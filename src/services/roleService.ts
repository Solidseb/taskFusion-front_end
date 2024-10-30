import api from './api';

const token = localStorage.getItem('token');
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const fetchRoles = async () => {
  const response = await api.get(`${API_URL}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createRole = async (name: string) => {
  const response = await api.post(`${API_URL}/roles`, { name }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteRole = async (roleId: string) => {
  await api.delete(`${API_URL}/roles/${roleId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchPermissions = async () => {
  const response = await api.get(`${API_URL}/permissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchRolePermissions = async (roleId: string) => {
  const response = await api.get(`${API_URL}/roles/${roleId}/permissions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]) => {
  await api.put(`${API_URL}/roles/${roleId}/permissions`, { permissionIds }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
