const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  section: {
    type: String,
    required: true,
    trim: true
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
}, { timestamps: true });

// Create a compound index to ensure Class + Section combination is unique
ClassSchema.index({ name: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Class', ClassSchema);
