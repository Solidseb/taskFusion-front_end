import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Fetch user profile (bio and skills)
export const fetchUserProfile = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};

// Fetch user info (name and email)
export const fetchUserInfo = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, profile: { bio: string; name: string; email: string; avatar:string }, skills: any[], password?: string) => {
    return axios.put(
      `${API_URL}/users/profile`,
      { profile, skills, password },  // Ensure this structure matches the back-end expectations
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
};

export const uploadUserAvatar = async (token: string, avatarFile: File) => {
const formData = new FormData();
formData.append('avatar', avatarFile);

return axios.post(`${API_URL}/users/profile/avatar`, formData, {
    headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
    },
});
};
