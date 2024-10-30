import React, { useState } from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';
import { Task } from '../components/types';

const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

interface TaskPrioritySelectorProps {
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  setUpdatedTask: React.Dispatch<React.SetStateAction<Task>>;
}

const TaskPrioritySelector: React.FC<TaskPrioritySelectorProps> = ({ task, onUpdateTask, setUpdatedTask }) => {
  const [priorityAnchorEl, setPriorityAnchorEl] = useState<null | HTMLElement>(null);

  const handlePriorityClick = (event: React.MouseEvent<HTMLElement>) => {
    setPriorityAnchorEl(event.currentTarget);
  };

  const handlePriorityClose = (newPriority?: string) => {
    setPriorityAnchorEl(null);
    if (newPriority && newPriority !== task.priority) {
      onUpdateTask({ ...task, priority: newPriority });
      setUpdatedTask({ ...task, priority: newPriority });
    }
  };

  return (
    <>
      <Chip
        label={task.priority}
        onClick={handlePriorityClick}
        sx={{
          backgroundColor: 
            task.priority === 'Critical'
              ? 'red'
              : task.priority === 'High'
              ? 'orange'
              : task.priority === 'Medium'
              ? '#F5E050'
              : 'green',
          color: 'white'
        }}
      />
      <Menu anchorEl={priorityAnchorEl} open={Boolean(priorityAnchorEl)} onClose={() => handlePriorityClose()}>
        {priorityOptions.map((priority) => (
          <MenuItem key={priority} onClick={() => handlePriorityClose(priority)}>
            {priority}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default TaskPrioritySelector;
