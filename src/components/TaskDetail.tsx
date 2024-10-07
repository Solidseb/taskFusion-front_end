import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskDetails, updateTask, deleteTask, fetchComments, createComment } from '../services/taskService';
import axios from 'axios'; // Import to fetch users
import { CircularProgress, Box, Typography, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import TaskDetailOverview from './TaskDetailOverview';

// Interfaces for User, Task, and Comment
interface User {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedUsers: User[];
}

interface Comment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}

interface TaskDetailProps {
  capsuleId: number;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ capsuleId }) => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [users, setUsers] = useState<User[]>([]); // State to hold users

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users'); // Replace with the correct API endpoint
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to load users.');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true);
      try {
        if (taskId) {
          const taskDetails = await fetchTaskDetails(parseInt(taskId));
          setTask(taskDetails);
          // Load comments for the task
          const taskComments = await fetchComments(parseInt(taskId));
          setComments(taskComments);
        }
      } catch (error) {
        toast.error('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [taskId]);

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(capsuleId, updatedTask.id, updatedTask);
      setTask(updatedTask);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(capsuleId, taskId);
      toast.success('Task deleted successfully!');
      // Redirect or remove task detail view as needed
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() && taskId) {
      try {
        const addedComment = await createComment(parseInt(taskId), newComment);
        setComments([...comments, addedComment]);
        setNewComment('');
        toast.success('Comment added successfully!');
      } catch (error) {
        toast.error('Failed to add comment.');
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      {task ? (
        <>
          {/* Task Overview */}
          <TaskDetailOverview
            task={task}
            users={users} // Pass users as prop to TaskDetailOverview
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* Comments Section */}
          <Box mt={4}>
            <Typography variant="h6">Comments</Typography>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Box key={comment.id} mt={2} p={1} border="1px solid #ccc">
                  <Typography variant="body2">
                    <strong>{comment.author}</strong> at {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">{comment.text}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2">No comments yet.</Typography>
            )}

            {/* Add New Comment */}
            <TextField
              label="Add a Comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
              multiline
              rows={2}
              margin="normal"
            />
            <Button variant="contained" onClick={handleAddComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </Box>
        </>
      ) : (
        <p>No task found.</p>
      )}
    </Box>
  );
};

export default TaskDetail;
