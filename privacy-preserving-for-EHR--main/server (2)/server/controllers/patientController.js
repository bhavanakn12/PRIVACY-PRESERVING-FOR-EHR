//server/controllers/patientController.js
const Patient = require('../models/Patient');

exports.registerPatient = async (req, res, next) => {
  try {
    const { name, dob, gender, phone, address, status, visitDate } = req.body; // ← add dob here
    if (!name || !gender || !phone) return res.status(400).json({ message: "Patient name, gender, phone required." });

    const patient = await Patient.create({
      name,
      dob, // ← save dob there!
      gender,
      phone,
      address,
      status,
      visitDate: status === 'outpatient' ? new Date() : undefined,
      createdBy: req.user._id
    });
    res.status(201).json(patient);
  } catch (err) { next(err); }
};


exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) { next(err); }
};


exports.getStaffPatients = async (req, res, next) => {
  try {
    // For staff: only non-medical/masked view
    const patients = await Patient.find();
    res.locals.staffPatients = patients;
    next();
  } catch (err) { next(err); }
};

exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) { next(err); }
};
