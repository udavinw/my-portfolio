import axios from 'axios';

// Get backend URL from environment variables (required for Create React App: REACT_APP_ prefix)
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  updateProfile: (userData) => api.put('/auth/update', userData),
  verifyToken: () => api.get('/auth/verify'),
};

// Projects API functions
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (projectId) => api.get(`/projects/${projectId}`),
  create: (formData) => api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (projectId, formData) => api.put(`/projects/${projectId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (projectId) => api.delete(`/projects/${projectId}`),
};

// Experience API functions
export const experienceAPI = {
  getAll: () => api.get('/experience'),
  getById: (experienceId) => api.get(`/experience/${experienceId}`),
  create: (experienceData) => api.post('/experience', experienceData),
  update: (experienceId, experienceData) => api.put(`/experience/${experienceId}`, experienceData),
  delete: (experienceId) => api.delete(`/experience/${experienceId}`),
};

// Education API functions
export const educationAPI = {
  getAll: () => api.get('/education'),
  getById: (educationId) => api.get(`/education/${educationId}`),
  create: (educationData) => api.post('/education', educationData),
  update: (educationId, educationData) => api.put(`/education/${educationId}`, educationData),
  delete: (educationId) => api.delete(`/education/${educationId}`),
};

// Testimonials API functions
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
  getById: (testimonialId) => api.get(`/testimonials/${testimonialId}`),
  create: (formData) => api.post('/testimonials', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (testimonialId, formData) => api.put(`/testimonials/${testimonialId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (testimonialId) => api.delete(`/testimonials/${testimonialId}`),
};

// Contact API functions
export const contactAPI = {
  send: (formData) => api.post('/contact', formData),
};

// Skills API functions
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (skillData) => api.post('/skills', skillData),
  update: (skillId, skillData) => api.put(`/skills/${skillId}`, skillData),
  delete: (skillId) => api.delete(`/skills/${skillId}`),
};

// Dashboard stats API function
export const dashboardAPI = {
  getStats: async () => {
    try {
      const [projects, experiences, education, testimonials, skills] = await Promise.all([
        projectsAPI.getAll(),
        experienceAPI.getAll(),
        educationAPI.getAll(),
        testimonialsAPI.getAll(),
        skillsAPI.getAll(),
      ]);

      return {
        projects: projects.data.length,
        experiences: experiences.data.length,
        education: education.data.length,
        testimonials: testimonials.data.length,
        skills: skills.data.length,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
};

export default api;
