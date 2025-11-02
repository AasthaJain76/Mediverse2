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

    // 1️⃣ Extract text (PDF / DOCX / OCR fallback)
    if (ext === "pdf") {
      const pdfData = await pdf(req.file.buffer);
      text = pdfData.text?.trim() || "";

      if (!text && req.file.size > 30 * 1024) {
        console.log("⚠️ PDF text empty — switching to OCR...");
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

    if (!text) {
      return res.status(400).json({ error: "No text could be extracted" });
    }

    console.log("📄 Extracted preview:", text.slice(0, 200));

    // 2️⃣ Clean text for readability (fix glued words, add spacing/newlines)
    let cleaned = text
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([^\s])([A-Z])/g, "$1 $2")
      .replace(/\r\n?/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/ ?- ?/g, ": ")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/•/g, "-");

    cleaned = cleaned
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .join("\n");

    console.log("🧹 Cleaned preview:", cleaned.slice(0, 250));

    // 3️⃣ Prompt to force JSON-only output
    const prompt = `
You are a professional resume analyzer.
Respond ONLY with valid JSON — no markdown, no code fences, no explanations.

Analyze the following resume text for a Frontend/Full-Stack Developer role.

Resume:
${cleaned}

Return JSON in this exact structure:
{
  "improvements": ["specific suggestions to enhance resume"],
  "extracted_skills": ["skills detected in resume"],
  "skill_gaps": ["missing but useful skills for frontend/fullstack role"],
  "score": number (0-100),
  "recommended_roles": ["job roles suited for candidate"],
  "ats_keywords": ["keywords to improve ATS compatibility"],
  "section_feedback": {
    "summary": "feedback on summary section",
    "skills": "feedback on skills section",
    "experience": "feedback on experience section",
    "education": "feedback on education section",
    "projects": "feedback on projects section"
  }
}
`;

    // 4️⃣ Generate content via Gemini (no responseSchema)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 2000,
        topP: 0.9
      }
    });

    // 5️⃣ Safely parse JSON from Gemini output
    const rawOutput = result.response.text();
    console.log("🤖 Gemini raw output preview:\n", rawOutput.slice(0, 600));

    let analysis;
    try {
      const jsonStart = rawOutput.indexOf("{");
      const jsonEnd = rawOutput.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = rawOutput.slice(jsonStart, jsonEnd + 1);
        analysis = JSON.parse(jsonText);
      } else {
        throw new Error("No JSON found in Gemini output");
      }
    } catch (err) {
      console.warn("⚠️ Gemini output not valid JSON. Wrapping raw text.");
      analysis = { raw: rawOutput };
    }

    // 6️⃣ Respond to frontend
    res.json({
      extractedText: cleaned.slice(0, 5000),
      analysis
    });

  } catch (err) {
    console.error("❌ analyzeResume failed:", err);
    res.status(500).json({
      error: "Failed to analyze resume",
      details: err.message
    });
  }
};
