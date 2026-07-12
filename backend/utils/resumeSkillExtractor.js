const IT_SKILLS = [
  "javascript", "react", "node", "node.js",
  "mongodb", "express", "html", "css",
  "typescript", "next.js", "python",
  "java", "c++", "sql", "mysql",
  "firebase", "redux", "tailwind",
  "docker", "aws", "git"
];

function extractSkillsFromResume(resumeText) {
  if (!resumeText) return [];
  const text = resumeText.toLowerCase();
  
  const matchedSkills = [];
  for (const skill of IT_SKILLS) {
    if (text.includes(skill)) {
      matchedSkills.push(skill);
    }
  }
  
  return [...new Set(matchedSkills)];
}

module.exports = { extractSkillsFromResume };
