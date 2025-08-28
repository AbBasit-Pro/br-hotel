const mongoose = require('mongoose');

const GuestHistorySchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Guest', required: true },
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  roomNumber: { type: String, required: true },
  rentPaid: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('GuestHistory', GuestHistorySchema);
