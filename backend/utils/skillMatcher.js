/**
 * Skill Matcher Utility
 * Compares a user's skill set against a job title and description,
 * returning a structured match report with percentage and qualification status.
 */

/**
 * A map of common skill aliases/variants.
 * Each key is the canonical (normalized) skill name.
 * Each value is an array of alternative forms that should be treated as equivalent.
 */
const SKILL_ALIASES = {
  'react':      ['react.js', 'reactjs'],
  'node':       ['node.js', 'nodejs'],
  'express':    ['express.js', 'expressjs'],
  'mongodb':    ['mongo db', 'mongo'],
  'javascript': ['js'],
};

/**
 * Resolves a raw skill string to its canonical (normalized) form.
 * For example, "React.js" -> "react", "JS" -> "javascript".
 *
 * @param {string} skill - The raw skill string to normalize.
 * @returns {string} The canonical skill name (lowercase).
 */
const resolveAlias = (skill) => {
  const normalized = skill.toLowerCase().trim();

  // Check if the skill itself is a known canonical key
  if (SKILL_ALIASES[normalized]) return normalized;

  // Check if it's an alias for one of the canonical keys
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (aliases.includes(normalized)) return canonical;
  }

  // No alias found — return as-is
  return normalized;
};

/**
 * Checks whether a skill (or any of its known aliases) appears
 * within the combined job text (title + description).
 *
 * @param {string} canonicalSkill - The canonical form of the skill.
 * @param {string} jobText - The lowercased job title + description.
 * @returns {boolean} True if the skill or an alias is found in the job text.
 */
const isSkillInJobText = (canonicalSkill, jobText) => {
  // Check the canonical form
  if (jobText.includes(canonicalSkill)) return true;

  // Also check all aliases for this canonical skill
  const aliases = SKILL_ALIASES[canonicalSkill] || [];
  return aliases.some(alias => jobText.includes(alias));
};

/**
 * Calculates how well a user's skills match a given job posting.
 *
 * @param {string} jobTitle - The title of the job posting.
 * @param {string} jobDescription - The full description of the job posting.
 * @param {string[]} userSkills - An array of the user's skills.
 * @returns {{
 *   matchPercentage: number,
 *   matchedSkills: string[],
 *   missingSkills: string[],
 *   isQualified: boolean
 * }} A structured match report.
 */
const calculateSkillMatch = (jobTitle, jobDescription, userSkills) => {
  // --- Guard: Handle empty or invalid inputs gracefully ---
  if (
    !Array.isArray(userSkills) ||
    userSkills.length === 0 ||
    !jobTitle ||
    !jobDescription
  ) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: Array.isArray(userSkills) ? userSkills : [],
      isQualified: false,
    };
  }

  // Combine and normalize job text to a single lowercase string for matching
  const jobText = `${jobTitle} ${jobDescription}`.toLowerCase();

  const matchedSkills = [];
  const missingSkills = [];

  // Loop through each user skill and check if it appears in the job text
  for (const rawSkill of userSkills) {
    if (!rawSkill || typeof rawSkill !== 'string') continue;

    const canonical = resolveAlias(rawSkill);

    if (isSkillInJobText(canonical, jobText)) {
      matchedSkills.push(rawSkill); // Push the original user-provided form
    } else {
      missingSkills.push(rawSkill);
    }
  }

  // Calculate match percentage rounded to 2 decimal places
  const matchPercentage = Math.round((matchedSkills.length / userSkills.length) * 100);

  // User is considered qualified if they match 60% or more of the skills
  const isQualified = matchPercentage >= 60;

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    isQualified,
  };
};

module.exports = { calculateSkillMatch };
