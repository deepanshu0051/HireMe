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

module.exports = {
  createEmailLog,
  getEmailsByCompany,
  updateEmailStatus,
  deleteEmailLog,
};
