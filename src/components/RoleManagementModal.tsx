// src/components/RoleManagementModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Grid,
} from '@mui/material';
import { Role, Permission } from './types';
import * as SettingsService from '../services/settings.service';
import { toast } from 'react-toastify';

interface RoleManagementModalProps {
  open: boolean;
  onClose: () => void;
  onRoleUpdated: () => void;
  role?: Role | null;
  permissions: Permission[];
}

const RoleManagementModal: React.FC<RoleManagementModalProps> = ({ open, onClose, onRoleUpdated, role, permissions }) => {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const organizationId = JSON.parse(localStorage.getItem('user') || '{}').organizationId;

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions.map((permission) => permission.id));
    } else {
      setRoleName('');
      setSelectedPermissions([]);
    }
  }, [role]);

  const handleSave = async () => {
    try {
      if (role) {
        await SettingsService.updateRole(role.id, roleName, organizationId, selectedPermissions);
      } else {
        await SettingsService.createRole(roleName, organizationId, selectedPermissions);
      }
      onRoleUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to save role', error);
      toast.error('Failed to save role');
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  // Group permissions by entity
  const permissionsByEntity = permissions.reduce((acc, permission) => {
    if (!acc[permission.entity]) acc[permission.entity] = [];
    acc[permission.entity].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Typography variant="h6" gutterBottom>Assign Permissions</Typography>

        {Object.keys(permissionsByEntity).map((entity) => (
          <Box key={entity} marginTop={2}>
            <Typography variant="subtitle1">{entity.charAt(0).toUpperCase() + entity.slice(1)}</Typography>
            <Grid container spacing={2}>
              {permissionsByEntity[entity].map((permission) => (
                <Grid item xs={3} key={permission.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                      />
                    }
                    label={permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleManagementModal;
