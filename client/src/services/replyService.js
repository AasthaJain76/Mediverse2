// src/services/replyService.js
import axiosInstance from "../utils/axiosInstance";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://mediverse2-9.onrender.com/'}/replies`;



// 💬 Reply to a specific thread (if using a nested route)
export const postReply = async (threadId, replyData) => {
  const res = await axiosInstance.post(
    `${API_URL}/${threadId}/reply`,
    replyData
  );
  return res.data;
};

// 📄 Get all replies for a thread (public, no auth needed)
export const getRepliesByThreadId = async (threadId) => {
  const res = await axiosInstance.get(`${API_URL}/${threadId}`);
  return res.data;
};

// 👍 Toggle upvote for a reply (requires session)
export const toggleUpvoteReply = async (replyId) => {
  const res = await axiosInstance.put(
    `${API_URL}/${replyId}/upvote`,
    {}
  );
  return res.data;
};

// 🗑 Delete a reply (requires session)
export const deleteReply = async (replyId) => {
  const res = await axiosInstance.delete(
    `${API_URL}/${replyId}`
  );
  return res.data;
};
