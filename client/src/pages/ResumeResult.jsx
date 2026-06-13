import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("skills");

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
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-50/40 via-white to-pink-50/40 p-6 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="glass-panel p-8 rounded-3xl text-center max-w-md border-gray-200/60 bg-white/60 relative z-10">
          <p className="text-gray-500 mb-6 text-lg font-medium">
            ⚠️ No resume result found. Upload a resume to see analysis.
          </p>
          <button
            onClick={() => navigate("/resume-analyze")}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition"
          >
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  const analysis = result?.analysis || {};
  const feedback = analysis?.section_feedback || {};

  const emptyCheck = (data) =>
    data && typeof data === "object" && Object.keys(data).length > 0;

  const renderItemsList = (items, colorClass = "indigo") => {
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return (
        <p className="text-sm text-gray-400 italic">No details available.</p>
      );
    }
    const arrayItems = Array.isArray(items) ? items : [items];

    const colorConfig = {
      indigo: "bg-indigo-50/50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/50",
      red: "bg-red-50/50 text-red-700 border-red-100 hover:bg-red-100/50",
      yellow: "bg-amber-50/50 text-amber-700 border-amber-100 hover:bg-amber-100/50",
      green: "bg-emerald-50/50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50",
      blue: "bg-blue-50/50 text-blue-700 border-blue-100 hover:bg-blue-100/50",
    };

    const chosenColor = colorConfig[colorClass] || colorConfig.indigo;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {arrayItems.map((item, idx) => (
          <div
            key={idx}
            className={`px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-300 ${chosenColor}`}
          >
            {item}
          </div>
        ))}
      </div>
    );
  };

  const ScoreRing = ({ score }) => {
    const radius = 55;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let strokeColor = "stroke-rose-500";
    let textColor = "text-rose-600";
    let bgColor = "bg-rose-50 border-rose-100";
    let label = "Needs Optimization";

    if (score >= 85) {
      strokeColor = "stroke-emerald-500";
      textColor = "text-emerald-600";
      bgColor = "bg-emerald-50 border-emerald-100";
      label = "ATS Optimized";
    } else if (score >= 65) {
      strokeColor = "stroke-amber-500";
      textColor = "text-amber-600";
      bgColor = "bg-amber-50 border-amber-100";
      label = "Good Progress";
    }

    return (
      <div className={`flex flex-col items-center p-6 rounded-3xl border ${bgColor} shadow-sm w-full md:max-w-xs bg-white/70 backdrop-blur-md`}>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-gray-100"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              className={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-gray-800">{score}</span>
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Score / 100</span>
          </div>
        </div>
        <span className={`mt-4 px-3.5 py-1 rounded-full text-xs font-bold border bg-white ${textColor}`}>
          {label}
        </span>
      </div>
    );
  };

  const tabs = [
    { id: "skills", label: "Skills Analysis", icon: "🛠️" },
    { id: "ats", label: "ATS & Keywords", icon: "🔑" },
    { id: "feedback", label: "Section Feedback", icon: "📋" },
    { id: "text", label: "Extracted Text", icon: "📄" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50/50 via-white to-pink-50/50 py-12 relative overflow-hidden">
      {/* Decorative Blob Spheres */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-2">
            📊 Resume Analysis Report
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Get structured, AI-guided improvements and profile matching ratings.
          </p>
        </div>

        {/* Top Section: Score Ring & Overall Card */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 items-stretch">
          {analysis.score ? (
            <ScoreRing score={analysis.score} />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl border border-gray-200 bg-gray-50/60 shadow-sm w-full md:max-w-xs">
              <span className="text-3xl mb-2">📉</span>
              <p className="text-gray-500 italic text-sm text-center">
                Score not available — AI may have returned raw output.
              </p>
            </div>
          )}

          {/* Quick Summary Info Box */}
          <div className="flex-1 glass-panel bg-white/70 border border-white/50 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">Analysis Summary</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Our parser evaluated your document against structural, terminology, and content matching guidelines. Review the tabs below for skill gaps, recommended keyword inclusions, and feedback on specific resume sections.
              </p>
            </div>
            
            <div className="flex gap-4 items-center">
              <button
                onClick={() => navigate("/resume-analyze")}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all duration-300"
              >
                🔄 Upload New Resume
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition duration-300 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-white/80 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-sm min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* SKILLS TAB */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
                      <span>🛠️</span> Extracted Skills
                    </h3>
                    {renderItemsList(analysis.extracted_skills || analysis.skills, "indigo")}
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-extrabold text-red-700 mb-3 flex items-center gap-2">
                      <span>❌</span> Skill Gaps / Gaps
                    </h3>
                    {renderItemsList(analysis.skill_gaps || analysis.gaps, "red")}
                  </div>
                </div>
              )}

              {/* ATS TAB */}
              {activeTab === "ats" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-700 mb-3 flex items-center gap-2">
                      <span>🔑</span> ATS Keywords
                    </h3>
                    {renderItemsList(analysis.ats_keywords || analysis.ats, "green")}
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-extrabold text-amber-700 mb-3 flex items-center gap-2">
                      <span>💡</span> Improvements
                    </h3>
                    {renderItemsList(analysis.improvements, "yellow")}
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-extrabold text-blue-700 mb-3 flex items-center gap-2">
                      <span>🎯</span> Suggested Roles
                    </h3>
                    {renderItemsList(analysis.recommended_roles || analysis.roles, "blue")}
                  </div>
                </div>
              )}

              {/* FEEDBACK TAB */}
              {activeTab === "feedback" && (
                <div className="space-y-6">
                  {emptyCheck(feedback) ? (
                    <div className="space-y-6">
                      {feedback.summary && (
                        <div>
                          <h4 className="text-sm font-bold text-gray-700 mb-2">🧩 Summary Feedback</h4>
                          <div className="p-3.5 bg-gray-50 rounded-2xl text-sm text-gray-600 border border-gray-100">
                            {feedback.summary}
                          </div>
                        </div>
                      )}
                      {feedback.skills && (
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="text-sm font-bold text-gray-700 mb-2">⚙️ Skills Feedback</h4>
                          <div className="p-3.5 bg-gray-50 rounded-2xl text-sm text-gray-600 border border-gray-100">
                            {feedback.skills}
                          </div>
                        </div>
                      )}
                      {feedback.experience && (
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="text-sm font-bold text-gray-700 mb-2">💼 Experience Feedback</h4>
                          <div className="p-3.5 bg-gray-50 rounded-2xl text-sm text-gray-600 border border-gray-100">
                            {feedback.experience}
                          </div>
                        </div>
                      )}
                      {feedback.education && (
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="text-sm font-bold text-gray-700 mb-2">🎓 Education Feedback</h4>
                          <div className="p-3.5 bg-gray-50 rounded-2xl text-sm text-gray-600 border border-gray-100">
                            {feedback.education}
                          </div>
                        </div>
                      )}
                      {feedback.projects && (
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="text-sm font-bold text-gray-700 mb-2">📂 Projects Feedback</h4>
                          <div className="p-3.5 bg-gray-50 rounded-2xl text-sm text-gray-600 border border-gray-100">
                            {feedback.projects}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm text-center py-12">No section feedback generated.</p>
                  )}
                </div>
              )}

              {/* RAW TEXT TAB */}
              {activeTab === "text" && (
                <div className="space-y-4">
                  {result.extractedText ? (
                    <div>
                      <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">Extracted raw text content from document:</p>
                      <pre className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-600 whitespace-pre-wrap max-h-[400px] overflow-y-auto font-mono">
                        {result.extractedText}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm text-center py-12">No raw text extracted from document.</p>
                  )}

                  {analysis.raw && (
                    <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-2xl mt-4">
                      <p className="text-xs font-bold text-yellow-800 flex items-center gap-1.5 mb-2">
                        <span>⚠️</span> raw text fallback content:
                      </p>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">{analysis.raw}</pre>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
