import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, ViewList, CalendarToday } from "@mui/icons-material";
import { Task, User } from "./types";
import dayjs from "dayjs";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "./TaskList.css";

// Localization for Calendar
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface TaskListProps {
  tasks: Task[];
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (taskId: number, completed: boolean) => void;
  onAddTask: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks = [],
  users,
  onDelete,
  onEdit,
  onToggleComplete,
  onAddTask,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [filters, setFilters] = useState({ priority: "", status: "" });
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const applyFilters = useCallback(() => {
    let updatedTasks = tasks;

    if (filters.priority) {
      updatedTasks = updatedTasks.filter((task) => task.priority === filters.priority);
    }

    if (filters.status) {
      updatedTasks = updatedTasks.filter((task) => task.status === filters.status);
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

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key: keyof Task) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Calculate overall task progress (number of completed tasks)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Switch between List and Calendar view
  const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, newViewMode: "list" | "calendar") => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Prepare events for Calendar
  const events = tasks.map((task) => ({
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.dueDate),
    allDay: false,
  }));

  return (
    <div className="task-list-container">
      {/* Button to Add New Task */}
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Button variant="contained" color="primary" onClick={onAddTask}>
          Add New Task
        </Button>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="View mode"
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="calendar" aria-label="calendar view">
            <CalendarToday />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Filters */}
      <div className="task-filters">
        <FormControl variant="outlined" margin="dense" style={{ minWidth: 180 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
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
            onChange={(e) => handleFilterChange("status", e.target.value)}
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

      {viewMode === "list" ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => requestSort("title")}>Task Name</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Completed Date</TableCell>
                <TableCell onClick={() => requestSort("status")}>Status</TableCell>
                <TableCell onClick={() => requestSort("priority")}>Priority</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTasks.length > 0 ? (
                sortedTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell style={{ textDecoration: task.status === "Completed" ? "line-through" : "none" }}>
                      <Link to={`/tasks/${task.id}`} className="task-link">
                        {task.title}
                      </Link>
                    </TableCell>

                    {/* Assigned Users */}
                    <TableCell>
                      {task.assignedUsers && task.assignedUsers.length > 0 ? (
                        task.assignedUsers.map((user) => (
                          <Tooltip title={user.name} key={user.id}>
                            <Avatar src={user.avatar} style={{ marginRight: 5 }}>
                              {user.name[0].toUpperCase()}
                            </Avatar>
                          </Tooltip>
                        ))
                      ) : (
                        "Unassigned"
                      )}
                    </TableCell>

                    {/* Start Date */}
                    <TableCell>
                      {task.startDate
                        ? dayjs(task.startDate).format("MMMM D, YYYY")
                        : "No start date"}
                    </TableCell>

                    {/* Due Date */}
                    <TableCell>
                      {task.dueDate ? (
                        <>
                          {dayjs(task.dueDate).format("MMMM D, YYYY")}
                          {dayjs().isAfter(task.dueDate) && task.status !== "Completed" && (
                            <span style={{ color: "red" }}> (Overdue)</span>
                          )}
                        </>
                      ) : (
                        "No due date"
                      )}
                    </TableCell>

                    {/* Completed Date */}
                    <TableCell>
                      {task.completedDate ? dayjs(task.completedDate).format("MMMM D, YYYY") : "Not completed"}
                    </TableCell>

                    {/* Status */}
                    <TableCell>{task.status}</TableCell>

                    {/* Priority */}
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
                  <TableCell colSpan={8}>No tasks found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box mt={2}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
          />
        </Box>
      )}
    </div>
  );
};

export default TaskList;
