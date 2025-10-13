import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mediverse_DEV", // Cloudinary folder
    allowed_formats: ["png", "jpg", "jpeg", "pdf"], // allowed formats
  },
});

// Multer instance
const upload = multer({ storage });

export { cloudinary, upload };
