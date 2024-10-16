import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography } from '@mui/material';

interface FileAttachmentTabProps {
  taskId: number;
}

const FileAttachmentTab: React.FC<FileAttachmentTabProps> = ({ taskId }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <Box mt={2}>
      <Typography variant="h6">Attach Files</Typography>
      <Button variant="contained" component="label">
        Upload File
        <input hidden accept="image/*,application/pdf" multiple type="file" onChange={handleFileChange} />
      </Button>

      <List>
        {files.map((file, index) => (
          <ListItem key={index}>
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FileAttachmentTab;
