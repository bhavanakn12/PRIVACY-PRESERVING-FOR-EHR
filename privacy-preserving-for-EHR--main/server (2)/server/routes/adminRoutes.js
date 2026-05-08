//server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// List all admissions for admin dashboard
router.get(
  '/patients',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.getAllAdmissions
);

// Privacy-preserved summary route
router.get(
  '/privacy-summary/:admissionId',
  authMiddleware,
  roleMiddleware('admin'),
  adminController.getPrivacyPreservedSummary
);


module.exports = router;
