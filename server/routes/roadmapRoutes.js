import express from "express";
import {generateRoadmap,saveRoadmap,getMyRoadmaps,getRoadmapById} from "../controllers/roadmapController.js";
import { protect } from "../middlewares/protect.js";

// POST /api/roadmap/generate
const router = express.Router();
router.post("/generate", protect, generateRoadmap);
router.post("/save", protect, saveRoadmap);
router.post('/my',protect,getMyRoadmaps);
// roadmap by ID
router.get("/:id", protect, getRoadmapById);

export default router;
