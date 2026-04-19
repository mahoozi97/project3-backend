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

//Routes left:
//Delete a blog
router.delete("/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete();

    if (!deletedBlog) {
      return res.status(404).json("blog not found.");
    }
    res.json(500).json({ message: "Deleted blog successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//ADD a comment to a blog
router.post("/:id/comments", async (req, res) => {
  try {
    const { text, userId } = req.body;
    const addedBlog = await Blog.findById(req.params.id);

    if (!addedBlog) {
      return res.status(404);
    }

    Blog.comments.push({ text, userId });
    await Blog.save();

    res.status(201).json();
  } catch (err) {
    res.status(500);
  }
});

// DELETE a comment

module.exports = router;
