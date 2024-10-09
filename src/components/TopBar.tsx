import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom'; // Updated from useHistory to useNavigate

const TopBar: React.FC = () => {
  const navigate = useNavigate(); // Replacing useHistory with useNavigate

  const handleLogout = () => {
    // Implement your logout logic here
    // For example, clearing tokens and redirecting to login
    localStorage.removeItem('authToken');
    navigate('/auth'); // Replacing history.push with navigate
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          TaskFusion
        </Typography>

        {/* Notification Icon */}
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>

        {/* Logout Button */}
        <Box ml={2}>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
