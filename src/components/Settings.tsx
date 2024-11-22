import React, { useState, useEffect } from 'react';
import {
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Tag, Role, Permission, User } from '../types/types';
import * as SettingsService from '../services/settings.service';
import RoleManagementModal from '../components/RoleManagementModal';
import UserCreationForm from '../components/UserCreationForm';
import UserRoleAssignment from '../components/UserRoleAssignment';
import { toast } from 'react-toastify';

const Settings: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0); // State for tabs
  const [subtasksEnabled, setSubtasksEnabled] = useState(true);
  const [blockersEnabled, setBlockersEnabled] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editTagId, setEditTagId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const organizationId = JSON.parse(localStorage.getItem('user') || '{}').organizationId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await SettingsService.fetchSettings(organizationId);
        setSubtasksEnabled(settings.subtasksEnabled);
        setBlockersEnabled(settings.blockersEnabled);
        setTags(await SettingsService.fetchTags(organizationId));
        setRoles(await SettingsService.fetchRoles(organizationId));
        setPermissions(await SettingsService.fetchPermissions(organizationId));
        setUsers(await SettingsService.fetchUsers());
      } catch (error) {
        console.error('Failed to fetch settings, tags, roles, permissions, or users', error);
        toast.error('Failed to fetch settings, tags, roles, permissions, or users');
      }
    };
    fetchData();
  }, [organizationId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const saveSettings = async () => {
    try {
      await SettingsService.saveSettings(organizationId, {
        subtasksEnabled,
        blockersEnabled,
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to save settings');
    }
  };

  const handleAddTag = async () => {
    if (newTagName.trim()) {
      try {
        const addedTag = await SettingsService.addTag(newTagName.trim(), organizationId);
        setTags([...tags, addedTag]);
        setNewTagName('');
      } catch (error) {
        console.error('Failed to add tag', error);
        toast.error('Failed to add tag');
      }
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditTagId(tag.id);
    setNewTagName(tag.name);
  };

  const handleUpdateTag = async () => {
    if (editTagId && newTagName.trim()) {
      try {
        const updatedTag = await SettingsService.updateTag(editTagId, newTagName.trim());
        setTags(tags.map((tag) => (tag.id === editTagId ? updatedTag : tag)));
        setEditTagId(null);
        setNewTagName('');
      } catch (error) {
        console.error('Failed to update tag', error);
        toast.error('Failed to update tag');
      }
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      await SettingsService.deleteTag(tagId);
      setTags(tags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error('Failed to delete tag', error);
      toast.error('Failed to delete tag');
    }
  };

  const handleOpenRoleModal = (role: Role | null = null) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleCloseRoleModal = () => {
    setIsRoleModalOpen(false);
    setSelectedRole(null);
  };

  const handleRoleUpdated = async () => {
    const updatedRoles = await SettingsService.fetchRoles(organizationId);
    setRoles(updatedRoles);
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await SettingsService.deleteRole(roleId, organizationId);
      setRoles(roles.filter((role) => role.id !== roleId));
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message);
      } else {
        console.error('Failed to delete role', error);
        toast.error('Failed to delete role');
      }
    }
  };

  return (
    <Box padding={3}>
      <Typography variant="h4">Settings</Typography>
      
      {/* Tabs for different sections */}
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="settings-tabs">
        <Tab label="General" />
        <Tab label="Tags" />
        <Tab label="Roles" />
        <Tab label="User Role Assignments" />
        <Tab label="User Creation" />
      </Tabs>

      {/* General Settings Tab */}
      {tabIndex === 0 && (
        <Box marginTop={3}>
          <Typography variant="h5" gutterBottom>
            General Settings
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={subtasksEnabled}
                  onChange={(e) => setSubtasksEnabled(e.target.checked)}
                />
              }
              label="Enable Subtasks"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={blockersEnabled}
                  onChange={(e) => setBlockersEnabled(e.target.checked)}
                />
              }
              label="Enable Blockers/Dependencies"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={saveSettings}
              sx={{ alignSelf: 'flex-start' }}
            >
              Save Settings
            </Button>
          </Box>
        </Box>
      )}

      {/* Tag Management Tab */}
      {tabIndex === 1 && (
        <Box marginTop={3} maxWidth={600}>
          <Typography variant="h5">Tag Management</Typography>
          <Box display="flex" alignItems="center" gap={1} marginTop={2}>
            <TextField
              label="New Tag Name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              size="small"
            />
            {editTagId ? (
              <Button variant="contained" color="primary" onClick={handleUpdateTag}>
                Update Tag
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleAddTag} startIcon={<AddIcon />}>
                Add Tag
              </Button>
            )}
          </Box>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tag Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditTag(tag)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTag(tag.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Role Management Tab */}
      {tabIndex === 2 && (
        <Box marginTop={3} maxWidth={800}>
          <Typography variant="h5">Role Management</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenRoleModal()}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Add New Role
          </Button>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Role Name</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      {role.permissions.map((permission) => (
                        <Typography key={permission.id} variant="body2">
                          {`${permission.entity} - ${permission.action}`}
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      {role.name !== 'Admin' ? (
                        <>
                          <IconButton onClick={() => handleOpenRoleModal(role)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteRole(role.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          Protected
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}  

      {/* User Role Assignment Tab */}
      {tabIndex === 3 && (
        <Box marginTop={3}>
          <UserRoleAssignment
            roles={roles}
            users={users}
            onRoleAssigned={() => {
              SettingsService.fetchUsers().then(setUsers);
            }}
          />
        </Box>
      )}

      {/* User Creation Tab */}
      {tabIndex === 4 && (
        <Box marginTop={3}>
          <Typography variant="h5" gutterBottom>
            User Creation
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsUserModalOpen(true)}
            startIcon={<AddIcon />}
          >
            Create User
          </Button>
          <UserCreationForm
            roles={roles}
            onUserCreated={() => {
              SettingsService.fetchUsers().then(setUsers);
            }}
            open={isUserModalOpen}
            onClose={() => setIsUserModalOpen(false)}
          />
        </Box>
      )}

      <RoleManagementModal
        open={isRoleModalOpen}
        onClose={handleCloseRoleModal}
        onRoleUpdated={handleRoleUpdated}
        role={selectedRole}
        permissions={permissions}
      />
    </Box>
  );
};

export default Settings;
