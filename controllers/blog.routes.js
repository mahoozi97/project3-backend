const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");

//Create a new blog
router.post("/", async (req, res) => {
  try {
    const { description, image } = req.body;
    const newBlog = new Blog({
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

//get all the blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("comments.userId", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "comments.userId",
      "name email",
    );
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Update the blog

router.put("/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        description: req.body.description,
        image: req.body.image,
      },
      {
        new: true, //return the UPDATED version of the document. by default, Mongoose returns the OLD document.
      },
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Delete a blog
router.delete("/:id", async (req, res) => {
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

//ADD a comment to a blog
router.post("/:id/comments", async (req, res) => {
  try {
    const { text, userId } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({ text, userId });
    await blog.save();

    res.status(201).json();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a comment
router.delete("/:id/comments/:commentsId", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    blog.comments.pull(req.params.commentsId);
    await blog.save();
    res.status(200).json({ message: "Comment deleted successfully", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
