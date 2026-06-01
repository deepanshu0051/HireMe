import api from '../api/apiClient';

// Mock data generator for SaaS demo
const mockJobs = [
  { id: 1, title: "Senior Product Designer", location: "Remote", type: "Full-time", status: "Published", applicants: 48, postedAt: "2023-10-24" },
  { id: 2, title: "Frontend Engineer (React)", location: "San Francisco", type: "Full-time", status: "Published", applicants: 32, postedAt: "2023-10-23" },
  { id: 3, title: "Marketing Manager", location: "New York", type: "Contract", status: "Draft", applicants: 0, postedAt: "2023-10-22" },
];

export const jobService = {
  getJobs: async () => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000));
    return { data: mockJobs };
  },
  
  getJobById: async (id) => {
    await new Promise(r => setTimeout(r, 500));
    return { data: mockJobs.find(j => j.id === parseInt(id)) };
  },

  createJob: async (jobData) => {
    await new Promise(r => setTimeout(r, 1000));
    return { data: { ...jobData, id: Date.now() } };
  },

  updateJob: async (id, jobData) => {
    await new Promise(r => setTimeout(r, 800));
    return { data: { ...jobData, id } };
  },

  deleteJob: async (id) => {
    await new Promise(r => setTimeout(r, 500));
    return { status: 200 };
  }
};
