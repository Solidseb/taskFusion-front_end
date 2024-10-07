import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Button, Avatar, AvatarGroup, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedUsers: User[];
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: number, status: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskUpdate, onTaskEdit, onTaskDelete }) => {
  const statuses = ['To Do', 'In Progress', 'Completed'];
  const navigate = useNavigate();

  return (
    <Grid container spacing={2}>
      {statuses.map((status) => (
        <Grid item xs={4} key={status}>
          <Typography variant="h6">{status}</Typography>
          <Box>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <Card key={task.id} sx={{ mb: 2 }}>
                  <CardContent>
                     <Typography
                      variant="subtitle1"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      {task.title}
                    </Typography>
                    {/* Display the due date if it exists */}
                    {task.dueDate && (
                      <Typography variant="body2" color="textSecondary">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    )}
                    {/* Display the assigned users */}
                    {task.assignedUsers.length > 0 && (
                      <>
                        <Typography variant="body2" color="textSecondary">
                          Assigned to:
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          {/* Show avatars of assigned users */}
                          <AvatarGroup max={3}>
                            {task.assignedUsers.map((user) => (
                              <Tooltip key={user.id} title={user.name} arrow>
                                <Avatar>
                                  {user.name.charAt(0)}
                                </Avatar>
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                        </Box>
                      </>
                    )}
                    <Box display="flex" justifyContent="space-between" mt={2}>
                     {/* <Button size="small" onClick={() => onTaskEdit(task)}>Edit</Button>
                      <Button size="small" onClick={() => onTaskDelete(task.id)}>Delete</Button>
                      {/* Buttons to update the task's status */}
                      {statuses.map((newStatus) => (
                        <Button
                          key={newStatus}
                          size="small"
                          disabled={newStatus === status}
                          onClick={() => onTaskUpdate(task.id, newStatus)}
                        >
                          {newStatus}
                        </Button>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default KanbanBoard;
