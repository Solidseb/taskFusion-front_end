import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';           // For task completion
import CommentIcon from '@mui/icons-material/Comment';     // For comments
import AttachFileIcon from '@mui/icons-material/AttachFile'; // For file uploads
import PersonIcon from '@mui/icons-material/Person';       // For user assignment changes
import { TaskHistory } from './types';

interface TaskHistoryTabProps {
  history: TaskHistory[];
}

const TaskHistoryTab: React.FC<TaskHistoryTabProps> = ({ history }) => {
  const getIconForChangeType = (changeType: string) => {
    switch (changeType) {
      case 'taskCompleted':
        return <DoneIcon color="success" />;
      case 'newComment':
        return <CommentIcon color="primary" />;
      case 'fileUploaded':
        return <AttachFileIcon color="secondary" />;
      case 'assignedUserChanged':
        return <PersonIcon color="action" />;
      case 'statusChanged':
        return <DoneIcon color="info" />;
      default:
        return <DoneIcon />;
    }
  };

  const getStyleForChangeType = (changeType: string) => {
    switch (changeType) {
      case 'taskCompleted':
        return { backgroundColor: '#e0ffe0' }; // Light green for completed tasks
      case 'newComment':
        return { backgroundColor: '#e0f7ff' }; // Light blue for comments
      case 'fileUploaded':
        return { backgroundColor: '#f0f0ff' }; // Light purple for files
      case 'assignedUserChanged':
        return { backgroundColor: '#fff3e0' }; // Light orange for user changes
      case 'statusChanged':
        return { backgroundColor: '#e0e0e0' }; // Light grey for status changes
      default:
        return {};
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6">Task History</Typography>
      {history.length > 0 ? (
        <List>
          {history.map((entry) => (
            <React.Fragment key={entry.id}>
              <ListItem style={getStyleForChangeType(entry.changeType)}>
                <ListItemIcon>{getIconForChangeType(entry.changeType)}</ListItemIcon>
                <ListItemText
                  primary={entry.changeDescription}
                  secondary={`${entry.changedBy} - ${new Date(entry.timestamp).toLocaleString()}`}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography variant="body2">No history available for this task.</Typography>
      )}
    </Box>
  );
};

export default TaskHistoryTab;
