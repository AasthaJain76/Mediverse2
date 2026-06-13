// services/threadService.js
import axiosInstance from "../utils/axiosInstance";
const API_URL = "/threads";


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

// ✅ Update a thread (authenticated)
export const updateThread = async (threadId, threadData) => {
  const res = await axiosInstance.put(`${API_URL}/${threadId}`, threadData);
  return res.data;
};
