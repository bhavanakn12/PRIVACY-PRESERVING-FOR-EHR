//server/routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Patient registration - accessible by admin or receptionist
router.post('/register', authMiddleware, roleMiddleware('admin', 'receptionist'), patientController.registerPatient);

router.get('/all', authMiddleware, patientController.getAllPatients);
router.get('/:id', require('../middleware/authMiddleware'), require('../controllers/patientController').getPatientById);

module.exports = router;
