// ✅ Load environment variables
import dotenv from "dotenv";
dotenv.config();

// ✅ Native ESM imports
import mammoth from "mammoth";
import tesseract from "node-tesseract-ocr"; // 👈 safer OCR for ESM
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =======================================================
// 🧩 Robust pdf-parse Loader (for "type": "module")
// =======================================================
async function loadPdfParse() {
  const mod = await import("pdf-parse");
  let fn = null;

  if (typeof mod === "function") fn = mod;
  if (!fn && typeof mod.default === "function") fn = mod.default;
  if (!fn && mod.default && typeof mod.default.default === "function")
    fn = mod.default.default;

  if (!fn && typeof mod === "object") {
    for (const k of Object.keys(mod)) {
      if (typeof mod[k] === "function") {
        fn = mod[k];
        break;
      }
    }
  }

  if (!fn && mod.default && typeof mod.default === "object") {
    for (const k of Object.keys(mod.default)) {
      if (typeof mod.default[k] === "function") {
        fn = mod.default[k];
        break;
      }
    }
  }

  if (!fn) {
    console.error("⚠️ pdf-parse loaded shape:", Object.keys(mod));
    throw new Error("❌ Could not find a callable export in pdf-parse module");
  }

  return fn;
}

// =======================================================
// 🧠 MAIN CONTROLLER — Analyze Resume
// =======================================================
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let text = "";

    // ------------------------------------------
    // 1️⃣ TEXT EXTRACTION
    // ------------------------------------------
    if (ext === "pdf") {
      const pdfParse = await loadPdfParse();
      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text?.trim() || "";

      // 🧾 OCR fallback if text missing
      if (!text && req.file.size > 40 * 1024) {
        console.log("⚠️ No text found, switching to OCR...");
        try {
          text = await tesseract.recognize(req.file.buffer, { lang: "eng" });
        } catch (ocrErr) {
          console.warn("⚠️ OCR failed:", ocrErr.message);
          text = "";
        }
      }
    } else if (ext === "docx") {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value?.trim() || "";
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!text)
      return res.status(400).json({ error: "No text extracted from resume" });

    // ------------------------------------------
    // 2️⃣ CLEAN & NORMALIZE TEXT
    // ------------------------------------------
    let cleaned = text;
    cleaned = cleaned.replace(/([a-z])\n([a-z])/gi, "$1$2");
    cleaned = cleaned.replace(/\s{2,}/g, " ");
    cleaned = cleaned.replace(/\n{2,}/g, "\n");
    cleaned = cleaned.replace(/([a-z])([A-Z])/g, "$1 $2");
    cleaned = cleaned.replace(/[:·•]/g, " - ");

    const sections = [
      "Professional Summary",
      "Skills",
      "Education",
      "Projects",
      "Experience",
      "Certifications",
      "Achievements",
      "Technical Skills",
    ];
    sections.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      cleaned = cleaned.replace(regex, `\n\n${kw.toUpperCase()}\n`);
    });

    cleaned = cleaned.trim();
    console.log("🧹 Cleaned Resume Text Preview:\n", cleaned.slice(0, 400));

    // ------------------------------------------
    // 3️⃣ ENHANCED GEMINI PROMPT
    // ------------------------------------------
    const prompt = `
You are an expert **Resume Analyzer** for Frontend & Full-Stack Developer roles.

You must reply **only with JSON**, no markdown or explanations.

Analyze the following resume text and return a structured evaluation.
If some section (like experience, projects, or education) is missing or unclear,
still include it with an empty string or empty array.

Resume:
${cleaned}

Return strictly valid JSON in this format:
{
  "improvements": ["specific resume improvements"],
  "extracted_skills": ["skills detected from resume"],
  "skill_gaps": ["important but missing skills for frontend/fullstack roles"],
  "score": number (0-100),
  "recommended_roles": ["role1", "role2"],
  "ats_keywords": ["ATS-friendly technical keywords to include"],
  "section_feedback": {
    "summary": "feedback or empty string",
    "skills": "feedback or empty string",
    "experience": "feedback or empty string",
    "education": "feedback or empty string",
    "projects": "feedback or empty string"
  }
}

Rules:
- Always include all fields, even if empty.
- Never include commentary, markdown, or backticks.
- Score should reflect how strong this resume is (0 = weak, 100 = exceptional).
- Focus on Frontend/MERN Stack context.
`;

    // ------------------------------------------
    // 4️⃣ GEMINI REQUEST
    // ------------------------------------------
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2000,
        topP: 0.9,
      },
    });

    const rawOutput = result.response.text();
    console.log("🤖 Gemini Raw Output (first 400 chars):\n", rawOutput.slice(0, 400));

    // ------------------------------------------
    // 5️⃣ PARSE JSON OUTPUT
    // ------------------------------------------
    let analysis;
    try {
      const jsonStart = rawOutput.indexOf("{");
      const jsonEnd = rawOutput.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = rawOutput.slice(jsonStart, jsonEnd + 1);
        analysis = JSON.parse(jsonText);
      } else throw new Error("No JSON found");
    } catch {
      console.warn("⚠️ AI output not valid JSON, returning raw text.");
      analysis = {
        improvements: [],
        extracted_skills: [],
        skill_gaps: [],
        score: 0,
        recommended_roles: [],
        ats_keywords: [],
        section_feedback: {},
        raw: rawOutput,
      };
    }

    // ------------------------------------------
    // 6️⃣ SEND RESPONSE
    // ------------------------------------------
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
