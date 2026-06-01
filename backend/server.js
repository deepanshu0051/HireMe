const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');
const emailLogRoutes = require('./routes/emailLogRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/emails', emailLogRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('HireMe Backend Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
