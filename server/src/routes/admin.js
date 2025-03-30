const express = require("express");
const multer = require("multer");
const path = require("path");
const Post = require("../models/Post");

const router = express.Router();

// Set up image storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Admin post creation
router.post("/create-post", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = new Post({ title, content, imageUrl });
    await newPost.save();
    res.status(201).send("Post created successfully");
  } catch (error) {
    res.status(500).send("Error creating post");
  }
});

module.exports = router;
