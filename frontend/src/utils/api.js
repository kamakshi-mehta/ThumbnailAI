import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  // Our backend APIs start with /api, so relative base URL handles both dev proxy and prod serving
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor to automatically add the Authorization header if JWT token is stored
API.interceptors.request.use(
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

export default API;
