/**
 * AI Routes
 * Exposes endpoints for interacting with AI-generated operations (testing).
 */
const express = require('express');
const router = express.Router();
const axios = require('axios'); // Required to establish raw REST queries

// Import the Gemini AI controller function
const { generateApplicationEmail } = require('../controllers/aiController');

/**
 * @route   GET /models
 * @desc    Debug route to query all functional AI models available for the loaded Gemini API Key.
 * @access  Public
 */
router.get('/models', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Strictly block request if credentials are computationally absent
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'GEMINI_API_KEY is missing from environment.',
      });
    }

    // 2. Query the raw v1beta standard REST endpoint 
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    // 3. Extract the master list
    const modelsList = response.data.models || [];

    // 4. Sanitize and restructure the monolithic payload down to the requested meta-fields
    const sanitizedModels = modelsList.map((m) => ({
      name: m.name,
      displayName: m.displayName,
      supportedGenerationMethods: m.supportedGenerationMethods,
    }));

    return res.status(200).json({
      success: true,
      message: 'Available Gemini models retrieved natively.',
      count: sanitizedModels.length,
      data: sanitizedModels,
    });
  } catch (error) {
    console.error('[AIRoutes - GET /models] Error:', error.message);
    const isProd = process.env.NODE_ENV === 'production';

    return res.status(500).json({
      success: false,
      message: 'Failed to REST query the Google Generative Language endpoint.',
      debug: isProd ? undefined : error.message,
    });
  }
});

/**
 * @route   POST /generate-email
 * @desc    Test route to dynamically generate an AI job application email.
 * @body    jobTitle (string, required)
 * @body    companyName (string, required)
 * @body    userSkills (array of strings, optional)
 * @access  Public
 */
router.post('/generate-email', async (req, res) => {
  try {
    // 1. Extract parameters from the request body, defaulting userSkills to an empty array
    const { jobTitle, companyName, userSkills = [] } = req.body;

    // 2. Initial Validation: Both jobTitle and companyName are strictly required
    if (!jobTitle || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'jobTitle' and 'companyName' are required string fields.",
      });
    }

    // 3. Delegate generation to the AI controller
    // Pass demo applicant info if the user is a guest to protect real personal info
    const options = {};
    if (req.user && req.user.role === 'guest') {
      options.applicantName = "Demo User";
      options.applicantRole = "Full Stack Developer";
    }

    const result = await generateApplicationEmail(jobTitle, companyName, userSkills, options);

    // 4. Respond with a successful payload containing the generated text
    return res.status(200).json({
      success: true,
      message: 'AI email generated successfully',
      data: {
        jobTitle,
        companyName,
        email: result.email,
        provider: result.provider
      },
    });

  } catch (error) {
    // 5. Handle unexpected server execution errors safely and dynamically
    console.error('[AIRoutes] Unexpected route error:', error.message);
    
    // Check if we are running in production context securely
    const isProd = process.env.NODE_ENV === 'production';

    return res.status(500).json({
      success: false,
      message: 'AI email generation failed',
      // Provide raw message payload exclusively in local/staging environments
      debug: isProd ? undefined : error.message
    });
  }
});

module.exports = router;
