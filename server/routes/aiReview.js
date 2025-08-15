import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config(); // Load .env variables

const router = express.Router();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔁 POST /api/ai-review → AI reviews the code
router.post("/", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // ✅ correct model

    const prompt = `You are an expert ${language} developer. Review the following code and suggest improvements:\n\n${code}`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response;
    const review = response.text();

    res.json({ review });
  } catch (err) {
    console.error("Gemini AI Review Error:", err);
    res.status(500).json({ error: err.message || "AI review failed." });
  }
});

// 🧪 GET /api/ai-review/list-models → returns models your API key can access
router.get("/list-models", async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (err) {
    console.error("Model List Error:", err.message);
    res.status(500).json({ error: "Failed to list models." });
  }
});

export default router;
