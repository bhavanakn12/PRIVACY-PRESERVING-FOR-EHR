//srever/models/Summary.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SummarySchema = new Schema({
  filename: { type: String, required: true },
  summaryText: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Summary', SummarySchema);
