import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Tag } from '../components/types'; // Import Tag type

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: any) => void;
  users: { id: string; name: string }[];
  tags: Tag[]; // Add tags prop
  initialTaskData?: any;
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  users,
  tags,
  initialTaskData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]); // Track selected tag IDs as string[].

  useEffect(() => {
    if (initialTaskData) {
      setTitle(initialTaskData.title || '');
      setDescription(initialTaskData.description || '');
      setStartDate(initialTaskData.startDate || '');
      setDueDate(initialTaskData.dueDate || '');
      setStatus(initialTaskData.status || 'To Do');
      setPriority(initialTaskData.priority || 'Medium');

      // Extract user IDs and tag IDs from initialTaskData
      const userIds = initialTaskData.assignedUsers
        ? initialTaskData.assignedUsers.map((user: any) => user.id)
        : [];
      setAssignedUserIds(userIds);

      const tagIds = initialTaskData.tags
        ? initialTaskData.tags.map((tag: any) => tag.id)
        : [];
      setSelectedTagIds(tagIds); // Store tag IDs as string[].
    } else {
      resetForm();
    }
  }, [initialTaskData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setDueDate('');
    setStatus('To Do');
    setPriority('Medium');
    setAssignedUserIds([]);
    setSelectedTagIds([]); // Reset tag IDs
  };

  const handleSave = () => {
    // Save full tag objects (id and name) by mapping selectedTagIds to tag objects
    const selectedTags = selectedTagIds.map((id) => {
      const tag = tags.find((tag) => tag.id === id);
      return { id: tag?.id, name: tag?.name };
    });

    const taskData = {
      title,
      description,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      status,
      priority,
      assignedUserIds,
      tags: selectedTags, // Store the full tag objects (id and name)
    };

    onSave(taskData);
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          p: 3,
          bgcolor: 'background.paper',
          margin: 'auto',
          mt: '20vh',
        }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          margin="normal"
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <FormControl margin="normal" fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
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
            onChange={(e) => setAssignedUserIds(e.target.value as string[])}
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

        {/* Tags Section */}
        <FormControl margin="normal" fullWidth>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={selectedTagIds} // Ensure this is treated as an array of tag IDs (string[]).
            onChange={(e) => setSelectedTagIds(e.target.value as string[])}
            renderValue={(selected) =>
              selected
                .map((id) => tags.find((tag) => tag.id === id)?.name)
                .join(', ')
            }
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TaskModal;
