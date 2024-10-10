import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Avatar, IconButton, Tooltip,
  FormControl, InputLabel, Select, MenuItem, LinearProgress, Box, Typography, Button
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Task, User } from "./types";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (taskId: number, completed: boolean) => void;
  onAddTask: () => void;  // Added this line for the new task button handler
}

const TaskList: React.FC<TaskListProps> = ({ tasks = [], users, onDelete, onEdit, onToggleComplete, onAddTask }) => {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [filters, setFilters] = useState({ priority: '', status: '' });

  const applyFilters = useCallback(() => {
    let updatedTasks = tasks;

    if (filters.priority) {
      updatedTasks = updatedTasks.filter(task => task.priority === filters.priority);
    }

    if (filters.status) {
      updatedTasks = updatedTasks.filter(task => task.status === filters.status);
    }

    setFilteredTasks(updatedTasks);
  }, [tasks, filters]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters, applyFilters]);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortConfig.key) {
      let aValue = a[sortConfig.key as keyof Task];
      let bValue = b[sortConfig.key as keyof Task];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Task) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Calculate overall task progress (number of completed tasks)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="task-list-container">
      {/* Button to Add New Task */}
      <Box display="flex" justifyContent="flex-end" my={2}>
        <Button variant="contained" color="primary" onClick={onAddTask}>
          Add New Task
        </Button>
      </Box>

      {/* Filters */}
      <div className="task-filters">
        <FormControl variant="outlined" margin="dense" style={{ minWidth: 180 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            label="Priority"
            MenuProps={{
              PaperProps: {
                style: {
                  minWidth: 180,
                },
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" margin="dense" style={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            label="Status"
            MenuProps={{
              PaperProps: {
                style: {
                  minWidth: 180,
                },
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Progress Bar for All Tasks */}
      <Box my={2}>
        <Typography variant="body2" gutterBottom>
          Overall Progress: {completedTasks}/{totalTasks} Tasks Completed
        </Typography>
        <LinearProgress variant="determinate" value={progressPercentage} />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => requestSort('title')}>Task Name</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell onClick={() => requestSort('status')}>Status</TableCell>
              <TableCell onClick={() => requestSort('priority')}>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell style={{ textDecoration: task.status === "Completed" ? 'line-through' : 'none' }}>
                    <Link to={`/tasks/${task.id}`} className="task-link">
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {task.assignedUsers && task.assignedUsers.length > 0 ? (
                      task.assignedUsers.map((user) => (
                        <Tooltip title={user.name} key={user.id}>
                          <Avatar src={ user.avatar } style={{ marginRight: 5 }}>{user.name[0].toUpperCase()}</Avatar>
                        </Tooltip>
                      ))
                    ) : (
                      'Unassigned'
                    )}
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    {/* Checkbox for toggling task completion */}
                    <Checkbox
                      checked={task.status === "Completed"}
                      onChange={(e) => onToggleComplete(task.id, e.target.checked)}
                      color="primary"
                    />
                    <IconButton color="primary" onClick={() => onEdit(task)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => onDelete(task.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No tasks found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TaskList;
