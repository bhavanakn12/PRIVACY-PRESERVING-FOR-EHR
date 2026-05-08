const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Inpatient list endpoint for staff/receptionist
router.get(
  '/inpatients',
  authMiddleware,
  roleMiddleware('staff', 'receptionist'),
  staffController.getInpatients
);
router.get(
  '/admissions',
  authMiddleware,
  roleMiddleware('staff', 'receptionist'),
  staffController.getAllAdmissions
);

// (You can keep your /patients route here for all-patient lists)

module.exports = router;
