/**
 * Resume Routes
 * -------------
 * POST   /api/resume/upload  — Upload PDF to Cloudinary + save metadata to MongoDB
 *                              Requires: valid JWT (admin or guest)
 * DELETE /api/resume/delete  — Delete from Cloudinary + MongoDB
 *                              Requires: valid JWT + admin role
 * GET    /api/resume          — Retrieve current resume metadata from MongoDB
 *                              Requires: valid JWT (admin or guest)
 *
 * Authentication middleware (requireAuth / requireAdmin) is applied globally
 * in server.js via app.use('/api/resume', requireAuth, resumeRoutes).
 * Per-route requireAdmin is applied here for the delete endpoint.
 */

const express  = require('express');
const router   = express.Router();
const multer   = require('multer');

const { uploadResume, deleteResume, getResume } = require('../controllers/resumeController');
const { requireAdmin } = require('../middleware/authMiddleware');

// ── Multer: memory storage — file never touches the disk ───────────────────
const storage = multer.memoryStorage();

// Strict PDF-only filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('INVALID_TYPE'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB hard limit
});

// Wrapper that converts Multer errors into standard JSON responses
const uploadMiddleware = (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err.message === 'INVALID_TYPE') {
        return res.status(400).json({ success: false, message: 'Invalid file. Please upload a PDF resume only.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// ── Routes ─────────────────────────────────────────────────────────────────

// POST /api/resume/upload — Upload (requireAuth already applied in server.js)
router.post('/upload', requireAdmin, uploadMiddleware, uploadResume);

// DELETE /api/resume/delete — Admin only (requireAuth from server.js + requireAdmin here)
router.delete('/delete', requireAdmin, deleteResume);

// GET /api/resume — Get current resume metadata (requireAuth already applied in server.js)
router.get('/', getResume);

module.exports = router;
