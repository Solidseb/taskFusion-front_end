import React, { useEffect, useState, useCallback } from "react";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import { fetchTasksByCapsule, createTask, updateTask, deleteTask } from "../services/taskService";
import axios from "axios";
import { Task, User } from "./types";
import { toast } from "react-toastify";
import dayjs from "dayjs";

interface TaskManagerProps {
  capsuleId: number;
  users: User[];
}

const TaskManager: React.FC<TaskManagerProps> = ({ capsuleId, users }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForEditing, setTaskForEditing] = useState<Task | null>(null);

  // Memoize loadTasks using useCallback to prevent re-creation on every render
  const loadTasks = useCallback(async () => {
    try {
      const tasksList = await fetchTasksByCapsule(capsuleId);
      const formattedTasks = tasksList.map((task: Task) => ({
        ...task,
        taskName: task.title,
        assignedUserIds: task.assignedUsers,
      }));
      setTasks(formattedTasks);
    } catch (err) {
      toast.error('Failed to load tasks.');
    }
  }, [capsuleId]);

  // Load tasks when the component mounts or when capsuleId changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Open task modal for adding a new task
  const handleAddTask = () => {
    setTaskForEditing(null); // Clear editing task to indicate a new task creation
    setTaskModalOpen(true);  // Open the task modal
  };

  // Open task modal for editing an existing task
  const handleOpenTaskModal = (task?: Task) => {
    const taskDataForModal = task
      ? { ...task, assignedUserIds: task.assignedUsers.map((user: { id: any }) => user.id) }
      : null;
    setTaskForEditing(taskDataForModal);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      if (taskForEditing) {
        // Update existing task
        await updateTask(capsuleId, taskForEditing.id, taskData);
        toast.success("Task updated successfully!");
      } else {
        // Create new task
        await createTask(capsuleId, taskData);
        toast.success("Task created successfully!");
      }
      loadTasks(); // Refresh tasks after saving
    } catch (err) {
      toast.error("Failed to save task.");
    } finally {
      setTaskModalOpen(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(capsuleId, taskId);
        loadTasks();
        toast.success("Task deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete task.");
      }
    }
  };

  // Handle task completion and update the completedDate in the backend
  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      // Send request to the backend to update the completion status and completedDate
      await axios.put(`http://localhost:3000/tasks/${taskId}/completion`, {
        completed,
        completedDate: completed ? dayjs().toISOString() : null, // Set completedDate to the current date or clear it
      });

      toast.success(`Task marked as ${completed ? 'completed' : 'not completed'}`);
      
      // Refresh task list
      loadTasks();
    } catch (err) {
      toast.error('Failed to update task completion status');
    }
  };

  return (
    <>
      <TaskList
        tasks={tasks}
        onDelete={handleDeleteTask}
        onEdit={handleOpenTaskModal}
        onToggleComplete={handleToggleComplete}
        onAddTask={handleAddTask} 
        users={users}
      />
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        users={users}
        initialTaskData={taskForEditing}
      />
    </>
  );
};

export default TaskManager;
