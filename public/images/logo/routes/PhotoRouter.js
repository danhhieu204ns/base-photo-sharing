const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const Comment = require("../db/commentModel");
const mongoose = require("mongoose");
const isAuthenticated = require("../middleware/authentication");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

router.get("/:id", async (request, response) => {
  // Get photos by user ID
  try {
    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
        userId: request.params.id,
      });
    }

    let photos = await Photo.find({ user_id: request.params.id })
      .populate("user_id", "first_name last_name")
      .sort({ date_time: 1 });
    for (let photo of photos) {
      const comments = await Comment.find({ photo_id: photo._id }).populate(
        "user",
        "first_name last_name"
      );

      photo._doc.comments = comments;
    }

    response.status(200).json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    response.status(500).json({
      message: "Error fetching user photos",
      error: error.message,
    });
  }
});

router.delete("/:photo_id/:userId", async function (request, response) {
  try {
    const photo_id = request.params.photo_id;
    const userId = request.params.userId;
    const photo = await Photo.findOne({
      _id: photo_id,
      user_id: userId,
    });
    if (!photo) {
      return response.status(404).json({
        message: "Photo not found or you do not have permission to delete it",
      });
    }
    await Photo.deleteOne({ _id: photo_id });
    response.status(200).json({
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting photo:", error);
    response.status(500).json({
      message: "Error deleting photo",
      error: error.message,
    });
  }
});

router.post("/commentsOfPhoto/:photo_id", async function (request, response) {
  try {
    const photo_id = request.params.photo_id;
    const commentText = request.body.comment;
    const user_id = request.body.userId;

    if (!commentText || commentText.trim() === "") {
      return response.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const newComment = {
      comment: commentText,
      date_time: new Date(),
      user: user_id,
      photo_id: photo_id,
      _id: new mongoose.Types.ObjectId(),
    };

    const comment = await Comment.create(newComment);

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "first_name last_name"
    );

    response.status(200).send(populatedComment);
  } catch (error) {
    console.error("Error posting comment:", error);
    response.status(500).json({
      message: "Error posting comment",
      error: error.message,
    });
  }
});

router.put("/comment/:comment_id", async function (request, response) {
  try {
    const comment_id = request.params.comment_id;
    const commentText = request.body.comment;
    const user_id = request.body.userId;

    if (!commentText || commentText.trim() === "") {
      return response.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const comment = await Comment.findOne({
      _id: comment_id,
      user: user_id,
    });
    if (!comment) {
      return response.status(404).json({
        message: "Comment not found or you do not have permission to edit it",
      });
    }

    comment.comment = commentText;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id).populate(
      "user",
      "first_name last_name"
    );

    response.status(200).send(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    response.status(500).json({
      message: "Error updating comment",
      error: error.message,
    });
  }
});

router.delete(
  "/comment/:comment_id/:userId",
  async function (request, response) {
    try {
      const comment_id = request.params.comment_id;
      const user_id = request.params.userId;
      const comment = await Comment.find({
        _id: comment_id,
        user: user_id,
      });

      if (!comment || comment.length === 0) {
        return response.status(404).json({
          message:
            "Comment not found or you do not have permission to delete it",
          user: request.body,
        });
      }
      await Comment.deleteOne({ _id: comment_id });
      response.status(200).json({
        message: "Comment deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      response.status(500).json({
        message: "Error deleting comment",
        error: error.message,
      });
    }
  }
);

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."),
      false
    );
  }
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post("/new/:userId", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo file uploaded" });
    }

    const userId = req.params.userId;

    const newPhoto = new Photo({
      _id: new mongoose.Types.ObjectId(),
      user_id: userId,
      date_time: new Date(),
      data: req.file.buffer, // buffer từ RAM
      contentType: req.file.mimetype,
      comments: [],
    });

    await newPhoto.save();

    res.status(201).json({
      message: "Photo uploaded to MongoDB successfully",
      photo: {
        _id: newPhoto._id,
        contentType: newPhoto.contentType,
      },
    });
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).json({
      message: "Error uploading photo",
      error: error.message,
    });
  }
});

module.exports = router;
