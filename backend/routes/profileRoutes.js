const express = require('express');
const router = express.Router();
const { getProfile, updateAdminProfile } = require('../controllers/profileController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Get profile (both admin + guest allowed)
router.get('/', requireAuth, getProfile);

// Update profile (admin ONLY)
router.put('/', requireAuth, requireAdmin, updateAdminProfile);

module.exports = router;
