// models/Reply.js
import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: String,
  content: {
    type: String,
    required: true,
  },
  upvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
}, {
  timestamps: true,
});

const Reply = mongoose.model("Reply", replySchema);
export default Reply;
