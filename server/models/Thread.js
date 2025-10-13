// models/Thread.js
import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: String,
  tags: {
    type: [String],
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: String,
  upvotes: {
    type: [mongoose.Schema.Types.ObjectId], // userIds who upvoted
    default: [],
  },
}, {
  timestamps: true,
});

const Thread = mongoose.model("Thread", threadSchema);
export default Thread;
