import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoadmapById } from "../services/roadmapService";
import ReactMarkdown from "react-markdown";

export default function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(`roadmap_progress_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await getRoadmapById(id);
        if (!data) setError("Roadmap not found.");
        else setRoadmap(data);
      } catch (err) {
        console.error("Error fetching roadmap:", err);
        setError("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  const toggleStep = (idx) => {
    const newProgress = { ...completedSteps, [idx]: !completedSteps[idx] };
    setCompletedSteps(newProgress);
    localStorage.setItem(`roadmap_progress_${id}`, JSON.stringify(newProgress));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50/50 via-white to-purple-50/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-600 animate-pulse">Loading custom roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-50/50 via-white to-purple-50/50 p-6">
        <div className="glass-panel p-8 rounded-3xl text-center max-w-md border-red-200 bg-red-50/30">
          <h1 className="text-xl font-bold text-red-600 mb-2">Error Loading Roadmap</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link 
              to="/my-roadmaps" 
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition"
            >
              Back
            </Link>
            <button 
              onClick={() => window.location.reload()} 
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-md transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = Array.isArray(roadmap.roadmap) ? roadmap.roadmap : [];
  const totalSteps = steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const percentComplete = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  const markdownComponents = {
    li: ({ children, ...props }) => {
      return (
        <li className="flex items-start gap-3 py-1.5 text-gray-700 text-sm md:text-base font-medium">
          <span className="text-indigo-500 text-base mt-0.5">✦</span>
          <span>{children}</span>
        </li>
      );
    },
    h2: ({ children }) => (
      <h2 className="text-xl font-extrabold text-gray-800 mt-6 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
        📍 {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-extrabold text-indigo-600 mt-5 mb-2.5 flex items-center gap-2">
        ⚡ {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-gray-600 leading-relaxed my-2 text-sm md:text-base font-medium">
        {children}
      </p>
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50/50 via-white to-purple-50/50 py-12 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Navigation & Header */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/my-roadmaps"
            className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            ← Back to My Roadmaps
          </Link>
        </div>

        <div className="glass-panel p-8 bg-white/70 border border-white/50 rounded-3xl shadow-xl space-y-8">
          {/* Header Info */}
          <div className="text-center space-y-4">
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-wider">
              ROADMAP
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
              {roadmap.topic}
            </h1>
            
            {/* Progress Bar */}
            {totalSteps > 0 && (
              <div className="max-w-md mx-auto pt-2 space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                  <span>YOUR PROGRESS</span>
                  <span className="text-indigo-600">{percentComplete}% DONE ({completedCount}/{totalSteps})</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/30">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentComplete}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Timeline / Markdown Content */}
          <div className="pt-4">
            {Array.isArray(roadmap.roadmap) ? (
              <div className="relative pl-2">
                {roadmap.roadmap.map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <div key={idx} className="relative pl-12 pb-8 last:pb-0 group">
                      {/* Timeline Line */}
                      <div className="absolute left-[15px] top-9 bottom-0 w-[2px] bg-gray-200 group-last:hidden"></div>
                      
                      {/* Timeline Dot (Checkbox) */}
                      <div className="absolute left-0 top-1.5 z-10">
                        <button
                          onClick={() => toggleStep(idx)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isDone 
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-110" 
                              : "bg-white border-gray-300 hover:border-indigo-500 text-transparent hover:scale-105"
                          }`}
                        >
                          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Timeline Content Panel */}
                      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                        isDone 
                          ? "bg-gray-50/40 border-gray-100 opacity-60" 
                          : "bg-white/80 border-white/50 shadow-sm hover:shadow-md hover:border-gray-200 bg-white/95"
                      }`}>
                        <div className="prose prose-indigo max-w-none text-gray-700 font-medium">
                          <ReactMarkdown components={markdownComponents}>{step}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white/60 border border-white/50 shadow-sm">
                <div className="prose prose-indigo max-w-none text-gray-700 font-medium">
                  <ReactMarkdown components={markdownComponents}>{roadmap.roadmap}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
