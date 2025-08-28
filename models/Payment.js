const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['cash','credit_card','btc','others'], default: 'cash' },
  status: { type: String, enum: ['pending','paid','partial'], default: 'pending' },
  paymentDate: { type: Date },
  comingFrom: { type: String },
  billingInstructions: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
