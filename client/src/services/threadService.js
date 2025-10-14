// services/threadService.js
import axiosInstance from "../utils/axiosInstance";
const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://mediverse2-9.onrender.com'}/threads`;


// ✅ Get all threads (public)
export const getAllThreads = async () => {
  const res = await axiosInstance.get('/threads');
  return res.data;
};

// ✅ Get a single thread by ID (public)
export const getThreadById = async (threadId) => {
  const res = await axiosInstance.get(`${API_URL}/${threadId}`);
  return res.data;
};

// ✅ Create a new thread (authenticated)
export const createThread = async (threadData) => {
  console.log("Thread Data in frontend is",threadData);
  const res = await axiosInstance.post(API_URL, threadData);
  return res.data;
};

// ✅ Toggle upvote (authenticated)
export const toggleUpvote = async (threadId) => {
  const res = await axiosInstance.post(`${API_URL}/${threadId}/upvote`, {});
  return res.data;
};

// ✅ Delete a thread (authenticated)
export const deleteThread = async (threadId) => {
  const res = await axiosInstance.delete(`${API_URL}/${threadId}`);
  return res.data;
};
