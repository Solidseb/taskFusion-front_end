import axios from 'axios';

const API_URL = 'http://localhost:3000/tasks';

// Fetch all users
export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

// Fetch tasks by capsule ID
export const fetchTasksByCapsule = async (capsuleId: number) => {
  const response = await axios.get(`${API_URL}/capsule/${capsuleId}`);
  return response.data;
};

// Create a new task
export const createTask = async (capsuleId: number, taskData: any) => {
  const response = await axios.post(API_URL, { capsuleId, ...taskData });
  return response.data;
};

// Update an existing task
export const updateTask = async (capsuleId: number, taskId: number, taskData: any) => {
  const response = await axios.put(`${API_URL}/${taskId}`, { capsuleId, ...taskData });
  return response.data;
};

// Delete a task
export const deleteTask = async (capsuleId: number, taskId: number) => {
  const response = await axios.delete(`${API_URL}/${taskId}`);
  return response.data;
};

// Fetch task details by task ID
export const fetchTaskDetails = async (taskId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};

// Fetch comments for a task
export const fetchComments = async (taskId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Create a new comment (rich-text HTML content)
export const createComment = async (taskId: number, commentText: string, author: number, parentCommentId?: number) => {
  try {
    const response = await axios.post(`${API_URL}/${taskId}/comments`, { text: commentText, author, parentCommentId });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Update assigned users for a task
export const updateAssignedUsers = async (taskId: number, assignedUserIds: number[]) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}/assigned-users`, { assignedUserIds });
    return response.data;
  } catch (error) {
    console.error('Error updating assigned users:', error);
    throw error;
  }
};
