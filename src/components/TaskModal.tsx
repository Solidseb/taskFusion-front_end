// src/components/TaskModal.tsx

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
  Typography,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Tag } from '../types/types';
import { TASK_STATUSES, TaskStatus } from '../types/taskStatuses';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (taskData: any) => void;
  users: { id: string; name: string }[];
  tags: Tag[];
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
  const [status, setStatus] = useState<TaskStatus>('TO_DO'); // Default to "To Do" status key
  const [priority, setPriority] = useState('Medium');
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    if (initialTaskData) {
      setTitle(initialTaskData.title || '');
      setDescription(initialTaskData.description || '');
      setStartDate(initialTaskData.startDate || '');
      setDueDate(initialTaskData.dueDate || '');
      setStatus(initialTaskData.status || 'TO_DO');
      setPriority(initialTaskData.priority || 'Medium');

      const userIds = initialTaskData.assignedUsers
        ? initialTaskData.assignedUsers.map((user: any) => user.id)
        : [];
      setAssignedUserIds(userIds);

      const tagIds = initialTaskData.tags
        ? initialTaskData.tags.map((tag: any) => tag.id)
        : [];
      setSelectedTagIds(tagIds);
    } else {
      resetForm();
    }
  }, [initialTaskData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setDueDate('');
    setStatus('TO_DO');
    setPriority('Medium');
    setAssignedUserIds([]);
    setSelectedTagIds([]);
  };

  const handleSave = () => {
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
      tags: selectedTags,
    };

    onSave(taskData);
    resetForm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          width: '90%',
          maxWidth: 500,
          maxHeight: '90vh',
          overflowY: 'auto',
          p: 3,
          boxShadow: 24,
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

        <Box mt={2} mb={9}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Description
          </Typography>
          <ReactQuill
            value={description}
            onChange={setDescription}
            theme="snow"
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
            style={{ height: '200px' }}
          />
        </Box>

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
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {Object.entries(TASK_STATUSES).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl margin="normal" fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <MenuItem value="Critical">Critical</MenuItem>
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
              selected.map((id) => users.find((user) => user.id === id)?.name).join(', ')
            }
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl margin="normal" fullWidth>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={selectedTagIds}
            onChange={(e) => setSelectedTagIds(e.target.value as string[])}
            renderValue={(selected) =>
              selected.map((id) => tags.find((tag) => tag.id === id)?.name).join(', ')
            }
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={3} display="flex" justifyContent="flex-end">
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
