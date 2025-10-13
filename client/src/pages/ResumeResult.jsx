import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResumeResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const storedResult = localStorage.getItem("resumeResult");
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="text-gray-500 mb-4 text-center">
          ⚠️ No resume result found. Upload a resume to see analysis.
        </p>
        <button
          onClick={() => navigate("/resume-analyze")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  const renderCardSection = (title, content) => {
    if (!content) return null;
    const items = Array.isArray(content) ? content : [content];
    return (
      <div className="mb-8">
        <h3 className="font-semibold text-xl mb-4 text-indigo-700">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white text-gray-800 font-medium px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition cursor-default border border-indigo-100"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-indigo-600">
        📊 Resume Analysis Result
      </h1>

      {renderCardSection("🛠 Extracted Skills", result.analysis?.extracted_skills)}
      {renderCardSection("❌ Skill Gaps", result.analysis?.skill_gaps)}
      {renderCardSection("💡 Improvements", result.analysis?.improvements)}
      {renderCardSection("🔑 ATS Keywords", result.analysis?.ats_keywords)}
      {renderCardSection("🎯 Suggested Roles", result.analysis?.recommended_roles)}

      {result.analysis?.section_feedback && (
        <>
          {renderCardSection("📋 Summary Feedback", result.analysis.section_feedback.summary)}
          {renderCardSection("🛠 Skills Feedback", result.analysis.section_feedback.skills)}
          {renderCardSection("💼 Experience Feedback", result.analysis.section_feedback.experience)}
          {renderCardSection("🎓 Education Feedback", result.analysis.section_feedback.education)}
          {renderCardSection("📂 Projects Feedback", result.analysis.section_feedback.projects)}
        </>
      )}

      {result.analysis?.score && (
        <div className="mb-6 bg-indigo-100 text-indigo-800 p-4 rounded-2xl text-center font-semibold shadow-sm">
          ⭐ Resume Score: {result.analysis.score} / 100
        </div>
      )}

      {result.extractedText && (
        <div className="mt-6 bg-white p-4 rounded-2xl shadow-md border border-indigo-100">
          <button
            onClick={() => setShowText(!showText)}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {showText ? "Hide Extracted Text ⬆️" : "Show Extracted Text ⬇️"}
          </button>
          {showText && (
            <pre className="text-sm text-gray-700 whitespace-pre-wrap mt-2">
              {result.extractedText}
            </pre>
          )}
        </div>
      )}

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/resume-analyze")}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
        >
          🔙 Analyze Another Resume
        </button>
      </div>
    </div>
  );
}
