const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAiReview = async (code, language = "cpp") => {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" }); // ✅ correct format for v1

    const prompt = `You are an expert ${language} developer. you are given a code adn you need to review it and give a short review of code the code is:\n\n${code}`;

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

    return review;
  } catch (err) {
    console.error("❌ generateAiReview error:", err.message);
    throw err;
  }
};

module.exports = { generateAiReview };
