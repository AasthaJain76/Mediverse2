// ✅ Load environment variables
import dotenv from "dotenv";
dotenv.config();

// ✅ Native ESM imports
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let text = "";

    // 1️⃣ Extract text
    if (ext === "pdf") {
      // 👇 Dynamically import pdf-parse (CJS module)
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = pdfParseModule.default || pdfParseModule;

      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text?.trim() || "";

      // fallback to OCR if text extraction fails
      if (!text && req.file.size > 40 * 1024) {
        console.log("⚠️ No text found, switching to OCR...");
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

    // 2️⃣ Clean & normalize text
    let cleaned = text;
    cleaned = cleaned.replace(/([a-z])\n([a-z])/gi, "$1$2"); // merge broken words
    cleaned = cleaned.replace(/\s{2,}/g, " "); // collapse multiple spaces
    cleaned = cleaned.replace(/\n{2,}/g, "\n"); // normalize newlines
    cleaned = cleaned.replace(/([a-z])([A-Z])/g, "$1 $2"); // add space between camelCase
    cleaned = cleaned.replace(/[:·•]/g, " - "); // clean symbols

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

    // 3️⃣ Gemini prompt
    const prompt = `
You are a professional resume analyzer.
Respond ONLY with valid JSON, no markdown or explanations.

Analyze the resume for a Frontend/Full-Stack Developer role.

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

    // 4️⃣ Generate content
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 2000,
        topP: 0.9,
      },
    });

    // 5️⃣ Parse Gemini output safely
    const rawOutput = result.response.text();
    console.log("🤖 Gemini Raw Output:\n", rawOutput.slice(0, 400));

    let analysis;
    try {
      const jsonStart = rawOutput.indexOf("{");
      const jsonEnd = rawOutput.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = rawOutput.slice(jsonStart, jsonEnd + 1);
        analysis = JSON.parse(jsonText);
      } else throw new Error("No JSON found");
    } catch (e) {
      console.warn("⚠️ Gemini returned non-JSON output, wrapping as raw text.");
      analysis = { raw: rawOutput };
    }

    // 6️⃣ Send result
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
