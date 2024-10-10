import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, MenuItem, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { fetchUserProfile, fetchUserInfo, updateUserProfile } from '../services/profileService';

const competencyLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
  { value: 'Master', label: 'Master' },
];

const Profile: React.FC = () => {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState<{ bio: string; skills: { skill: string; competencyLevel: string; experienceYears: number }[] }>({
    bio: '',
    skills: [],
  });
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null); // Store the base64 version of the avatar

  // Fetch user info and profile data
  useEffect(() => {
    const fetchProfileAndUserInfo = async () => {
      const token = localStorage.getItem('token');
      try {
        const userInfo = await fetchUserInfo(token as string);
        const profileInfo = await fetchUserProfile(token as string);

        setUser({
          name: userInfo?.name || '',
          email: userInfo?.email || '',
          avatar: userInfo?.avatar || '',
        });

        setProfile({
          bio: profileInfo?.bio || '',
          skills: profileInfo?.skills && Array.isArray(profileInfo.skills) ? profileInfo.skills : [],
        });
      } catch (error) {
        console.error('Failed to fetch profile or user info', error);
        toast.error('Failed to load profile or user info');
      }
    };

    fetchProfileAndUserInfo();
  }, []);

  // Handle avatar change and display it in real-time
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarBase64(reader.result as string); // Update the base64 image to be shown immediately
      };

      reader.readAsDataURL(file); // Convert the image to base64 format
    }
  };

  // Add new skill
  const handleAddSkill = () => {
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, { skill: '', competencyLevel: '', experienceYears: 0 }],
    }));
  };

  // Remove skill
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = [...profile.skills];
    updatedSkills.splice(index, 1);
    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
  };

  // Update profile information
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      await updateUserProfile(
        token as string,
        { bio: profile.bio, name: user.name, email: user.email, avatar: avatarBase64 || user.avatar }, // Send base64 or previous avatar
        profile.skills,
        password || undefined,
      );
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  // Handle profile changes
  const handleChangeProfile = (index: number, key: string, value: any) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = { ...updatedSkills[index], [key]: value };
    setProfile((prev) => ({ ...prev, skills: updatedSkills }));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Profile</Typography>

      {/* Avatar Section */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={avatarBase64 || user.avatar || `${process.env.REACT_APP_API_URL}${user.avatar}`}  // Show the updated base64 or the previous avatar
          alt={user.name}
          sx={{ width: 80, height: 80, marginRight: '10px' }}
        />
        <input
          accept="image/*"
          type="file"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
          id="avatar-upload"
        />
        <label htmlFor="avatar-upload">
          <Button variant="contained" component="span">
            Upload Avatar
          </Button>
        </label>
      </Box>

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
        value={profile?.bio || ''}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        margin="normal"
        fullWidth
        multiline
        rows={4}
      />

      {/* Skills & Competencies Section */}
      <Typography variant="h5" style={{ marginTop: '20px' }}>Skills & Competencies</Typography>

      <Button variant="contained" onClick={handleAddSkill} style={{ marginBottom: '20px' }}>
        Add Skill
      </Button>

      {profile?.skills?.length > 0 ? (
        profile.skills.map((item, index) => (
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
              style={{ marginRight: '10px', minWidth: '200px' }}
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
        ))
      ) : (
        <Typography variant="body2">No skills added yet.</Typography>
      )}

      {/* Update Button */}
      <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
        Update Profile
      </Button>
    </Container>
  );
};

export default Profile;
