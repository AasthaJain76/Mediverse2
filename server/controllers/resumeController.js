// ==========================================
//  Load Env
// ==========================================
import dotenv from "dotenv";
dotenv.config();

// ==========================================
//  Native ESM imports
// ==========================================
import mammoth from "mammoth";
import tesseract from "node-tesseract-ocr";
import { pdfToText } from "pdf-extraction";
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
    // 1️⃣ TEXT EXTRACTION
    // ---------------------------------------------------------------
    if (ext === "pdf") {
      try {
        text = await pdfToText(req.file.buffer);
        text = text?.trim() || "";
      } catch (err) {
        console.log("❌ PDF extraction failed, trying OCR...", err);
      }

      // No text? fallback to OCR
      if (!text) {
        text = await tesseract.recognize(req.file.buffer, { lang: "eng" });
      }
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
    // 3️⃣ GEMINI PROMPT
    // ---------------------------------------------------------------
    const prompt = `
Reply ONLY with valid JSON. No markdown.

Return:
{
  "improvements": [],
  "extracted_skills": [],
  "skill_gaps": [],
  "score": 0,
  "recommended_roles": [],
  "ats_keywords": [],
  "section_feedback": {
    "summary": "",
    "skills": "",
    "experience": "",
    "education": "",
    "projects": ""
  }
}

Resume text:
${cleaned}
`;

    // ---------------------------------------------------------------
    // 4️⃣ CALL GEMINI
    // ---------------------------------------------------------------
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const rawOutput = result.response.text();

    // ---------------------------------------------------------------
    // 5️⃣ JSON PARSING
    // ---------------------------------------------------------------
    let analysis;
    try {
      const first = rawOutput.indexOf("{");
      const last = rawOutput.lastIndexOf("}");
      const json = rawOutput.slice(first, last + 1);
      analysis = JSON.parse(json);
    } catch {
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
