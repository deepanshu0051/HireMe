const { fetchJobsFromJSearch } = require('../config/jsearch');
const { calculateSkillMatch } = require('../utils/skillMatcher');

/**
 * Fetches fresher React developer jobs from JSearch API,
 * applies a relaxed title filter (excludes senior roles only),
 * then scores each job against the user's skills.
 *
 * NOTE: Thresholds and filters are loosened for testing.
 *
 * @param {string[]} [userSkills=[]] - The user's skills array for match scoring.
 * @returns {Promise<Array>} Array of matched, formatted job objects with skill metadata.
 */
const fetchAndFilterJobs = async (userSkills = []) => {
  try {
    // 1. Fetch jobs with fixed parameters targeting fresher React roles in India
    const params = {
      query: "fresher react developer jobs in india",
      num_pages: 1,
      country: "in",
      date_posted: "week",
      employment_types: "FULLTIME",
    };

    const jobs = await fetchJobsFromJSearch(params);

    // Log total jobs received from JSearch before any filtering
    console.log(`[JobController] Total jobs fetched from JSearch: ${jobs ? jobs.length : 0}`);

    if (!jobs || jobs.length === 0) {
      return [];
    }

    // 2. Only exclude clearly senior roles — inclusion keywords are no longer required
    const excludeKeywords = [
      "senior", "lead", "manager", "principal", "architect", "sr.", "head"
    ];

    // 3. Relaxed title filter: exclude senior roles only
    const titleFilteredJobs = jobs.filter(job => {
      if (!job.job_title) return false;

      const title = job.job_title.toLowerCase();
      const hasExcludedKeyword = excludeKeywords.some(keyword => title.includes(keyword));

      return !hasExcludedKeyword;
    });

    console.log(`[JobController] Jobs after title filter (excluding senior roles): ${titleFilteredJobs.length}`);

    // 4. Apply skill matching with a lowered threshold of 30% for testing
    const SKILL_THRESHOLD = 30;

    const qualifiedJobs = titleFilteredJobs
      .map(job => {
        const matchResult = calculateSkillMatch(
          job.job_title,
          job.job_description || '',
          userSkills
        );

        return {
          job_id:              job.job_id,
          job_title:           job.job_title,
          employer_name:       job.employer_name,
          employer_website:    job.employer_website,
          job_apply_link:      job.job_apply_link,
          job_description:     job.job_description,
          job_is_remote:       job.job_is_remote,
          job_posted_at:       job.job_posted_at,
          job_employment_type: job.job_employment_type,
          // Skill match results
          matchPercentage:     matchResult.matchPercentage,
          matchedSkills:       matchResult.matchedSkills,
          missingSkills:       matchResult.missingSkills,
          isQualified:         matchResult.isQualified,
        };
      })
      // 5. Keep jobs meeting the temporary 30% threshold
      .filter(job => job.matchPercentage >= SKILL_THRESHOLD);

    console.log(`[JobController] Jobs after skill match filter (>= ${SKILL_THRESHOLD}%): ${qualifiedJobs.length}`);

    return qualifiedJobs;

  } catch (error) {
    console.error('[JobController] Error fetching and filtering jobs:', error.message);
    return [];
  }
};

module.exports = { fetchAndFilterJobs };
