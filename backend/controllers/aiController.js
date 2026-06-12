/**
 * AI Controller
 * Handles automated generation workflows utilizing Google Gemini via @google/generative-ai, 
 * with built-in safe fallback templates ensuring 100% operational uptime.
 */
const { geminiModel } = require('../config/gemini');

/**
 * Generates a tailored, professional job application email.
 * Defaults to the Google Gemini AI API, but instantly activates an embedded static 
 * template if rate limits, missing keys, or server timeouts block the API request.
 *
 * @param {string} jobTitle - The title of the position being applied to.
 * @param {string} companyName - The name of the company.
 * @param {string[]} userSkills - Array of the applicant's relevant skills.
 * @param {Object} options - Optional configuration (applicantName, applicantRole).
 * @returns {Promise<{email: string, provider: 'gemini' | 'template'}>} Execution result.
 */
const generateApplicationEmail = async (jobTitle, companyName, userSkills = [], options = {}) => {
  const applicantName = options.applicantName || "Deepanshu Bhati";
  const applicantRole = options.applicantRole || "Full Stack Developer";

  // A. Internal fallback template generator strictly adhering to constraints
  const buildFallbackTemplate = () => {
    // Join array by comma, or strictly inject fallback default if totally empty array
    const joinedSkills = userSkills && userSkills.length > 0 
      ? userSkills.join(', ')
      : "modern full stack web development";

    const templateEmail = `Subject: Application for ${jobTitle} at ${companyName}\n\nDear Hiring Team,\n\nMy name is ${applicantName}, a ${applicantRole} with hands-on experience in ${joinedSkills}.\nI am excited to apply for the ${jobTitle} role at ${companyName}. My recent projects demonstrate strong skills in building scalable web applications using modern JavaScript ecosystems.\nI would love the opportunity to discuss how my skills align with your team's goals.\n\nBest regards,\n${applicantName}`;

    return { email: templateEmail, provider: 'template' };
  };

  // B. Attempt primary intelligent generation pipeline
  try {
    // Primary sanity check guarding against unconfigured/broken upstream model imports
    if (!geminiModel || typeof geminiModel.generateContent !== 'function') {
      throw new Error('geminiModel is missing or generateContent is not a function.');
    }

    const skillsString = userSkills && userSkills.length > 0 
      ? userSkills.join(', ')
      : 'software development';

    const prompt = `
You are writing a professional, concise job application email.

Context Info:
- Applicant Name: ${applicantName}
- Applicant Role: ${applicantRole}
- Job Title: ${jobTitle}
- Company Name: ${companyName}
- Skills: ${skillsString}

Requirements:
- Must be formal, concise, and strictly UNDER 200 words.
- Must include a clear 'Subject: ' line at the top.
- Must include a polite greeting.
- Provide 2-3 lines summarizing how the listed Skills make the applicant a strong fit for the Job Title.
- Include a strong Call to Action requesting a discussion or interview.
- End with a professional sign-off.
- Do not output blockquotes or meta-text. Output ONLY the raw email content.
`;

    const result = await geminiModel.generateContent(prompt);
    const generatedText = result.response.text();

    // Mission parameter strictly requested this return signature
    return { email: generatedText, provider: 'gemini' };
    
  } catch (error) {
    // C. Engage Graceful Degradation on ANY error pattern (Quota/429/Network)
    // We intentionally DONT use 'throw error' anymore as we must maintain the system seamlessly
    console.error('[AIController] Gemini API generation failed safely. Engaging template fallback. Message:', error.message);
    
    // Invoke synchronous fallback
    return buildFallbackTemplate();
  }
};

module.exports = {
  generateApplicationEmail
};
