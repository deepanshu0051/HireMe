const mongoose = require('mongoose');

// Define the Company schema
const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    hrEmail: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Sent', 'Failed', 'Skipped'],
      default: 'Pending',
    },
    replied: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    // Enable timestamps (createdAt and updatedAt automatically)
    timestamps: true,
  }
);

// Create the model from the schema
const Company = mongoose.model('Company', companySchema);

// Export the model using CommonJS
module.exports = Company;
