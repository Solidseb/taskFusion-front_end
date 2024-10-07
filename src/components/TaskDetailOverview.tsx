import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Chip,
  Menu,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// User interface
interface User {
  id: number;
  name: string;
}

// Props for task detail
interface TaskDetailProps {
  task: {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    assignedUsers: User[];
  };
  users: User[]; // All users for assigning to task
  onUpdateTask: (updatedTask: any) => void;
  onDeleteTask: (taskId: number) => void;
}

const TaskDetailOverview: React.FC<TaskDetailProps> = ({ task, users, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task);
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);
  const [priorityAnchorEl, setPriorityAnchorEl] = useState<null | HTMLElement>(null);
  const [assignAnchorEl, setAssignAnchorEl] = useState<null | HTMLElement>(null);

  // Handle status changes via dropdown menu
  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget);
  };
  const handleStatusClose = (newStatus?: string) => {
    setStatusAnchorEl(null);
    if (newStatus && newStatus !== task.status) {
      onUpdateTask({ ...updatedTask, status: newStatus });
      setUpdatedTask({ ...updatedTask, status: newStatus });
    }
  };

  // Handle priority changes via dropdown menu
  const handlePriorityClick = (event: React.MouseEvent<HTMLElement>) => {
    setPriorityAnchorEl(event.currentTarget);
  };
  const handlePriorityClose = (newPriority?: string) => {
    setPriorityAnchorEl(null);
    if (newPriority && newPriority !== task.priority) {
      onUpdateTask({ ...updatedTask, priority: newPriority });
      setUpdatedTask({ ...updatedTask, priority: newPriority });
    }
  };

  // Handle adding/removing assigned users
  const handleAssignClick = (event: React.MouseEvent<HTMLElement>) => {
    setAssignAnchorEl(event.currentTarget);
  };

  const handleAssignClose = (userId?: number) => {
    setAssignAnchorEl(null);

    if (userId !== undefined) {
      // Toggle user assignment
      const isAssigned = updatedTask.assignedUsers.some(user => user.id === userId);

      const updatedAssignedUsers = isAssigned
        ? updatedTask.assignedUsers.filter(user => user.id !== userId) // Remove if already assigned
        : [...updatedTask.assignedUsers, users.find(user => user.id === userId)!]; // Add if not assigned

      const newTask = { ...updatedTask, assignedUsers: updatedAssignedUsers };
      onUpdateTask(newTask);
      setUpdatedTask(newTask);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedTask(task); // Reset changes
  };

  const handleSaveEdit = () => {
    onUpdateTask(updatedTask);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Task Title */}
      {isEditing ? (
        <TextField
          label="Task Title"
          value={updatedTask.title}
          onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
          fullWidth
          margin="normal"
        />
      ) : (
        <Typography variant="h4">{task.title}</Typography>
      )}

      {/* Task Description */}
      {isEditing ? (
        <TextField
          label="Task Description"
          value={updatedTask.description}
          onChange={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ marginTop: 1, marginBottom: 3 }}>
          {task.description}
        </Typography>
      )}

      {/* Task Status */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle2">Status:</Typography>
        <Chip
          label={task.status}
          color={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'primary' : 'default'}
          onClick={handleStatusClick}
        />
        <Menu
          anchorEl={statusAnchorEl}
          open={Boolean(statusAnchorEl)}
          onClose={() => handleStatusClose()}
        >
          {['To Do', 'In Progress', 'Completed'].map((status) => (
            <MenuItem key={status} onClick={() => handleStatusClose(status)}>
              {status}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Task Priority */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle2">Priority:</Typography>
        <Chip
          label={task.priority}
          color={
            task.priority === 'High' ? 'error' :
            task.priority === 'Medium' ? 'warning' :
            'success'
          }
          onClick={handlePriorityClick}
        />
        <Menu
          anchorEl={priorityAnchorEl}
          open={Boolean(priorityAnchorEl)}
          onClose={() => handlePriorityClose()}
        >
          {['High', 'Medium', 'Low'].map((priority) => (
            <MenuItem key={priority} onClick={() => handlePriorityClose(priority)}>
              {priority}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Assigned Users */}
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle2">Assigned Users:</Typography>
        {updatedTask.assignedUsers.map((user) => (
          <Chip key={user.id} label={user.name} onDelete={() => handleAssignClose(user.id)} />
        ))}
        <IconButton onClick={handleAssignClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={assignAnchorEl}
          open={Boolean(assignAnchorEl)}
          onClose={() => handleAssignClose()}
        >
          {users.map((user) => (
            <MenuItem key={user.id} onClick={() => handleAssignClose(user.id)}>
              {user.name}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
        {isEditing ? (
          <>
            <Button variant="contained" color="primary" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" onClick={handleEditClick}>Edit</Button>
            <Button variant="outlined" color="error" onClick={handleDeleteClick}>Delete</Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TaskDetailOverview;
