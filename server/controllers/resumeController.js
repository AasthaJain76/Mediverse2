// ==========================================
//  Load Env
// ==========================================
import dotenv from "dotenv";
dotenv.config();

// ==========================================
//  Imports
// ==========================================
import mammoth from "mammoth";
import pdf from "pdf-extraction";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
//  MAIN CONTROLLER — Analyze Resume
// ==========================================
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let text = "";

    // ---------------------------------------------------------------
    // 1️⃣ EXTRACT TEXT
    // ---------------------------------------------------------------
    if (ext === "pdf") {
      const data = await pdf(req.file.buffer);
      text = data.text?.trim() || "";
    }

    else if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value?.trim() || "";
    }

    else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    if (!text)
      return res.status(400).json({ error: "No text extracted from resume" });

    // ---------------------------------------------------------------
    // 2️⃣ CLEAN TEXT
    // ---------------------------------------------------------------
    let cleaned = text
      .replace(/([a-z])\n([a-z])/gi, "$1 $2")
      .replace(/\n{2,}/g, "\n")
      .replace(/\s{2,}/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[:·•]/g, " - ")
      .trim();

    console.log("Cleaned text preview:\n", cleaned.slice(0, 300));

    // ---------------------------------------------------------------
    // 3️⃣ GEMINI PROMPT & SCHEMA
    // ---------------------------------------------------------------
    const prompt = `Analyze the following resume text. Provide improvements, extracted skills, skill gaps, suggested roles, ATS keywords, a score out of 100, and specific feedback for each section (summary, skills, experience, education, projects).
    
    Resume text:
    ${cleaned}`;

    const resumeSchema = {
      type: "OBJECT",
      properties: {
        improvements: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        extracted_skills: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        skill_gaps: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        score: {
          type: "INTEGER"
        },
        recommended_roles: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        ats_keywords: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        section_feedback: {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
            skills: { type: "STRING" },
            experience: { type: "STRING" },
            education: { type: "STRING" },
            projects: { type: "STRING" }
          },
          required: ["summary", "skills", "experience", "education", "projects"]
        }
      },
      required: [
        "improvements",
        "extracted_skills",
        "skill_gaps",
        "score",
        "recommended_roles",
        "ats_keywords",
        "section_feedback"
      ]
    };

    // ---------------------------------------------------------------
    // 4️⃣ CALL GEMINI
    // ---------------------------------------------------------------
    const generateParams = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema
      }
    };

    let result;
    try {
      console.log("⚡ Calling Gemini with gemini-2.5-flash for resume analysis...");
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      result = await model.generateContent(generateParams);
    } catch (firstError) {
      console.warn("⚠️ Gemini 2.5 Flash failed or overloaded, attempting fallback to gemini-2.5-flash-lite for resume analysis:", firstError.message);
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        result = await fallbackModel.generateContent(generateParams);
      } catch (secondError) {
        console.warn("⚠️ Fallback model gemini-2.5-flash-lite also failed for resume analysis, attempting fallback to gemini-flash-latest:", secondError.message);
        try {
          const secondFallbackModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
          result = await secondFallbackModel.generateContent(generateParams);
        } catch (thirdError) {
          console.error("❌ All fallback models failed for resume analysis:", thirdError.message);
          throw firstError; // Throw original error if all fail
        }
      }
    }
    const rawOutput = result.response.text();

    console.log("Gemini Output:", rawOutput.slice(0, 200));

    // ---------------------------------------------------------------
    // 5️⃣ JSON PARSING
    // ---------------------------------------------------------------
    let analysis;
    try {
      analysis = JSON.parse(rawOutput);
    } catch (err) {
      console.error("❌ JSON parsing failed for structured response:", err);
      analysis = { error: "Invalid JSON from model", raw: rawOutput };
    }

    // ---------------------------------------------------------------
    // 6️⃣ SEND RESPONSE
    // ---------------------------------------------------------------
    res.json({
      extractedText: cleaned.slice(0, 5000),
      analysis
    });

  } catch (err) {
    console.error("❌ analyzeResume error:", err);
    res.status(500).json({
      error: "Failed to analyze resume",
      details: err.message
    });
  }
};
