import React, { useState } from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';
import { Task } from '../components/types';

const statusOptions = ['To Do', 'In Progress', 'Completed'];

interface TaskStatusSelectorProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  setUpdatedTask: React.Dispatch<React.SetStateAction<Task>>;
}

const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ task, onUpdateTask, setUpdatedTask }) => {
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusClose = (newStatus?: string) => {
    setStatusAnchorEl(null);
    if (newStatus && newStatus !== task.status) {
      onUpdateTask({ ...task, status: newStatus });
      setUpdatedTask({ ...task, status: newStatus });
    }
  };

  return (
    <>
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
    </>
  );
};

export default TaskStatusSelector;
