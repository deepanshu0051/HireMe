const { fetchJobsFromJSearch } = require('../config/jsearch');
const { calculateSkillMatch } = require('../utils/skillMatcher');
const Company = require('../models/Company');
const Profile = require('../models/Profile');

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
    let queryStr = "software developer jobs in india";
    const adminProfile = await Profile.findOne({ key: 'admin' }).lean();
    if (adminProfile) {
      let role = adminProfile.role || 'software developer';
      if (adminProfile.skills && adminProfile.skills.length > 0) {
        const topSkills = adminProfile.skills.slice(0, 2).join(' ');
        queryStr = `${topSkills} ${role} jobs in india`.trim();
      } else {
        queryStr = `${role} jobs in india`.trim();
      }
    }

    // 1. Fetch jobs dynamically based on admin profile
    const params = {
      query: queryStr,
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

    // 4. Apply skill matching — skip filter entirely if no skills are available
    //    (empty userSkills means every job would score 0%, blocking all ingestion)
    const SKILL_THRESHOLD = 30;
    let qualifiedJobs;

    if (!userSkills || userSkills.length === 0) {
      // No skills loaded → accept all title-filtered jobs unconditionally
      console.log('[JobController] No user skills available — skipping skill filter, accepting all title-filtered jobs.');
      qualifiedJobs = titleFilteredJobs.map(job => ({
        job_id:              job.job_id,
        job_title:           job.job_title,
        employer_name:       job.employer_name,
        employer_website:    job.employer_website,
        job_apply_link:      job.job_apply_link,
        job_description:     job.job_description,
        job_is_remote:       job.job_is_remote,
        job_posted_at:       job.job_posted_at,
        job_employment_type: job.job_employment_type,
        job_city:            job.job_city,
        job_state:           job.job_state,
        job_country:         job.job_country,
        matchPercentage:     100,
        matchedSkills:       [],
        missingSkills:       [],
        isQualified:         true,
      }));
    } else {
      // Skills are available — score and filter normally
      qualifiedJobs = titleFilteredJobs
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
            job_city:            job.job_city,
            job_state:           job.job_state,
            job_country:         job.job_country,
            matchPercentage:     matchResult.matchPercentage,
            matchedSkills:       matchResult.matchedSkills,
            missingSkills:       matchResult.missingSkills,
            isQualified:         matchResult.isQualified,
          };
        })
        .filter(job => job.matchPercentage >= SKILL_THRESHOLD);
    }

    console.log(`[JobController] Jobs after skill match filter (>= ${SKILL_THRESHOLD}%): ${qualifiedJobs.length}`);

    return qualifiedJobs;

  } catch (error) {
    console.error('[JobController] Error fetching and filtering jobs:', error.message);
    return [];
  }
};

/**
 * Automates the fetching of jobs and inserts them into the MongoDB 'companies' collection.
 * Extracts email from the job description if available. Filters out existing duplicates.
 */
const syncJobsToCompanies = async (userSkills = []) => {
  try {
    const jobs = await fetchAndFilterJobs(userSkills);
    let newInserts = 0;

    for (const job of jobs) {
      const {
        job_id,
        employer_name,
        job_title,
        job_city, job_state, job_country,
        job_apply_link,
        job_description
      } = job;

      const companyName = employer_name || 'Unknown Company';
      const jobTitle = job_title || 'Unknown Title';
      
      const locParts = [job_city, job_state, job_country].filter(Boolean);
      const jobLocation = locParts.length > 0 ? locParts.join(', ') : 'Unknown Location';
      const jobUrl = job_apply_link || '';

      // Fallback regex to capture emails in job description
      let extractedEmail = null;
      if (job_description) {
        const emailMatch = job_description.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) {
          extractedEmail = emailMatch[0];
        }
      }

      // Avoid duplicates using job_id or companyName+jobTitle combination
      const query = [];
      if (job_id) {
        query.push({ job_id: job_id });
      }
      query.push({ companyName: companyName, jobTitle: jobTitle });

      const existing = await Company.findOne({ $or: query });

      if (!existing) {
        await Company.create({
          job_id: job_id || null,
          companyName,
          jobRole: jobTitle,
          jobLocation,
          jobUrl,
          hrEmail: extractedEmail || null,
          status: "Pending",
          source: "JSearch",
          createdAt: new Date()
        });
        newInserts++;
      }
    }
    
    console.log(`[JobController] syncJobsToCompanies inserted ${newInserts} new jobs as Pending.`);
    return newInserts;
  } catch (error) {
    console.error('[JobController] Error in syncJobsToCompanies:', error.message);
    return 0;
  }
};

module.exports = { fetchAndFilterJobs, syncJobsToCompanies };
