// src/components/TaskStatusSelector.tsx

import React, { useState } from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';
import { Task } from '../types/types';
import { TASK_STATUSES, TaskStatus } from '../types/taskStatuses';  // Import centralized statuses

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

  const handleStatusClose = async (newStatus?: TaskStatus) => {
    setStatusAnchorEl(null);

    if (newStatus && newStatus !== task.status) {
      if (newStatus === 'COMPLETED') {
        // Mark task as completed using the appropriate handler
        if (task.parent_id && handleToggleSubtaskComplete) {
          let response = await handleToggleSubtaskComplete(task.id, true);
          if (response) {
            setUpdatedTask({ ...task, status: newStatus });
          }
        } else {
          let response = await handleToggleComplete(task.id, true);
          if (response) {
            setUpdatedTask({ ...task, status: newStatus });
          }
        }
      } else {
        // For other status changes
        setUpdatedTask({ ...task, status: newStatus });
        onUpdateTask({ ...task, status: newStatus });
      }
    }
  };

  // Get the display label from TASK_STATUSES based on the task's status key
  const currentStatusLabel = TASK_STATUSES[task.status as TaskStatus] || task.status;

  return (
    <>
      <Chip
        label={currentStatusLabel}
        color={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'primary' : 'default'}
        onClick={handleStatusClick}
      />
      <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={() => handleStatusClose()}>
        {Object.entries(TASK_STATUSES).map(([statusKey, statusLabel]) => (
          <MenuItem key={statusKey} onClick={() => handleStatusClose(statusKey as TaskStatus)}>
            {statusLabel}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TaskStatusSelector;
