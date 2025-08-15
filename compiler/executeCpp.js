const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = async (filePath, inputFilePath) => {
  const jobId = path.basename(filePath).split('.')[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  console.log("📝 Received filePath:", filePath);
  if (inputFilePath) {
    console.log("📥 Input file path:", inputFilePath);
  }

  return new Promise((resolve, reject) => {
    console.log("⚙️ Compiling...");

    exec(`g++ ${filePath} -o ${outPath}`, (compileErr, stdout, stderr) => {
      if (compileErr) {
        console.error("❌ Compilation Error:", stderr);
        return reject({ error: stderr });
      }

      console.log("🚀 Running binary...");

      // Run binary with input redirection if inputFilePath is provided
      const command = inputFilePath ? `${outPath} < ${inputFilePath}` : outPath;

      exec(command, (runErr, runStdout, runStderr) => {
        if (runErr) {
          console.error("❌ Runtime Error:", runStderr);
          return reject({ error: runStderr });
        }

        if (runStderr) {
          console.warn("⚠️ Stderr Output:", runStderr);
        }

        console.log("✅ Execution Success:", runStdout);
        resolve(runStdout);  // Just returning raw string output
      });
    });
  });
};

module.exports = { executeCpp };
