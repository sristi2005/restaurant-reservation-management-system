const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  timeSlot: {
    type: String, // Format: HH:00
    required: true,
  },
  guests: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
