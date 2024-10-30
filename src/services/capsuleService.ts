import api from './api';

const API_URL = 'http://localhost:3000/capsules'; 

const token = localStorage.getItem('token');

interface CreateTaskData {
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate?: string;
}

interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
}
  
// Fetch all capsules
export const fetchCapsules = async () => {
  const response = await api.get(`${API_URL}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new capsule
export const createCapsule = async (capsule: { title: string; description: string }) => {
  const response = await api.post(`${API_URL}`, capsule,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update an existing capsule
export const updateCapsule = async (id: number, capsule: { title: string; description: string }) => {
  const response = await api.put(`${API_URL}/${id}`, capsule,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch details of a specific capsule
export const fetchCapsuleDetails = async (id: number) => {
  const response = await api.get(`${API_URL}/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch tasks associated with a specific capsule
export const fetchTasksByCapsule = async (capsuleId: number) => {
    const response = await api.get(`${API_URL}/${capsuleId}/tasks`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};

export const createTask = async (capsuleId: number, data: CreateTaskData) => {
    console.log(data)
    const response = await api.post(`${API_URL}/${capsuleId}/tasks`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};

  export const updateTask = async (capsuleId: number, taskId: number, data: UpdateTaskData) => {
    const response = await api.put(`${API_URL}/${capsuleId}/tasks/${taskId}`, data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};

export const deleteTask = async (capsuleId: number, taskId: number) => {
    const response = await api.delete(`${API_URL}/${capsuleId}/tasks/${taskId}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};