const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { generateFile } = require("./generateFile");
const { generateInputFile } = require("./generateInputFile");
const { executeCpp } = require("./executeCpp");
const { executePython } = require("./executePython");
const { executeJava } = require("./executeJava");
const { generateAiReview } = require("./generateAiReview"); // ✅ import AI review

const app = express();

// ✅ CORS setup
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Hello from backend 🚀");
});

/* ---------------- CODE COMPILATION ROUTE ---------------- */
app.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code received." });
  }

  try {
    const filePath = generateFile(language, code);
    const inputFilePath = generateInputFile(input);

    let output;

    if (language === "cpp") {
      output = await executeCpp(filePath, inputFilePath);
    } else if (language === "python") {
      output = await executePython(filePath, inputFilePath);
    } else if (language === "java") {
      output = await executeJava(filePath, inputFilePath);
    } else {
      return res.status(400).json({ success: false, error: "Unsupported language." });
    }

    return res.json({
      success: true,
      filePath,
      inputFilePath,
      output,
    });
  } catch (error) {
    console.error("Compilation error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Code execution failed.",
    });
  }
});

/* ---------------- AI REVIEW ROUTE ---------------- */
app.post("/ai-review", async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ success: false, error: "Code and language are required." });
  }

  try {
    const aiReview = await generateAiReview(code, language);
    res.status(200).json({ success: true, aiReview });
  } catch (error) {
    console.error("Gemini AI Review Error:", error.message);
    res.status(500).json({ success: false, error: error.message || "AI review failed." });
  }
});

/* ---------------- SERVER LISTEN ---------------- */
app.listen(PORT, "0.0.0.0", (error) => {
  if (error) {
    console.error("❌ Error starting the server:", error);
  } else {
    console.log(`✅ Server running on port ${PORT}`);
  }
});
