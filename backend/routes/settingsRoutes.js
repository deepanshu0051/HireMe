const express = require('express');
const router = express.Router();
const { getSettings, updateAutoSend, updateSchedule } = require('../controllers/settingsController');

// All endpoints chained below server auth protections via requireAuth and requireAdmin
router.get('/', getSettings);
router.put('/auto-send', updateAutoSend);
router.put('/schedule', updateSchedule);

module.exports = router;
