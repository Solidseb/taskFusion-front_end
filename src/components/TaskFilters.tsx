import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface TaskFiltersProps {
  filters: { priority: string; status: string };
  onFilterChange: (filters: { priority: string; status: string }) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="task-filters">
      <FormControl variant="outlined" margin="dense" style={{ minWidth: 180 }}>
        <InputLabel>Priority</InputLabel>
        <Select value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)} label="Priority">
          <MenuItem value="">All</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" margin="dense" style={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>
        <Select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} label="Status">
          <MenuItem value="">All</MenuItem>
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default TaskFilters;
