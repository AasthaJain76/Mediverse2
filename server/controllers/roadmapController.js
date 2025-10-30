import mongoose from "mongoose";
import Roadmap from "../models/Roadmap.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -------------------- GENERATE ROADMAP --------------------
export const generateRoadmap = async (req, res) => {
  console.log("Authenticated user:", req.user);

  const { topic } = req.body;

  if (!topic?.trim()) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    // 1️⃣ Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2️⃣ Generate roadmap content
    const prompt = `
You are a professional learning mentor.
Create a clear, modern, and motivational **step-by-step learning roadmap** for the topic: "${topic}".

Format Guidelines:
1️⃣ Divide the roadmap into stage-wise sections (e.g., Beginner, Intermediate, Advanced).
2️⃣ Each stage should include:
   - 🎯 Objective (1 short motivational line)
   - 📚 Key Topics (short bullet points)
   - 🔗 Suggested Resources (max 2 per stage)
3️⃣ Keep it concise, practical, and encouraging — not like a textbook.
4️⃣ Use emojis for visual appeal.
5️⃣ Avoid long paragraphs. Prefer structured bullets.
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096, // 🔥 ensures full roadmap
        topP: 0.95,
      },
    });

    // 3️⃣ Extract full text safely
    const generatedRoadmap = result.response.text()?.trim() || "No roadmap generated.";

    console.log("📜 Generated roadmap:\n", generatedRoadmap);

    // 4️⃣ Return response
    res.json({ topic, roadmap: generatedRoadmap });
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
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
    console.error("❌ Save roadmap error:", error.message);
    res.status(500).json({ error: "Failed to save roadmap" });
  }
};

// -------------------- GET ALL ROADMAPS FOR USER --------------------
export const getMyRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (error) {
    console.error("❌ Error fetching roadmaps:", error.message);
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
    console.error("❌ Error fetching roadmap by id:", error.message);
    res.status(500).json({ error: "Failed to fetch roadmap" });
  }
};
