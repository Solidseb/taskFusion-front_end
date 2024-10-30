// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
});

// Intercept responses to handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request intercepted");
      return Promise.resolve({ data: [] }); 
    }
    return Promise.reject(error);
  }
);

export default api;
