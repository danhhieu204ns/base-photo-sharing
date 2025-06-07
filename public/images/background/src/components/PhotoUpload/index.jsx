import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from "../../lib/useApi";
import "./styles.css";

function PhotoUploadModal({ open, onClose, userId, onPhotoAdded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    setError("");
    setSuccess(false);

    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("photo", selectedFile);

      const response = await api.post(`/photo/new/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);

      if (onPhotoAdded) {
        onPhotoAdded(response.data.photo);
      }

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);

      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError(
        err.response?.data?.message ||
          "Failed to upload photo. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload New Photo</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Photo uploaded successfully!
          </Alert>
        )}

        <Box className="upload-container">
          <input
            accept="image/*"
            className="upload-input"
            id="upload-photo-button"
            type="file"
            onChange={handleFileChange}
            disabled={loading}
          />
          <label htmlFor="upload-photo-button">
            <Button
              variant="outlined"
              component="span"
              //   startIcon={<CloudUploadIcon />}
              disabled={loading}
              className="upload-button"
            >
              Select Photo
            </Button>
          </label>

          {previewUrl && (
            <Box className="preview-container">
              <Typography variant="subtitle1" gutterBottom>
                Preview:
              </Typography>
              <img src={previewUrl} alt="Preview" className="preview-image" />
            </Box>
          )}

          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          disabled={!selectedFile || loading}
          variant="contained"
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PhotoUploadModal;
