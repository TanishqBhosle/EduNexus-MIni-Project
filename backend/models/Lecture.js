const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  videoId: {
    type: String, // Cloudinary public ID
    required: true
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  resources: [{
    name: String,
    url: String,
    type: String
  }],
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lecture', lectureSchema);
