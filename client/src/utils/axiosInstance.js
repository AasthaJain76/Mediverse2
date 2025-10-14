// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mediverse2.vercel.app/",
  withCredentials: true, // ✅ Required for cookies
});

export default axiosInstance;
