import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// User interface
interface User {
  id: number;
  name: string;
  avatar?: string;
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

const statusOptions = ['To Do', 'In Progress', 'Completed'];
const priorityOptions = ['Low', 'Medium', 'High'];

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
      const isAssigned = updatedTask.assignedUsers.some((user) => user.id === userId);
      const updatedAssignedUsers = isAssigned
        ? updatedTask.assignedUsers.filter((user) => user.id !== userId)
        : [...updatedTask.assignedUsers, users.find((user) => user.id === userId)!];

      onUpdateTask({ ...updatedTask, assignedUsers: updatedAssignedUsers });
      setUpdatedTask({ ...updatedTask, assignedUsers: updatedAssignedUsers });
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedTask(task); // Reset changes if cancel
  };

  const handleSaveEdit = () => {
    onUpdateTask(updatedTask);
    setIsEditing(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Task Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {isEditing ? (
          <TextField
            value={updatedTask.title}
            onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
            fullWidth
            variant="outlined"
            label="Task Title"
            sx={{ marginRight: 2 }}
          />
        ) : (
          <Typography variant="h4">{task.title}</Typography>
        )}

        {/* Status, Priority, and Assigned Users */}
        <Box display="flex" gap={1} alignItems="center">
          {/* Status */}
          <Chip
            label={task.status}
            color={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'primary' : 'default'}
            onClick={handleStatusClick}
          />
          <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={() => handleStatusClose()}>
            {statusOptions.map((status) => (
              <MenuItem key={status} onClick={() => handleStatusClose(status)}>
                {status}
              </MenuItem>
            ))}
          </Menu>

          {/* Priority */}
          <Chip
            label={task.priority}
            color={
              task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'
            }
            onClick={handlePriorityClick}
          />
          <Menu anchorEl={priorityAnchorEl} open={Boolean(priorityAnchorEl)} onClose={() => handlePriorityClose()}>
            {priorityOptions.map((priority) => (
              <MenuItem key={priority} onClick={() => handlePriorityClose(priority)}>
                {priority}
              </MenuItem>
            ))}
          </Menu>

          {/* Assigned Users */}
          <Box display="flex" alignItems="center">
            <Stack direction="row" spacing={1}>
              {updatedTask.assignedUsers.map((user) => (
                <Box key={user.id} display="flex" alignItems="center">
                  <Avatar
                    src={user.avatar || ''}
                    alt={user.name}
                    sx={{ width: 30, height: 30, marginRight: '5px' }}
                  />
                  <Typography variant="body2">{user.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAssignClose(user.id)} // Remove user
                    sx={{ marginLeft: '5px' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>
            <IconButton onClick={handleAssignClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={assignAnchorEl} open={Boolean(assignAnchorEl)} onClose={() => handleAssignClose()}>
              {users.map((user) => (
                <MenuItem key={user.id} onClick={() => handleAssignClose(user.id)}>
                  <Avatar src={user.avatar || ''} sx={{ width: 24, height: 24, marginRight: '10px' }} />
                  {user.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      </Box>

      {/* Task Description */}
      <Box mb={3}>
        <Typography variant="h6">Description</Typography>
        {isEditing ? (
          <ReactQuill
            value={updatedTask.description}
            onChange={(value) => setUpdatedTask({ ...updatedTask, description: value })}
            theme="snow"
            placeholder="Enter task description..."
            modules={{
              toolbar: [
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline', 'strike'],
                ['link', 'image'],
                ['clean'],
              ],
            }}
            formats={['header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'link', 'image']}
          />
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ marginTop: 1, marginBottom: 3 }}>
            <div dangerouslySetInnerHTML={{ __html: task.description }} />
          </Typography>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
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
            <Button variant="contained" onClick={handleEditClick}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={() => onDeleteTask(task.id)}>
              Delete
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TaskDetailOverview;
