import express from "express";
import {
  postReply,
  getRepliesByThreadId,
  upvoteReply,
  deleteReply,
} from "../controllers/replyController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();


router.post("/:threadId/reply", protect, postReply);
router.get("/:threadId", getRepliesByThreadId);
router.put("/:replyId/upvote", protect, upvoteReply);
router.delete("/:replyId", protect, deleteReply);

export default router;
