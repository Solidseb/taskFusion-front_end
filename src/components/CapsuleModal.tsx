import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

interface CapsuleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  initialTitle?: string;
  initialDescription?: string;
}

const CapsuleModal: React.FC<CapsuleModalProps> = ({ open, onClose, onSave, initialTitle = '', initialDescription = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    // Reset the fields when modal opens/closes
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [open, initialTitle, initialDescription]);

  const handleSave = () => {
    onSave(title, description);
    onClose(); // Close modal after save
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialTitle ? 'Edit Capsule' : 'Add New Capsule'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CapsuleModal;
