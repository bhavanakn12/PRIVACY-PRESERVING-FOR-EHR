//server/controller/doctorController.js
const Patient = require('../models/Patient');
const Admission = require('../models/Admission');
const User = require('../models/User');

// Returns all patients (for demo/doctor selection)
exports.getDoctorPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) { next(err); }
};

exports.addEntry = async (req, res, next) => {
  try {
    const { symptoms, medicine, date } = req.body;
    const patientId = req.params.id;
    if (!symptoms || !medicine) return res.status(400).json({ message: "Symptoms and medicine required." });
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found." });

    if (!patient.entries) patient.entries = [];
    patient.entries.push({ symptoms, medicine, date: date || new Date() });
    await patient.save();

    res.status(201).json({ message: "Entry added successfully.", patient });
  } catch (err) { next(err); }
};

// Admit patient and create admission record
exports.admitPatient = async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const occupied = await Admission.find({ dischargeDate: null }).distinct('roomNumber');
    const allRooms = Array.from({ length: 20 }, (_, i) => (101 + i).toString());
    const availableRoom = allRooms.find(rn => !occupied.includes(rn));
    if (!availableRoom) return res.status(400).json({ message: 'No available rooms.' });

    const admission = await Admission.create({
      patient: patientId,
      doctor: req.user._id,
      roomNumber: availableRoom,
      admissionDate: new Date(),
      days: []
    });
    await Patient.findByIdAndUpdate(patientId, { status: 'inpatient', admitDate: new Date(), roomNumber: availableRoom });
    res.status(201).json({ message: "Admitted", roomNumber: availableRoom, admissionId: admission._id });
  } catch (err) { next(err); }
};

// Add or update daily session
exports.addDailyUpdate = async (req, res, next) => {
  try {
    const { admissionId, day, session, symptoms, medications, status, reports, medicineChanged } = req.body;
    const admission = await Admission.findById(admissionId);
    if (!admission) return res.status(404).json({ message: 'Admission not found' });

    const dayObj = admission.days.find(d => d.day === day);
    if (dayObj) {
      dayObj.sessions.push({ period: session, symptoms, medications, status, reports, medicineChanged });
    } else {
      admission.days.push({ day, sessions: [{ period: session, symptoms, medications, status, reports, medicineChanged }] });
    }
    await admission.save();
    res.json(admission);
  } catch (err) { next(err); }
};

// Mark as discharged and store date/next appointment
exports.dischargePatient = async (req, res, next) => {
  try {
    const { admissionId, nextAppointment, dischargeRemarks } = req.body;
    const admission = await Admission.findById(admissionId);
    if (!admission) return res.status(404).json({ message: 'Admission not found' });
    admission.dischargeDate = new Date();
    if (nextAppointment) admission.nextAppointment = nextAppointment;
    if (dischargeRemarks) admission.dischargeRemarks = dischargeRemarks;
    await admission.save();
    await Patient.findByIdAndUpdate(admission.patient, {
      status: 'outpatient',
      dischargeDate: admission.dischargeDate,
      roomNumber: undefined,
    });
    res.json({ message: "Discharged", dischargeDate: admission.dischargeDate });
  } catch (err) { next(err); }
};

// Save discharge summary for an admission (NEW: now saves diagnosis, Father/Spouse, etc.)
exports.saveDischargeSummary = async (req, res, next) => {
  try {
    const { admissionId } = req.params;
    const {
      fatherOrSpouse, dischargeDate, presentingComplaints, onExamination,
      investigations, courseInHospital, atDischarge, adviceRows, nextAppointment, diagnosis
    } = req.body;
    const admission = await Admission.findById(admissionId);
    if (!admission) return res.status(404).json({ message: "Admission not found" });

    if (fatherOrSpouse) admission.fatherOrSpouse = fatherOrSpouse;
    if (dischargeDate) admission.dischargeDate = dischargeDate;
    if (presentingComplaints) admission.presentingComplaints = presentingComplaints;
    if (onExamination) admission.onExamination = onExamination;
    if (investigations) admission.investigations = investigations;
    if (courseInHospital) admission.courseInHospital = courseInHospital;
    if (atDischarge) admission.atDischarge = atDischarge;
    if (adviceRows) admission.adviceOnDischarge = adviceRows;
    if (nextAppointment) admission.nextAppointment = nextAppointment;
    if (diagnosis) admission.diagnosis = diagnosis;

    await admission.save();

    // Optional: update patient record for Father/Spouse sync
    if (fatherOrSpouse) {
      await Patient.findByIdAndUpdate(admission.patient, { fatherName: fatherOrSpouse });
    }

    res.json({ message: "Discharge summary saved." });
  } catch (err) { next(err); }
};

// Returns complete discharge summary for one admission
exports.getDischargeSummary = async (req, res, next) => {
  try {
    const { admissionId } = req.params;
    if (!admissionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid admission ID format" });
    }
    const admission = await Admission.findById(admissionId)
      .populate('patient')
      .populate('doctor');
    if (!admission) return res.status(404).json({ message: "Admission not found" });

    let outpatientHistory = [];
    if (admission.patient && admission.patient.entries && admission.admissionDate) {
      outpatientHistory = admission.patient.entries.filter(e =>
        e.date && new Date(e.date) <= new Date(admission.admissionDate)
      );
    }

    res.json({
      admission,
      patient: admission.patient,
      doctor: admission.doctor,
      opdHistory: outpatientHistory,
    });
  } catch (err) { next(err); }
};

// Returns available room number
exports.getAvailableRoom = async (req, res, next) => {
  try {
    const occupied = await Admission.find({ dischargeDate: null }).distinct('roomNumber');
    const allRooms = Array.from({ length: 20 }, (_, i) => (101 + i).toString());
    const availableRoom = allRooms.find(rn => !occupied.includes(rn));
    if (!availableRoom) return res.status(400).json({ message: 'No available rooms.' });
    res.json({ room: availableRoom });
  } catch (err) { next(err); }
};

// Returns all inpatients (no discharge date)
exports.getInpatients = async (req, res, next) => {
  try {
    const admissions = await Admission.find({ dischargeDate: null })
      .populate('patient');
    const result = admissions.map(adm => ({
      patient: adm.patient,
      currentAdmissionId: adm._id,
      nextDay: (adm.days && adm.days.length > 0) ? adm.days.length + 1 : 1,
      roomNumber: adm.roomNumber,
      admissionDate: adm.admissionDate
    }));
    res.json(result);
  } catch (err) { next(err); }
};

// Returns specific admission day info
exports.getAdmissionDay = async (req, res, next) => {
  try {
    const admission = await Admission.findById(req.params.admissionId).populate('patient');
    if (!admission) return res.status(404).json({ message: "Admission not found" });
    const dayNum = parseInt(req.params.dayNum || "1");
    const dayObj = admission.days.find(d => d.day === dayNum) || { day: dayNum, sessions: [] };
    let outpatientHistory = [];
    if (admission.patient && admission.patient.entries && admission.admissionDate) {
      outpatientHistory = admission.patient.entries.filter(entry =>
        entry.date && new Date(entry.date) <= new Date(admission.admissionDate)
      );
    }
    res.json({ admission, day: dayObj, outpatientHistory });
  } catch (err) { next(err); }
};

// Add daily session to one admission/day/period
exports.addDailySession = async (req, res, next) => {
  try {
    const { period, status, symptoms, medications, medicineChanged, remarks } = req.body;
    const admission = await Admission.findById(req.params.admissionId);
    if (!admission) return res.status(404).json({ message: "Admission not found" });

    const dayNum = parseInt(req.params.dayNum || "1");
    let dayObj = admission.days.find(d => d.day === dayNum);
    if (!dayObj) {
      dayObj = { day: dayNum, sessions: [] };
      admission.days.push(dayObj);
    }
    const sessionIndex = dayObj.sessions.findIndex(s => s.period === period);
    if (sessionIndex >= 0) {
      dayObj.sessions[sessionIndex] = { period, status, symptoms, medications, medicineChanged, remarks };
    } else {
      dayObj.sessions.push({ period, status, symptoms, medications, medicineChanged, remarks });
    }
    await admission.save();
    res.status(201).json({ message: "Session saved", day: dayNum, period });
  } catch (err) { next(err); }
};

