// services/postService.js
import axios from "axios";
import axiosInstance from "../utils/axiosInstance"; // Uses withCredentials: true

const API = "/posts"; // Base URL already set in axiosInstance
const API_URL = `${import.meta.env.VITE_API_BASE_URL || "https://mediverse2-9.onrender.com/"}/posts`;

export const createPost = async (formData) => {
  const res = await axiosInstance.post(API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePost = async (id, formData) => {
  const res = await axiosInstance.put(`${API}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


// Get all posts
export const getAllPosts = async () => {
  const res = await axiosInstance.get(`${API_URL}`);
  return res.data;
};

// Get post by slug
export const getPostBySlug = async (slug) => {
  console.log("frontend sending slug is:",slug);
  const res = await axiosInstance.get(`${API_URL}/${slug}`);
  
  return res.data;
};

// Delete post
export const deletePost = async (id) => {
  const res = await axiosInstance.delete(`${API_URL}/${id}`);
  return res.data;
};

// Toggle like
export const toggleLikePost = async (id) => {
  const res = await axiosInstance.put(`${API_URL}/${id}/like`);
  return res.data;
};

// Add comment
export const addComment = async (id, commentText) => {
  const res = await axiosInstance.post(`${API_URL}/${id}/comment`, { text: commentText });
  return res.data;
};

export const getCommentsByPostId = async (postId) => {
  const res = await axiosInstance.get(`${API_URL}/${postId}/comment`);
  return res.data;
};

export const deleteComment = async (postId, commentId) => {
  const res = await axiosInstance.delete(`${API_URL}/${postId}/comments/${commentId}`);
  return res.data;
};