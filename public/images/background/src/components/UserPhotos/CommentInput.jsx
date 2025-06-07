import React, { useState } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";
import api from "../../lib/useApi";

function CommentInput({ photoId, onCommentAdded }) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    const user = localStorage.getItem("user");

    setIsSubmitting(true);
    setCommentError("");

    try {
      // console.log(user);
      const response = await api.post(`/photo/commentsOfPhoto/${photoId}`, {
        comment: newComment,
        userId: user ? JSON.parse(user)._id : null,
      });
      // console.log("res", response);

      setNewComment("");
      onCommentAdded(response.data);
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError(err.response?.data || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {commentError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {commentError}
        </Alert>
      )}

      <TextField
        fullWidth
        placeholder="Add a comment..."
        variant="outlined"
        size="small"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        disabled={isSubmitting}
        sx={{ mb: 1 }}
      />

      <Button
        variant="contained"
        color="primary"
        disabled={isSubmitting}
        onClick={handleCommentSubmit}
        sx={{ float: "right" }}
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </Box>
  );
}

export default CommentInput;
