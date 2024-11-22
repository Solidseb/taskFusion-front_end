import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Comment, User } from '../types/types';

interface CommentTabProps {
  users: User[];
  comments: Comment[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: () => void;
  replyToCommentId: number | null;
  setReplyToCommentId: React.Dispatch<React.SetStateAction<number | null>>;
}

const CommentTab: React.FC<CommentTabProps> = ({
  users,
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  replyToCommentId,
  setReplyToCommentId,
}) => {

    const getAuthorName = (authorId: string) => {
        const user = users.find((user) => user.id === authorId);
        return user ? user.name : 'Unknown';
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

  return (
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
      <Button
        variant="contained"
        onClick={handleAddComment}
        disabled={!newComment.trim()}
        sx={{ mt: 2 }}
      >
        {replyToCommentId ? 'Post Reply' : 'Post Comment'}
      </Button>
    </Box>
  );
};

export default CommentTab;
