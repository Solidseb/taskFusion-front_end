import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCapsuleDetails } from "../services/capsuleService";
import { Box, Typography, CircularProgress } from "@mui/material";
import TaskManager from "./TaskManager";
import { User } from "./types";
import { toast } from "react-toastify";
import { fetchUserInfo } from '../services/userService';  // Import service functions

const CapsuleDetail: React.FC = () => {
  const { id: capsuleId } = useParams<{ id: string }>();
  const [capsule, setCapsule] = useState<{ title: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

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
    async function loadCapsule() {
      try {
        setLoading(true);
        if (capsuleId) {
          const capsuleDetails = await fetchCapsuleDetails(parseInt(capsuleId));
          setCapsule(capsuleDetails);
        }
      } catch (err) {
        toast.error("Failed to load capsule details.");
      } finally {
        setLoading(false);
      }
    }
    loadCapsule();
  }, [capsuleId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {/* Capsule Title and Description */}
      <Typography variant="h4">{capsule?.title}</Typography>
      <Typography variant="body1" gutterBottom>{capsule?.description}</Typography>

      {/* Task Manager */}
      <Box my={2}>
        <TaskManager capsuleId={parseInt(capsuleId!)} users={users} />
      </Box>
    </div>
  );
};

export default CapsuleDetail;
