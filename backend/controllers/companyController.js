const Company = require('../models/Company');

/**
 * @desc    Create a new company record
 * @route   POST /api/... (to be defined)
 * @access  Public/Private (depending on requirements)
 */
const createCompany = async (req, res) => {
  try {
    const { companyName, hrEmail, jobRole, status, replied, sentAt } = req.body;

    // Create a new Company instance
    const newCompany = new Company({
      companyName,
      hrEmail,
      jobRole,
      status,
      replied,
      sentAt
    });

    // Save to the database
    await newCompany.save();

    // Return success response with 201 Created status
    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: newCompany
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create company',
      error: error.message
    });
  }
};

/**
 * @desc    Get all companies
 * @route   GET /api/... (to be defined)
 * @access  Public/Private
 */
const getAllCompanies = async (req, res) => {
  try {
    // Fetch all companies and sort by createdAt in descending order (latest first)
    const companies = await Company.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
      error: error.message
    });
  }
};

/**
 * @desc    Update company status and replied field
 * @route   PUT /api/.../:id (to be defined)
 * @access  Public/Private
 */
const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, replied } = req.body;

    // Find the company by ID and update specific fields
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { status, replied },
      { new: true, runValidators: true } // Return the updated document & run validators
    );

    if (!updatedCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company status updated successfully',
      data: updatedCompany
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update company status',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a company
 * @route   DELETE /api/.../:id (to be defined)
 * @access  Public/Private
 */
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCompany = await Company.findByIdAndDelete(id);

    if (!deletedCompany) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete company',
      error: error.message
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  updateCompanyStatus,
  deleteCompany
};
