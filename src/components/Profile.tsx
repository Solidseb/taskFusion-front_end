import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const Profile: React.FC = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch user profile data
    axios.get(`${API_URL}/user/profile`).then((response) => {
      setUser(response.data);
    });
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`${API_URL}/user/profile`, { ...user, password });
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Profile</Typography>
      <TextField
        label="Name"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
        Update Profile
      </Button>
    </Container>
  );
};

export default Profile;
