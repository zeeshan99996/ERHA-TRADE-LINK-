const fs = require('fs');
const path = require('path');

const targetDir = 'src';

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      searchDir(filePath);
    } else if (stat.isFile() && /\.(tsx|ts|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/power\s*bank/i.test(line)) {
          // Exclude comments or code that we shouldn't change
          console.log(`${filePath}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

searchDir(targetDir);
