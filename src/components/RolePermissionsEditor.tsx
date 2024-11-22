import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
} from '@mui/material';
import { Role, Permission } from '../types/types';
import { updateRolePermissions, fetchRolePermissions } from '../services/roleService';

interface RolePermissionsEditorProps {
  role: Role;
  permissions: Permission[];
  onClose: () => void;
}

const RolePermissionsEditor: React.FC<RolePermissionsEditorProps> = ({ role, permissions, onClose }) => {
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);

  const loadRolePermissions = useCallback(async () => {
    const data = await fetchRolePermissions(role.id);
    setRolePermissions(data);
}, [role]);

  useEffect(() => {
    loadRolePermissions();
  }, [role, loadRolePermissions]);

  const handleTogglePermission = (permissionId: string) => {
    const updatedPermissions = rolePermissions.some((p) => p.id === permissionId)
      ? rolePermissions.filter((p) => p.id !== permissionId)
      : [...rolePermissions, permissions.find((p) => p.id === permissionId)!];

    setRolePermissions(updatedPermissions);
  };

  const handleSavePermissions = async () => {
    await updateRolePermissions(role.id, rolePermissions.map((p) => p.id));
    onClose();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5">Edit Permissions for {role.name}</Typography>

      {permissions.map((permission) => (
        <FormControlLabel
          key={permission.id}
          control={
            <Switch
              checked={rolePermissions.some((p) => p.id === permission.id)}
              onChange={() => handleTogglePermission(permission.id)}
            />
          }
          label={permission.name}
        />
      ))}

      <Button onClick={handleSavePermissions} variant="contained" sx={{ marginTop: 2 }}>
        Save Permissions
      </Button>
      <Button onClick={onClose} variant="text" sx={{ marginTop: 2 }}>
        Cancel
      </Button>
    </Box>
  );
};

export default RolePermissionsEditor;
