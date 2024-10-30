import React, { useState } from 'react';
import { Box, Button, Typography, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';
import * as SettingsService from '../services/settings.service';
import { toast } from 'react-toastify';

interface UserRoleAssignmentProps {
  roles: any[];
  users: any[];
  onRoleAssigned: () => void;
}

const UserRoleAssignment: React.FC<UserRoleAssignmentProps> = ({ roles, users, onRoleAssigned }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleAssignRole = async () => {
    try {
      await SettingsService.assignRoleToUser(selectedUser, selectedRole);
      setSelectedUser('');
      setSelectedRole('');
      onRoleAssigned();
    } catch (error) {
      console.error('Failed to assign role to user', error);
      toast.error('Failed to assign role to user');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        User Role Assignment
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel>User</InputLabel>
          <Select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value as string)}
            size="small"
          >
            {users.map((user) => {
              const roleNames = user.roles.map((role: any) => role.name).join(', ');
              return (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.email}) {roleNames && `(${roleNames})`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as string)}
            size="small"
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAssignRole}
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        >
          Assign Role
        </Button>
      </Stack>
    </Box>
  );
};

export default UserRoleAssignment;
