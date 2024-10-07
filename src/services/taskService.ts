import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks';

// In taskService.ts or relevant file
export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`); // Ensure this endpoint is correct
  return response.data;
};


export const fetchTasksByCapsule = async (capsuleId: number) => {
  const response = await axios.get(`${API_URL}/capsule/${capsuleId}`);
  return response.data;
};

export const createTask = async (capsuleId: number, taskData: any) => {
  const response = await axios.post(API_URL, { capsuleId, ...taskData });
  return response.data;
};

export const updateTask = async (capsuleId: number, taskId: number, taskData: any) => {
  const response = await axios.put(`${API_URL}/${taskId}`, { capsuleId, ...taskData });
  return response.data;
};

export const deleteTask = async (capsuleId: number, taskId: number) => {
  const response = await axios.delete(`${API_URL}/${taskId}`);
  return response.data;
};

export const fetchTaskDetails = async (taskId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};

export const fetchComments = async (taskId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (taskId: number, commentText: string) => {
  try {
    const response = await axios.post(`${API_URL}/${taskId}/comments`, { text: commentText, author: 'Current User' });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export const updateAssignedUsers = async (taskId: number, assignedUserIds: number[]) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}/assigned-users`, { assignedUserIds });
    return response.data;
  } catch (error) {
    console.error('Error updating assigned users:', error);
    throw error;
  }
};
