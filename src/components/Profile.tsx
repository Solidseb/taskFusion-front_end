import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';  // Import toast for notifications
import { fetchUserProfile, fetchUserInfo, updateUserProfile } from '../services/profileService';  // Import service functions

const competencyLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
  { value: 'Master', label: 'Master' },
];

const Profile: React.FC = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState({ bio: '', skills: [{ skill: '', competencyLevel: '', experienceYears: 0 }] });

  // Fetch both user info and profile data
  useEffect(() => {
    const fetchProfileAndUserInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const userInfo = await fetchUserInfo(token as string);
        const profileInfo = await fetchUserProfile(token as string);
        setUser({ name: userInfo.name, email: userInfo.email });
        setProfile(profileInfo);
      } catch (error) {
        console.error('Failed to fetch profile or user info', error);
        toast.error('Failed to load profile or user info'); // Error toast
      }
    };
    fetchProfileAndUserInfo();
  }, []);

  // Add new skill
  const handleAddSkill = () => {
    setProfile(prev => ({ ...prev, skills: [...prev.skills, { skill: '', competencyLevel: '', experienceYears: 0 }] }));
  };

  // Remove a skill
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...profile.skills];
    updatedSkills.splice(index, 1);
    setProfile(prev => ({ ...prev, skills: updatedSkills }));
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      // Send the correct structure with bio, name, and email inside the profile object
      await updateUserProfile(token as string, {
        bio: profile.bio, name: user.name, email: user.email },
        profile.skills,
        password || undefined, 
      );
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangeProfile = (index: number, key: string, value: any) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = { ...updatedSkills[index], [key]: value };
    setProfile(prev => ({ ...prev, skills: updatedSkills }));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Profile</Typography>

      {/* User Info Section */}
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

      {/* Bio Section */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Bio</Typography>
      <TextField
        label="Bio"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        margin="normal"
        fullWidth
        multiline
        rows={4}
      />

      {/* Skills & Competencies Section */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Skills & Competencies</Typography>

      {/* Add Skill Button moved under title */}
      <Button variant="contained" onClick={handleAddSkill} style={{ marginBottom: '20px' }}>
        Add Skill
      </Button>

      {profile.skills.map((item, index) => (
        <Box key={index} display="flex" alignItems="center" my={2}>
          <TextField
            label="Skill"
            value={item.skill}
            onChange={(e) => handleChangeProfile(index, 'skill', e.target.value)}
            margin="normal"
            style={{ marginRight: '10px' }}
          />
         <TextField
            select
            label="Competency Level"
            value={item.competencyLevel}
            onChange={(e) => handleChangeProfile(index, 'competencyLevel', e.target.value)}
            margin="normal"
            style={{ marginRight: '10px', minWidth: '200px' }}  // Set a minimum width for the select
          >
            {competencyLevels.map((level) => (
              <MenuItem key={level.value} value={level.value}>
                {level.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Experience (Years)"
            type="number"
            value={item.experienceYears}
            onChange={(e) => handleChangeProfile(index, 'experienceYears', e.target.value)}
            margin="normal"
            style={{ width: '120px', marginRight: '10px' }}
          />
          <IconButton onClick={() => handleRemoveSkill(index)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {/* Update Button */}
      <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
        Update Profile
      </Button>
    </Container>
  );
};

export default Profile;
