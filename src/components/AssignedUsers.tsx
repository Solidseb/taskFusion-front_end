import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, Menu, MenuItem, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Task, User } from '../types/types';

interface AssignedUsersProps {
  task: Task;
  users: User[];
  onUpdateTask: (updatedTask: Task) => void;
  setUpdatedTask: React.Dispatch<React.SetStateAction<Task>>;
}

const AssignedUsers: React.FC<AssignedUsersProps> = ({ task, users, onUpdateTask, setUpdatedTask }) => {
  const [assignAnchorEl, setAssignAnchorEl] = useState<null | HTMLElement>(null);

  const handleAssignClick = (event: React.MouseEvent<HTMLElement>) => {
    setAssignAnchorEl(event.currentTarget);
  };

  const handleAssignClose = (userId?: string) => {
    setAssignAnchorEl(null);

    if (userId !== undefined) {
      const isAssigned = task.assignedUsers.some((user) => user.id === userId);
      const updatedAssignedUsers = isAssigned
        ? task.assignedUsers.filter((user) => user.id !== userId)
        : [...task.assignedUsers, users.find((user) => user.id === userId)!];

      // Update both assignedUserIds and assignedUsers arrays
      const updatedTask = {
        ...task,
        assignedUserIds: updatedAssignedUsers.map((user: { id: any }) => user.id),
        assignedUsers: updatedAssignedUsers,
      };

      // Call onUpdateTask to propagate changes upwards
      onUpdateTask(updatedTask);
      // Update local task state to reflect changes in UI
      setUpdatedTask(updatedTask);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2">Assigned Users:</Typography>
      <Stack direction="column" spacing={1}>
        {task.assignedUsers.map((user) => (
          <Box key={user.id} display="flex" alignItems="center" gap={1}>
            <Avatar src={user.avatar || ''} alt={user.name} sx={{ width: 30, height: 30 }} />
            <Typography variant="body2">{user.name}</Typography>
            <IconButton size="small" onClick={() => handleAssignClose(user.id)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={handleAssignClick} sx={{ mt: 1 }}>
        Assign Users
      </Button>
      <Menu anchorEl={assignAnchorEl} open={Boolean(assignAnchorEl)} onClose={() => handleAssignClose()}>
        {users.map((user) => (
          <MenuItem key={user.id} onClick={() => handleAssignClose(user.id)}>
            <Avatar src={user.avatar || ''} sx={{ width: 24, height: 24, marginRight: '10px' }} />
            {user.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AssignedUsers;
