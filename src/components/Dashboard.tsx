import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, List, ListItem, ListItemText, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface Capsule {
  id: number;
  title: string;
  description: string;
}

const Dashboard: React.FC = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [open, setOpen] = useState(false);
  const [newCapsule, setNewCapsule] = useState({ title: '', description: '' });
  const [editCapsule, setEditCapsule] = useState<Capsule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch capsules from the backend
  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/capsules`);
      setCapsules(response.data);
    } catch (error) {
      console.error('Error fetching capsules:', error);
      toast.error('Error fetching capsules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  // Open the dialog to create or edit a capsule
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewCapsule({ title: '', description: '' });
    setEditCapsule(null);
  };

  const handleOpenEdit = (capsule: Capsule) => {
    setEditCapsule(capsule);
    setNewCapsule({ title: capsule.title, description: capsule.description });
    handleOpen();
  };

  // Handle creating or updating a capsule
  const handleCreateOrUpdateCapsule = async () => {
    try {
      if (editCapsule) {
        // Update capsule
        await axios.put(`${API_URL}/capsules/${editCapsule.id}`, newCapsule);
        toast.success('Capsule updated successfully!');
      } else {
        // Create new capsule
        await axios.post(`${API_URL}/capsules`, newCapsule);
        toast.success('Capsule created successfully!');
      }
      fetchCapsules(); // Refresh capsules after creation or update
      handleClose();
    } catch (error) {
      console.error('Error creating or updating capsule:', error);
      toast.error('Error creating or updating capsule');
    }
  };

  // Handle deleting a capsule
  const handleDeleteCapsule = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this capsule?')) {
      try {
        await axios.delete(`${API_URL}/capsules/${id}`);
        fetchCapsules(); // Refresh capsules after deletion
        toast.success('Capsule deleted successfully!');
      } catch (error) {
        console.error('Error deleting capsule:', error);
        toast.error('Error deleting capsule');
      }
    }
  };

  // Filter capsules based on search query
  const filteredCapsules = capsules.filter((capsule) =>
    capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    capsule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddIcon />}>
        Create New Capsule
      </Button>

      {/* Search Bar */}
      <TextField
        label="Search Capsules"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* List of Capsules */}
      {loading ? (
        <Typography variant="body1">Loading capsules...</Typography>
      ) : (
        <List>
          {filteredCapsules.map((capsule) => (
            <ListItem key={capsule.id} component={Link} to={`/capsules/${capsule.id}`}>
              <ListItemText primary={capsule.title} secondary={capsule.description} />
              <IconButton edge="end" color="primary" onClick={(e) => { e.preventDefault(); handleOpenEdit(capsule); }}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" color="secondary" onClick={(e) => { e.preventDefault(); handleDeleteCapsule(capsule.id); }}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Dialog for Creating or Editing a Capsule */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editCapsule ? 'Edit Capsule' : 'Create New Capsule'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newCapsule.title}
            onChange={(e) => setNewCapsule({ ...newCapsule, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={newCapsule.description}
            onChange={(e) => setNewCapsule({ ...newCapsule, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdateCapsule} color="primary">
            {editCapsule ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
