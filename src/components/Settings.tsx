import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Button, TextField, List, ListItem, IconButton } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Tag } from '../components/types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Settings: React.FC = () => {
  const [subtasksEnabled, setSubtasksEnabled] = useState(true);
  const [blockersEnabled, setBlockersEnabled] = useState(true);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');     
  const [editTagId, setEditTagId] = useState<string | null>(null); 
  const [editTagName, setEditTagName] = useState(''); 

  const organizationId = JSON.parse(localStorage.getItem('user') || '{}').organizationId;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsResponse = await axios.get(`${API_URL}/settings/${organizationId}`);
        setSubtasksEnabled(settingsResponse.data.subtasksEnabled);
        setBlockersEnabled(settingsResponse.data.blockersEnabled);

        const tagsResponse = await axios.get(`${API_URL}/tags/${organizationId}`);
        setTags(tagsResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch settings or tags', error);
      }
    };
    fetchSettings();
  }, [organizationId]);

  const saveSettings = async () => {
    try {
      await axios.put(`${API_URL}/settings/${organizationId}`, {
        subtasksEnabled,
        blockersEnabled,
      });
      localStorage.setItem('settings', JSON.stringify({ subtasksEnabled, blockersEnabled }));
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim()) {
      try {
        const response = await axios.post(`${API_URL}/tags`, {
          name: newTag.trim(),
          organizationId,
        });

        if (response.status === 201) {
          setTags([...tags, response.data]);
          setNewTag('');
        }
      } catch (error) {
        console.error('Failed to add tag', error);
      }
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/tags/${tagId}`);
      if (response.status === 200) {
        setTags(tags.filter(tag => tag.id !== tagId));
      }
    } catch (error) {
      console.error('Failed to delete tag', error);
    }
  };

  const handleEditTag = (tag: Tag) => {
    setEditTagId(tag.id);
    setEditTagName(tag.name);
  };

  const handleUpdateTag = async () => {
    if (editTagName.trim() && editTagId) {
      try {
        const response = await axios.put(`${API_URL}/tags/${editTagId}`, {
          name: editTagName.trim(),
        });

        if (response.status === 200) {
          setTags(tags.map(tag => (tag.id === editTagId ? { ...tag, name: editTagName } : tag)));
          setEditTagId(null); 
          setEditTagName(''); 
        }
      } catch (error) {
        console.error('Failed to update tag', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings</h1>
      
      {/* Enable Subtasks */}
      <div style={{ marginBottom: '20px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={subtasksEnabled}
              onChange={(e) => setSubtasksEnabled(e.target.checked)}
              name="subtasksEnabled"
            />
          }
          label="Enable Subtasks"
        />
      </div>
      
      {/* Enable Blockers/Dependencies */}
      <div style={{ marginBottom: '20px' }}>
        <FormControlLabel
          control={
            <Switch
              checked={blockersEnabled}
              onChange={(e) => setBlockersEnabled(e.target.checked)}
              name="blockersEnabled"
            />
          }
          label="Enable Blockers/Dependencies"
        />
      </div>

      {/* Tag Management Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Manage Tags/Labels</h3>
        <TextField
          label="New Tag"
          variant="outlined"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleAddTag(); }}
          margin="normal"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddTag} sx={{ mt: 1 }}>
          Add Tag
        </Button>

        <List>
          {tags.map((tag) => (
            <ListItem
              key={tag.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditTag(tag)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTag(tag.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              {tag.name}
            </ListItem>
          ))}
        </List>

        {/* Edit Tag Section */}
        {editTagId && (
          <div style={{ marginTop: '20px' }}>
            <TextField
              label="Edit Tag Name"
              variant="outlined"
              value={editTagName}
              onChange={(e) => setEditTagName(e.target.value)}
              margin="normal"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleUpdateTag} sx={{ mt: 1 }}>
              Update Tag
            </Button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button variant="contained" color="primary" onClick={saveSettings}>
        Save Settings
      </Button>
    </div>
  );
};

export default Settings;
