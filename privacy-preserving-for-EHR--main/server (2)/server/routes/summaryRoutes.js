const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), summaryController.uploadSummary);

// LLM-powered manual summary creation
router.post('/manual', summaryController.createPrivacyPreservedSummary);

// Save regular summary on discharge (doctor)
router.post('/save', authMiddleware, roleMiddleware('doctor'), summaryController.saveSummary);

// Download privacy-preserved discharge summary (admin, doctor, staff)
router.get('/pdf/:patientId', authMiddleware, summaryController.getSummaryPDF);
router.get('/all-summaries', summaryController.getAllSummaries);
module.exports = router;
