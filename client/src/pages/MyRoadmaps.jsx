// src/pages/MyRoadmaps.jsx
import React, { useEffect, useState } from "react";
import { getMyRoadmaps } from "../services/roadmapService";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react"; // optional icon for CTA

export default function MyRoadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        // 🔹 This should hit /my-roadmaps endpoint (user-specific)
        const data = await getMyRoadmaps();
        console.log("data", data);
        setRoadmaps(data || []);
      } catch (err) {
        console.error("Error fetching roadmaps:", err);
        setError("Failed to load your roadmaps. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 font-medium animate-pulse">
        Loading your roadmaps...
      </p>
    );

  if (error)
    return <p className="text-red-600 text-center mt-10">{error}</p>;

  if (roadmaps.length === 0)
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-white to-pink-50 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 flex flex-col items-center space-y-6"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-gray-800 flex items-center gap-2"
          >
            📌 No Roadmaps Found
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-500 text-center text-base"
          >
            You haven’t saved any roadmaps yet. Start by generating your first roadmap tailored to your learning goals.
          </motion.p>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full"
          >
            <Link
              to="/generate"
              className="w-full flex items-center justify-center gap-2 py-3 text-lg rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-shadow shadow-lg transform hover:scale-105"
            >
              <Rocket className="w-5 h-5" />
              Generate Your First Roadmap
            </Link>
          </motion.div>
        </motion.div>
      </div>

    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📌 My Saved Roadmaps
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap._id}
            className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {roadmap.topic}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {Array.isArray(roadmap.roadmap)
                  ? roadmap.roadmap.slice(0, 3).join(", ") + "..."
                  : typeof roadmap.roadmap === "string"
                    ? roadmap.roadmap.substring(0, 100) + "..."
                    : "No roadmap details available"}
              </p>
              {roadmap.createdAt && (
                <p className="text-xs text-gray-400">
                  Created on {new Date(roadmap.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <Link
              to={`/roadmap/${roadmap._id}`}
              className="mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-center font-medium transition-all shadow-md"
            >
              View Full Roadmap
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
