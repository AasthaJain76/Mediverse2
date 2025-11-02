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

      // Fallback to OCR if no text found
      if (!text && req.file.size > 50 * 1024) {
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

    if (!text) {
      return res.status(400).json({ error: "No text could be extracted" });
    }

    console.log("📄 Extracted text preview:", text.slice(0, 300));

    // 2️⃣ Gemini 2.5 Flash — JSON-safe prompt
    const prompt = `
You are a professional resume analyzer.
Respond ONLY with valid JSON — no markdown, no explanations, no comments.

Analyze the following resume text:

${text}

Return EXACTLY in this JSON format:
{
  "improvements": ["bullet suggestions"],
  "extracted_skills": ["list of skills"],
  "skill_gaps": ["missing skills for Frontend Developer role"],
  "score": 0-100,
  "recommended_roles": ["role1", "role2"],
  "ats_keywords": ["ATS-friendly keywords to add"],
  "section_feedback": {
    "summary": "feedback",
    "skills": "feedback",
    "experience": "feedback",
    "education": "feedback",
    "projects": "feedback"
  }
}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 900,
        topP: 0.9
      }
    });

    // 3️⃣ Handle Gemini output safely
    const rawOutput = result.response.text();
    console.log("🤖 Gemini raw output:\n", rawOutput);

    let analysis;
    try {
      const jsonStart = rawOutput.indexOf("{");
      const jsonEnd = rawOutput.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonText = rawOutput.slice(jsonStart, jsonEnd + 1);
        analysis = JSON.parse(jsonText);
      } else {
        throw new Error("No valid JSON found");
      }
    } catch (err) {
      console.warn("⚠️ Gemini did not return valid JSON, returning raw text");
      analysis = { raw: rawOutput };
    }

    // 4️⃣ Respond to frontend
    res.json({
      extractedText: text.slice(0, 500),
      analysis
    });

  } catch (err) {
    console.error("❌ Resume analysis failed:", err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};
