import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Badge, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { fetchNotifications, markNotificationsAsRead } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

const POLLING_INTERVAL = 30000; // Poll every 60 seconds

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Fetch notifications
  const loadNotifications = async () => {
    const notifications = await fetchNotifications();
    setNotifications(notifications);
    setUnreadCount(notifications.filter((n: { isRead: any }) => !n.isRead).length);
  };

  // Fetch notifications when component mounts and poll periodically
  useEffect(() => {
    // Initial load
    loadNotifications();

    // Poll every 60 seconds
    const intervalId = setInterval(() => {
      loadNotifications();
    }, POLLING_INTERVAL);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth');
  };

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0); // Reset unread count after clicking
  };

  const handleClose = () => {
    if (notifications.length > 0) {
      markNotificationsAsRead();
      setNotifications([])
    }
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          TaskFusion
        </Typography>

        {/* Notification Icon */}
        <IconButton color="inherit" onClick={handleNotificationsClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Notification Dropdown */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <MenuItem key={index} onClick={handleClose}>
                {notification.message}
              </MenuItem>
            ))
          ) : (
            <MenuItem onClick={handleClose}>No new notifications</MenuItem>
          )}
        </Menu>

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
