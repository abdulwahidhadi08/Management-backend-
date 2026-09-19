const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String, // Base64 encoding
    default: ''
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  assignedClass: {
    type: String, // e.g. "Grade 6 - Section A"
    default: 'None'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
