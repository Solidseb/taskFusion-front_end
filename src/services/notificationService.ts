// src/services/notificationService.ts
import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');

export const fetchNotifications = async () => {
  const response = await api.get(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const markNotificationsAsRead = async () => {
  await api.post(`${API_URL}/notifications/mark-as-read`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
