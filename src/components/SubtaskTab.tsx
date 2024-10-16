import React, { useState } from 'react';
import { Button } from '@mui/material';
import SubtaskList from './SubtaskList';
import TaskModal from './TaskModal';
import { Task, User } from './types';

interface SubtaskTabProps {
  taskId: number;
  subtasks: Task[];
  onDeleteSubtask: (subtaskId: number) => void;
  onToggleSubtaskComplete: (subtaskId: number, completed: boolean) => void;
  onEditSubtask: (subtask: Task) => void;
  onAddSubtask: (taskData: any) => Promise<void>;
  onUpdateSubtask: (taskId: number, updatedSubtask: Task) => Promise<void>; // New prop for updating a subtask
  users: User[];
}

const SubtaskTab: React.FC<SubtaskTabProps> = ({
  subtasks,
  onDeleteSubtask,
  onToggleSubtaskComplete,
  onEditSubtask,
  onAddSubtask,
  onUpdateSubtask, // Use this for updating an edited subtask
  users,
}) => {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [subtaskForEditing, setSubtaskForEditing] = useState<Task | null>(null);

  const handleAddSubtask = () => {
    setSubtaskForEditing(null); // Reset to null to indicate it's a new subtask
    setTaskModalOpen(true);
  };

  const handleEditSubtask = (subtask: Task) => {
    setSubtaskForEditing(subtask); // Set the subtask for editing
    setTaskModalOpen(true); // Open modal in edit mode
  };

  const handleSaveTaskOrSubtask = async (taskData: any) => {
    try {
      if (subtaskForEditing) {
        await onUpdateSubtask(subtaskForEditing.id, { ...subtaskForEditing, ...taskData });
      } else {
        await onAddSubtask(taskData); // Add a new subtask if not editing
      }
      setTaskModalOpen(false);
    } catch (error) {
      console.error('Failed to save subtask:', error);
    }
  };

  return (
    <>
      <SubtaskList
        subtasks={subtasks}
        onDeleteSubtask={onDeleteSubtask}
        onToggleSubtaskComplete={onToggleSubtaskComplete}
        onEditSubtask={handleEditSubtask} // Pass the correct edit handler
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddSubtask} // Add new subtask
        sx={{ mt: 2 }}
      >
        Add Subtask
      </Button>
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTaskOrSubtask}
        users={users}
        initialTaskData={subtaskForEditing || undefined} // Preload data if editing
      />
    </>
  );
};

export default SubtaskTab;
