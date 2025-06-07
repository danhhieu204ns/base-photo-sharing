import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/useApi";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = currentUser?._id === userId;

  const fetchUserDetails = async (userId) => {
    try {
      const res = await api.get(`/user/${userId}`);
      setUser(res.data);
      setEditUser(res.data); // Copy data để edit
      setLoading(false);
    } catch (err) {
      console.error("Error loading user details:", err);
      setError("Failed to load user details.");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/user/${userId}`, editUser);
      setUser(editUser); // cập nhật lại UI
      setEditMode(false);
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user info.");
    }
  };

  useEffect(() => {
    fetchUserDetails(userId);
  }, [userId]);

  if (loading) {
    return (
      <Box
        className="user-detail-container"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Typography variant="h5" color="error">
        {error || "User not found"}
      </Typography>
    );
  }

  return (
    <Box className="user-detail-container">
      <Card className="user-detail-card" elevation={3}>
        <Box className="user-detail-header">
          <Avatar className="user-detail-avatar" />
          <div>
            {editMode ? (
              <>
                <TextField
                  label="First Name"
                  value={editUser.first_name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, first_name: e.target.value })
                  }
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Last Name"
                  value={editUser.last_name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, last_name: e.target.value })
                  }
                  sx={{ ml: 2, mb: 1 }}
                />
              </>
            ) : (
              <Typography variant="h4" gutterBottom>
                {user.first_name} {user.last_name}
              </Typography>
            )}
            <Chip
              label={user.occupation || ""}
              sx={{
                color: "black",
                backgroundColor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            />
          </div>
        </Box>

        <CardContent className="user-detail-content">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {editMode ? (
                <TextField
                  label="Location"
                  fullWidth
                  value={editUser.location}
                  onChange={(e) =>
                    setEditUser({ ...editUser, location: e.target.value })
                  }
                />
              ) : (
                <Typography variant="subtitle1">
                  Location: {user.location || "No location provided"}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">About</Typography>
              {editMode ? (
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  value={editUser.description}
                  onChange={(e) =>
                    setEditUser({ ...editUser, description: e.target.value })
                  }
                />
              ) : (
                <Paper elevation={1} sx={{ p: 2, backgroundColor: "#f9f9f9" }}>
                  <Typography variant="body1">
                    {user.description || "No description provided"}
                  </Typography>
                </Paper>
              )}
            </Grid>

            <Grid item xs={12} display="flex" gap={2}>
              <Button
                variant="contained"
                component={Link}
                to={`/photos/${userId}`}
                className="user-detail-button"
              >
                View Photos
              </Button>

              {/* {isOwner && !editMode && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              )} */}

              {editMode && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserDetail;
