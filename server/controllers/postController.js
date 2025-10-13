// controllers/postController.js
import Post from "../models/Post.js";
import fs from "fs";
import slugify from "slugify";
import { v2 as cloudinary } from "cloudinary";
import { getIO } from "./socket.js"; // ✅ import socket instance

export const createPost = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const slug = req.body.slug || slugify(title || "", { lower: true });

    if (!title || !slug || !content) return res.status(400).json({ message: "Missing required fields" });

    const existing = await Post.findOne({ slug });
    if (existing) return res.status(400).json({ message: "Slug already exists" });

    const featuredImage = req.file?.path || "";
    const featuredImageId = req.file?.filename || "";

    const post = await Post.create({
      title,
      slug,
      content,
      status: status || "active",
      userId: req.user._id,
      userName: req.user.username,
      featuredImage,
      featuredImageId,
    });

    // 🔔 Emit real-time event to all clients
    const io = getIO();
    io.emit("new-post", post);

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err.message });
  }
};


export const updatePost = async (req, res) => {
  try {
    const { title, slug, content, status } = req.body;
    const postId = req.params.id;

    console.log("Post to be updated id is:", postId);

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔒 Authorization: only owner can update
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ If a new image is uploaded
    if (req.file) {
      // delete old image from Cloudinary
      if (post.featuredImageId) {
        try {
          await cloudinary.uploader.destroy(post.featuredImageId);
          console.log("Old Cloudinary image deleted:", post.featuredImageId);
        } catch (err) {
          console.log("⚠️ Failed to delete old image:", err.message);
        }
      }

      // save new Cloudinary URL + public_id
      post.featuredImage = req.file.path;       // secure_url
      post.featuredImageId = req.file.filename; // public_id
    }

    // ✅ Update other fields (keep old values if not sent)
    post.title = title ?? post.title;
    post.slug = slug ?? post.slug;
    post.content = content ?? post.content;
    post.status = status ?? post.status;

    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    console.error("❌ Update post error:", err);
    return res.status(500).json({
      message: "Failed to update post",
      error: err.message,
    });
  }
};



export const toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log("Post is",post);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length, likedByUser: index === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle like', error: err.message });
  }
};


// GET all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};


export const getPostBySlug = async (req, res) => {
  console.log("Server side req data received:", req.params);
  console.log("req.params.slug:", req.params.slug);

  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .select("-featuredImageId"); // hide internal Cloudinary id

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ 
      message: "Failed to fetch post", 
      error: err.message 
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    console.log("Delete request for id:", req.params.id);

    const post = await Post.findById(req.params.id);
    console.log("Post to be deleted is", post);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // ✅ Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ Delete image from Cloudinary if exists
    if (post.featuredImageId) {
      try {
        await cloudinary.uploader.destroy(post.featuredImageId);
        console.log("Cloudinary image deleted:", post.featuredImageId);
      } catch (err) {
        console.log("Failed to delete Cloudinary image:", err.message);
      }
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Failed to delete post", error: err.message });
  }
};


export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    // Find the post by ID and only return comments
    const post = await Post.findById(postId).select("comments");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};


export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = {
      userId: req.user._id,
      userName: req.user.username,
      text,
    };

    post.comments.unshift(comment); // add to top
    await post.save();

    // 🔔 Emit comment to all clients in post room
    const io = getIO();
    io.to(post._id.toString()).emit("receive-comment", comment);

    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      post.userId.toString() !== userId.toString() &&
      comment.userId.toString() !== userId.toString()
    ) return res.status(403).json({ message: "Not authorized to delete this comment" });

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();

    // 🔔 Emit comment deletion event
    const io = getIO();
    io.to(postId).emit("delete-comment", commentId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting comment", error: error.message });
  }
};