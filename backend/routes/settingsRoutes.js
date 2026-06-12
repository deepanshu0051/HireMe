const express = require('express');
const router = express.Router();
const { getSettings, updateAutoSend, updateSchedule, updateEmailsPerDay } = require('../controllers/settingsController');

// All endpoints chained below server auth protections via requireAuth and requireAdmin
router.get('/', getSettings);
router.put('/auto-send', updateAutoSend);
router.put('/schedule', updateSchedule);
router.put('/emails-per-day', updateEmailsPerDay);

module.exports = router;
