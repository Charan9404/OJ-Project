const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

// Directory to store all input files
const dirInput = path.join(__dirname, "input");

// Create folder if it doesn't exist
if (!fs.existsSync(dirInput)) {
  fs.mkdirSync(dirInput, { recursive: true });
}

const generateInputFile = (input) => {
  const jobId = uuid(); // Unique filename
  const inputFileName = `${jobId}.txt`; // e.g., abc123.txt
  const inputFilePath = path.join(dirInput, inputFileName);

  fs.writeFileSync(inputFilePath, input); // Write input to the file

  return inputFilePath; // Return full path
};

module.exports = { generateInputFile };
