// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://mediverse2-13.onrender.com",
  withCredentials: true, // ✅ Required for cookies
});

export default axiosInstance;
