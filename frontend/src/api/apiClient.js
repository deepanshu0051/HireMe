import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Interceptor for SaaS demonstration
api.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('admin_token') || 'mock-admin-token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
