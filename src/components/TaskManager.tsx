import React, { useEffect, useState, useCallback } from "react";
import TaskList from "./TaskList";
import TaskModal from "./TaskModal";
import { fetchTasksByCapsule, createTask, updateTask, deleteTask, completeTask } from "../services/taskService";
import { Tag, Task, User } from "../types/types";
import { toast } from "react-toastify";
import { useCapsule } from '../context/CapsuleContext'; // Use CapsuleContext

const TaskManager: React.FC<{ users: User[], tags: Tag[] }> = ({ users, tags }) => {
  const { capsuleId } = useCapsule(); // Get capsuleId from context
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForEditing, setTaskForEditing] = useState<Task | null>(null);

  // Memoize loadTasks using useCallback to prevent re-creation on every render
  const loadTasks = useCallback(async () => {
    if (!capsuleId) return; // Ensure capsuleId is available

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
    if (!capsuleId) return; // Ensure capsuleId is available

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
    if (!capsuleId) return; // Ensure capsuleId is available

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

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      // Check if all subtasks are completed before allowing the task to be marked as completed
      if (completed && (task.subtasks?.some(subtask => subtask.status !== 'COMPLETED') ?? false)) {
        toast.error("Cannot complete task because not all subtasks are completed.");
        return;
      }
      // Send request to the backend to update the completion status and completedDate
      const response = await completeTask(taskId, completed);

      if (response.success) {
        toast.success('Task completed successfully!');
      } else if (response.blockers && response.blockers.length > 0) {
        // If the task is blocked, create a user-friendly message
        const blockerMessages = response.blockers
          .map((blocker: { title: any; status: any; }) => `${blocker.title} (Status: ${blocker.status})`)
          .join(', ');
  
        const message = `Task cannot be completed because it is blocked by: ${blockerMessages}`;
        
        // Show the message to the user, e.g., using a toast
        toast.error(message);
      }
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
        tags={tags}
        initialTaskData={taskForEditing}
      />
    </>
  );
};

export default TaskManager;
