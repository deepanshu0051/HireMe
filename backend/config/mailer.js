const nodemailer = require('nodemailer');

// Debug: confirm credentials are loaded from environment
console.log('EMAIL_USER loaded:', process.env.EMAIL_USER ? 'YES' : 'NO - MISSING!');
console.log('EMAIL_PASS loaded:', process.env.EMAIL_PASS ? 'YES' : 'NO - MISSING!');

// Configure the transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the SMTP connection when the server starts or script runs
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error.message);
  } else {
    console.log('SMTP Configured: Server is ready to take our messages');
  }
});

// Export the transporter for use in other files
module.exports = transporter;
