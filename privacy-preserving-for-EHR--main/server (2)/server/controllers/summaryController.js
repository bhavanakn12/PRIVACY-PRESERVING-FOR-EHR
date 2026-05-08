const axios = require("axios");
const Summary = require('../models/Summary');
const Patient = require('../models/Patient');
const { anonymizeSummary, maskName, genderPronoun } = require('../utils/privacyUtils');
const { createDischargeSummaryPDF } = require('../utils/pdfUtils');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const fs = require('fs');


exports.getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find().sort({ uploadedAt: -1 });
    res.json(summaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve summaries." });
  }
};

exports.saveSummary = async (req, res, next) => {
  try {
    const { patientId, summaryText } = req.body;
    const summary = await Summary.create({ patient: patientId, summaryText });
    res.locals.summary = summary;
    next();
  } catch (err) { next(err); }
};

exports.getSummaryPDF = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const summary = await Summary.findOne({ patient: patientId }).populate('patient');
    if (!summary) return res.status(404).json({ message: "Summary not found" });

    const patient = summary.patient;
    const pdfStream = createDischargeSummaryPDF({
      maskedName: maskName(patient.name),
      pronoun: genderPronoun(patient.gender),
      roomNumber: patient.roomNumber,
      admitDate: patient.admitDate,
      dischargeDate: patient.dischargeDate,
      summaryText: anonymizeSummary(summary.summaryText, patient)
    });

    res.setHeader('Content-Disposition', 'attachment; filename=discharge_summary.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
  } catch (err) { next(err); }
};

// LLM-powered, OpenRouter-based privacy-preserved paragraph summary
exports.createPrivacyPreservedSummary = async (req, res) => {
  try {
    const {
      patientName, patientDOB, patientSex, patientAddress, admitDate,
      fatherOrSpouse, dischargeDate, diagnosis, presentingComplaints,
      onExamination, investigations, courseInHospital, atDischarge,
      adviceRows, nextAppointment
    } = req.body;

    // Clinical expert prompt for paragraph summary, privacy preserved
    const humanPrompt = `
You are a clinical expert. Write a privacy-preserved, paragraph-style discharge summary for medical records.
- DO NOT use the patient's name, exact address, or full birthdate.
- You MAY include the patient's gender and the *month and year* of admission and discharge.
- Write the summary in formal medical English, in a  flowing paragraphs.

Here is the structured patient data:

Gender: ${patientSex || "not specified"}
Admitted: ${admitDate ? new Date(admitDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : "date not specified"}
Discharged: ${dischargeDate ? new Date(dischargeDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : "date not specified"}
Diagnosis: ${diagnosis}
Presenting complaints: ${presentingComplaints}
Exam: ${onExamination}
Investigations: ${investigations}
Hospital course: ${courseInHospital}
At discharge: ${atDischarge}
Advice: ${adviceRows && adviceRows.map(row => `${row.medication} (${row.instruction})`).join("; ")}

`.trim();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: humanPrompt }],
        max_tokens: 640
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const privacyPreservedText = response.data.choices[0].message.content.trim();

    return res.json({ privacyPreservedText });
  } catch (err) {
    console.error(err?.response?.data || err);
    return res.status(500).json({ error: "Failed to generate privacy-preserved summary." });
  }
};


// --- LLM + OCR: File upload discharge summary ---
exports.uploadSummary = async (req, res) => {
  try {
    const file = req.file;
    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const pdfBuffer = fs.readFileSync(file.path);
      const parsed = await pdfParse(pdfBuffer);
      extractedText = parsed.text;
    } else if (file.mimetype.startsWith("image/")) {
      const { data: { text } } = await Tesseract.recognize(file.path, 'eng');
      extractedText = text;
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Privacy-preserving LLM prompt
    const humanPrompt = `
You are a clinical expert. Write a privacy-preserved, paragraph-style discharge summary in formal English from this raw discharge summary. 
Do not include patient name, DOB, address, NHID, or any direct identifiers in your summary. 
Make sure your output is one clean, anonymized paragraph.
Here is the raw (possibly unstructured) summary:
${extractedText}
    `.trim();

    const apiKey = process.env.OPENROUTER_API_KEY;
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: humanPrompt }],
        max_tokens: 700
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );
    const privacyPreservedText = response.data.choices[0].message.content.trim();

    // ---- ADD THIS TO SAVE SUMMARY TO DATABASE ----
    const summaryRecord = await Summary.create({
      filename: file.originalname,
      summaryText: privacyPreservedText,
      uploadedAt: new Date()
    });

    return res.json({ privacyPreservedText, id: summaryRecord._id });
  } catch (err) {
    console.error(err?.response?.data || err);
    res.status(500).json({ error: "Failed to process uploaded summary." });
  }
};
