const mongoose = require('mongoose');

const AdviceRowSchema = new mongoose.Schema({
  medication: { type: String, required: true },
  instruction: { type: String, required: true }
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  period: { type: String, enum: ['morning', 'evening'], required: true },
  status: String,
  symptoms: String,
  medications: String,
  medicineChanged: Boolean,
  remarks: String,
  nextAppointment: String,
  dischargeRemarks: String,
  diagnosis: { type: String, required: false }
}, { _id: false });

const DaySchema = new mongoose.Schema({
  day: Number, // e.g. 1, 2, 3
  sessions: [SessionSchema]
}, { _id: false });

const AdmissionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomNumber: String,
  admissionDate: Date,
  dischargeDate: { type: String, default: "" },

  presentingComplaints: { type: String, default: "" },
  onExamination: { type: String, default: "" },
  investigations: { type: String, default: "" },
  courseInHospital: { type: String, default: "" },
  atDischarge: { type: String, default: "" },
fatherOrSpouse: { type: String, default: "" },

diagnosis: { type: String, default: "" },
nextAppointment: { type: String, default: "" },

  diagnosis: { type: String, required: false },  // <-- Top-level diagnosis for every admission

  adviceOnDischarge: [AdviceRowSchema],
  nextAppointment: { type: String, default: "" },

  days: [DaySchema]
});

module.exports = mongoose.model('Admission', AdmissionSchema);
