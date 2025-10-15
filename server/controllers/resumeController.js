import pdf from "pdf-extraction";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import axios from "axios";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const API_KEY = process.env.GEMINI_API_KEY;

// -------------------- ANALYZE RESUME --------------------
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    let text = "";

    // 1️⃣ Extract resume text
    if (ext === "pdf") {
      const pdfData = await pdf(req.file.buffer);
      text = pdfData.text?.trim() || "";

      if (!text && req.file.size > 50 * 1024) {
        console.log("⚠️ No text found in PDF, switching to OCR...");
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

    if (!text) return res.status(400).json({ error: "No text could be extracted" });

    console.log("📄 Extracted text preview:", text.slice(0, 300));

    // 2️⃣ Build Gemini prompt
    const prompt = `
      Analyze the following resume and return ONLY valid JSON (no markdown, no extra explanation).
      Structure your response exactly like this:

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

      Resume:
      ${text}
    `;

    // 3️⃣ Call Gemini 2.5 Flash API
    const response = await axios.post(
      `${BASE_URL}/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000,
        },
      }
    );

    const rawOutput =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    console.log("🤖 Gemini raw output:\n", rawOutput);

    // 4️⃣ Safely parse JSON
    let analysis;
    try {
      const match = rawOutput.match(/\{[\s\S]*\}/);
      if (match) {
        analysis = JSON.parse(match[0]);
      } else {
        throw new Error("No valid JSON found in AI output");
      }
      console.log("✅ Parsed JSON:\n", JSON.stringify(analysis, null, 2));
    } catch (err) {
      console.warn("⚠️ Gemini did not return valid JSON, returning raw output");
      analysis = { raw: rawOutput };
    }

    // 5️⃣ Send final structured response
    res.json({
      extractedText: text.slice(0, 500),
      analysis,
    });
  } catch (err) {
    console.error("❌ Resume analysis failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};
