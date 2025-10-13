// File: src/pages/RoadmapGenerator.jsx
import React, { useState } from "react";
import { generateRoadmap, saveRoadmap } from "../services/roadmapService";
import { motion } from "framer-motion";
import { Loader2, Rocket } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {toast} from 'react-toastify'

export default function RoadmapGenerator() {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await generateRoadmap(topic);
      setRoadmap(result);
    } catch (err) {
      setRoadmap("❌ Failed to generate roadmap. Please try again.");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!roadmap) return;
    setSaving(true);
    try {
      await saveRoadmap(topic, roadmap);
      toast.success("✅ Roadmap saved successfully!"); // ✅ Success toast
    } catch (err) {
      toast.error("❌ Failed to save roadmap."); // ✅ Error toast
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex flex-col items-center justify-center p-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-10"
      >
        <Rocket className="w-10 h-10 text-indigo-600" />
        Roadmap Generator
      </motion.h1>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 space-y-6"
      >
        {/* Input Section */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Enter a Topic / Skill
          </label>
          <input
            type="text"
            placeholder="e.g., Full Stack Development"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 text-lg rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Generate Roadmap
            </>
          )}
        </button>

        {/* Result Section */}
        {roadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-6 max-h-[400px] overflow-y-auto space-y-4"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Your Roadmap
            </h2>
            <p className="whitespace-pre-line text-gray-600"><ReactMarkdown>{roadmap}</ReactMarkdown></p>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-70 transition"
            >
              {saving ? "Saving..." : "Save Roadmap"}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}