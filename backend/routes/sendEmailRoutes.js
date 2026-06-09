const express = require('express');
const router = express.Router();

// Import the controller function handling email dispatch
const { sendEmail } = require('../controllers/sendEmailController');

/**
 * @desc    Trigger and dispatch a real email
 * @route   POST /send
 * @access  Private/Public depending on implementation
 */
router.post('/send', sendEmail);

module.exports = router;
