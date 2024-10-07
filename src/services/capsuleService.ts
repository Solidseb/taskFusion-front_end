import axios from 'axios';

const API_URL = 'http://localhost:3000/capsules'; 

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
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Create a new capsule
export const createCapsule = async (capsule: { title: string; description: string }) => {
  const response = await axios.post(`${API_URL}`, capsule);
  return response.data;
};

// Update an existing capsule
export const updateCapsule = async (id: number, capsule: { title: string; description: string }) => {
  const response = await axios.put(`${API_URL}/${id}`, capsule);
  return response.data;
};

// Fetch details of a specific capsule
export const fetchCapsuleDetails = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Fetch tasks associated with a specific capsule
export const fetchTasksByCapsule = async (capsuleId: number) => {
    const response = await axios.get(`${API_URL}/${capsuleId}/tasks`);
    return response.data;
};

export const createTask = async (capsuleId: number, data: CreateTaskData) => {
    console.log(data)
    const response = await axios.post(`${API_URL}/${capsuleId}/tasks`, data);
    return response.data;
};

  export const updateTask = async (capsuleId: number, taskId: number, data: UpdateTaskData) => {
    const response = await axios.put(`${API_URL}/${capsuleId}/tasks/${taskId}`, data);
    return response.data;
};

export const deleteTask = async (capsuleId: number, taskId: number) => {
    const response = await axios.delete(`${API_URL}/${capsuleId}/tasks/${taskId}`);
    return response.data;
};