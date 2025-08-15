const path = require("path");
const { exec } = require("child_process");

const executeJava = (filePath, inputFilePath) => {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath).split(".")[0];

    const compileCommand = `javac ${filePath}`;
    const runCommand = inputFilePath
      ? `cd ${dir} && java ${fileName} < ${inputFilePath}`
      : `cd ${dir} && java ${fileName}`;

    exec(compileCommand, (compileErr, _, compileStderr) => {
      if (compileErr) return reject(compileStderr);

      exec(runCommand, (runErr, stdout, stderr) => {
        if (runErr) return reject(stderr);
        if (stderr) return reject(stderr);
        resolve(stdout);
      });
    });
  });
};

module.exports = { executeJava };
