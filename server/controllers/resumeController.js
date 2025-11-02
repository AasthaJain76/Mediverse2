// analyzeResume.js
import dotenv from "dotenv";
dotenv.config();

import pdf from "pdf-extraction";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * analyzeResume handler
 * Expects multipart/form-data with file under req.file (buffer available)
 */
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Log whether API key present (temporary debug — remove in prod if you like)
    console.log("🔑 GEMINI key present:", !!process.env.GEMINI_API_KEY);

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let text = "";

    // 1) Extract text from PDF or DOCX; OCR fallback for images / scanned PDFs
    if (ext === "pdf") {
      const pdfData = await pdf(req.file.buffer);
      text = pdfData.text?.trim() || "";

      if (!text && req.file.size > 20 * 1024) {
        console.log("⚠️ No text found in PDF; using OCR fallback...");
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
      return res.status(400).json({ error: "No text could be extracted from the uploaded file" });
    }

    console.log("📄 Raw extracted preview:", text.slice(0, 250));

    // 2) Clean & normalize text so the model understands it (fix glued words, spacing)
    // Insert space before capital letters when words are glued (e.g., Full-StackDeveloper -> Full-Stack Developer)
    let cleaned = text;

    // Common fixes:
    // - Ensure proper newlines after common section words
    cleaned = cleaned.replace(/(Email|Phone|Address|LinkedIn|GitHub|Leetcode|GeeksForGeeks|ProfessionalSummary|Skills|Education|Projects|Experience|Certifications|Certifications & Achievements)/gi, "\n$1\n");

    // - Add space between lower-to-upper and letter-to-digit boundaries if glued
    cleaned = cleaned.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    cleaned = cleaned.replace(/([A-Za-z])([0-9])/g, "$1 $2");
    cleaned = cleaned.replace(/([0-9])([A-Za-z])/g, "$1 $2");

    // - Replace multiple spaces with single, ensure single blank lines
    cleaned = cleaned.replace(/[ \t]{2,}/g, " ");
    cleaned = cleaned.replace(/\r\n?/g, "\n");
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    cleaned = cleaned.replace(/ ?- ?/g, ": "); // convert "Email- xxx" -> "Email: xxx"
    cleaned = cleaned.replace(/•/g, "-");

    // Trim each line and re-join to avoid lines with only spaces
    cleaned = cleaned
      .split("\n")
      .map((ln) => ln.trim())
      .filter((ln) => ln.length > 0)
      .join("\n");

    console.log("✳️ Cleaned preview:", cleaned.slice(0, 300));

    // 3) Build compact prompt (shorter but explicit) and use structured response schema
    const prompt = `
You are a professional resume analyzer. Analyze the resume text below and return ONLY valid JSON (no markdown, no commentary).
Use the cleaned resume text to extract skills, suggest improvements and compute a relevance score (0-100) for an internship / entry-level Frontend/Full-Stack role.

Resume:
${cleaned}

Return JSON with keys: improvements, extracted_skills, skill_gaps, score, recommended_roles, ats_keywords, section_feedback.
`;

    // 4) Schema for structured response (forces keys & types)
    const responseSchema = {
      type: "object",
      properties: {
        improvements: { type: "array", items: { type: "string" } },
        extracted_skills: { type: "array", items: { type: "string" } },
        skill_gaps: { type: "array", items: { type: "string" } },
        score: { type: "number" },
        recommended_roles: { type: "array", items: { type: "string" } },
        ats_keywords: { type: "array", items: { type: "string" } },
        section_feedback: {
          type: "object",
          properties: {
            summary: { type: "string" },
            skills: { type: "string" },
            experience: { type: "string" },
            education: { type: "string" },
            projects: { type: "string" }
          }
        }
      },
      required: ["extracted_skills", "score", "section_feedback"]
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 5) Call Gemini with schema. (Note: SDK implementations vary; adjust if your SDK expects different keys)
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 2000,
        topP: 0.9
      },
      // The SDK may accept `responseSchema` or a similar param — pass it if supported.
      responseSchema
    });

    // 6) Read structured output if available, otherwise fallback to parsing raw text
    let analysis = null;
    // Try structured field first (SDKs differ — check where the parsed object sits)
    try {
      // Preferred: SDK populates parsed JSON under result.response.output or result.output
      if (result?.response?.output) {
        // If response.output is already a parsed object:
        const parsed = result.response.output;
        // If it's an array or has structured content, try to find the first object-like entry
        if (Array.isArray(parsed) && parsed.length) {
          analysis = parsed.find((p) => typeof p === "object") || parsed[0];
        } else if (typeof parsed === "object") {
          analysis = parsed;
        }
      } else if (result?.output) {
        analysis = result.output;
      }
    } catch (e) {
      console.warn("⚠️ Structured output read error:", e);
    }

    // Fallback: parse raw text response to extract JSON substring
    if (!analysis) {
      const rawOutput = (result?.response?.text && typeof result.response.text === "function")
        ? result.response.text()
        : result?.text || "";

      console.log("🤖 Gemini raw output (fallback):", rawOutput?.slice(0, 1000));

      try {
        const jsonStart = rawOutput.indexOf("{");
        const jsonEnd = rawOutput.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const jsonText = rawOutput.slice(jsonStart, jsonEnd + 1);
          analysis = JSON.parse(jsonText);
        }
      } catch (e) {
        console.warn("⚠️ Could not parse JSON from raw output:", e);
      }
    }

    // Final fallback: if still nothing, return default structured skeleton with the cleaned text under `raw`
    if (!analysis) {
      analysis = {
        improvements: [],
        extracted_skills: [],
        skill_gaps: [],
        score: 0,
        recommended_roles: [],
        ats_keywords: [],
        section_feedback: {
          summary: "",
          skills: "",
          experience: "",
          education: "",
          projects: ""
        },
        // include the cleaned text for debugging and later re-processing on frontend
        raw: cleaned
      };
    }

    // 7) Return a trimmed extractedText (you can send full cleaned text if you want)
    return res.json({
      extractedText: cleaned.slice(0, 5000), // keep a reasonable length; frontend can show more if needed
      analysis
    });
  } catch (err) {
    console.error("❌ analyzeResume failed:", err);
    return res.status(500).json({ error: "Failed to analyze resume", details: err.message });
  }
};
