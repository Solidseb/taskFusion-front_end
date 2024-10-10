import React, { useEffect, useState } from 'react';
import {
  Button, TextField, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { toast } from 'react-toastify';
import CapsuleCard from './CapsuleCard';  // CapsuleCard component for displaying capsules
import CapsuleFormDialog from './CapsuleFormDialog';  // Form Dialog for creating/editing capsules
import { useNavigate } from 'react-router-dom';  // For navigation
import './Dashboard.css';  // Dashboard-specific styles for the grid layout

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface User {
  id: number;
  name: string;
}

interface Capsule {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  newDueDate?: string;  // New due date field for tracking modifications
  status: string;
  completedTasks: number;
  totalTasks: number;
  assignedUsers: User[];
}

const Dashboard: React.FC = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [open, setOpen] = useState(false);
  const [editCapsule, setEditCapsule] = useState<Capsule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    setEditCapsule(null);  // Reset the editing state when closing
  };

  const handleOpenEdit = (capsule: Capsule) => {
    setEditCapsule(capsule); // Set the capsule to be edited
    handleOpen();
  };

  // Handle creating or updating a capsule
  const handleCreateOrUpdateCapsule = async (data: { title: string; description: string; dueDate?: string; newDueDate?: string }) => {
    try {
      if (editCapsule) {
        // Update capsule
        await axios.put(`${API_URL}/capsules/${editCapsule.id}`, data);
        toast.success('Capsule updated successfully!');
      } else {
        // Create new capsule
        await axios.post(`${API_URL}/capsules`, data);
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
      {/* Create New Capsule Button */}
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
        <div className="capsule-grid">
          {filteredCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              title={capsule.title}
              status={capsule.status}
              dueDate={capsule.dueDate}
              newDueDate={capsule.newDueDate}  // Display newDueDate if available
              completedTasks={capsule.completedTasks}
              totalTasks={capsule.totalTasks}
              assignedUsers={capsule.assignedUsers}
              onEdit={() => handleOpenEdit(capsule)}
              onDelete={() => handleDeleteCapsule(capsule.id)}
              onViewDetails={() => navigate(`/capsules/${capsule.id}`)} // Navigate to capsule details
            />
          ))}
        </div>
      )}

      {/* Dialog for Creating or Editing a Capsule */}
      <CapsuleFormDialog
        open={open}
        onClose={handleClose}
        onSave={handleCreateOrUpdateCapsule}
        capsule={editCapsule}  // Pass the capsule for editing (null if creating)
      />
    </div>
  );
};

export default Dashboard;
