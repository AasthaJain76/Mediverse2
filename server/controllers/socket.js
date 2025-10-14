// controllers/socket.js
import { Server } from "socket.io";

let io = null;

export const initIO = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: "https://mediverse2.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};
