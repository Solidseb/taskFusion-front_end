import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Task, User } from '../components/types';
import TaskStatusSelector from './TaskStatusSelector';
import TaskPrioritySelector from './TaskPrioritySelector';
import AssignedUsers from './AssignedUsers';

interface TaskDetailProps {
  task: Task;
  users: User[];
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const TaskDetailOverview: React.FC<TaskDetailProps> = ({
  task,
  users,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task);

  // Handle saving edits for the task
  const handleSaveEdit = () => {
    onUpdateTask(updatedTask);
    setIsEditing(false);
  };

  // Handle canceling edits
  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedTask(task); // Reset changes if cancel
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Task Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box flex={1}>
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
                value={updatedTask.description}
                onChange={(value) => setUpdatedTask({ ...updatedTask, description: value })}
                theme="snow"
              />
            ) : (
              <Typography variant="body1" color="textSecondary" sx={{ marginTop: 1, marginBottom: 3 }}>
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
              </Typography>
            )}
          </Box>
        </Box>

        {/* Status, Priority, Assigned Users */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TaskStatusSelector task={updatedTask} onUpdateTask={onUpdateTask} setUpdatedTask={setUpdatedTask} />
          <TaskPrioritySelector task={updatedTask} onUpdateTask={onUpdateTask} setUpdatedTask={setUpdatedTask} />
          <AssignedUsers task={updatedTask} users={users} onUpdateTask={onUpdateTask} setUpdatedTask={setUpdatedTask} />
        </Box>
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
    </Box>
  );
};

export default TaskDetailOverview;
