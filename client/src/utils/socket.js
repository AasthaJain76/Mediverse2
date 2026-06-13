// src/utils/socket.js
import { io } from "socket.io-client";

let SOCKET_URL = "http://localhost:5000";
if (import.meta.env.PROD) {
  SOCKET_URL = "https://mediverse2-13.onrender.com";
}

export const socket = io(SOCKET_URL, {
  withCredentials: true,
});
