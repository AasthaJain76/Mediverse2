// src/utils/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "https://mediverse2-9.onrender.com";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});
