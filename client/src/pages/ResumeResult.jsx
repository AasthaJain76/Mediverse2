import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ResumeResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem("resumeResult");
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch {
        console.error("⚠️ Failed to parse resumeResult from localStorage");
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
        <p className="text-gray-500 mb-4 text-center text-lg">
          ⚠️ No resume result found. Upload a resume to see the analysis.
        </p>
        <button
          onClick={() => navigate("/resume-analyze")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  const analysis = result.analysis || {};
  const feedback = analysis.section_feedback || {};

  // Helper for rendering lists or single text blocks
  const renderCardSection = (title, content, color = "indigo") => {
    if (!content || (Array.isArray(content) && content.length === 0)) return null;
    const items = Array.isArray(content) ? content : [content];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h3 className={`font-semibold text-xl mb-4 text-${color}-700 flex items-center gap-2`}>
          {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white text-gray-800 font-medium px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-10 text-center text-indigo-600"
      >
        📊 Resume Analysis Result
      </motion.h1>

      <div className="max-w-6xl mx-auto">
        {/* SCORE */}
        {analysis.score ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-indigo-100 text-indigo-800 p-5 rounded-2xl text-center font-semibold shadow-sm"
          >
            ⭐ Resume Score: <span className="text-2xl">{analysis.score}</span> / 100
          </motion.div>
        ) : (
          <p className="text-gray-500 italic text-center mb-6">
            📉 Score not available — AI may have returned raw output only.
          </p>
        )}

        {/* MAIN SECTIONS */}
        {renderCardSection("🛠 Extracted Skills", analysis.extracted_skills)}
        {renderCardSection("❌ Skill Gaps", analysis.skill_gaps, "red")}
        {renderCardSection("💡 Improvements", analysis.improvements, "yellow")}
        {renderCardSection("🔑 ATS Keywords", analysis.ats_keywords, "green")}
        {renderCardSection("🎯 Suggested Roles", analysis.recommended_roles, "blue")}

        {/* FEEDBACK SECTIONS */}
        {Object.keys(feedback).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">📋 Section Feedback</h2>
            {renderCardSection("🧩 Summary Feedback", feedback.summary)}
            {renderCardSection("⚙️ Skills Feedback", feedback.skills)}
            {renderCardSection("💼 Experience Feedback", feedback.experience)}
            {renderCardSection("🎓 Education Feedback", feedback.education)}
            {renderCardSection("📂 Projects Feedback", feedback.projects)}
          </motion.div>
        )}

        {/* RAW OUTPUT (if any) */}
        {analysis.raw && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6"
          >
            <p className="font-semibold text-yellow-800">⚠️ Raw AI Output:</p>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap mt-2">{analysis.raw}</pre>
          </motion.div>
        )}

        {/* EXTRACTED TEXT */}
        {result.extractedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-white p-5 rounded-2xl shadow-md border border-indigo-100"
          >
            <button
              onClick={() => setShowText(!showText)}
              className="font-semibold text-indigo-600 hover:underline"
            >
              {showText ? "Hide Extracted Text ⬆️" : "Show Extracted Text ⬇️"}
            </button>
            {showText && (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap mt-3 max-h-[400px] overflow-y-auto">
                {result.extractedText}
              </pre>
            )}
          </motion.div>
        )}

        {/* ACTION BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => navigate("/resume-analyze")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            🔙 Analyze Another Resume
          </button>
        </motion.div>
      </div>
    </div>
  );
}
