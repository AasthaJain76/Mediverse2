import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/User.js";
import { initIO } from "./controllers/socket.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

if (process.env.NODE_ENV !== "production") dotenv.config();

const app = express();

// --- CORS ---
app.use(
  cors({
    origin: "https://mediverse2.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Session ---
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
app.use(sessionMiddleware);

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Logging ---
app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.url}`);
  next();
});

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/posts", postRoutes);
app.use("/threads", threadRoutes);
app.use("/replies", replyRoutes);
app.use("/roadmap", roadmapRoutes);
app.use("/resume", resumeRoutes);

// --- Server + Socket ---
const server = createServer(app);
const io = initIO(server);

// Share session
io.use((socket, next) => sessionMiddleware(socket.request, {}, next));
io.use((socket, next) => {
  if (socket.request.session?.passport?.user) next();
  else next(new Error("Unauthorized"));
});

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("joinThread", (threadId) => {
    socket.join(threadId);
    console.log(`Socket ${socket.id} joined thread ${threadId}`);
  });

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

// --- Root route ---
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// --- MongoDB ---
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
