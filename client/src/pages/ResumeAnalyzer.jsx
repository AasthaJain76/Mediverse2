import React, { useState, useRef } from "react";
import { analyzeResume } from "../services/resumeService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    const allowedExtensions = ["pdf", "doc", "docx"];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError("❌ Invalid file format. Please upload a PDF or Word document (.pdf, .doc, .docx).");
      setFile(null);
      return;
    }

    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("❌ File is too large. Maximum size allowed is 5MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) return setError("Please upload a resume file first.");

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
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-tr from-indigo-50/40 via-white to-pink-50/40 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blob Spheres */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-8 space-y-6 relative z-10"
      >
        {/* Title block */}
        <div className="text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center md:justify-start gap-3 mb-2"
          >
            📄 Resume Analyzer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-gray-600 text-sm md:text-base"
          >
            Upload your resume to get AI-powered feedback, skill extraction, ATS score rating, and keyword suggestions.
          </motion.p>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`relative overflow-hidden group cursor-pointer border-2 border-dashed rounded-3xl p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
            isDragging 
              ? "border-indigo-600 bg-indigo-50/70 scale-[1.01]" 
              : file 
                ? "border-emerald-500 bg-emerald-50/30" 
                : "border-indigo-200 hover:border-indigo-500 bg-white/40 hover:bg-white/60"
          }`}
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-3"
              >
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mx-auto group-hover:scale-110 transition duration-300 shadow-sm">
                  📤
                </div>
                <div>
                  <p className="text-gray-700 font-bold text-base">Drag & drop your resume here</p>
                  <p className="text-gray-400 text-sm mt-0.5">or <span className="text-indigo-600 font-semibold underline decoration-2">browse files</span> from your computer</p>
                </div>
                <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Supports PDF, DOC, DOCX up to 5MB</p>
              </motion.div>
            ) : (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-4 w-full px-4"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-sm">
                  📄
                </div>
                <div className="space-y-1">
                  <p className="text-gray-800 font-bold text-base truncate max-w-sm mx-auto">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Selected File</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl border border-red-200 transition duration-200"
                >
                  Remove File
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-20">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center space-y-1">
                <p className="font-bold text-gray-800">Analyzing Resume...</p>
                <p className="text-xs text-gray-400 animate-pulse">Running ATS checks & skill matching</p>
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <motion.button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="w-full flex items-center justify-center gap-3 py-3.5 text-base font-bold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-indigo-500/20 transition-all duration-300"
        >
          Analyze Resume ⚡
        </motion.button>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-center text-sm font-medium"
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
