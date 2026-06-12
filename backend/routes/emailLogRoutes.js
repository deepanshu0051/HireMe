const express = require('express');
const router = express.Router();
const {
  createEmailLog,
  getEmailsByCompany,
  updateEmailStatus,
  deleteEmailLog,
  getWeeklyStats
} = require('../controllers/emailLogController');

/**
 * @desc    Create a new email log
 * @route   POST /
 */
router.post('/', createEmailLog);

/**
 * @desc    Get weekly email sending statistics mapped per day natively mapped to IST bounds.
 * @route   GET /weekly-stats
 */
router.get('/weekly-stats', getWeeklyStats);

/**
 * @desc    Get all email logs for a specific company
 * @route   GET /company/:companyId
 */
router.get('/company/:companyId', getEmailsByCompany);

/**
 * @desc    Update an email log (status or seen state)
 * @route   PUT /:id
 */
router.put('/:id', updateEmailStatus);

/**
 * @desc    Delete a specific email log
 * @route   DELETE /:id
 */
router.delete('/:id', deleteEmailLog);

module.exports = router;
