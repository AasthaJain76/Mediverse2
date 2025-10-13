// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import mammoth from "mammoth";
// import axios from "axios";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import Profile from "./models/Profile.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import bcrypt from "bcrypt";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";

// // ✅ Replace pdf-parse with pdf2json
// import PDFParser from "pdf2json";

// // ✅ Multer memory storage for resume upload
// export const upload = multer({ storage: multer.memoryStorage() });

// // Import routes
// import authRoutes from "./routes/authRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import threadRoutes from "./routes/threadRoutes.js";
// import replyRoutes from "./routes/replyRoutes.js";
// import roadmapRoutes from "./routes/roadmapRoutes.js";
// import resumeRoutes from "./routes/resumeRoutes.js";

// // Initialize Express app
// const app = express();

// // Load environment variables
// if (process.env.NODE_ENV !== "production") {
//   dotenv.config();
// }

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const sessionOptions = {
//   secret: "supersecret",
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//     httpOnly: true,
//     sameSite: "lax", // or "none" + secure in production
//   },
// };

// app.use(session(sessionOptions));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//   console.log(`🔥 ${req.method} ${req.url}`);
//   next();
// });

// // API routes
// app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/threads", threadRoutes);
// app.use("/api/replies", replyRoutes);
// app.use("/api/roadmap", roadmapRoutes);
// app.use("/api/resume", resumeRoutes);

// // Connect to MongoDB and start server
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI;

// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   });


import express from "express";
import { createServer } from "http";
import multer from "multer";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

// Socket helpers
import { initIO } from "./controllers/socket.js";

// Models
import User from "./models/User.js";

// Express setup
const app = express();
if (process.env.NODE_ENV !== "production") dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
const sessionOptions = {
  secret: "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, sameSite: "lax" },
};
const sessionMiddleware = session(sessionOptions);
app.use(sessionMiddleware);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Logging
app.use((req, res, next) => { console.log(`🔥 ${req.method} ${req.url}`); next(); });

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/resume", resumeRoutes);

// HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = initIO(server);

// Share session with Socket.IO
io.use((socket, next) => sessionMiddleware(socket.request, {}, next));
io.use((socket, next) => {
  if (socket.request.session.passport?.user) next();
  else next(new Error("Unauthorized"));
});

// Socket events
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Join thread room
  socket.on("joinThread", (threadId) => {
    socket.join(threadId);
    console.log(`Socket ${socket.id} joined thread ${threadId}`);
  });

  // Example for replies
  socket.on("new-reply", (reply) => {
    io.to(reply.threadId).emit("receive-reply", reply);
  });

  socket.on("delete-reply", (data) => {
    io.to(data.threadId).emit("delete-reply", data.replyId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// MongoDB & server start
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    )
  )
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });