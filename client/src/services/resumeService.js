// services/resumeService.js
import axiosInstance from "../utils/axiosInstance";

// ✅ Upload and analyze a resume
export const analyzeResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // must match multer field name in backend

    const response = await axiosInstance.post("/resume/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // return everything from backend (analysis + extractedText, etc.)
    return response.data; 
  } catch (error) {
    console.error("Error analyzing resume:", error.response?.data || error.message);
    throw new Error("Failed to analyze resume. Please try again later.");
  }
};
