// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Custom Middlewares
const { sanitizeInput } = require("./middleware/validation");
const errorHandler = require("./middleware/errorHandler");

// Initialize Express
const app = express();
const server = createServer(app);

// Environment
const NODE_ENV = process.env.NODE_ENV || "development";
const isDev = NODE_ENV !== "production";
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// -------------------------------
// 🔒 Security & Middleware
// -------------------------------

// Helmet security headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: isDev
          ? [
              "'self'",
              "http://localhost:5000",
              "http://127.0.0.1:5000",
              "ws://localhost:5000",
              "ws://127.0.0.1:5000",
              "https:",
              "wss:",
            ]
          : ["'self'", CLIENT_URL, "wss:", "https:"],
      },
    },
  })
);

// CORS setup
app.use(
  cors({
    origin: isDev
      ? true
      : [
          CLIENT_URL,
          "http://localhost:3000",
          "https://localhost:3000",
          "http://127.0.0.1:3000",
          "https://127.0.0.1:3000",
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanitize all incoming input
app.use(sanitizeInput);

// -------------------------------
// 🧱 Rate Limiting
// -------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// -------------------------------
// 🧩 API Routes
// -------------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/lectures", require("./routes/lectures"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/users", require("./routes/users"));

// -------------------------------
// 💬 Socket.io (Real-Time Chat)
// -------------------------------
const io = new Server(server, {
  cors: {
    origin: isDev
      ? "*"
      : [
          CLIENT_URL,
          "http://localhost:3000",
          "https://localhost:3000",
          "http://127.0.0.1:3000",
          "https://127.0.0.1:3000",
        ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join-course", (courseId) => {
    try {
      socket.join(courseId);
      console.log(`✅ User ${socket.id} joined course ${courseId}`);
    } catch (error) {
      console.error("Join course error:", error);
      socket.emit("error", { message: "Failed to join course" });
    }
  });

  socket.on("send-message", (data) => {
    try {
      if (!data.courseId || !data.content) {
        socket.emit("error", { message: "Invalid message data" });
        return;
      }
      io.to(data.courseId).emit("receive-message", data);
    } catch (error) {
      console.error("Send message error:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ User disconnected: ${socket.id}, Reason: ${reason}`);
  });
});

// -------------------------------
// ⚠️ Error & 404 Handling
// -------------------------------
app.use(errorHandler);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// -------------------------------
// 🧠 Database Connection
// -------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/edunexus", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// Connect to DB and Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
  });
});

// -------------------------------
// 🧹 Graceful Shutdown
// -------------------------------
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("🔒 Server closed. Process terminated.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
