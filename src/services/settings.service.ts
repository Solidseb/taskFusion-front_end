// src/services/settings.service.ts
import axios from 'axios';
import { Tag, Role, Permission, User } from '../components/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Fetch organization settings
export const fetchSettings = async (organizationId: string) => {
  const response = await axios.get(`${API_URL}/settings/${organizationId}`, getAuthHeaders());
  return response.data;
};

// Save organization settings
export const saveSettings = async (organizationId: string, settings: { subtasksEnabled: boolean; blockersEnabled: boolean }) => {
  await axios.put(`${API_URL}/settings/${organizationId}`, settings, getAuthHeaders());
};

// Tag-related functions
export const fetchTags = async (organizationId: string): Promise<Tag[]> => {
  const response = await axios.get(`${API_URL}/tags/${organizationId}`, getAuthHeaders());
  return response.data;
};

export const addTag = async (name: string, organizationId: string): Promise<Tag> => {
  const response = await axios.post(`${API_URL}/tags`, { name, organizationId }, getAuthHeaders());
  return response.data;
};

export const deleteTag = async (tagId: string) => {
  await axios.delete(`${API_URL}/tags/${tagId}`, getAuthHeaders());
};

export const updateTag = async (tagId: string, name: string): Promise<Tag> => {
  const response = await axios.put(`${API_URL}/tags/${tagId}`, { name }, getAuthHeaders());
  return response.data;
};

// Role-related functions
export const fetchRoles = async (organizationId: string): Promise<Role[]> => {
  const response = await axios.get(`${API_URL}/organizations/${organizationId}/roles`, getAuthHeaders());
  return response.data;
};

export const addRole = async (name: string, organizationId: string): Promise<Role> => {
  const response = await axios.post(`${API_URL}/organizations/${organizationId}/roles`, { name }, getAuthHeaders());
  return response.data;
};

export const createRole = async (name: string, organizationId: string, permissionIds: string[]) => {
    const response = await axios.post(
      `${API_URL}/organizations/${organizationId}/roles`,
      { name, permissionIds },
      getAuthHeaders(),
    );
    return response.data;
};

export const updateRole = async (roleId: string, name: string, organizationId: string, permissionIds: string[]) => {
    await axios.put(`${API_URL}/organizations/${organizationId}/roles/${roleId}`, { name, permissionIds }, getAuthHeaders());
};

export const updateRolePermissions = async (roleId: string, permissionIds: string[]) => {
  await axios.put(`${API_URL}/roles/${roleId}/permissions`, { permissionIds }, getAuthHeaders());
};

export const assignPermissionToRole = async (roleId: string, permissionId: string) => {
  await axios.post(`${API_URL}/roles/${roleId}/permissions/${permissionId}`, {}, getAuthHeaders());
};

// Permission-related functions
export const fetchPermissions = async (organizationId: string): Promise<Permission[]> => {
  const response = await axios.get(`${API_URL}/organizations/${organizationId}/permissions`, getAuthHeaders());
  return response.data;
};

// User-related functions
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data;
};

export const addUser = async (userData: { name: string; email: string; password: string }, roleId:string ): Promise<string> => {
  const response = await axios.post(`${API_URL}/users/register`, { userData, roleId }, getAuthHeaders());
  return response.data.id;
};

export const assignRoleToUser = async (userId: string, roleId: string) => {
  await axios.post(`${API_URL}/users/${userId}/roles`, { roleId }, getAuthHeaders());
};

export const deleteRole = async (roleId: string, organizationId: string): Promise<void> => {
    await axios.delete(`${API_URL}/organizations/${organizationId}/roles/${roleId}`, getAuthHeaders());
  };
