import Thread from "../models/Thread.js";
import Reply from "../models/Reply.js";
import { getIO } from "./socket.js"; 

// @desc    Create a new thread
// @route   POST /api/threads
// @access  Private
export const createThread = async (req, res) => {
  try {
    console.log("Req body in backend is ", req.body);
    const { title, body, tags } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }

    const thread = new Thread({
      title,
      body,
      tags,
      userId: req.user._id,
      userName: req.user.username
    });

    const saved = await thread.save();

    // 🔥 Emit new thread event to all connected clients
    const io = getIO();
    io.emit("new-thread", saved);

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error creating thread", error });
  }
};

// @desc    Get all threads
// @route   GET /api/threads
// @access  Public
export const getAllThreads = async (req, res) => {
  try {
    const threads = await Thread.find().sort({ createdAt: -1 });
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching threads", error });
  }
};

// @desc    Get a single thread by ID
// @route   GET /api/threads/:id
// @access  Public
export const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ message: "Error fetching thread", error });
  }
};

// @desc    Delete a thread
// @route   DELETE /api/threads/:id
// @access  Private (Owner only)
export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    if (thread.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this thread" });
    }

    // Delete all replies linked to this thread
    await Reply.deleteMany({ threadId: thread._id });

    // Delete the thread
    await thread.deleteOne();

    res.status(200).json({ message: "Thread and its replies deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting thread", error: error.message });
  }
};

// @desc    Toggle upvote for a thread
// @route   PATCH /api/threads/:id/upvote
// @access  Private
export const toggleUpvote = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    const userId = req.user._id.toString();
    const alreadyUpvoted = thread.upvotes.includes(userId);

    if (alreadyUpvoted) {
      thread.upvotes = thread.upvotes.filter(id => id.toString() !== userId);
    } else {
      thread.upvotes.push(userId);
    }

    const updated = await thread.save();

    // 🔥 Emit updated upvote info
    const io = getIO();
    io.emit("thread-upvote", updated);

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error toggling upvote", error });
  }
};

