const { geminiModel } = require('../config/gemini');

/**
 * AI Service
 * Core logic for generating tailored, professional job application emails.
 * Includes security safeguards to exclude social links and robust template fallbacks.
 */

const generateApplicationEmail = async (jobTitle, companyName, resumeContent = "", options = {}) => {
  const applicantName = options.applicantName || "Deepanshu Bhati";
  const applicantRole = options.applicantRole || "Full Stack Developer";

  // A. Internal fallback template generator strictly adhering to constraints
  const buildFallbackTemplate = () => {
    const templateEmail = `Subject: Application for ${jobTitle} at ${companyName}\n\nDear Hiring Team,\n\nMy name is ${applicantName}, a ${applicantRole}.\nI am excited to apply for the ${jobTitle} role at ${companyName}. My recent projects demonstrate strong skills in building scalable web applications using modern technologies.\nI would love the opportunity to discuss how my skills align with your team's goals.\n\nBest regards,\n${applicantName}`;

    return { email: templateEmail, provider: 'template' };
  };

  try {
    if (!geminiModel || typeof geminiModel.generateContent !== 'function') {
      throw new Error('geminiModel is missing or generateContent is not a function.');
    }

    const prompt = `
You are writing a professional, concise job application email.

Context Info:
- Applicant Name: ${applicantName}
- Applicant Role: ${applicantRole}
- Job Title: ${jobTitle}
- Company Name: ${companyName}

Resume Content:
${resumeContent}

Requirements:
- Analyze the resume content carefully.
- Extract relevant skills and experience internally.
- Tailor the email specifically to the Job Title.
- Mention relevant experience naturally.
- Must be formal, concise, and strictly UNDER 200 words.
- Must include a clear 'Subject: ' line at the top.
- Must include a polite greeting.
- Include a strong Call to Action requesting a discussion or interview.
- End with a professional sign-off.
- Do NOT fabricate experience not present in resume content.
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
