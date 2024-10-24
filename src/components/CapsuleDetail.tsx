import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCapsuleDetails } from '../services/capsuleService';
import { Box, Typography, CircularProgress } from '@mui/material';
import TaskManager from './TaskManager';
import { Tag, User } from './types';
import { toast } from 'react-toastify';
import { fetchUsers } from '../services/userService';
import { useCapsule } from '../context/CapsuleContext'; // Import the useCapsule hook
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const CapsuleDetail: React.FC = () => {
  const { id: capsuleIdParam } = useParams<{ id: string }>();
  const { setCapsuleId } = useCapsule(); // Get setCapsuleId from context
  const [capsule, setCapsule] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    async function loadCapsule() {
      try {
        setLoading(true);
        if (capsuleIdParam) {
          const capsuleDetails = await fetchCapsuleDetails(parseInt(capsuleIdParam));
          setCapsule(capsuleDetails);
          setCapsuleId(parseInt(capsuleIdParam)); // Set capsuleId in context
        }
      } catch (err) {
        toast.error('Failed to load capsule details.');
      } finally {
        setLoading(false);
      }
    }
    loadCapsule();
  }, [capsuleIdParam, setCapsuleId]);

  const organizationId = JSON.parse(localStorage.getItem('user') || '{}').organizationId;

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsResponse = await axios.get(`${API_URL}/tags/${organizationId}`);
        setTags(tagsResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch settings or tags', error);
      }
    };
    fetchTags();
  }, [organizationId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {/* Capsule Title and Description */}
      <Typography variant="h4">{capsule?.title}</Typography>
      <Typography variant="body1" gutterBottom>{capsule?.description}</Typography>

      {/* Task Manager */}
      <Box my={2}>
        <TaskManager users={users} tags={tags} /> {/* No need to pass capsuleId as it's in context */}
      </Box>
    </div>
  );
};

export default CapsuleDetail;
