//server/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Doctor patient list (dashboard)
router.get('/patients', authMiddleware, roleMiddleware('doctor'), doctorController.getDoctorPatients);

// Outpatient add-entry (OPD)
router.post('/patient/:id/add-entry', authMiddleware, roleMiddleware('doctor'), doctorController.addEntry);

// Room lookup
router.get('/available-room', authMiddleware, roleMiddleware('doctor'), doctorController.getAvailableRoom);

// Admit patient
router.post('/admit', authMiddleware, roleMiddleware('doctor'), doctorController.admitPatient);

// Manual update (legacy support)
router.post('/update', authMiddleware, roleMiddleware('doctor'), doctorController.addDailyUpdate);

// Daily inpatient updates
router.get('/admission/:admissionId/day/:dayNum', authMiddleware, roleMiddleware('doctor'), doctorController.getAdmissionDay);
router.post('/admission/:admissionId/day/:dayNum', authMiddleware, roleMiddleware('doctor'), doctorController.addDailySession);

// Inpatients listing
router.get('/inpatients', authMiddleware, roleMiddleware('doctor'), doctorController.getInpatients);

// --- DISCHARGE: REMOVE duplicate `/doctor` ---
router.post('/discharge-summary/:admissionId', authMiddleware, roleMiddleware('doctor'), doctorController.saveDischargeSummary);

//router.post('/discharge/:admissionId', authMiddleware, roleMiddleware('doctor'), doctorController.dischargePatient);

// Discharge summary
router.get('/admission/:admissionId/discharge-summary', authMiddleware, roleMiddleware('doctor', 'staff', 'receptionist'), doctorController.getDischargeSummary);


router.post('/discharge/:admissionId', (req, res) => {
  console.log("DISCHARGE ROUTE HIT", req.params);
  res.status(200).json({ ok: true });
});

module.exports = router;
