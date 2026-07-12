/**
 * Resume Controller
 * -----------------
 * Handles upload, deletion, and retrieval of the resume PDF.
 * Uses Cloudinary for cloud storage and MongoDB (Resume model) for persistence.
 * Only ONE resume is stored at a time — uploading a new one replaces the old one.
 */

const cloudinary = require('../config/cloudinary');
const Resume     = require('../models/Resume');
const pdfParse   = require('pdf-parse');

// ─────────────────────────────────────────────────────────────────────────────
// 1) POST /api/resume/upload
//    Streams the PDF buffer to Cloudinary, then saves metadata to MongoDB.
//    If a resume already exists, the old Cloudinary asset + MongoDB record
//    are deleted first to maintain a single-resume invariant.
// ─────────────────────────────────────────────────────────────────────────────
const uploadResume = async (req, res) => {
  try {
    // Step 1 — Validate that multer captured a file in memory
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Step 1.5 — Extract text from PDF buffer
    let parsedText = "";
    try {
      const pdfResult = await pdfParse(req.file.buffer);
      if (pdfResult && pdfResult.text) {
        // Clean the extracted text: Replace multiple spaces/newlines with a single space and trim
        parsedText = pdfResult.text.replace(/\s+/g, ' ').trim();
      }
    } catch (parseError) {
      console.error('[Resume] PDF Parse Error:', parseError.message);
      // Proceed with upload normally if parsing fails
    }

    // Step 2 — Upload the buffer to Cloudinary via upload_stream
    //   resource_type: "raw"  — required for PDFs; "auto" breaks MIME type.
    //   upload_preset        — optional unsigned preset from .env.
    //   access_mode: "public" — allow direct URL access without signing.
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder:           'hireme_resumes',
            resource_type:    'raw',
            upload_preset:    process.env.CLOUDINARY_UPLOAD_PRESET, // optional
            use_filename:     true,
            unique_filename:  true,
            overwrite:        false,
            access_mode:      'public',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        // Pipe the in-memory buffer into the Cloudinary stream
        stream.end(req.file.buffer);
      });

    const result = await uploadToCloudinary();

    // Step 3 — Check if an existing resume already lives in MongoDB
    const existing = await Resume.findOne();

    if (existing) {
      // Step 3a — Delete the OLD Cloudinary asset first (resource_type must match upload)
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'raw' });
    }

    // Step 4 — UPSERT the resume document so there is always exactly one
    const saved = await Resume.findOneAndUpdate(
      {},
      {
        cloudinaryUrl: result.secure_url,
        publicId: result.public_id,
        filename: req.file.originalname,
        resumeText: parsedText,
        uploadedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("[resume] cloudinary success:", result.public_id);
    console.log("[resume] mongo saved:", saved && saved._id);

    // Step 5 — Return the new resume details to the client
    return res.status(200).json({
      success:  true,
      url:      saved.cloudinaryUrl,
      publicId: saved.publicId,
      filename: saved.filename,
    });

  } catch (error) {
    console.error('[Resume] Upload Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during upload.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2) DELETE /api/resume/delete
//    Looks up the resume in MongoDB, deletes it from Cloudinary, then removes
//    the MongoDB record. No publicId is needed in the request body — the
//    source of truth is always MongoDB.
// ─────────────────────────────────────────────────────────────────────────────
const deleteResume = async (req, res) => {
  try {
    // Step 1 — Find the current resume in MongoDB
    const existing = await Resume.findOne();

    if (!existing) {
      return res.status(404).json({ success: false, message: 'No resume found.' });
    }

    // Step 2 — Delete asset from Cloudinary (resource_type must match original upload)
    await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'raw' });

    // Step 3 — Remove ALL MongoDB records to ensure it becomes completely empty
    await Resume.deleteMany({});

    return res.status(200).json({ success: true, message: 'Resume deleted.' });

  } catch (error) {
    console.error('[Resume] Delete Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during deletion.' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3) GET /api/resume
//    Returns the current resume URL and metadata from MongoDB.
//    Returns { success: false, resume: null } if none uploaded yet.
//    Protected: requireAuth (admin + guest) in routes.
// ─────────────────────────────────────────────────────────────────────────────
const getResume = async (req, res) => {
  try {
    // Find the single stored resume (if any) using lean() for better performance
    const resume = await Resume.findOne().lean();

    return res.status(200).json({
      success: true,
      resume: resume ? {
        url:        resume.cloudinaryUrl,
        publicId:   resume.publicId,
        filename:   resume.filename,
        uploadedAt: resume.uploadedAt,
      } : null
    });

  } catch (error) {
    console.error('[Resume] Get Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching resume.' });
  }
};

module.exports = {
  uploadResume,
  deleteResume,
  getResume,
};
