import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyProfile,  
  getProfileById,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.delete("/me", protect, deleteMyProfile);
router.get("/:userId", getProfileById);

export default router;
