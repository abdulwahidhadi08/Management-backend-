const mongoose = require('mongoose');

const AcademicRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 100
  },
  obtainedMarks: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    default: ''
  },
  examTerm: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AcademicRecord', AcademicRecordSchema);
