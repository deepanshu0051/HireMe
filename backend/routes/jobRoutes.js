const express = require('express');
const router = express.Router();

// Import controllers
const { fetchAndFilterJobs } = require('../controllers/jobController');
const { generateApplicationEmail } = require('../controllers/aiController');

/**
 * @route   GET /fetch
 * @desc    Fetch and filter fresher jobs from JSearch API, optionally matched against user skills.
 * @query   skills - Comma-separated list of user skills (e.g. ?skills=React,Node.js,MongoDB)
 * @access  Public
 */
router.get('/fetch', async (req, res) => {
  try {
    // 1. Read the `skills` query parameter from the request URL
    const rawSkills = req.query.skills;

    // 2. Parse skills string into a clean array, or fall back to empty array
    const userSkills = rawSkills
      ? rawSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      : [];

    // 3. Fetch, filter, and skill-match jobs using the controller
    const jobs = await fetchAndFilterJobs(userSkills);

    // 4. Respond with structured JSON
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });

  } catch (error) {
    console.error('[JobRoutes] Error in GET /fetch:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching jobs.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /fetch-with-email
 * @desc    Fetch filtered jobs and sequentially generate AI application emails.
 * @query   skills - Comma-separated list of user skills (e.g. ?skills=React,Node.js)
 * @query   limit - Number of jobs to process (default 3, min 1, max 3)
 * @access  Public
 */
router.get('/fetch-with-email', async (req, res) => {
  try {
    // 1. Extract query tracking params
    const rawSkills = req.query.skills;
    const userSkills = rawSkills
      ? rawSkills.split(',').map(skill => skill.trim()).filter(Boolean)
      : [];
    
    // Parse limit param strictly
    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1) limit = 3;
    if (limit > 3) limit = 3; // Explicitly capping at 3 prevents Gemini rate-limiting 

    // 2. Fetch standard normalized jobs
    const jobs = await fetchAndFilterJobs(userSkills);

    // 3. Prevent crashing if upstream query yields nothing
    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No matching jobs found.',
        count: 0,
        data: []
      });
    }

    // 4. Reduce payload load down to requested/maximum subset size
    const slicedJobs = jobs.slice(0, limit);

    // 5. Sequentially iterate through jobs generating custom emails cleanly
    for (const job of slicedJobs) {
      const jobTitle = job.job_title;
      // Provide a backup employer name if null
      const companyName = job.employer_name || 'Hiring Team';

      // Pass demo applicant info if the user is a guest
      const options = {};
      if (req.user && req.user.role === 'guest') {
        options.applicantName = "Demo User";
        options.applicantRole = "Full Stack Developer";
      }

      const result = await generateApplicationEmail(jobTitle, companyName, userSkills, options);

      // Mutate the original reference safely
      job.applicationEmail = result.email;
      job.emailProvider = result.provider;
    }

    // 6. Push final merged payload out
    return res.status(200).json({
      success: true,
      message: 'Jobs + emails generated',
      count: slicedJobs.length,
      data: slicedJobs
    });

  } catch (error) {
    console.error('[JobRoutes] Unexpected error in GET /fetch-with-email:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Unexpected server error occurred.'
    });
  }
});

module.exports = router;
