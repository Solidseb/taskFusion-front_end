import React, { useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Avatar, Stack } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';
import { Task, User } from '../types/types';
import * as TaskService from '../services/taskService';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, users, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState(tasks);

  const columns = [
    { id: 'to_do', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
  ];

  const getTasksByStatus = (status: string) => taskList.filter((task) => task.status === status);

  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    const updatedTasks = [...taskList];
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destStatus;

    if (sourceStatus === destStatus) {
      updatedTasks.splice(destination.index, 0, movedTask);
    } else {
      updatedTasks.splice(destination.index, 0, movedTask);
    }

    setTaskList(updatedTasks);
    setLoading(true);
    try {
      await TaskService.updateTaskStatus(movedTask.id, movedTask.status);
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Error updating task status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={2}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="flex" gap={2}>
          {columns.map((column) => (
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <Paper
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ width: 300, padding: 2 }}
                >
                  <Typography variant="h6" align="center">
                    {column.title}
                  </Typography>
                  {loading && <CircularProgress size={24} sx={{ mt: 2, display: 'block', mx: 'auto' }} />}
                  {getTasksByStatus(column.id).map((task, index) => (
                    <Draggable draggableId={String(task.id)} index={index} key={task.id}>
                      {(provided) => (
                        <Paper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            marginBottom: 2,
                            padding: 2,
                            backgroundColor: 'whitesmoke',
                          }}
                        >
                          <Typography variant="body1">{task.title}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center" marginTop={1}>
                            {task.assignedUsers.map((user: User) => (
                              <Avatar key={user.id} src={user.avatar} alt={user.name} />
                            ))}
                          </Stack>
                        </Paper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Paper>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
