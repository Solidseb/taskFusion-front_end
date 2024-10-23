import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchTaskDetails,
  updateTask,
  deleteTask,
  fetchComments,
  createComment,
  fetchSubtasks,
  createSubtask,
  completeTask,
  deleteSubtask,
  updateSubtask,
  fetchTaskHistory,
  fetchTasksByCapsule
} from '../services/taskService'; // Fetching task details
import { fetchUsers } from '../services/userService';
import { CircularProgress, Box, Typography, Divider, Card, Tabs, Tab } from '@mui/material'; 
import { toast } from 'react-toastify';
import TaskDetailOverview from './TaskDetailOverview';
import SubtaskTab from './SubtaskTab';
import CommentTab from './CommentTab';
import FileAttachmentTab from './FileAttachmentTab';
import TaskHistoryTab from './TaskHistoryTab'; 
import { User, Task, Comment, TaskHistory } from './types';
import { useCapsule } from '../context/CapsuleContext';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { capsuleId } = useCapsule(); 
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]); 
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState(0);  

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const loadTaskDetails = useCallback(async () => {
    setLoading(true);
    try {
      if (taskId) {
        const taskDetails = await fetchTaskDetails(parseInt(taskId));
        setTask(taskDetails);

        if (!taskDetails.parentId) {
          const subtasks = await fetchSubtasks(parseInt(taskId));
          setSubtasks(subtasks);
        }

        const taskComments = await fetchComments(parseInt(taskId));
        const structuredComments = buildCommentHierarchy(taskComments);
        setComments(structuredComments);

        const history = await fetchTaskHistory(parseInt(taskId)); 
        setTaskHistory(history);

        const availableTasks = await fetchTasksByCapsule(capsuleId!);
        setTasks(availableTasks);
      }
    } catch (error) {
      toast.error('Failed to load task details.');
    } finally {
      setLoading(false);
    }
  }, [capsuleId, taskId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUser();
    loadTaskDetails();
  }, [loadTaskDetails]);

  const buildCommentHierarchy = (comments: Comment[]) => {
    const commentMap: { [key: number]: Comment } = {};
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;

      if (comment.parentCommentId) {
        if (commentMap[comment.parentCommentId]) {
          commentMap[comment.parentCommentId].replies!.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  const handleAddComment = async () => {
    if (newComment.trim() && taskId) {
      try {
        await createComment(parseInt(taskId), newComment, currentUser.id, replyToCommentId || undefined);
        const updatedComments = await fetchComments(parseInt(taskId));
        setComments(buildCommentHierarchy(updatedComments));
        setNewComment('');
        setReplyToCommentId(null);
        toast.success('Comment added successfully!');
        loadTaskDetails();
      } catch (error) {
        toast.error('Failed to add comment.');
      }
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(capsuleId!, updatedTask.id, updatedTask);
      setTask(updatedTask);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(capsuleId!, taskId); 
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handleAddSubtask = async (subtaskData: any) => {
    try {
      await createSubtask(task!.id, capsuleId!, subtaskData); 
      const updatedSubtasks = await fetchSubtasks(task!.id);
      setSubtasks(updatedSubtasks);
      toast.success('Subtask added successfully!');
    } catch (error) {
      toast.error('Failed to add subtask.');
    }
  };

  const handleEditSubtask = (subtask: Task) => {
    setSubtasks(subtasks.map((s) => (s.id === subtask.id ? subtask : s)));
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    try {
      await deleteSubtask(subtaskId);
      setSubtasks(subtasks.filter((subtask) => subtask.id !== subtaskId));
      toast.success('Subtask deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete subtask.');
    }
  };

  const handleToggleSubtaskComplete = async (subtaskId: number, completed: boolean): Promise<boolean> => {
    try {
      const updatedSubtask =  await completeTask(subtaskId, completed);
      setSubtasks(subtasks.map((subtask) => (subtask.id === subtaskId ? updatedSubtask.task : subtask)));
      toast.success('Subtask updated successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to update subtask.');
      return false;
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean): Promise<boolean> => {
    try {
      const task = tasks.find(t => t.id === taskId);
      
      if (!task) {
        throw new Error('Task not found');
      }
      const response = await completeTask(taskId, completed);

      if (response.success) {
        toast.success('Task completed successfully!');
        setTasks(tasks.map((task) => (task.id === taskId ? response.task : task)));
        return true;
      } else if (response.blockers && response.blockers.length > 0) {
        const blockerMessages = response.blockers
          .map((blocker: { title: any; status: any; }) => `${blocker.title} (Status: ${blocker.status})`)
          .join(', ');
  
        const message = `Task cannot be completed because it is blocked by: ${blockerMessages}`;
        toast.error(message);
        return false;
      } else if (response.subtasks && response.subtasks.length > 0) {
        const blockerMessages = response.subtasks
          .map((subtasks: { title: any; status: any; }) => `${subtasks.title} (Status: ${subtasks.status})`)
          .join(', ');
  
        const message = `Task cannot be completed because the following subtask isn't completed: ${blockerMessages}`;
        toast.error(message);
        return false;
      }
    } catch (err) {
      toast.error('Failed to update task completion status');
      return false;
    }
    return false;
  };

  const handleUpdateSubtask = async (subtaskId: number, updatedSubtask: Task) => {
    try {
      const updatedSubtaskFromApi = await updateSubtask(subtaskId, updatedSubtask);
      setSubtasks(subtasks.map((subtask) =>
        subtask.id === subtaskId ? updatedSubtaskFromApi : subtask
      ));
      toast.success('Subtask updated successfully!');
    } catch (error) {
      toast.error('Failed to update subtask.');
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 3 }}>
      {task ? (
        <>
          {/* Task Header wrapped in Card */}
          <Card sx={{ padding: 3, marginBottom: 3 }}>
            <TaskDetailOverview
              task={task}
              users={users}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              handleToggleSubtaskComplete={handleToggleSubtaskComplete}
              handleToggleComplete={handleToggleComplete}
              blockersDependency={tasks.map(t => ({ id: t.id, title: t.title }))}
            />
          </Card>

          {/* Tabs for File Attachments, Comments, and History always visible */}
          <Tabs value={activeTab} onChange={handleTabChange}>
            {!task.parent_id && <Tab label="Subtasks" />}
            <Tab label="File Attachments" />
            <Tab label="Comments" />
            <Tab label="History" />
          </Tabs>

          {/* Subtasks Tab - Only visible when task is not a subtask */}
          {activeTab === 0 && !task.parent_id && (
            <SubtaskTab
              taskId={task.id}
              subtasks={subtasks}
              users={users}
              onDeleteSubtask={handleDeleteSubtask}
              onToggleSubtaskComplete={handleToggleSubtaskComplete}
              onEditSubtask={handleEditSubtask}
              onAddSubtask={handleAddSubtask}
              onUpdateSubtask={handleUpdateSubtask} // Added missing prop
            />
          )}

          {/* File Attachments Tab */}
          {activeTab === (task.parent_id ? 0 : 1) && <FileAttachmentTab taskId={task.id} />}

          {/* Comments Tab */}
          {activeTab === (task.parent_id ? 1 : 2) && (
            <CommentTab
              users={users}
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              handleAddComment={handleAddComment}
              replyToCommentId={replyToCommentId}
              setReplyToCommentId={setReplyToCommentId}
            />
          )}

          {/* Task History Tab */}
          {activeTab === (task.parent_id ? 2 : 3) && <TaskHistoryTab history={taskHistory} users={users} tasks={tasks} />}

          <Divider sx={{ my: 4 }} />
        </>
      ) : (
        <Typography variant="body2">No task found.</Typography>
      )}
    </Box>
  );
};

export default TaskDetail;
