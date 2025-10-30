const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image'],
    default: 'text'
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
