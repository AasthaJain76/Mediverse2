import express from "express";
import {
  createThread,
  getAllThreads,
  getThreadById,
  deleteThread,
  toggleUpvote,
} from "../controllers/threadController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

// Public routes
router.get("/", getAllThreads);
router.get("/:id", getThreadById);

// Protected routes
router.post("/", protect, createThread);
router.delete("/:id", protect, deleteThread);
router.patch("/:id/upvote", protect, toggleUpvote);

export default router;
