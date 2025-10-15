import axios from "axios";
import Roadmap from "../models/Roadmap.js";
import mongoose from "mongoose";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const API_KEY = process.env.GEMINI_API_KEY;

export const generateRoadmap = async (req, res) => {
  const { topic } = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    // 1️⃣ Call Gemini 2.5 Flash
    const response = await axios.post(
      `${BASE_URL}/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Create a modern, step-by-step roadmap for learning ${topic}.
Format guidelines:
1️⃣ Use stage-wise sections with emojis (✅, 🚀, 📚, 🔗)
2️⃣ For each stage, include:
   - 🎯 Objective (1 short line)
   - 📚 Key Topics (bullet points only)
   - 🔗 Suggested Resources (max 2 per stage)
3️⃣ Keep tone motivational and practical, not like a textbook.
4️⃣ Avoid long paragraphs — focus on short, crisp, actionable points.
5️⃣ The roadmap should feel like a personal mentor guide.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200,
          topP: 0.95,
        }
      }
    );

    // 2️⃣ Extract generated text safely
    let generatedRoadmap = "No roadmap generated.";
    try {
      const candidates = response.data?.candidates || [];
      generatedRoadmap = candidates[0]?.content?.parts
        ?.map((p) => p.text)
        ?.join("\n")
        ?.trim() || generatedRoadmap;
    } catch (e) {
      console.warn("⚠️ Failed to parse roadmap text:", e.message);
    }

    console.log("📜 Generated roadmap:\n", generatedRoadmap);

    res.json({ topic, roadmap: generatedRoadmap });
  } catch (error) {
    console.error("❌ Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};




// -------------------- SAVE ROADMAP --------------------
export const saveRoadmap = async (req, res) => {
  const { topic, roadmap } = req.body;

  if (!topic || !roadmap) {
    return res.status(400).json({ error: "Topic and roadmap are required" });
  }

  try {
    const newRoadmap = new Roadmap({
      user: req.user._id,
      topic,
      roadmap,
    });

    await newRoadmap.save();

    res.json({ message: "Roadmap saved successfully", roadmap: newRoadmap });
  } catch (error) {
    console.error("Save roadmap error:", error.message);
    res.status(500).json({ error: "Failed to save roadmap" });
  }
};

// -------------------- GET ALL ROADMAPS FOR USER --------------------
export const getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(roadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error.message);
    res.status(500).json({ error: "Failed to fetch roadmaps" });
  }
};

// -------------------- GET ROADMAP BY ID --------------------
export const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid roadmap ID format" });
    }

    const roadmap = await Roadmap.findOne({
      _id: id,
      user: req.user._id,
    }).populate("user", "username email");

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    res.json(roadmap);
  } catch (error) {
    console.error("Error fetching roadmap by id:", error.message);
    res.status(500).json({ error: "Failed to fetch roadmap" });
  }
};
