const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // Single, Double, Suite, etc.
  capacity: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  status: { type: String, enum: ['available', 'booked', 'maintenance'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
