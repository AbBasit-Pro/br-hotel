const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  guestId: { type: String, required: true, unique: true }, // e.g. R-02
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNo: { type: String },
  nationality: { type: String },
  cnicNo: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  companyName: { type: String },
  passportNo: { type: String, unique: true, sparse: true },
  placeOfIssue: { type: String },
  reference: { type: String },
  expiryDate: { type: Date },
  address: { type: String },
  identityAttachment: { type: String } // store uploaded image path
}, { timestamps: true });

module.exports = mongoose.model('Guest', GuestSchema);
