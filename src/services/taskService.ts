import axios from 'axios';
import dayjs from 'dayjs';

const API_URL = 'http://localhost:3000/tasks';

// Fetch all users
const token = localStorage.getItem('token');

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch tasks by capsule ID
export const fetchTasksByCapsule = async (capsuleId: number) => {
  const response = await axios.get(`${API_URL}/capsule/${capsuleId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new task or subtask (with blockers)
export const createTask = async (capsuleId: number, taskData: any) => {
  const response = await axios.post(API_URL, { capsuleId, ...taskData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update an existing task or subtask (with blockers)
export const updateTask = async (capsuleId: number, taskId: number, taskData: any) => {
  const response = await axios.put(`${API_URL}/${taskId}`, { capsuleId, ...taskData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a task or subtask
export const deleteTask = async (capsuleId: number, taskId: number) => {
  const response = await axios.delete(`${API_URL}/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch subtasks by parent task ID
export const fetchSubtasks = async (parentId: number) => {
  const response = await axios.get(`${API_URL}?parentId=${parentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Create a new subtask (with blockers)
export const createSubtask = async (parent_id: number, capsuleId: number, title: string) => {
  const response = await axios.post(API_URL, { title, capsuleId, parent_id }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update an existing subtask (with blockers)
export const updateSubtask = async (subtaskId: number, taskData: any) => {
  const response = await axios.put(`${API_URL}/${subtaskId}`, taskData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a subtask
export const deleteSubtask = async (subtaskId: number) => {
  const response = await axios.delete(`${API_URL}/${subtaskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch task details by task ID (include blockers)
export const fetchTaskDetails = async (taskId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};

// Fetch comments for a task
export const fetchComments = async (taskId: number) => {
  try {
    const response = await axios.get(`${API_URL}/${taskId}/comments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Create a new comment (rich-text HTML content)
export const createComment = async (taskId: number, commentText: string, author: number, parentCommentId?: number) => {
  try {
    const response = await axios.post(`${API_URL}/${taskId}/comments`, { text: commentText, author, parentCommentId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Update assigned users for a task
export const updateAssignedUsers = async (taskId: number, assignedUserIds: number[]) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}/assigned-users`, { assignedUserIds }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating assigned users:', error);
    throw error;
  }
};

// Mark task as complete (handle blockers)
export const completeTask = async (taskId: number, completed: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}/completion`, {
      completed,
      completedDate: completed ? dayjs().toISOString() : null,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error completing the task:', error);
    throw error;
  }
};

// Fetch task history by task ID
export const fetchTaskHistory = async (taskId: number) => {
  const response = await axios.get(`${API_URL}/${taskId}/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch task blockers
export const fetchTaskBlockers = async (taskId: number) => {
  const response = await axios.get(`${API_URL}/${taskId}/blockers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Add a blocker to a task
export const addBlocker = async (taskId: number, blockerId: number) => {
  const response = await axios.post(`${API_URL}/${taskId}/blockers`, { blockerId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Remove a blocker from a task
export const removeBlocker = async (taskId: number, blockerId: number) => {
  const response = await axios.delete(`${API_URL}/${taskId}/blockers/${blockerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
