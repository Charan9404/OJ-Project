const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// Directory to store all code files
const dirCodes = path.join(__dirname, "codes");

// Create folder if it doesn't exist
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, content) => {
  const jobId = uuid(); // Unique filename
  let extension;

  switch (language) {
    case "cpp":
      extension = "cpp";
      break;
    case "python":
      extension = "py";
      break;
    case "java":
      extension = "java";
      break;
    default:
      throw new Error("❌ Unsupported language for file generation.");
  }

  const fileName = `${jobId}.${extension}`; // e.g., abc123.cpp
  const filePath = path.join(dirCodes, fileName);

  fs.writeFileSync(filePath, content); // Write code to the file

  return filePath; // Return full path
};

module.exports = { generateFile };
