import express from "express";
import { getContests } from "../controllers/contestController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.get("/", protect, getContests);

export default router;
