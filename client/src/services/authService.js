// services/authService.js
import axiosInstance from "../utils/axiosInstance";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "https://mediverse2.vercel.app/"}/auth`;

export const register = async (userData) => {
  const res = await axiosInstance.post(`${API_URL}/signup`, userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await axiosInstance.post(`${API_URL}/login`, userData);
  return res.data;
};

export const logout = async () => {
  try {
    const res = await axiosInstance.post(`${API_URL}/logout`);
    return res.data;
  } catch (err) {
    console.error("Logout failed:", err.response?.data || err.message);
    throw err;
  }
};


export const getCurrentUser = async () => {
  try {
    const res = await axiosInstance.get(`${API_URL}/me`);
    return res.data;
  } catch (err) {
    console.error("User not authenticated", err);
    return null;
  }
};
