import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Avatar, IconButton, Tooltip, Chip, Stack } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Task, User } from './types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

interface TaskTableProps {
  tasks: Task[];
  users: User[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onToggleComplete: (taskId: number, completed: boolean) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, users, onDelete, onEdit, onToggleComplete }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Subtasks</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Completed Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
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
                    'Unassigned'
                  )}
                </TableCell>

                {/* Subtask Count */}
                <TableCell>{task.subtasks ? task.subtasks.length : 0}</TableCell>

                {/* Start Date */}
                <TableCell>{task.startDate ? dayjs(task.startDate).format('MMMM D, YYYY') : 'No start date'}</TableCell>

                {/* Due Date */}
                <TableCell>
                  {task.dueDate ? (
                    <>
                      {new Date(new Date(task.dueDate).setDate(new Date(task.dueDate).getDate() + 1)).toLocaleDateString()}
                      {new Date() > new Date(new Date(task.dueDate).setDate(new Date(task.dueDate).getDate() + 1)) &&
                        task.status !== 'Completed' && (
                          <span style={{ color: 'red' }}> (Overdue)</span>
                      )}
                    </>
                  ) : (
                    'No due date'
                  )}
                </TableCell>

                {/* Completed Date */}
                <TableCell>{task.completedDate ? dayjs(task.completedDate).format('MMMM D, YYYY') : 'Not completed'}</TableCell>

                {/* Status */}
                <TableCell><Chip
                  label={task.status}
                  color={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'primary' : 'default'}
                /></TableCell>

                {/* Priority */}
                <TableCell>      
                  <Chip
                    label={task.priority}
                    sx={{
                      backgroundColor: 
                        task.priority === 'Critical'
                          ? 'red'
                          : task.priority === 'High'
                          ? 'orange'
                          : task.priority === 'Medium'
                          ? '#F5E050'
                          : 'green',
                      color: 'white'
                    }}
                  />
                </TableCell>

                {/* Display Tags */}
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {task.tags?.map((tag) => (
                      <Chip key={tag.id} label={tag.name} size="small" />
                    ))}
                  </Stack>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <Checkbox
                    checked={task.status === 'Completed'}
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
              <TableCell colSpan={10}>No tasks found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
