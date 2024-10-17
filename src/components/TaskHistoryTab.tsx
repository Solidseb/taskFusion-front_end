import React, { useState } from 'react';
import { Box, Typography, Avatar, Divider, IconButton, Collapse, Tooltip } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';           // For task completion
import CommentIcon from '@mui/icons-material/Comment';     // For comments
import AttachFileIcon from '@mui/icons-material/AttachFile'; // For file uploads
import PersonIcon from '@mui/icons-material/Person';       // For user assignment changes
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { TaskHistory, User } from './types';  // Assuming TaskHistory and User types exist

interface TaskHistoryTabProps {
  history: TaskHistory[];
  users: User[];  // List of all users to map IDs to names
}

// Helper to find user by ID
const findUserNameById = (userId: string, users: User[]): string => {
  const user = users.find((user) => user.id === userId);
  return user ? user.name : 'Unknown User';
};

// Generate icons for different change types
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
    case 'taskCreated':
    case 'subtaskCreated':
      return <DoneIcon color="success" />;
    case 'taskDeleted':
      return <DoneIcon color="error" />;
    default:
      return <DoneIcon />;
  }
};

// Handle collapsible sections for different dates
const groupHistoryByDate = (history: TaskHistory[]) => {
  return history.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as { [date: string]: TaskHistory[] });
};

const TaskHistoryTab: React.FC<TaskHistoryTabProps> = ({ history, users }) => {
  const [openSections, setOpenSections] = useState<{ [date: string]: boolean }>({});
  
  const toggleSection = (date: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const parseChangeDescription = (changeType: string, changeDescription: string) => {
    if (changeType === 'taskCreated' || changeType === 'subtaskCreated') {
      const parsed = JSON.parse(changeDescription);
      return (
        <div>
          <Typography variant="body2" color="success.main">
            {changeType === 'subtaskCreated' ? 'SubTask' : 'Task' } Created with title: <strong>{parsed.title}</strong>, status: <strong>{parsed.status}</strong>, priority: <strong>{parsed.priority}</strong>.
          </Typography>
        </div>
      );
    }
  
    if (changeType === 'taskDeleted' || changeType === 'subtaskDeleted') {
      return (
        <div>
          <Typography variant="body2" color="error.main">
            Task Deleted.
          </Typography>
        </div>
      );
    }

    const parsed = JSON.parse(changeDescription);

    return Object.entries(parsed).map(([field, value]: [string, any]) => {
      if (field === 'assignedUsers') {
        // Handle user assignments using the IDs to map to names
        return (
          <div key={field}>
            <strong>Assigned Users:</strong>
            <div>
              <strong>Old:</strong>{' '}
              {value.old.map((userId: string) => findUserNameById(userId, users)).join(', ')}
            </div>
            <div>
              <strong>New:</strong>{' '}
              {value.new.map((userId: string) => findUserNameById(userId, users)).join(', ')}
            </div>
          </div>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <div key={field}>
            <strong>{field}:</strong> {value.old} → {value.new}
          </div>
        );
      }
      return (
        <div key={field}>
          <strong>{field}:</strong> {value}
        </div>
      );
    });
  };

  const groupedHistory = groupHistoryByDate(history);

  return (
    <Box mt={2} sx={{ padding: '16px' }}>
      <Typography variant="h6">Task History</Typography>
      {Object.entries(groupedHistory).length > 0 ? (
        <Box>
          {Object.entries(groupedHistory).map(([date, events]) => (
            <Box key={date} mb={2}>
              <Box display="flex" alignItems="center">
                <Typography variant="h6">{date}</Typography>
                <IconButton onClick={() => toggleSection(date)}>
                  {openSections[date] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Collapse in={openSections[date]}>
                {events.map((entry, index) => (
                  <Box key={entry.id} sx={{ display: 'flex', mb: 3 }}>
                    {/* Display the timeline marker */}
                    <Box sx={{ mr: 3, textAlign: 'center', position: 'relative' }}>
                      {/* Dot for the timeline */}
                      <Box
                        sx={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#3f51b5',
                          margin: 'auto',
                        }}
                      />
                      {/* Vertical line between dots */}
                      {index < events.length - 1 && (
                        <Box
                          sx={{
                            width: '2px',
                            height: '100%',
                            backgroundColor: '#e0e0e0',
                            position: 'absolute',
                            left: '50%',
                            top: '10px',
                            transform: 'translateX(-50%)',
                          }}
                        />
                      )}
                    </Box>

                    {/* Content of the history event */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Tooltip title={entry.user.name}>
                          <Avatar src={entry.user.avatar} alt={entry.user.name} sx={{ mr: 2 }} />
                        </Tooltip>
                        <Typography variant="body1">
                          <strong>{entry.user.name}</strong> made changes:
                        </Typography>
                        {/* Use the icon from getIconForChangeType */}
                        {getIconForChangeType(entry.changeType)}
                      </Box>
                      <Typography variant="body2">
                        {parseChangeDescription(entry.changeType, entry.changeDescription)}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(entry.timestamp).toLocaleString()}
                      </Typography>
                      {index < events.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  </Box>
                ))}
              </Collapse>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2">No history available for this task.</Typography>
      )}
    </Box>
  );
};

export default TaskHistoryTab;
