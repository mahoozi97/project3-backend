const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const blogSchema = mongoose.Schema({
  // FIX: added title field — was missing from schema entirely,
  // causing a validation error whenever a blog was created
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  comments: [commentSchema],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;