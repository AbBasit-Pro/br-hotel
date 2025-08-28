const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  totalRooms: { type: Number, default: 1 },
  advanceReceipt: { type: Number, default: 0 },
  arrivalDate: { type: Date },
  arrivalTime: { type: String },
  estimatedStay: { type: String },
  departureDate: { type: Date },
  departureTime: { type: String },
  stayDuration: { type: String },
  remarks: { type: String },
  status: { type: String, enum: ['pending','confirmed','checked_in','checked_out','cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', ReservationSchema);