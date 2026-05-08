//server/controllers/adminController.js
const Admission = require('../models/Admission');
const axios = require('axios');

async function generateNlpSummary(promptText) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const endpoint = 'https://openrouter.ai/api/v1/chat/completions';
  const response = await axios.post(endpoint, {
    model: "openai/gpt-3.5-turbo",
    messages: [{ role: "user", content: promptText }],
    max_tokens: 256
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data.choices[0].message.content;
}
// GET: Return privacy-preserved summary for one admission
exports.getPrivacyPreservedSummary = async (req, res, next) => {
  try {
    const { admissionId } = req.params;

    const admission = await Admission.findById(admissionId)
      .populate("patient")
      .populate("doctor");

    if (!admission) 
      return res.status(404).json({ message: "Admission not found" });

    const patient = admission.patient;

    // ---------- PRIVACY SANITIZATION ----------
    const age = patient.dob
      ? Math.floor((Date.now() - new Date(patient.dob)) / (365.25 * 24 * 3600 * 1000))
      : "adult";

    const gender = patient.gender || "patient";

    // REMOVE ADDRESSES COMPLETELY (no district/state leakage)
    const safeAddress = "Not disclosed";

    // REMOVE Father/Spouse name (PHI)
    const familyInfo = admission.fatherOrSpouse ? "Provided" : "Not provided";

    // Build a safe, PHI-free dataset
    const safeData = {
      age,
      gender,
      complaints: admission.presentingComplaints || "Not recorded",
      exam: admission.onExamination || "Not recorded",
      investigations: admission.investigations || "Not recorded",
      diagnosis: admission.diagnosis || "Not recorded",
      hospitalCourse: admission.courseInHospital || "Not recorded",
      atDischarge: admission.atDischarge || "Not recorded",
      medications: (admission.adviceOnDischarge || [])
        .map(x => `${x.medication} – ${x.instruction}`)
        .join("; "),
      nextAppointment: admission.nextAppointment || "Not scheduled",
      familyInfo
    };

    // ---------- NLP PROMPT (NO PHI ALLOWED) ----------
    const prompt = `
Using the following clinical details, write a privacy-preserved discharge summary. 
DO NOT include: 
- patient name 
- doctor name 
- address 
- phone number 
- initials 
- district/state 
- spouse/father name 
- any direct identifiers.

You may ONLY use: age, gender, symptoms, diagnosis, hospital course, exam findings, investigations, treatment, and discharge advice.

Details:
Age: ${safeData.age}
Gender: ${safeData.gender}
Chief complaints: ${safeData.complaints}
Examination: ${safeData.exam}
Investigations: ${safeData.investigations}
Diagnosis: ${safeData.diagnosis}
Hospital course: ${safeData.hospitalCourse}
Condition at discharge: ${safeData.atDischarge}
Medications: ${safeData.medications}
Next appointment: ${safeData.nextAppointment}
Family information: ${safeData.familyInfo}

Write a clean, medically accurate, anonymized discharge summary.
`;

    // ---------- CALL NLP ----------
    let privacySummary = "";
    try {
      privacySummary = await generateNlpSummary(prompt);
    } catch (e) {
      console.error("NLP error:", e.response?.data || e.message);
      privacySummary = "Unable to generate privacy-preserved summary.";
    }

    return res.json({ summary: privacySummary });

  } catch (err) {
    next(err);
  }
};

// GET: Return all admissions (admin dashboard list)
exports.getAllAdmissions = async (req, res, next) => {
  try {
    const admissions = await Admission.find({}).populate('patient');
    const data = admissions
      .filter(adm => adm.patient)
      .map(adm => ({
        admissionId: adm._id,
        name: adm.patient.name,
        status: adm.patient.status,
        roomNumber: adm.roomNumber,
        admissionDate: adm.admissionDate,
        dischargeDate: adm.dischargeDate,
        visitDate: adm.admissionDate // Edit as needed
      }));
    res.json(data);
  } catch (err) { next(err); }
};

