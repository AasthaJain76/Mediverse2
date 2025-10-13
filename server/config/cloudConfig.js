// config/cloudConfig.js
import dotenv from 'dotenv';
dotenv.config(); // ✅ Load .env first

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// ✅ Helper to check env variables
function validateEnvVar(name) {
    const value = process.env[name];
    if (!value || typeof value !== 'string') {
        throw new Error(`❌ Missing or invalid environment variable: ${name}`);
    }
    return value;
}

// ✅ Validate and get values
const CLOUD_NAME = validateEnvVar('CLOUD_NAME');
const CLOUD_API_KEY = validateEnvVar('CLOUD_API_KEY');
const CLOUD_API_SECRET = validateEnvVar('CLOUD_API_SECRET');

// Debug logs
console.log("✅ Cloudinary config loaded:");
console.log("   CLOUD_NAME:", CLOUD_NAME);
console.log("   CLOUD_API_KEY:", CLOUD_API_KEY); 
// console.log("   CLOUD_API_SECRET:", CLOUD_API_SECRET); // hidden for safety

// Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET
});

// Configure storage
export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "mediverse_DEV",
        allowedFormats: ["png", "jpg", "jpeg"],
    },
});

export default cloudinary;
