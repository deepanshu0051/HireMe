const EmailLog = require('../models/EmailLog');
const Company = require('../models/Company');

/**
 * @desc    Create a new email log
 * @route   POST /api/... (to be defined)
 * @access  Private/Public
 */
const createEmailLog = async (req, res) => {
  try {
    const { company, subject, body, status, seen, sentAt } = req.body;

    // Validate that the referenced company exists
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      return res.status(404).json({
        success: false,
        message: 'The referenced Company does not exist',
      });
    }

    // Create and save the new email log
    const newEmailLog = new EmailLog({
      company,
      subject,
      body,
      status,
      seen,
      sentAt,
    });

    await newEmailLog.save();

    res.status(201).json({
      success: true,
      message: 'Email log created successfully',
      data: newEmailLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create email log',
      error: error.message,
    });
  }
};

/**
 * @desc    Fetch all email logs for a specific company
 * @route   GET /api/.../:companyId (to be defined)
 * @access  Private/Public
 */
const getEmailsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Fetch emails for the company, sort latest first, and populate the company name
    const emailLogs = await EmailLog.find({ company: companyId })
      .sort({ createdAt: -1 })
      .populate('company', 'companyName'); // Only pulling the companyName field for efficiency

    res.status(200).json({
      success: true,
      count: emailLogs.length,
      data: emailLogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch email logs for the company',
      error: error.message,
    });
  }
};

/**
 * @desc    Update an email log's status or seen state
 * @route   PUT /api/.../:id (to be defined)
 * @access  Private/Public
 */
const updateEmailStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, seen } = req.body;

    // Update document and return the new version, running schema validations
    const updatedEmailLog = await EmailLog.findByIdAndUpdate(
      id,
      { status, seen },
      { new: true, runValidators: true }
    );

    if (!updatedEmailLog) {
      return res.status(404).json({
        success: false,
        message: 'Email log not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email log updated successfully',
      data: updatedEmailLog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update email log',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete an email log
 * @route   DELETE /api/.../:id (to be defined)
 * @access  Private/Public
 */
const deleteEmailLog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEmailLog = await EmailLog.findByIdAndDelete(id);

    if (!deletedEmailLog) {
      return res.status(404).json({
        success: false,
        message: 'Email log not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email log deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete email log',
      error: error.message,
    });
  }
};

/**
 * @desc    Get weekly email stats (Mon-Sun of current week)
 * @route   GET /api/emails/weekly-stats
 * @access  Private
 */
const getWeeklyStats = async (req, res) => {
  try {
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    // Manually shift to IST so UTCMonth/Date logic aligns with local calendar bounds
    const nowIST = new Date(now.getTime() + IST_OFFSET_MS);

    // Day offset computation (0=Sun -> 6=Sat) shift to (0=Mon -> 6=Sun)
    let currentDayIdx = nowIST.getUTCDay();
    let diffToMonday = currentDayIdx === 0 ? 6 : currentDayIdx - 1;

    const mondayIST = new Date(nowIST);
    mondayIST.setUTCDate(nowIST.getUTCDate() - diffToMonday);
    mondayIST.setUTCHours(0, 0, 0, 0);

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const results = [];

    // Evaluate all 7 days consecutively
    for (let i = 0; i < 7; i++) {
      const startOfDayIST = new Date(mondayIST);
      startOfDayIST.setUTCDate(mondayIST.getUTCDate() + i);
      
      const endOfDayIST = new Date(startOfDayIST);
      endOfDayIST.setUTCHours(23, 59, 59, 999);

      // Re-normalize to UTC to safely query MongoDB timestamps
      const startUTC = new Date(startOfDayIST.getTime() - IST_OFFSET_MS);
      const endUTC = new Date(endOfDayIST.getTime() - IST_OFFSET_MS);

      const count = await EmailLog.countDocuments({
        status: 'Sent',
        sentAt: { $gte: startUTC, $lte: endUTC },
      });

      const isToday = nowIST.getUTCDate() === startOfDayIST.getUTCDate() && 
                      nowIST.getUTCMonth() === startOfDayIST.getUTCMonth() && 
                      nowIST.getUTCFullYear() === startOfDayIST.getUTCFullYear();

      const isFuture = startOfDayIST.getTime() > nowIST.getTime() && !isToday;

      results.push({
        day: labels[i],
        date: startOfDayIST.toISOString().split('T')[0],
        val: isFuture ? -1 : count,
        isToday
      });
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate weekly stats', error: error.message });
  }
};

module.exports = {
  createEmailLog,
  getEmailsByCompany,
  updateEmailStatus,
  deleteEmailLog,
  getWeeklyStats
};
