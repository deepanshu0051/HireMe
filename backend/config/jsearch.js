/**
 * JSearch API configuration and service
 * Reusable utility to fetch job postings from RapidAPI
 */
const axios = require('axios');

/**
 * Fetches jobs from the JSearch API on RapidAPI.
 * 
 * @param {Object} params - The query parameters for the API request.
 * @param {string} params.query - Search query (e.g., 'Software Engineer in San Francisco').
 * @param {string} [params.cursor] - Cursor for pagination.
 * @param {string} [params.num_pages] - Number of pages to return.
 * @param {string} [params.country] - Country code for searching.
 * @param {string} [params.language] - Language code.
 * @param {string} [params.location] - Location to search in.
 * @param {string} [params.date_posted] - Date posted filter (e.g., 'today', '3days', 'week').
 * @param {boolean} [params.work_from_home] - Filter for remote jobs.
 * @param {string} [params.employment_types] - Comma-separated list of employment types (e.g., 'FULLTIME').
 * @param {string} [params.job_requirements] - Job requirements filter.
 * @param {string} [params.radius] - Radius around location in km.
 * @param {string} [params.exclude_job_publishers] - Comma-separated list of publishers to exclude.
 * @param {string} [params.fields] - Comma-separated list of fields to return.
 * @returns {Promise<Array>} List of job postings, or empty array if an error occurs.
 */
const fetchJobsFromJSearch = async (params) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: params,
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST,
      },
    };

    const response = await axios.request(options);

    // JSearch returns results inside response.data.data
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('[JSearch API] Failed to fetch jobs:', error.message);
    if (error.response) {
      // The request was made and the server responded with an error status code
      console.error('[JSearch API] Response details:', error.response.data);
    }
    return []; // Return an empty array as requested if jobs are not found or errors occur
  }
};

module.exports = { fetchJobsFromJSearch };
