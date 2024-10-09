import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCapsuleDetails } from '../services/capsuleService';
import { fetchTasksByCapsule, createTask, updateTask, deleteTask } from '../services/taskService';
import axios from 'axios';
import { Button, CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';
import TaskModal from './TaskModal';
import TaskList from './TaskList';
import { Task, User } from './types';  // Import Task and User types

const CapsuleDetail: React.FC = () => {
  const { id: capsuleId } = useParams<{ id: string }>();
  const [capsule, setCapsule] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForEditing, setTaskForEditing] = useState<Task | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    async function loadCapsule() {
      try {
        setLoading(true);
        if (capsuleId) {
          const capsuleDetails = await fetchCapsuleDetails(parseInt(capsuleId));
          const tasksList = await fetchTasksByCapsule(parseInt(capsuleId));

          const formattedTasks = tasksList.map((task: Task) => ({
            ...task,
            taskName: task.title,
            assignedUserIds: task.assignedUsers,
          }));
          setCapsule(capsuleDetails);
          setTasks(formattedTasks);
        }
      } catch (err) {
        toast.error('Failed to load capsule details or tasks.');
      } finally {
        setLoading(false);
      }
    }
    loadCapsule();
  }, [capsuleId]);

  const handleOpenTaskModal = (task?: Task) => {
    const taskDataForModal = task
      ? { ...task, assignedUserIds: task.assignedUsers.map((user: { id: any; }) => user.id) }  // Convert assignedUsers to assignedUserIds
      : null;
    setTaskForEditing(taskDataForModal);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      if (taskForEditing) {
        await updateTask(parseInt(capsuleId!), taskForEditing.id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await createTask(parseInt(capsuleId!), taskData);
        toast.success('Task created successfully!');
      }

      const updatedTasks = await fetchTasksByCapsule(parseInt(capsuleId!));
      const formattedTasks = updatedTasks.map((task: Task) => ({
        ...task,
        taskName: task.title,
        assignedUserIds: task.assignedUsers,
      }));
      setTasks(formattedTasks);
    } catch (err) {
      toast.error('Failed to save task.');
    } finally {
      setTaskModalOpen(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(parseInt(capsuleId!), taskId);
        const updatedTasks = await fetchTasksByCapsule(parseInt(capsuleId!));
        const formattedTasks = updatedTasks.map((task: Task) => ({
          ...task,
          taskName: task.title,
          assignedUserIds: task.assignedUsers,
        }));
        setTasks(formattedTasks);
        toast.success('Task deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete task.');
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h1>{capsule?.title}</h1>
      <p>{capsule?.description}</p>

      {/* Button to Add New Task */}
      <Box display="flex" justifyContent="center" my={2}>
        <Button variant="contained" onClick={() => handleOpenTaskModal()}>
          Add New Task
        </Button>
      </Box>

      {/* Task List View */}
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onEdit={handleOpenTaskModal}  // Pass the full task with user IDs
        users={users}  // Passing users to show avatars/icons in the list
      />

      {/* Task Modal */}
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        users={users}
        initialTaskData={taskForEditing}  // Pass task data with user IDs to the modal
      />
    </div>
  );
};

export default CapsuleDetail;
