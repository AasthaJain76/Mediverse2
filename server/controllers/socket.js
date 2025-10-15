// controllers/socket.js
import { Server } from "socket.io";

export const initIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://mediverse2.vercel.app",
      methods: ["GET", "POST"],
      credentials: true, // ✅ Required for sessions
    },
  });
  return io;
};
