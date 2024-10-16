import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskDetails, updateTask, deleteTask, fetchComments, createComment, fetchSubtasks, createSubtask, completeTask, deleteSubtask } from '../services/taskService';
import { fetchUsers } from '../services/userService';
import { CircularProgress, Box, Typography, Button, Divider, Card } from '@mui/material';
import { toast } from 'react-toastify';
import TaskDetailOverview from './TaskDetailOverview';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { User, Task, Comment } from './types';
import dayjs from 'dayjs';
import SubtaskList from './SubtaskList';
import TaskModal from './TaskModal';
import { useCapsule } from '../context/CapsuleContext'; // Import the useCapsule hook

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { capsuleId } = useCapsule(); 
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subtasks, setSubtasks] = useState<Task[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [subtaskForEditing, setSubtaskForEditing] = useState<Task | null>(null);  // State for editing subtask

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

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
  }, []);

  useEffect(() => {
    const loadTaskDetails = async () => {
      setLoading(true);
      try {
        if (taskId) {
          const taskDetails = await fetchTaskDetails(parseInt(taskId));
          setTask(taskDetails);

          // Only fetch subtasks if the current task is not a subtask itself
          if (!taskDetails.parentId) {
            const subtasks = await fetchSubtasks(parseInt(taskId));
            setSubtasks(subtasks);
          }

          const taskComments = await fetchComments(parseInt(taskId));
          const structuredComments = buildCommentHierarchy(taskComments);
          setComments(structuredComments);
        }
      } catch (error) {
        toast.error('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };
    loadTaskDetails();
  }, [taskId]);

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(capsuleId!, updatedTask.id, updatedTask); // Use capsuleId from context
      setTask(updatedTask);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(capsuleId!, taskId); // Use capsuleId from context
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handleAddSubtask = async (taskId: number, subtaskData: any) => {
    try {
      await createSubtask(taskId, capsuleId!, subtaskData.title); // Use capsuleId from context
      const updatedSubtasks = await fetchSubtasks(taskId);
      setSubtasks(updatedSubtasks);
      toast.success('Subtask added successfully!');
    } catch (error) {
      toast.error('Failed to add subtask.');
    }
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

  const handleToggleSubtaskComplete = async (subtaskId: number, completed: boolean) => {
    try {
      const updatedSubtask =  await completeTask(subtaskId, completed);
      setSubtasks(subtasks.map((subtask) => (subtask.id === subtaskId ? updatedSubtask : subtask)));
      toast.success('Subtask updated successfully!');
    } catch (error) {
      toast.error('Failed to update subtask.');
    }
  };

  // Handle subtask editing
  const handleEditSubtask = (subtask: Task) => {
    setSubtaskForEditing(subtask);
    setTaskModalOpen(true);
  };

  const handleSaveTaskOrSubtask = async (taskData: any) => {
    try {
      if (subtaskForEditing) {
        // Use PUT to update the existing subtask
        await updateTask(capsuleId!, subtaskForEditing.id, { ...subtaskForEditing, ...taskData });
        setSubtasks(subtasks.map((subtask) => (subtask.id === subtaskForEditing.id ? { ...subtask, ...taskData } : subtask)));
        setSubtaskForEditing(null);
      } else {
        // Create a new subtask (Use POST)
        await handleAddSubtask(task!.id, taskData);
      }
      toast.success(subtaskForEditing ? 'Subtask updated successfully!' : 'Subtask added successfully!');
      setTaskModalOpen(false);
    } catch (error) {
      toast.error('Failed to save subtask.');
    }
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
      } catch (error) {
        toast.error('Failed to add comment.');
      }
    }
  };

  const getAuthorName = (authorId: number) => {
    const user = users.find((user) => user.id === authorId);
    return user ? user.name : 'Unknown';
  };

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

  const renderComments = (commentsList: Comment[]) => {
    return commentsList.map((comment) => (
      <Box
        key={comment.id}
        mt={2}
        p={1}
        border="1px solid #ccc"
        borderRadius={1}
        style={{ marginLeft: comment.parentCommentId ? '20px' : '0px' }}
      >
        <Typography variant="body2">
          <strong>{getAuthorName(comment.author)}</strong> at {new Date(comment.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: comment.text }} />
        <Button size="small" onClick={() => setReplyToCommentId(comment.id)}>
          Reply
        </Button>
        {comment.replies && comment.replies.length > 0 && (
          <Box ml={2}>{renderComments(comment.replies)}</Box>
        )}
      </Box>
    ));
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
            />
          </Card>

          {!task.parent_id && (
            <>
              <Typography variant="h5" gutterBottom>
                Subtasks
              </Typography>

              <SubtaskList
                subtasks={subtasks}
                onDeleteSubtask={handleDeleteSubtask}
                onToggleSubtaskComplete={handleToggleSubtaskComplete}
                onEditSubtask={handleEditSubtask}  // Pass the subtask edit handler here
              />

              <Button
                variant="contained"
                color="primary"
                onClick={() => setTaskModalOpen(true)}
                sx={{ mt: 2 }}
              >
                Add Subtask
              </Button>

              <TaskModal
                open={taskModalOpen}
                onClose={() => setTaskModalOpen(false)}
                onSave={handleSaveTaskOrSubtask}  // General handler for both task and subtask
                users={users}
                initialTaskData={subtaskForEditing || undefined}  // Preload the subtask if editing
              />
            </>
          )}

          {task.completedDate && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Completed on: {dayjs(task.completedDate).format('MMMM D, YYYY')}
            </Typography>
          )}

          <Divider sx={{ my: 4 }} />
          <Box mt={2}>
            <Typography variant="h6">Comments</Typography>
            {comments.length > 0 ? renderComments(comments) : <Typography variant="body2">No comments yet.</Typography>}

            <ReactQuill
              value={newComment}
              onChange={setNewComment}
              theme="snow"
              placeholder="Add a comment..."
              modules={{
                toolbar: [
                  [{ header: '1' }, { header: '2' }, { font: [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
              formats={['header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'strike', 'link', 'image']}
            />
            <Button variant="contained" onClick={handleAddComment} disabled={!newComment.trim()} sx={{ mt: 2 }}>
              {replyToCommentId ? 'Post Reply' : 'Post Comment'}
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body2">No task found.</Typography>
      )}
    </Box>
  );
};

export default TaskDetail;
