/**
 * Auth Routes
 * Exposes public authentication endpoints for Admin and Guest login.
 */
const express = require('express');
const router = express.Router();
const { loginAdmin, loginGuest } = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Admin login — requires accessPassword + secretKey
 * @access  Public
 */
router.post('/login', loginAdmin);

/**
 * @route   POST /api/auth/guest
 * @desc    Guest login — no credentials required, returns short-lived token
 * @access  Public
 */
router.post('/guest', loginGuest);

module.exports = router;
