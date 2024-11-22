import React from 'react';
import { Card, CardContent, Typography, IconButton, CircularProgress, Avatar, Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, isValid } from 'date-fns';
import { User } from "../types/types";

interface CapsuleCardProps {
  title: string;
  status: string;
  dueDate: string;
  newDueDate?: string; // Optional field for the current due date
  completedTasks: number;
  totalTasks: number;
  assignedUsers: User[];
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({
  title,
  status,
  dueDate,
  newDueDate,
  completedTasks,
  totalTasks,
  assignedUsers,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const completionPercentage = (completedTasks / totalTasks) * 100 || 0;

  // Formatting dates
  const originalDeadline = new Date(dueDate);
  const formattedOriginalDate = isValid(originalDeadline) ? format(originalDeadline, 'dd/MM/yyyy') : 'No original deadline';

  const currentDeadline = newDueDate ? new Date(newDueDate) : null;
  const formattedCurrentDate = currentDeadline && isValid(currentDeadline) ? format(currentDeadline, 'dd/MM/yyyy') : 'No updated deadline';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'green';
      case 'IN_PROGRESS':
        return 'orange';
      case 'PENDING_DEPENDENCIES':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Card style={{ borderLeft: `5px solid ${getStatusColor(status)}`, position: 'relative' }}>
      <CardContent>
        {/* Title */}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {/* Due Dates */}
        <Typography variant="body2" color="textSecondary">
          Delivery Date: {formattedOriginalDate}
        </Typography>
        {newDueDate && (
          <Typography variant="body2" color="textSecondary">
            New Delivery Date: {formattedCurrentDate}
          </Typography>
        )}

        {/* Progress Bar */}
        <Box display="flex" alignItems="center" marginTop={2}>
          <CircularProgress variant="determinate" value={completionPercentage} />
          <Typography variant="body2" color="textSecondary" style={{ marginLeft: 10 }}>
            {completedTasks}/{totalTasks} Tasks Completed
          </Typography>
        </Box>

        {/* Assigned Users */}
        <Box display="flex" alignItems="center" marginTop={2}>
          {assignedUsers.map((user) => (
            <Avatar src={ user.avatar } key={user.id} style={{ marginRight: 5 }}>
              {user.name[0].toUpperCase()}
            </Avatar>
          ))}
        </Box>

        {/* Actions: Edit, Delete, View Details */}
        <Box display="flex" justifyContent="space-between" marginTop={2}>
          <Button size="small" onClick={onViewDetails}>
            View Details
          </Button>
          <Box>
            <IconButton color="primary" onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="secondary" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CapsuleCard;
