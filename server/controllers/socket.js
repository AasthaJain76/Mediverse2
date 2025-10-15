// controllers/socket.js
import { Server } from "socket.io";

let io = null;

export const initIO = (server, sessionMiddleware) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: "https://mediverse2.vercel.app",
      methods: ["GET", "POST"],
      credentials: true, // ✅ allows sending cookies
    },
  });

  // ✅ Share Express sessions with Socket.IO
  io.engine.use((req, res, next) => {
    sessionMiddleware(req, {}, next);
  });

  // ✅ Authenticate Socket connections based on Passport session
  io.use((socket, next) => {
    const user = socket.request.session?.passport?.user;
    if (user) next();
    else next(new Error("Unauthorized"));
  });

  console.log("⚡ Socket.IO initialized");
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};
