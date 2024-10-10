import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskDetails, updateTask, deleteTask, fetchComments, createComment } from '../services/taskService';
import { CircularProgress, Box, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import TaskDetailOverview from './TaskDetailOverview';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchUserInfo } from '../services/userService';  // Import service functions

// Interfaces for User, Task, and Comment
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

interface Comment {
  id: number;
  text: string;
  author: number;
  createdAt: string;
  parentCommentId?: number;
  replies?: Comment[];
}

interface TaskDetailProps {
  capsuleId: number;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ capsuleId }) => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Get the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch all users when component mounts
  useEffect(() => {
    const fetchUser = async () => {
     
      try {
        const response = await fetchUserInfo();
        setUsers(response);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUser();
  }, []);


  useEffect(() => {
    const loadTask = async () => {
      setLoading(true);
      try {
        if (taskId) {
          const taskDetails = await fetchTaskDetails(parseInt(taskId));
          setTask(taskDetails);
          // Load comments for the task
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
    loadTask();
  }, [taskId]);

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(capsuleId, updatedTask.id, updatedTask);
      setTask(updatedTask);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(capsuleId, taskId);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() && taskId) {
      try {
        await createComment(
          parseInt(taskId),
          newComment,
          currentUser.id,
          replyToCommentId || undefined
        );
        const updatedComments = await fetchComments(parseInt(taskId)); // Fetch updated comments
        setComments(buildCommentHierarchy(updatedComments));
        setNewComment('');
        setReplyToCommentId(null);
        toast.success('Comment added successfully!');
      } catch (error) {
        toast.error('Failed to add comment.');
      }
    }
  };

  // Map author ID to user name
  const getAuthorName = (authorId: number) => {
    const user = users.find((user) => user.id === authorId);
    return user ? user.name : 'Unknown';
  };

  // Build a nested structure for comments
  const buildCommentHierarchy = (comments: Comment[]) => {
    const commentMap: { [key: number]: Comment } = {};
    const rootComments: Comment[] = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment.id] = comment;

      // If the comment has a parent, add it to its parent's replies
      if (comment.parentCommentId) {
        if (commentMap[comment.parentCommentId]) {
          commentMap[comment.parentCommentId].replies!.push(comment);
        }
      } else {
        // If no parent, it's a root comment
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  // Render comments recursively
  const renderComments = (commentsList: Comment[]) => {
    return commentsList.map((comment) => (
      <Box
        key={comment.id}
        mt={2}
        p={1}
        border="1px solid #ccc"
        style={{ marginLeft: comment.parentCommentId ? '20px' : '0px' }}
      >
        <Typography variant="body2">
          <strong>{getAuthorName(Number(comment.author))}</strong> at{' '}
          {new Date(comment.createdAt).toLocaleString()}
        </Typography>
        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: comment.text }} />
        {/* Button to reply */}
        <Button size="small" onClick={() => setReplyToCommentId(comment.id)}>
          Reply
        </Button>
        {/* Render replies if available */}
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
          {/* Task Overview */}
          <TaskDetailOverview
            task={task}
            users={users} // Pass users as prop to TaskDetailOverview
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />

          {/* Comments Section */}
          <Box mt={4}>
            <Typography variant="h6">Comments</Typography>
            {comments.length > 0 ? (
              renderComments(comments)
            ) : (
              <Typography variant="body2">No comments yet.</Typography>
            )}

            {/* Add New Comment */}
            <ReactQuill
              value={newComment}
              onChange={setNewComment}
              theme="snow"
              placeholder="Add a comment..."
              modules={{
                toolbar: [
                  [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
              formats={[
                'header', 'font', 'list', 'bullet', 
                'bold', 'italic', 'underline', 'strike',
                'link', 'image'
              ]}
            />
            <Button variant="contained" onClick={handleAddComment} disabled={!newComment.trim()}>
              {replyToCommentId ? 'Post Reply' : 'Post Comment'}
            </Button>
          </Box>
        </>
      ) : (
        <p>No task found.</p>
      )}
    </Box>
  );
};

export default TaskDetail;
