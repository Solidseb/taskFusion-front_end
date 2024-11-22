import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, ToggleButton, ToggleButtonGroup, LinearProgress, Typography } from '@mui/material';
import { ViewList, CalendarToday } from '@mui/icons-material';
import TaskTable from './TaskTable';
import TaskFilters from './TaskFilters';
import { Task, User } from '../types/types';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
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
  tasks,
  users,
  onDelete,
  onEdit,
  onToggleComplete,
  onAddTask,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [filters, setFilters] = useState({ priority: '', status: '' });

  const applyFilters = useCallback(() => {
    let updatedTasks = tasks.filter((task) => !task.parent_id);

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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const events = tasks
    .filter((task) => !task.parent_id)
    .map((task) => ({
      title: task.title,
      start: new Date(task.startDate),
      end: new Date(task.dueDate),
      allDay: false,
    }));

  return (
    <div className="task-list-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Button variant="contained" color="primary" onClick={onAddTask}>
          Add New Task
        </Button>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(event, newViewMode) => setViewMode(newViewMode)}
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

      <TaskFilters filters={filters} onFilterChange={setFilters} />

      <Box my={2}>
        <Typography variant="body2" gutterBottom>
          Overall Progress: {completedTasks}/{totalTasks} Tasks Completed
        </Typography>
        <LinearProgress variant="determinate" value={progressPercentage} />
      </Box>

      {viewMode === 'list' ? (
        <TaskTable tasks={filteredTasks} users={users} onDelete={onDelete} onEdit={onEdit} onToggleComplete={onToggleComplete} />
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
