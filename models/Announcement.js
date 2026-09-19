const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
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
    default: Date.now
  },
  category: {
    type: String,
    enum: ['academic', 'sports', 'admission', 'general'],
    default: 'general'
  },
  image: {
    type: String, // Base64
    default: ''
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isImportant: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
