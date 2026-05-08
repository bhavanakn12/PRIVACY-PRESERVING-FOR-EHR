//server/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const doctorRoutes = require('./routes/doctorRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/summary', require('./routes/summaryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error Handler (last)
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err); // Add this line!
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});


module.exports = app;
