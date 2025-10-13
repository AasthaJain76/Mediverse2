import pdf from "pdf-extraction";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // 2️⃣ Ask Gemini for structured analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the following resume and return ONLY a valid JSON object.
    Do NOT include explanations, markdown, or extra text. 
    The JSON must strictly follow this structure:

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

    Resume Text:
    ${text}
    `;

    const result = await model.generateContent(prompt);
    let rawOutput = result.response.text();

    console.log("🤖 Gemini raw output:\n", rawOutput);

    // 3️⃣ Try to parse clean JSON
    let analysis;
    try {
      // Extract only the JSON object using regex
      const match = rawOutput.match(/\{[\s\S]*\}/);
      if (match) {
        analysis = JSON.parse(match[0]);
      } else {
        throw new Error("No JSON found in Gemini output");
      }
      console.log("✅ Parsed JSON Analysis:\n", JSON.stringify(analysis, null, 2));
    } catch (e) {
      console.warn("⚠️ Gemini did not return valid JSON, wrapping raw text");
      analysis = { raw: rawOutput };
    }

    // 4️⃣ Send structured response
    res.json({
      extractedText: text.slice(0, 500),
      analysis,
    });
  } catch (err) {
    console.error("❌ Resume analysis failed:", err);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
};
