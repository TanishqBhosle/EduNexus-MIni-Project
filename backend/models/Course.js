const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: {
    type: Number, // in hours
    default: 0
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lectures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture'
  }],
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  tags: [String],
  requirements: [String],
  whatYouWillLearn: [String]
}, {
  timestamps: true
});

// Virtual for student count
courseSchema.virtual('studentCount').get(function() {
  return this.students.length;
});

// Virtual for lecture count
courseSchema.virtual('lectureCount').get(function() {
  return this.lectures.length;
});

module.exports = mongoose.model('Course', courseSchema);
