// src/components/UserCreationForm.tsx

import React, { useState } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import * as SettingsService from '../services/settings.service';
import { toast } from 'react-toastify';

interface UserCreationFormProps {
  roles: any[];
  onUserCreated: () => void;
  open: boolean;
  onClose: () => void;
}

const UserCreationForm: React.FC<UserCreationFormProps> = ({ roles, onUserCreated, open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const handleCreateUser = async () => {
    if (!name || !email || !password) {
      alert('Please fill all required fields.');
      toast.error('Please fill all required fields.');
      return;
    }

    try {
      await SettingsService.addUser({ name, email, password }, selectedRole);

      /*if (selectedRole) {
        await SettingsService.assignRoleToUser(userId, selectedRole);
      }*/

      setName('');
      setEmail('');
      setPassword('');
      setSelectedRole('');
      onUserCreated();
      onClose(); // Close modal after creation
    } catch (error) {
      console.error('Failed to create user', error);
      toast.error('Failed to save settings');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ my: 2 }}
          fullWidth
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ my: 2 }}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ my: 2 }}
          fullWidth
        />

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as string)}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleCreateUser}>
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserCreationForm;
