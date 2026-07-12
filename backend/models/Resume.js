/**
 * Resume Model
 * -----------
 * Stores metadata for the single uploaded resume (PDF) on Cloudinary.
 * Only ONE resume document should exist at a time — old one is replaced on new upload.
 * Collection name: "resumes"
 */

const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
  {
    // Full HTTPS URL returned by Cloudinary after upload
    cloudinaryUrl: {
      type: String,
      required: [true, 'Cloudinary URL is required'],
      trim: true,
    },

    // Cloudinary public_id — needed to delete the asset from Cloudinary
    publicId: {
      type: String,
      required: [true, 'Cloudinary public_id is required'],
      trim: true,
    },

    // Original filename of the uploaded PDF
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true,
    },

    // Extracted text content of the PDF
    resumeText: {
      type: String,
      default: "",
    },

    // When the resume was uploaded (explicit field + automatic via timestamps)
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
    // Explicitly set MongoDB collection name
    collection: 'resumes',
  }
);

module.exports = mongoose.model('Resume', ResumeSchema, 'resumes');
