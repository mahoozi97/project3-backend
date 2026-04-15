const express = require("express").Router();
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
    res.status(500).json(err);
  }
});
