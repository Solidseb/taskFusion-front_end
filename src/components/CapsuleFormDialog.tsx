import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';

interface CapsuleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string; dueDate?: string; newDueDate?: string }) => Promise<void>;
  capsule: Capsule | null; // Accept the capsule for editing
}

interface Capsule {
  id?: number;
  title: string;
  description: string;
  dueDate: string; // Set at creation
  newDueDate?: string; // Editable when updating
}

const CapsuleFormDialog: React.FC<CapsuleFormDialogProps> = ({ open, onClose, onSave, capsule }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Populate form fields if capsule is passed (for editing)
  useEffect(() => {
    if (capsule) {
      setTitle(capsule.title);
      setDescription(capsule.description);
      setDueDate(capsule.dueDate);  // Set for display, but not editable in editing mode
      setNewDueDate(capsule.newDueDate || ''); // Editable only in editing mode
    } else {
      // Reset form fields when creating a new capsule
      setTitle('');
      setDescription('');
      setDueDate('');
      setNewDueDate('');
    }
  }, [capsule]);

  const handleSave = () => {
    // Pass the form data back to the parent component
    const data = {
      title,
      description,
      ...(capsule ? { newDueDate } : { dueDate }), // Only set newDueDate during editing, dueDate during creation
    };
    onSave(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{capsule ? 'Edit Capsule' : 'Create New Capsule'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {!capsule && (
          <TextField
            margin="dense"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
        {capsule && (
          <TextField
            margin="dense"
            label="New Due Date"
            type="date"
            fullWidth
            variant="outlined"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          {capsule ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CapsuleFormDialog;
