const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: {
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
  fatherName: {
    type: String,
    required: true
  },
  motherName: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  rollNo: {
    type: Number,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  photo: {
    type: String, // Base64 encoding
    default: ''
  },
  guardianName: {
    type: String,
    required: true
  },
  guardianPhone: {
    type: String,
    required: true
  },
  emergencyContact: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
