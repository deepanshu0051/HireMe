const mongoose = require('mongoose');

// Define the EmailLog schema
const emailLogSchema = new mongoose.Schema(
  {
    // Reference to the Company this email log belongs to
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    // The subject line of the email
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    // The main content/body of the email
    body: {
      type: String,
      required: true,
    },
    // The delivery status of the email
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Failed'],
      default: 'Draft',
    },
    // Whether the email has been seen/opened by the recipient
    seen: {
      type: Boolean,
      default: false,
    },
    // The exact date and time when the email was successfully sent
    sentAt: {
      type: Date,
    },
  },
  {
    // Enable timestamps to automatically add the createdAt and updatedAt fields
    timestamps: true,
  }
);

// Create the model from the schema
const EmailLog = mongoose.model('EmailLog', emailLogSchema);

// Export the model using CommonJS
module.exports = EmailLog;
