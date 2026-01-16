import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) =>
        api.post('/auth/login', { email, password }),

    getCurrentUser: () =>
        api.get('/auth/me'),

    getAllUsers: () =>
        api.get('/auth/users'),

    register: (userData) =>
        api.post('/auth/register', userData)
};

// Leads API
export const leadsAPI = {
    getAll: (filters = {}) =>
        api.get('/leads', { params: filters }),

    getById: (id) =>
        api.get(`/leads/${id}`),

    create: (leadData) =>
        api.post('/leads', leadData),

    update: (id, leadData) =>
        api.put(`/leads/${id}`, leadData),

    delete: (id) =>
        api.delete(`/leads/${id}`),

    getStats: (assignedTo) =>
        api.get('/leads/stats', { params: { assignedTo } })
};

export default api;
