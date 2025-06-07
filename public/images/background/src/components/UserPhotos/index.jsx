import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Divider,
  List,
  Paper,
  Avatar,
  Stack,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/useApi";
import "./styles.css";
import CommentInput from "./CommentInput";

function UserPhotos() {
  const [reload, setReload] = useState(false);
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [openDeleteCommentDialog, setOpenDeleteCommentDialog] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [openEditCommentDialog, setOpenEditCommentDialog] = useState(false);
  const [editedCommentText, setEditedCommentText] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    fetchCurrentUser();
  }, []);

  const handleDeleteClick = (photo) => {
    setPhotoToDelete(photo);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPhotoToDelete(null);
  };

  const getImageSrc = (photo) => {
    if (photo.file_name) {
      return `/images/${photo.file_name}`;
    }

    if (photo.data && photo.contentType) {
      const binary = photo.data.data
        .map((byte) => String.fromCharCode(byte))
        .join("");
      const base64 = btoa(binary);
      return `data:${photo.contentType};base64,${base64}`;
    }

    return "/images/default.jpg";
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;

    try {
      await api.delete(`/photo/${photoToDelete._id}/${userId}`);
      setPhotos(photos.filter((photo) => photo._id !== photoToDelete._id));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting photo:", error);
    }
  };

  const handleDeleteCommentClick = (commentId) => {
    setCommentToDelete({ commentId });
    setOpenDeleteCommentDialog(true);
  };

  const handleCloseDeleteCommentDialog = () => {
    setOpenDeleteCommentDialog(false);
    setCommentToDelete(null);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      //   console.log(user);
      await api.delete(
        `/photo/comment/${commentToDelete.commentId}/${user._id}`
      );

      setReload(true);
      handleCloseDeleteCommentDialog();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditCommentClick = (photoId, comment) => {
    setCommentToEdit({ photoId, commentId: comment._id });
    setEditedCommentText(comment.comment);
    setOpenEditCommentDialog(true);
  };

  const handleCloseEditCommentDialog = () => {
    setOpenEditCommentDialog(false);
    setCommentToEdit(null);
    setEditedCommentText("");
  };

  const handleEditComment = async () => {
    if (!commentToEdit || !editedCommentText.trim()) return;

    try {
      await api.put(`/photo/comment/${commentToEdit.commentId}`, {
        comment: editedCommentText,
        userId: user._id,
      });
      setReload(true);
      handleCloseEditCommentDialog();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await api.get(`/user/${userId}`);
      // console.log('Fetched user details:', userData);
      setUser(userData.data);
    } catch (error) {
      console.error("Error loading user details:", error);
      setError("Failed to load user details. Please try again later.");
      setLoading(false);
    }
  };

  const fetchPhotosData = async () => {
    try {
      const photosData = await api.get(`/photo/${userId}`);
      // console.log('Fetched user photos:', photosData);
      setPhotos(photosData.data);
    } catch (error) {
      console.error("Error loading user photos:", error);
      setError("Failed to load photos. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserData();
    fetchPhotosData();
    setLoading(false);
    setReload(false);
  }, [userId, reload]);

  if (loading) {
    return (
      <Box
        className="photo-container"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "300px" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h5" color="error">
        {error}
      </Typography>
    );
  }

  if (!user) {
    return (
      <Typography variant="h5" color="error">
        User not found
      </Typography>
    );
  }

  if (!photos || photos.length === 0) {
    return (
      <Typography variant="h5">
        No photos found for {user.first_name} {user.last_name}
      </Typography>
    );
  }

  const formatDateTime = (dateTimeStr) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTimeStr).toLocaleDateString(undefined, options);
  };

  return (
    <Box className="photo-container">
      <Typography variant="h4" gutterBottom className="photo-page-title">
        Photos by {user.first_name} {user.last_name}
      </Typography>

      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} key={photo._id}>
            {/* {console.log('Rendering photo:', photo)} */}
            <Card elevation={3} className="photo-card">
              {/* {console.log(photo)} */}
              <CardMedia
                component="img"
                image={getImageSrc(photo)}
                alt={`Photo by ${photo.user_id.first_name}`}
                className="photo-image"
              />
              {/* {photo.user_id._id === currentUser._id && (
                <Button
                  variant="outlined"
                  color="error"
                  className="delete-photo-button"
                  onClick={() => handleDeleteClick(photo)}
                >
                  Delete
                </Button>
              )} */}
              <CardContent>
                {/* <Typography variant="body2" className="photo-date">
                                    {formatDateTime(photo.date_time)}
                                </Typography> */}

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" className="comments-title">
                  Comments ({photo.comments ? photo.comments.length : 0})
                </Typography>

                {photo.comments && photo.comments.length > 0 ? (
                  <List className="comments-section">
                    {photo.comments.map((comment) => (
                      <Paper
                        elevation={1}
                        className="comment-item"
                        sx={{ p: 2 }}
                        key={comment._id}
                      >
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Avatar className="comment-avatar" />
                          <Box sx={{ flex: 1 }}>
                            <Link
                              to={`/users/${comment.user?._id || "0"}`}
                              className="comment-user-link"
                            >
                              {comment.user?.first_name || ""}{" "}
                              {comment.user?.last_name || ""}
                            </Link>
                            {/* <Typography variant="caption" display="block" className="comment-date">
                                                            {formatDateTime(comment.date_time)}
                                                        </Typography> */}
                            <Typography
                              variant="body1"
                              className="comment-text"
                            >
                              {comment.comment}
                            </Typography>
                            {/* {currentUser._id === comment.user._id && (
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  size="small"
                                  onClick={() =>
                                    handleEditCommentClick(photo._id, comment)
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleDeleteCommentClick(comment._id)
                                  }
                                >
                                  Delete
                                </Button>
                              </Stack>
                            )} */}
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2">
                    No comments for this photo
                  </Typography>
                )}

                <CommentInput
                  photoId={photo._id}
                  onCommentAdded={(newComment) => {
                    setReload(true);
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this photo? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePhoto} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteCommentDialog}
        onClose={handleCloseDeleteCommentDialog}
        aria-labelledby="delete-comment-dialog-title"
        aria-describedby="delete-comment-dialog-description"
      >
        <DialogTitle id="delete-comment-dialog-title">
          Confirm Delete Comment
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-comment-dialog-description">
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteCommentDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteComment} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEditCommentDialog}
        onClose={handleCloseEditCommentDialog}
        aria-labelledby="edit-comment-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="edit-comment-dialog-title">Edit Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="comment"
            label="Comment"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={editedCommentText}
            onChange={(e) => setEditedCommentText(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditCommentDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleEditComment}
            color="primary"
            disabled={!editedCommentText.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserPhotos;
