import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Box,
  Typography,
  LinearProgress,
  Tooltip, 
  Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';  // Import Link for navigation
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';  // Edit Icon for subtask editing
import { Task } from './types';  // Ensure you import the User type
import TaskFilters from './TaskFilters'; // Reuse filters for subtasks

interface SubtaskListProps {
  subtasks: Task[];
  onDeleteSubtask: (subtaskId: number) => void;
  onToggleSubtaskComplete: (subtaskId: number, completed: boolean) => void;
  onEditSubtask: (subtask: Task) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onDeleteSubtask,
  onToggleSubtaskComplete,
  onEditSubtask,
}) => {
  const [filteredSubtasks, setFilteredSubtasks] = useState<Task[]>(subtasks);
  const [filters, setFilters] = useState({ priority: '', status: '' });

  const applyFilters = useCallback(() => {
    let updatedSubtasks = subtasks;

    if (filters.priority) {
      updatedSubtasks = updatedSubtasks.filter((subtask) => subtask.priority === filters.priority);
    }

    if (filters.status) {
      updatedSubtasks = updatedSubtasks.filter((subtask) => subtask.status === filters.status);
    }

    setFilteredSubtasks(updatedSubtasks);
  }, [subtasks, filters]);

  useEffect(() => {
    applyFilters();
  }, [subtasks, filters, applyFilters]);

  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter((subtask) => subtask.status === 'Completed').length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div>
      {/* Filters */}
      <TaskFilters filters={filters} onFilterChange={setFilters} />

      {/* Progress Bar for Subtasks */}
      <Box my={2}>
        <Typography variant="body2" gutterBottom>
          Subtask Progress: {completedSubtasks}/{totalSubtasks} Subtasks Completed
        </Typography>
        <LinearProgress variant="determinate" value={progressPercentage} />
      </Box>

      {/* Subtask Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Subtask Name</TableCell>
              <TableCell>Assigned Users</TableCell> {/* New column for assigned users */}
              <TableCell>Start Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Completed Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubtasks.length > 0 ? (
              filteredSubtasks.map((subtask) => (
                <TableRow key={subtask.id}>
                  <TableCell style={{ textDecoration: subtask.status === 'Completed' ? 'line-through' : 'none' }}>
                    {/* Link to subtask detail */}
                    <Link to={`/tasks/${subtask.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {subtask.title}
                    </Link>
                  </TableCell>

                  {/* Assigned Users */}
                      <TableCell>
                  {subtask.assignedUsers && subtask.assignedUsers.length > 0 ? (
                    subtask.assignedUsers.map((user) => (
                      <Tooltip title={user.name} key={user.id}>
                        <Avatar src={user.avatar} style={{ marginRight: 5 }}>
                          {user.name[0].toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))
                  ) : (
                    'Unassigned'
                  )}
                </TableCell>

                  <TableCell>
                    {subtask.startDate ? new Date(subtask.startDate).toLocaleDateString() : 'No start date'}
                  </TableCell>

                  <TableCell>
                    {subtask.dueDate ? (
                      <>
                        {/* Add one day to the subtask due date */}
                        {new Date(new Date(subtask.dueDate).setDate(new Date(subtask.dueDate).getDate() + 1)).toLocaleDateString()}
                        {/* Check if the (adjusted) due date is overdue */}
                        {new Date() > new Date(new Date(subtask.dueDate).setDate(new Date(subtask.dueDate).getDate() + 1)) &&
                          subtask.status !== 'Completed' && (
                            <span style={{ color: 'red' }}> (Overdue)</span>
                        )}
                      </>
                    ) : (
                      'No due date'
                    )}
                  </TableCell>


                  <TableCell>
                    {subtask.completedDate
                      ? new Date(subtask.completedDate).toLocaleDateString()
                      : 'Not completed'}
                  </TableCell>

                  <TableCell>{subtask.status}</TableCell>
                  <TableCell>{subtask.priority}</TableCell>

                  <TableCell>
                    <Checkbox
                      checked={subtask.status === 'Completed'}
                      onChange={(e) => onToggleSubtaskComplete(subtask.id, e.target.checked)}
                      color="primary"
                    />
                    {/* Edit button to open the modal for subtask editing */}
                    <IconButton
                      color="primary"
                      onClick={() => onEditSubtask(subtask)}  // Call the new edit handler
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => onDeleteSubtask(subtask.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No subtasks found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SubtaskList;
