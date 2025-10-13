// routes/postRoutes.js
import express from "express";
import { createPost, updatePost, getAllPosts, getPostBySlug, deletePost,getCommentsByPostId,deleteComment } from "../controllers/postController.js";
import {upload} from '../cloudConfig.js'
import { protect } from "../middlewares/protect.js";
import { toggleLikePost, addComment } from '../controllers/postController.js';
const router = express.Router();

router.post("/", protect, upload.single("featuredImage"), createPost);
router.put("/:id", protect, upload.single("featuredImage"), updatePost);
router.get("/", protect,getAllPosts);
router.get("/:slug", protect,getPostBySlug);
router.delete("/:id", protect, deletePost);
router.put('/:id/like', protect, toggleLikePost);
router.post('/:id/comment', protect, addComment);
router.get('/:postId/comment', protect,getCommentsByPostId);
router.delete("/:postId/comments/:commentId", protect, deleteComment);
export default router;




