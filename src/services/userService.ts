import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Fetch the authenticated user's basic info (name, email)
export const fetchUserInfo = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get(`${API_URL}/users/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
};

// Update user info (name, email, password)
export const updateUserInfo = async (token: string, userData: any) => {
  try {
    const response = await api.put(
      `${API_URL}/users/info`,
      { ...userData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update user info:', error);
    return null;
  }
};

export const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Make sure this is an array of users
    } catch (err) {
      console.error("Failed to fetch users:", err);
      throw err; // Throw error to handle it on the frontend
    }
  };
