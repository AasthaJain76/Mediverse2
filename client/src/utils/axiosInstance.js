// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // ✅ Required for cookies
});

export default axiosInstance;
