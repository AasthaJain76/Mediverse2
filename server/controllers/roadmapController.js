import axios from "axios"
import Roadmap from "../models/Roadmap.js";
import mongoose from "mongoose";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const API_KEY = process.env.GEMINI_API_KEY; // keep key in backend .env


export const generateRoadmap = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Create a modern, step-by-step roadmap for learning ${topic}.
Format guidelines:
1. Use stage-wise sections with emojis (✅, 🚀, 📚, 🔗).
2. For each stage, include:
   - 🎯 Objective (1 short line)
   - 📚 Key Topics (bullet points only)
   - 🔗 Suggested Resources (max 2 per stage)
3. Keep tone motivational and practical, not like a textbook.
4. Avoid long paragraphs — focus on short, crisp, actionable points.
5. The roadmap should feel like a personal mentor guide.`
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 900,
        },
      }
    );

    const roadmap =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No roadmap generated.";

    res.json({ roadmap });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};


export const saveRoadmap = async (req, res) => {
  const { topic, roadmap } = req.body;

  if (!topic || !roadmap) {
    return res.status(400).json({ error: "Topic and roadmap are required" });
  }

  try {
    const newRoadmap = new Roadmap({
      user: req.user._id, // comes from protect middleware
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

export const getMyRoadmaps = async (req, res) => {
  try {
    // console.log("getMyRoadmaps request received");
    // console.log("req.user is", req.user);

    // ✅ Use req.user._id to filter by logged-in user
    const roadmaps = await Roadmap.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json(roadmaps);
  } catch (error) {
    console.error("Error fetching roadmaps:", error.message);
    res.status(500).json({ error: "Failed to fetch roadmaps" });
  }
};



// ✅ Get roadmap by ID
// ✅ Get roadmap by ID (only if it belongs to logged-in user)
export const getRoadmapById = async (req, res) => {
  try {
    // console.log("getRoadmapById request received");

    const { id } = req.params;
    // console.log("req is", req.params);

    // validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid roadmap ID format" });
    }

    const userId = req.user?._id || req.user?.id;

    // console.log("Logged-in userId:", userId);
    // console.log("id is", new mongoose.Types.ObjectId(id));

    const roadmap = await Roadmap.findOne({
      user: userId,
      _id: id,
    }).populate("user", "username email");


    // console.log("Fetched roadmap:", roadmap);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // console.log("roadmap.user", roadmap.user._id.toString());
    // console.log("userId ", userId.toString());

    // 👇 check ownership
    if (roadmap.user._id.toString() !== userId.toString()) {
      console.log(
        "Ownership mismatch:",
        "roadmap.user =", roadmap.user,
        "loggedInUser =", userId
      );
      return res.status(400).json({ message: "Forbidden: Not your roadmap" });
    }

    res.json(roadmap);
  } catch (error) {
    console.error("Error fetching roadmap by id:", error.message);
    res.status(500).json({ error: "Failed to fetch roadmap" });
  }
};
