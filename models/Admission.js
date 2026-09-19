const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  studentName: {
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
  previousSchool: {
    type: String,
    default: 'None'
  },
  previousClass: {
    type: String,
    default: 'None'
  },
  applyingClass: {
    type: String,
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
  guardianName: {
    type: String,
    required: true
  },
  guardianPhone: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Admission', AdmissionSchema);
