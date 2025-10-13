import React, { useState } from "react";
import { analyzeResume } from "../services/resumeService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file) return setError("Please upload a resume file.");

    setLoading(true);
    setError("");

    try {
      const response = await analyzeResume(file);
      console.log("Resume analysis result:", response);

      // ✅ Store in localStorage so ResumeResult can access
      localStorage.setItem("resumeResult", JSON.stringify(response));

      // ✅ Navigate to result page
      navigate("/resume-result");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 space-y-6"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-6"
        >
          📄 Resume Analyzer
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-600 text-base"
        >
          Upload your resume to get AI-powered suggestions, skill extraction, and ATS optimization.
        </motion.p>

        {/* File Input */}
        <motion.input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />

        {/* Analyze Button */}
        <motion.button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 text-lg rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 transition"
        >
          {loading ? (
            <span>Analyzing...</span>
          ) : (
            <span>Analyze Resume</span>
          )}
        </motion.button>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-red-600 font-medium text-center"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>

  );
}
