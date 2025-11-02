import dotenv from "dotenv";
dotenv.config();

import pdf from "pdf-extraction";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let text = "";

    // 1️⃣ Extract text
    if (ext === "pdf") {
      const pdfData = await pdf(req.file.buffer);
      text = pdfData.text?.trim() || "";
      if (!text && req.file.size > 30 * 1024) {
        console.log("⚠️ Switching to OCR...");
        const bufferArray = new Uint8Array(req.file.buffer);
        const ocrResult = await Tesseract.recognize(bufferArray, "eng");
        text = ocrResult.data.text?.trim() || "";
      }
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value?.trim() || "";
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!text) return res.status(400).json({ error: "No text extracted" });

    // 2️⃣ Clean text for readability
    let cleaned = text
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/:\s?/g, "-")
      .replace(/\s{2,}/g, " ")
      .replace(/([A-Za-z])(\d)/g, "$1 $2")
      .replace(/([0-9])([A-Za-z])/g, "$1 $2")
      .replace(/([^\n])([A-Z][a-z])/g, "$1\n$2")
      .replace(/\n{3,}/g, "\n\n");

    const sectionKeywords = [
      "Professional Summary",
      "Skills",
      "Education",
      "Projects",
      "Experience",
      "Certifications",
      "Achievements",
      "Technical Skills",
    ];
    sectionKeywords.forEach((kw) => {
      const regex = new RegExp(kw, "gi");
      cleaned = cleaned.replace(regex, `\n\n${kw.toUpperCase()}\n`);
    });

    cleaned = cleaned.replace(/\s{2,}/g, " ").trim();
    console.log("🧹 Cleaned preview:", cleaned.slice(0, 250));

    // 3️⃣ Build strict JSON prompt
    const prompt = `
You are a professional resume analyzer.
Respond ONLY with valid JSON — no markdown, no code fences, no explanations.

Analyze the resume text below for a Frontend/Full-Stack Developer role.

Resume:
${cleaned}

Return JSON in this exact format:
{
  "improvements": ["specific improvement suggestions"],
  "extracted_skills": ["skills detected"],
  "skill_gaps": ["missing but relevant skills"],
  "score": number (0-100),
  "recommended_roles": ["role1", "role2"],
  "ats_keywords": ["ATS friendly keywords"],
  "section_feedback": {
    "summary": "feedback on summary",
    "skills": "feedback on skills section",
    "experience": "feedback on experience section",
    "education": "feedback on education section",
    "projects": "feedback on projects section"
  }
}
`;

    // 4️⃣ Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 2000,
        topP: 0.9,
      },
    });

    // 5️⃣ Parse model output safely
    const rawOutput = result.response.text();
    console.log("🤖 Gemini raw output:", rawOutput.slice(0, 400));

    let analysis;
    try {
      const jsonStart = rawOutput.indexOf("{");
      const jsonEnd = rawOutput.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = rawOutput.slice(jsonStart, jsonEnd + 1);
        analysis = JSON.parse(jsonText);
      } else throw new Error("No JSON found");
    } catch {
      analysis = { raw: rawOutput };
    }

    // 6️⃣ Send to frontend
    res.json({
      extractedText: cleaned.slice(0, 5000),
      analysis,
    });
  } catch (err) {
    console.error("❌ analyzeResume failed:", err);
    res.status(500).json({
      error: "Failed to analyze resume",
      details: err.message,
    });
  }
};
