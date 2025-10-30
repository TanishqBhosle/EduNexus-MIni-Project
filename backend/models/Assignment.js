const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxMarks: {
    type: Number,
    default: 100
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    attachments: [{
      name: String,
      url: String,
      type: String
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    },
    marks: {
      type: Number,
      default: null
    },
    feedback: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
