const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
// FIX: verifyToken was used throughout but never imported
const verifyToken = require("../middleware/verify-token");

// Create a new blog
router.post("/", verifyToken, async (req, res) => {
  try {
    // FIX: added title — was missing, causes validation error since it's required in schema
    const { title, description, image } = req.body;
    const newBlog = new Blog({
      title,
      description,
      image,
      comments: [],
    });
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("comments.userId", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "comments.userId",
      "name email"
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a blog
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        // FIX: added title — was missing, so editing a blog would wipe the title
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
      },
      {
        new: true, // return the updated document, not the old one
      }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a blog
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(200).json({ message: "Deleted blog successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a comment to a blog
router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    // FIX: get userId from the verified token (req.user), not from req.body
    // Trusting userId from the client body is a security issue — any user
    // could claim to be someone else
    const userId = req.user._id;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({ text, userId });
    await blog.save();

    // FIX: was returning empty json() — now returns the updated blog
    // so the frontend can re-render comments without a separate refetch
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment
router.delete("/:id/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // FIX: use .id() to find the subdocument, then .deleteOne()
    // blog.comments.pull(id) can silently fail for subdocument arrays
    const comment = blog.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.deleteOne();
    await blog.save();

    res.status(200).json({ message: "Comment deleted successfully", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;