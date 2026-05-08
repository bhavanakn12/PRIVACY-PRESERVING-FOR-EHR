const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  symptoms: String,
  medicine: String,
  date: Date,
  remarks: String // Add more fields if you need
}, { _id: false });

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  phone: { type: String, required: true },
  address: { type: String },
  status: { type: String, enum: ['inpatient', 'outpatient'], default: 'outpatient' },
  admitDate: { type: Date },
  dischargeDate: { type: Date },
  visitDate: { type: Date },
  roomNumber: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  entries: [EntrySchema]  // <-- THIS IS CRITICAL
});

module.exports = mongoose.model('Patient', PatientSchema);
