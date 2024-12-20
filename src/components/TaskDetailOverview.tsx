import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Stack,
  Grid,
  IconButton,
  Menu,
  Paper,
  Slider,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Task, User, Tag } from '../types/types';
import TaskStatusSelector from './TaskStatusSelector';
import TaskPrioritySelector from './TaskPrioritySelector';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';

const currentSettings = JSON.parse(localStorage.getItem('settings') || '{}');

interface Blocker {
  id: number;
  title: string;
}

interface TaskDetailProps {
  task: Task;
  users: User[];
  blockersDependency: Blocker[];
  tags: Tag[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: number) => void;
  handleToggleComplete: (taskId: number, completed: boolean) => Promise<boolean>;
  handleToggleSubtaskComplete?: (subtaskId: number, completed: boolean) => Promise<boolean>;
}

const TaskDetailOverview: React.FC<TaskDetailProps> = ({
  task,
  users,
  blockersDependency,
  tags,
  onUpdateTask,
  onDeleteTask,
  handleToggleComplete,
  handleToggleSubtaskComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<Task>(task);
  const [blockers, setBlockers] = useState<number[]>(
    task.blockers.map((blocker: Task | number) =>
      typeof blocker === 'object' && 'id' in blocker ? blocker.id : blocker
    )
  );
  const [assignedUsers, setAssignedUsers] = useState<User[]>(task.assignedUsers);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(task.tagIds || []);
  const [timeSpent, setTimeSpent] = useState<number>(task.timeSpent || 0);
  const [assignAnchorEl, setAssignAnchorEl] = useState<null | HTMLElement>(null);
  const [progress, setProgress] = useState<number>(task.progress || 0);
  const navigate = useNavigate();

  // Debugging to check if `task.progress` is changing
  useEffect(() => {
    console.log("Task prop updated:", task);
    setProgress(task.progress || 0);
  }, [task]);

  const handleSaveEdit = () => {
    const updatedTaskWithTime = {
      ...updatedTask,
      blockers,
      assignedUsers,
      tags: selectedTags,
      timeSpent,
    };
    onUpdateTask(updatedTaskWithTime);
    setIsEditing(false);
  };

  const handleProgressChange = (event: Event, newValue: number | number[]) => {
    const updatedProgress = Array.isArray(newValue) ? newValue[0] : newValue;
    setProgress(updatedProgress);
  };

  const handleSaveProgress = () => {
    const updatedTask = { ...task, progress };

    // Automatically update status based on progress
    if (progress === 100) {
      updatedTask.status = 'COMPLETED';
    } else if (progress === 0) {
      updatedTask.status = 'To_DO';
    } else {
      updatedTask.status = 'IN_PROGRESS';
    }
    
    onUpdateTask(updatedTask);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setBlockers(
      task.blockers.map((blocker: Task | number) =>
        typeof blocker === 'object' && 'id' in blocker ? blocker.id : blocker
      )
    );
    setSelectedTags(task.tags || []);
    setTimeSpent(task.timeSpent || 0);
  };

  const handleAssignClick = (event: React.MouseEvent<HTMLElement>) => {
    setAssignAnchorEl(event.currentTarget);
  };

  const handleAssignClose = (userId?: string) => {
    setAssignAnchorEl(null);
    if (userId) {
      const isAssigned = assignedUsers.some((user) => user.id === userId);
      const updatedAssignedUsers = isAssigned
        ? assignedUsers.filter((user) => user.id !== userId)
        : [...assignedUsers, users.find((user) => user.id === userId)!];
      setAssignedUsers(updatedAssignedUsers);
      setUpdatedTask({ ...updatedTask, assignedUsers: updatedAssignedUsers });
    }
  };

  const handleTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const tagIds = event.target.value as string[];
    const newTags = tags.filter((tag) => tagIds.includes(tag.id));
    setSelectedTags(newTags);
  };

  const handleNavigateToTask = (blockerId: number) => {
    navigate(`/tasks/${blockerId}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2}>
        {/* Task Header and Description */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ padding: 2, marginBottom: 2 }}>
            {isEditing ? (
              <TextField
                value={updatedTask.title}
                onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
                fullWidth
                variant="outlined"
                label="Task Title"
                sx={{ marginBottom: 2 }}
              />
            ) : (
              <Typography variant="h4">{task.title}</Typography>
            )}

            <Box mb={3}>
              <Typography variant="h6">Description</Typography>
              {isEditing ? (
                <ReactQuill
                  value={updatedTask.description || ''}
                  onChange={(value) => setUpdatedTask({ ...updatedTask, description: value })}
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
                />
              ) : (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ marginTop: 1, marginBottom: 3 }}
                >
                  <div dangerouslySetInnerHTML={{ __html: task.description }} />
                </Typography>
              )}
            </Box>

            {/* Progress Section */}
            <Box mb={3}>
              <Typography variant="h6">Progress</Typography>
              <Slider
                value={progress}
                onChange={handleProgressChange}
                onChangeCommitted={handleSaveProgress}
                step={5}
                marks
                min={0}
                max={100}
                valueLabelDisplay="auto"
                aria-labelledby="progress-slider"
              />
              <Typography variant="body2" color="textSecondary">
                {progress}% Complete
              </Typography>
            </Box>

            {/* Time Spent Field */}
            <Box mb={3}>
              <Typography variant="h6">Time Spent (in hours)</Typography>
              {isEditing ? (
                <TextField
                  type="number"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(Number(e.target.value))}
                  fullWidth
                  variant="outlined"
                  label="Time Spent"
                  inputProps={{ min: 0, step: 0.1 }}
                  sx={{ marginBottom: 2 }}
                />
              ) : (
                <Typography variant="body1">
                  {timeSpent} hours
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Status, Priority, Assigned Users, Blockers, and Tag */}
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={2} sx={{ textAlign: 'right' }}>
            {/* Status */}
            <Box sx={{ width: '200px', alignSelf: 'flex-end' }}>
              <Typography variant="h6">Status</Typography>
              <TaskStatusSelector
                task={updatedTask}
                onUpdateTask={onUpdateTask}
                setUpdatedTask={setUpdatedTask}
                handleToggleComplete={handleToggleComplete}
                handleToggleSubtaskComplete={handleToggleSubtaskComplete}
              />
            </Box>

            {/* Priority */}
            <Box sx={{ width: '200px', alignSelf: 'flex-end' }}>
              <Typography variant="h6">Priority</Typography>
              <TaskPrioritySelector
                task={updatedTask}
                onUpdateTask={onUpdateTask}
                setUpdatedTask={setUpdatedTask}
              />
            </Box>

            {/* Assigned Users */}
            <Box>
              <Typography variant="h6">Assigned Users</Typography>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                {assignedUsers.map((user) => (
                  <Box key={user.id} display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.name}
                      sx={{ width: 30, height: 30 }}
                      title={user.name}
                    />
                    {isEditing && (
                      <IconButton size="small" onClick={() => handleAssignClose(user.id)}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                {isEditing && (
                  <IconButton size="small" color="primary" onClick={handleAssignClick}>
                    <PersonAddIcon />
                  </IconButton>
                )}
              </Stack>
              <Menu anchorEl={assignAnchorEl} open={Boolean(assignAnchorEl)} onClose={() => handleAssignClose()}>
                {users.map((user) => (
                  <MenuItem key={user.id} onClick={() => handleAssignClose(user.id)}>
                    <Avatar src={user.avatar || ''} sx={{ width: 24, height: 24, marginRight: '10px' }} />
                    {user.name}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Blockers */}
            {!task.parent_id && currentSettings.blockersEnabled && (
              <Box>
                <Typography variant="h6">Blockers</Typography>
                {isEditing ? (
                  <Box display="flex" flexWrap="wrap" gap={1} justifyContent="flex-end">
                    <TextField
                      select
                      label="Blockers"
                      value={blockers}
                      onChange={(e) => setBlockers(e.target.value as unknown as number[])}
                      SelectProps={{
                        multiple: true,
                      }}
                      variant="outlined"
                      sx={{ width: '200px' }}
                    >
                      {blockersDependency
                        .filter((blocker) => blocker.id !== task.id) // Filter out current task from blockers
                        .map((blocker) => (
                          <MenuItem key={blocker.id} value={blocker.id}>
                            {blocker.title}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Box>
                ) : (
                  <Box>
                    {blockers.length > 0 ? (
                      <Stack spacing={1} direction="row" justifyContent="flex-end">
                        {blockers
                          .filter((blockerId) => blockerId !== task.id)
                          .map((blockerId) => {
                            const blocker = blockersDependency.find((b) => b.id === blockerId);
                            return blocker ? (
                              <Chip
                                key={blocker.id}
                                label={blocker.title}
                                size="small"
                                onClick={() => handleNavigateToTask(blocker.id)}
                                clickable
                              />
                            ) : null;
                          })}
                      </Stack>
                    ) : (
                      <Typography>No blockers assigned</Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* Tag Selector */}
            {isEditing && (
              <Box>
                <Typography variant="h6">Tags</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} justifyContent="flex-end">
                  <TextField
                    select
                    label="Select Tag"
                    value={selectedTags.map((tag) => tag.id)}
                    onChange={handleTagChange}
                    variant="outlined"
                    SelectProps={{ multiple: true }}
                    sx={{ width: '200px' }}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>
            )}
            {!isEditing && (
              <Box>
                <Typography variant="h6">Tags</Typography>
                {selectedTags.length > 0 ? (
                  <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                    {selectedTags.map((tag) => (
                      <Chip key={tag.id} label={tag.name} size="small" />
                    ))}
                  </Stack>
                ) : (
                  <Typography>No tags selected</Typography>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Start Date and Due Date */}
      <Box mb={3} mt={3}>
        <Typography variant="h6">Dates</Typography>
        {isEditing ? (
          <Box display="flex" gap={2}>
            <TextField
              label="Start Date"
              type="date"
              value={updatedTask.startDate ? dayjs(updatedTask.startDate).format('YYYY-MM-DD') : ''}
              onChange={(e) => setUpdatedTask({ ...updatedTask, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: '200px' }}
            />
            <TextField
              label="Due Date"
              type="date"
              value={updatedTask.dueDate ? dayjs(updatedTask.dueDate).format('YYYY-MM-DD') : ''}
              onChange={(e) => setUpdatedTask({ ...updatedTask, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: '200px' }}
            />
          </Box>
        ) : (
          <Box>
            <Typography>
              Start Date: {task.startDate ? dayjs(task.startDate).format('MMMM D, YYYY') : 'N/A'}
            </Typography>
            <Typography>
              Due Date: {task.dueDate ? dayjs(task.dueDate).format('MMMM D, YYYY') : 'N/A'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
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
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={() => onDeleteTask(task.id)}>
              Delete
            </Button>
          </>
        )}
      </Box>

      {/* Completed Date */}
      {task.completedDate && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Completed on: {dayjs(task.completedDate).format('MMMM D, YYYY')}
        </Typography>
      )}
    </Box>
  );
};

export default TaskDetailOverview;
