import React, { useState } from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';
import { Task } from '../components/types';

const statusOptions = ['To Do', 'In Progress', 'Completed'];

interface TaskStatusSelectorProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  setUpdatedTask: React.Dispatch<React.SetStateAction<Task>>;
  handleToggleComplete: (taskId: number, completed: boolean) => Promise<boolean>;
  handleToggleSubtaskComplete?: (subtaskId: number, completed: boolean) => Promise<boolean>;
}

const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({
  task,
  onUpdateTask,
  setUpdatedTask,
  handleToggleComplete,
  handleToggleSubtaskComplete,
}) => {
  const [statusAnchorEl, setStatusAnchorEl] = useState<null | HTMLElement>(null);

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleStatusClose = async (newStatus?: string) => {
    setStatusAnchorEl(null);

    if (newStatus && newStatus !== task.status) {
      if (newStatus === 'Completed') {
        // Mark task as completed using the appropriate handler
        if (task.parent_id && handleToggleSubtaskComplete) {
          let response =  await handleToggleSubtaskComplete(task.id, true);
          if (response) {
           setUpdatedTask({ ...task, status: 'Completed' });
           //onUpdateTask({ ...task, status: 'Completed' });
          } 
        } else {
         let response =  await handleToggleComplete(task.id, true);
         if (response) {
          setUpdatedTask({ ...task, status: 'Completed' });
          //onUpdateTask({ ...task, status: 'Completed' });
         } 
        }
      } else {
        // For other status changes (e.g., "In Progress")
        setUpdatedTask({ ...task, status: newStatus });
        onUpdateTask({ ...task, status: newStatus });
      }
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
