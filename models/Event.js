const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // "HH:MM"
    required: true
  },
  endTime: {
    type: String, // "HH:MM"
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String, // Base64
    default: ''
  },
  requiresRegistration: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  registrations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
