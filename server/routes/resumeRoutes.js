// routes/resumeRoutes.js
import express from "express";
import multer from "multer";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Single file upload field name should match frontend form
router.post("/analyze", upload.single("file"), (req, res, next) => {
  // console.log("🔥 Received request");
  // console.log("Headers:", req.headers["content-type"]);
  // console.log("File:", req.file);

  next();
}, analyzeResume);

export default router;
