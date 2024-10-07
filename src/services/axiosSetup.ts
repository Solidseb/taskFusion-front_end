import axios from 'axios';
import { getToken } from './authService'; // Ensure getToken is correctly implemented

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = getToken(); // Get JWT token from storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach the token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
