const { geminiModel } = require('../config/gemini');

/**
 * AI Service
 * Core logic for generating tailored, professional job application emails.
 * Includes security safeguards to exclude social links and robust template fallbacks.
 */

const generateApplicationEmail = async (jobTitle, companyName, userSkills = [], options = {}) => {
  const applicantName = options.applicantName || "Deepanshu Bhati";
  const applicantRole = options.applicantRole || "Full Stack Developer";

  // A. Internal fallback template generator strictly adhering to constraints
  const buildFallbackTemplate = () => {
    const joinedSkills = userSkills && userSkills.length > 0 
      ? userSkills.join(', ')
      : "modern full stack web development";

    const templateEmail = `Subject: Application for ${jobTitle} at ${companyName}\n\nDear Hiring Team,\n\nMy name is ${applicantName}, a ${applicantRole} with hands-on experience in ${joinedSkills}.\nI am excited to apply for the ${jobTitle} role at ${companyName}. My recent projects demonstrate strong skills in building scalable web applications using modern JavaScript ecosystems.\nI would love the opportunity to discuss how my skills align with your team's goals.\n\nBest regards,\n${applicantName}`;

    return { email: templateEmail, provider: 'template' };
  };

  try {
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
- **IMPORTANT**: Do NOT include any social links (LinkedIn, GitHub, etc.) or contact URLs. 
- Do not output blockquotes or meta-text. Output ONLY the raw email content.
`;

    const result = await geminiModel.generateContent(prompt);
    let generatedText = result.response.text();

    // B. Security Safety Check: Redact any accidental social links
    generatedText = generatedText.replace(/linkedin\.com|github\.com/gi, '[REDACTED]');

    return { email: generatedText, provider: 'gemini' };
    
  } catch (error) {
    console.error('[AIService] Generation failed. Engaging template fallback. Message:', error.message);
    return buildFallbackTemplate();
  }
};

module.exports = {
  generateApplicationEmail
};
