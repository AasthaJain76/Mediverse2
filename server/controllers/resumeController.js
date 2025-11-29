// ==========================================
// ✅ Load environment variables
// ==========================================
import dotenv from "dotenv";
dotenv.config();

// ==========================================
// ✅ Native ESM imports
// ==========================================
import mammoth from "mammoth";
import tesseract from "node-tesseract-ocr";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// 🔧 Simplified pdf-parse dynamic loader
// ==========================================
async function loadPdfParse() {
  const mod = await import("pdf-parse");
  return mod.default || mod; // covers all build shapes
}


// ==========================================
// 🧠 MAIN CONTROLLER — Analyze Resume
// ==========================================
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let text = "";

    // ------------------------------------------------------------------
    // 1️⃣ TEXT EXTRACTION
    // ------------------------------------------------------------------
    if (ext === "pdf") {
      const pdfParse = await loadPdfParse();
      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text?.trim() || "";

      // If scanned PDF → fallback to OCR
      if (!text && req.file.size > 40 * 1024) {
        try {
          console.log("⚠️ PDF contains no text — running OCR...");
          text = await tesseract.recognize(req.file.buffer, { lang: "eng" });
        } catch (ocrErr) {
          console.log("⚠️ OCR failed:", ocrErr.message);
          text = "";
        }
      }

    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value?.trim() || "";

    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    if (!text) {
      return res.status(400).json({ error: "No text extracted from resume" });
    }

    // ------------------------------------------------------------------
    // 2️⃣ CLEANING & NORMALIZATION
    // ------------------------------------------------------------------
    let cleaned = text
      .replace(/([a-z])\n([a-z])/gi, "$1 $2")
      .replace(/\n{2,}/g, "\n")
      .replace(/\s{2,}/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[:·•]/g, " - ")
      .trim();

    console.log("🧹 Cleaned preview:\n", cleaned.slice(0, 300));

    // ------------------------------------------------------------------
    // 3️⃣ GEMINI PROMPT — JSON ONLY
    // ------------------------------------------------------------------
    const prompt = `
You are an expert resume analyzer for Software Engineering roles.
Respond ONLY with valid JSON. No markdown.

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

    // ------------------------------------------------------------------
    // 4️⃣ GEMINI REQUEST (NO AbortException ANYWHERE)
    // ------------------------------------------------------------------
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(prompt);
    const rawOutput = result.response.text();

    console.log("🤖 Raw Gemini Output:\n", rawOutput.slice(0, 300));

    // ------------------------------------------------------------------
    // 5️⃣ JSON PARSING
    // ------------------------------------------------------------------
    let analysis;
    try {
      const first = rawOutput.indexOf("{");
      const last = rawOutput.lastIndexOf("}");
      const json = rawOutput.slice(first, last + 1);

      analysis = JSON.parse(json);
    } catch (e) {
      analysis = {
        error: "Model did not return valid JSON",
        raw: rawOutput
      };
    }

    // ------------------------------------------------------------------
    // 6️⃣ SEND RESPONSE
    // ------------------------------------------------------------------
    return res.json({
      extractedText: cleaned.slice(0, 5000),
      analysis
    });

  } catch (err) {
    console.error("❌ analyzeResume error:", err);
    return res.status(500).json({
      error: "Failed to analyze resume",
      details: err.message,
    });
  }
};
