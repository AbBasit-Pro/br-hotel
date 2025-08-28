const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  reportDate: { type: Date, required: true },
  data: { type: mongoose.Schema.Types.Mixed } // JSON object
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
