import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Button, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: any) => void;
  users: { id: number, name: string }[];
  initialTaskData?: any; // Data for editing an existing task
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, users, initialTaskData }) => {
  // Local state for the form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>([]);

  useEffect(() => {
    if (initialTaskData) {
      // Prefill form with existing task data if available
      setTitle(initialTaskData.title || '');
      setDescription(initialTaskData.description || '');
      setDueDate(initialTaskData.dueDate || '');
      setStatus(initialTaskData.status || 'To Do');
      setPriority(initialTaskData.priority || 'Medium');
      setAssignedUserIds(initialTaskData.assignedUserIds || []);
    } else {
      resetForm();
    }
  }, [initialTaskData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('To Do');
    setPriority('Medium');
    setAssignedUserIds([]);
  };

  const handleSave = () => {
    const taskData = {
      title,
      description,
      dueDate: dueDate || undefined,
      status,
      priority,
      assignedUserIds
    };
    onSave(taskData);
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: 'background.paper', margin: 'auto', mt: '20vh' }}>
        <TextField
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl margin="normal" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel>Assign Users</InputLabel>
          <Select
            multiple
            value={assignedUserIds}
            onChange={(e) => setAssignedUserIds(e.target.value as number[])}
            renderValue={(selected) =>
              selected
                .map((id) => users.find((user) => user.id === id)?.name)
                .join(', ')
            }
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button variant="contained" onClick={handleSave} disabled={!title.trim()}>
            Save Task
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
