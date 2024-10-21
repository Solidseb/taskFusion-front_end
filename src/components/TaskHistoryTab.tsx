import React, { useState } from 'react';
import { Box, Typography, Avatar, Divider, IconButton, Collapse, Tooltip } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CommentIcon from '@mui/icons-material/Comment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FlagIcon from '@mui/icons-material/Flag';
import { TaskHistory, User, Task } from './types'; // Assuming Task type includes id and title

interface TaskHistoryTabProps {
  history: TaskHistory[];
  users: User[];
  tasks: Task[]; // Pass all tasks here to map blocker IDs to task titles
}

const findUserNameById = (userId: string, users: User[]): string => {
  const user = users.find((user) => user.id === userId);
  return user ? user.name : 'Unknown User';
};

// Function to map blocker IDs to task titles
const mapBlockersToTitles = (blockerIds: number[], tasks: Task[]) => {
  return blockerIds
    .map((id) => {
      const task = tasks.find((t) => t.id === id);
      return task ? task.title : `Task ${id}`; // Fallback to Task ID if title is not found
    })
    .join(', ');
};

const getIconForChangeType = (changeType: string) => {
  switch (changeType) {
    case 'taskCreated':
    case 'subtaskCreated':
      return <Tooltip title="Task Created"><AddCircleIcon color="success" /></Tooltip>;
    case 'subtaskDeleted':
    case 'taskDeleted':
      return <Tooltip title="Task Deleted"><DeleteIcon color="error" /></Tooltip>;
    case 'taskUpdated':
    case 'subtaskUpdated':
      return <Tooltip title="Task Updated"><EditIcon color="primary" /></Tooltip>;
    case 'taskCompleted':
      return <Tooltip title="Task Completed"><DoneIcon color="success" /></Tooltip>;
    case 'assignedUserChanged':
      return <Tooltip title="User Assignment Changed"><PeopleAltIcon color="action" /></Tooltip>;
    case 'newComment':
      return <Tooltip title="New Comment"><CommentIcon color="primary" /></Tooltip>;
    case 'fileUploaded':
      return <Tooltip title="File Uploaded"><AttachFileIcon color="secondary" /></Tooltip>;
    case 'statusChanged':
      return <Tooltip title="Status Changed"><FlagIcon color="info" /></Tooltip>;
    default:
      return <Tooltip title="Change"><EditIcon color="disabled" /></Tooltip>;
  }
};

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

const TaskHistoryTab: React.FC<TaskHistoryTabProps> = ({ history, users, tasks }) => {
  const [openSections, setOpenSections] = useState<{ [date: string]: boolean }>({});

  const toggleSection = (date: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const parseChangeDescription = (changeType: string, changeDescription: string) => {
    const parsed = JSON.parse(changeDescription);

    // If the change is related to blockers, map blocker IDs to titles
    if (parsed.blockers) {
      const oldBlockers = mapBlockersToTitles(parsed.blockers.old, tasks);
      const newBlockers = mapBlockersToTitles(parsed.blockers.new, tasks);

      return (
        <Box key="blockers">
          <strong>Blockers:</strong>
          <div>
            <strong>Old:</strong> {oldBlockers || 'None'}
          </div>
          <div>
            <strong>New:</strong> {newBlockers || 'None'}
          </div>
        </Box>
      );
    }

    // If the description is changed, display the old and new descriptions
    if (changeType === 'taskUpdated' && parsed.description) {
      return (
        <Box key="description">
          <strong>Description:</strong>
          <Typography variant="body2" component="div">
            <strong>Old:</strong>
            <div dangerouslySetInnerHTML={{ __html: parsed.description.old }} />
          </Typography>
          <Typography variant="body2" component="div">
            <strong>New:</strong>
            <div dangerouslySetInnerHTML={{ __html: parsed.description.new }} />
          </Typography>
        </Box>
      );
    }

    // Handle other types of changes (assigned users, priority, etc.)
    return Object.entries(parsed).map(([field, value]: [string, any]) => {
      if (field === 'assignedUsers') {
        return (
          <Box key={field}>
            <strong>Assigned Users:</strong>
            <div>
              <strong>Old:</strong>{' '}
              {value.old.map((userId: string) => findUserNameById(userId, users)).join(', ')}
            </div>
            <div>
              <strong>New:</strong>{' '}
              {value.new.map((userId: string) => findUserNameById(userId, users)).join(', ')}
            </div>
          </Box>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <Box key={field}>
            <strong>{field}:</strong> {value.old} → {value.new}
          </Box>
        );
      }
      return (
        <Box key={field}>
          <strong>{field}:</strong> {value}
        </Box>
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
                <Typography variant="h6" component="div">{date}</Typography>
                <IconButton onClick={() => toggleSection(date)}>
                  {openSections[date] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
              <Collapse in={openSections[date]}>
                {events.map((entry, index) => (
                  <Box key={entry.id} sx={{ display: 'flex', mb: 3 }}>
                    {/* Timeline marker */}
                    <Box sx={{ mr: 3, textAlign: 'center', position: 'relative' }}>
                      <Box
                        sx={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#3f51b5',
                          margin: 'auto',
                        }}
                      />
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

                    {/* History event content */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Tooltip title={entry.user.name}>
                          <Avatar
                            src={entry.user.avatar || '/default-avatar.png'} // Fallback for missing avatars
                            alt={entry.user.name}
                            sx={{ mr: 2 }}
                          />
                        </Tooltip>
                        <Typography component="span" variant="body1">
                          <strong>{entry.user.name}</strong> made changes:
                        </Typography>
                        {getIconForChangeType(entry.changeType)}
                      </Box>
                      <Typography component="div" variant="body2">
                        {parseChangeDescription(entry.changeType, entry.changeDescription)}
                      </Typography>
                      <Typography component="span" variant="caption" color="textSecondary">
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
