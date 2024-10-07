import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Adjust according to your backend endpoint

// Handle login
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

// Handle registration
export const register = async (email: string, password: string, name: string) => {
    const response = await axios.post(`${API_URL}/register`, { email, password, name });
    return response.data;
  };
  

// Get stored JWT token
export const getToken = () => localStorage.getItem('token');
