export const mockApplicants = [
  { 
    id: 1, 
    name: "Sarah Wilson", 
    role: "Sr. Product Designer", 
    email: "sarah@design.com",
    status: "Shortlisted", 
    matchScore: 92,
    location: "New York, US",
    experience: "8 years",
    skills: ["Figma", "Design Systems", "Prototyping", "React"],
    aiSummary: "Exceptional visual design skills with strong technical understanding. Perfect fit for product-led growth teams.",
    timeline: [
      { event: "Applied", date: "2023-10-24" },
      { event: "Internal Review", date: "2023-10-25" },
      { event: "Shortlisted", date: "2023-10-26" }
    ]
  },
  { 
    id: 2, 
    name: "James Chen", 
    role: "Full Stack Engineer", 
    email: "j.chen@dev.io",
    status: "Interview", 
    matchScore: 88,
    location: "Remote",
    experience: "5 years",
    skills: ["Node.js", "React", "AWS", "PostgreSQL"],
    aiSummary: "Strong backend fundamentals. Experience with high-traffic distributed systems.",
    timeline: [
      { event: "Applied", date: "2023-10-23" },
      { event: "Tech Screen", date: "2023-10-27" }
    ]
  }
];

export const applicantService = {
  getApplicants: async () => {
    await new Promise(r => setTimeout(r, 1200));
    return { data: mockApplicants };
  },
  
  getApplicantById: async (id) => {
    await new Promise(r => setTimeout(r, 600));
    return { data: mockApplicants.find(a => a.id === parseInt(id)) };
  },

  updateStatus: async (id, status) => {
    await new Promise(r => setTimeout(r, 800));
    return { data: { id, status } };
  }
};
