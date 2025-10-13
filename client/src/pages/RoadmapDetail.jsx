import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoadmapById } from "../services/roadmapService";
import ReactMarkdown from "react-markdown"; // ✅ Import

export default function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 font-medium">
        Loading roadmap...
      </p>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span>⚠️</span>
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <Link
          to="/my-roadmaps"
          className="mt-2 sm:mt-0 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Retry
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Back Button */}
        <div className="mb-8 text-left">
          <Link
            to="/my-roadmaps"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to My Roadmaps
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10 text-center">
          {roadmap.topic}
        </h1>

        {/* Steps */}
        <div className="text-left space-y-3">
          {Array.isArray(roadmap.roadmap) ? (
            <ul className="list-decimal list-inside space-y-1 text-lg marker:text-blue-600 marker:font-bold">
              {roadmap.roadmap.map((step, idx) => (
                <li
                  key={idx}
                  className="text-gray-800 leading-snug"
                >
                  <ReactMarkdown>{step}</ReactMarkdown>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 whitespace-pre-line leading-snug text-lg">
              <ReactMarkdown>{roadmap.roadmap}</ReactMarkdown>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
