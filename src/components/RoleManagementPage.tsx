import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Role, Permission } from '../types/types';
import { fetchRoles, createRole, deleteRole, fetchPermissions } from '../services/roleService';
import RolePermissionsEditor from './RolePermissionsEditor';

const RoleManagementPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    // Fetch roles and permissions from the backend
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    const data = await fetchRoles();
    setRoles(data);
  };

  const loadPermissions = async () => {
    const data = await fetchPermissions();
    setPermissions(data);
  };

  const handleCreateRole = async () => {
    if (newRoleName.trim()) {
      await createRole(newRoleName);
      setNewRoleName('');
      setIsDialogOpen(false);
      loadRoles(); // Refresh roles
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    await deleteRole(roleId);
    loadRoles(); // Refresh roles
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Role Management</Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsDialogOpen(true)}
        sx={{ marginTop: 2 }}
      >
        Create New Role
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateRole} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        {roles.map((role) => (
          <Grid item xs={12} md={6} key={role.id}>
            <Paper sx={{ padding: 2, position: 'relative' }}>
              <Typography variant="h6">{role.name}</Typography>
              <IconButton
                onClick={() => handleDeleteRole(role.id)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <DeleteIcon />
              </IconButton>
              <Button
                onClick={() => setSelectedRole(role)}
                variant="outlined"
                sx={{ marginTop: 2 }}
              >
                Edit Permissions
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selectedRole && (
        <RolePermissionsEditor
          role={selectedRole}
          permissions={permissions}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </Box>
  );
};

export default RoleManagementPage;
