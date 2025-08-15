const { exec } = require("child_process");

const executePython = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const command = inputFilePath
      ? `python3 ${filePath} < ${inputFilePath}`
      : `python3 ${filePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      if (stderr) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = { executePython };
