const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { sanitizeInput } = require('./middleware/validation');
require('dotenv').config();

const app = express();
const server = createServer(app);
const isDev = (process.env.NODE_ENV || 'development') !== 'production';
const io = new Server(server, {
  cors: {
    origin: isDev ? '*' : function (origin, callback) {
      const allowedOrigins = [
        process.env.CLIENT_URL || "http://localhost:3000",
        "http://localhost:3000",
        "https://localhost:3000",
        "http://127.0.0.1:3000",
        "https://127.0.0.1:3000",
      ];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: (
        isDev
          ? [
              "'self'",
              "http://localhost:5000",
              "http://127.0.0.1:5000",
              "ws://localhost:5000",
              "ws://127.0.0.1:5000",
              "https:",
              "wss:"
            ]
          : ["'self'", process.env.CLIENT_URL || 'http://localhost:3000']
      )
    },
  },
}));

app.use(cors({
  origin: isDev ? true : [
    process.env.CLIENT_URL || "http://localhost:3000",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
// Enable preflight across-the-board
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize input
app.use(sanitizeInput);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lectures', require('./routes/lectures'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/users', require('./routes/users'));

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-course', (courseId) => {
    try {
      socket.join(courseId);
      console.log(`User ${socket.id} joined course ${courseId}`);
    } catch (error) {
      console.error('Error joining course:', error);
      socket.emit('error', { message: 'Failed to join course' });
    }
  });

  socket.on('send-message', (data) => {
    try {
      if (!data.courseId || !data.content) {
        socket.emit('error', { message: 'Invalid message data' });
        return;
      }
      socket.to(data.courseId).emit('receive-message', data);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edunexus', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
