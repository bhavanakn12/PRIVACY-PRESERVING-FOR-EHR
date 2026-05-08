const Admission = require('../models/Admission');
const Patient = require('../models/Patient');

// Keeps your original staffDashboard export (for /patients with masking)
exports.staffDashboard = (req, res) => {
  return res.json(res.locals.staffPatients || []);
};

// In-patient list with robust null checking
exports.getInpatients = async (req, res, next) => {
  try {
    // Find all currently admitted (not yet discharged)
    const inAdmits = await Admission.find({
      dischargeDate: { $in: [undefined, null, ""] }
    }).populate('patient');
    const data = inAdmits
      .filter(adm => adm.patient) // SKIP any admission with deleted/missing patient
      .map(adm => ({
        _id: adm.patient._id,
        name: adm.patient.name,
        phone: adm.patient.phone,
        admissionId: adm._id,
        admissionDate: adm.admissionDate,
        dischargeDate: adm.dischargeDate,
        roomNumber: adm.roomNumber,
      }));
    res.json(data);
  } catch (err) { next(err); }
};
exports.getAllAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.find({})
      .populate('patient');
    const data = admissions
      .filter(adm => adm.patient)
      .map(adm => ({
        _id: adm.patient._id,
        name: adm.patient.name,
        phone: adm.patient.phone,
        admissionId: adm._id,
        admissionDate: adm.admissionDate,
        dischargeDate: adm.dischargeDate,
        roomNumber: adm.roomNumber
      }));
    res.json(data);
  } catch (err) { next(err); }
};
