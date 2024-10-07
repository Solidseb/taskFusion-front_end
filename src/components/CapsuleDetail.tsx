import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCapsuleDetails } from '../services/capsuleService';
import { fetchTasksByCapsule, createTask, updateTask, deleteTask } from '../services/taskService';
import axios from 'axios';
import { Button, CircularProgress, Box } from '@mui/material';
import { toast } from 'react-toastify';
import KanbanBoard from './KanbanBoard';
import TaskModal from './TaskModal'; // Import TaskModal

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedUsers: User[];
}

interface CapsuleDetailProps {
  id: number;
  title: string;
  description: string;
}

interface User {
  id: number;
  name: string;
}

const CapsuleDetail: React.FC = () => {
  const { id: capsuleId } = useParams<{ id: string }>();
  const [capsule, setCapsule] = useState<CapsuleDetailProps | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // State for Task Modal
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
          // Convert assignedUsers to assignedUserIds for the frontend
          const formattedTasks = tasksList.map((task: Task) => ({
            ...task,
            assignedUserIds: task.assignedUsers.map((user) => user.id),
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
    setTaskForEditing(task || null);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      if (taskForEditing) {
        // Update task
        await updateTask(parseInt(capsuleId!), taskForEditing.id, taskData);
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        await createTask(parseInt(capsuleId!), taskData);
        toast.success('Task created successfully!');
      }

      // Reload tasks
      const updatedTasks = await fetchTasksByCapsule(parseInt(capsuleId!));
      setTasks(updatedTasks);
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
        setTasks(updatedTasks);
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

      {/* Kanban Board View */}
      <KanbanBoard
        tasks={tasks}
        onTaskUpdate={(taskId, status) => {
          const updatedTask = tasks.find(task => task.id === taskId);
          if (updatedTask) {
            updateTask(parseInt(capsuleId!), taskId, { ...updatedTask, status });
            fetchTasksByCapsule(parseInt(capsuleId!)).then(setTasks);
          }
        }}
        onTaskEdit={handleOpenTaskModal} // Open modal with the task for editing
        onTaskDelete={handleDeleteTask}
      />

      {/* Task Modal */}
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        users={users}
        initialTaskData={taskForEditing}
      />
    </div>
  );
};

export default CapsuleDetail;
