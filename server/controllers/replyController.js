import Reply from "../models/Reply.js";
import Thread from "../models/Thread.js"; 
import { getIO } from "../controllers/socket.js";

// Create a reply (with Socket.IO)
export const postReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { threadId } = req.params;

    const thread = await Thread.findById(threadId);
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Reply content cannot be empty" });
    }

    const newReply = new Reply({
      threadId,
      userId: req.user._id,
      userName: req.user.username,
      content,
    });

    await newReply.save();
    const io = getIO();
    // ✅ Emit to room so all connected clients get the new reply in real-time
    io?.to(threadId).emit("receive-reply", newReply);

    res.status(201).json(newReply);
  } catch (err) {
    console.error("Error creating reply:", err);
    res.status(500).json({ message: "Failed to create reply", error: err.message });
  }
};


// Get all replies (no real-time needed)
export const getRepliesByThreadId = async (req, res) => {
  try {
    const { threadId } = req.params;
    const replies = await Reply.find({ threadId }).sort({ createdAt: -1 });
    res.status(200).json(replies);
  } catch (err) {
    console.error("Error fetching replies:", err);
    res.status(500).json({ message: "Failed to fetch replies" });
  }
};


export const deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    // ✅ Only the creator can delete
    const isOwner = reply.userId.toString() === req.user._id.toString();
    if (!isOwner) return res.status(403).json({ message: "Unauthorized" });

    await reply.deleteOne();

    // ✅ Emit delete event to the thread room
    const io = getIO();
    io.to(reply.threadId.toString()).emit("delete-reply", reply._id);

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (err) {
    console.error("Error deleting reply:", err);
    res.status(500).json({ message: "Failed to delete reply", error: err.message });
  }
};


// Upvote reply
export const upvoteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    const userId = req.user._id;
    const alreadyUpvoted = reply.upvotes.includes(userId);

    if (alreadyUpvoted) {
      reply.upvotes.pull(userId);
    } else {
      reply.upvotes.push(userId);
    }

    await reply.save();

    // Optional: emit real-time update
    req.io?.to(reply.threadId.toString()).emit("update-reply-upvotes", {
      replyId: reply._id,
      upvotes: reply.upvotes.length,
    });

    res.status(200).json({ upvotes: reply.upvotes.length });
  } catch (err) {
    console.error("Error upvoting reply:", err);
    res.status(500).json({ message: "Failed to toggle upvote" });
  }
};
