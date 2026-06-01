const express = require('express');
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  updateCompanyStatus,
  deleteCompany
} = require('../controllers/companyController');

/**
 * @desc    Create a new company record
 * @route   POST /
 */
router.post('/', createCompany);

/**
 * @desc    Get all companies
 * @route   GET /
 */
router.get('/', getAllCompanies);

/**
 * @desc    Update company status
 * @route   PUT /:id
 */
router.put('/:id', updateCompanyStatus);

/**
 * @desc    Delete a company
 * @route   DELETE /:id
 */
router.delete('/:id', deleteCompany);

module.exports = router;
