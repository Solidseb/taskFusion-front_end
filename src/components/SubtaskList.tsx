// src/components/SubtaskList.tsx

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
  Avatar,
  Stack,
  Chip,
  Slider
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Task } from '../types/types';
import TaskFilters from './TaskFilters';
import { TASK_STATUSES, TaskStatus } from '../types/taskStatuses';  // Import centralized statuses

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
  const completedSubtasks = subtasks.filter((subtask) => subtask.status === 'COMPLETED').length;
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
              <TableCell>Assigned Users</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Completed Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubtasks.length > 0 ? (
              filteredSubtasks.map((subtask) => (
                <TableRow key={subtask.id}>
                  <TableCell style={{ textDecoration: subtask.status === TASK_STATUSES.COMPLETED ? 'line-through' : 'none' }}>
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
                        {new Date(new Date(subtask.dueDate).setDate(new Date(subtask.dueDate).getDate() + 1)).toLocaleDateString()}
                        {new Date() > new Date(new Date(subtask.dueDate).setDate(new Date(subtask.dueDate).getDate() + 1)) &&
                          subtask.status !== TASK_STATUSES.COMPLETED && (
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

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={TASK_STATUSES[subtask.status as TaskStatus] || subtask.status}
                      color={subtask.status === 'COMPLETED' ? 'success' : subtask.status === 'IN_PROGRESS' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  
                  {/* Progress */}
                  <TableCell>
                    <Typography variant="body2">{subtask.progress || 0}%</Typography>
                    <Box width="100%" mt={1}>
                      <Slider
                        value={subtask.progress || 0}
                        step={10}
                        marks
                        min={0}
                        max={100}
                        valueLabelDisplay="auto"
                        disabled // Display only, not interactive
                      />
                    </Box>
                  </TableCell>

                  {/* Priority */}
                  <TableCell>      
                    <Chip
                      label={subtask.priority}
                      sx={{
                        backgroundColor: 
                          subtask.priority === 'Critical'
                            ? 'red'
                            : subtask.priority === 'High'
                            ? 'orange'
                            : subtask.priority === 'Medium'
                            ? '#F5E050'
                            : 'green',
                        color: 'white'
                      }}
                    />
                  </TableCell>

                  {/* Display Tags */}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {subtask.tags?.map((tag) => (
                        <Chip key={tag.id} label={tag.name} size="small" />
                      ))}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Checkbox
                      checked={subtask.status === TASK_STATUSES.COMPLETED}
                      onChange={(e) => onToggleSubtaskComplete(subtask.id, e.target.checked)}
                      color="primary"
                    />
                    <IconButton
                      color="primary"
                      onClick={() => onEditSubtask(subtask)}
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
                <TableCell colSpan={10}>No subtasks found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SubtaskList;
