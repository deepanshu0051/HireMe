// Load environment variables FIRST before any other imports
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const companyRoutes = require('./routes/companyRoutes');
const emailLogRoutes = require('./routes/emailLogRoutes');
const sendEmailRoutes = require('./routes/sendEmailRoutes');
const { startCronJob } = require('./config/cron');
const { sendPendingEmails } = require('./controllers/cronController');

// Connect to MongoDB, then start the cron scheduler AFTER DB is ready
connectDB().then(() => {
  startCronJob(sendPendingEmails);
  console.log('[CRON] Automated email scheduler started successfully');
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/companies', companyRoutes);
app.use('/api/emails/send', sendEmailRoutes);
app.use('/api/emails', emailLogRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('HireMe Backend Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
