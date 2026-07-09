const fs = require("fs");
const path = require("path");

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(full));
    if (entry.isFile() && entry.name.endsWith(".uvue")) files.push(full);
  }
  return files;
}

const files = ["App.uvue", ...listFiles("pages"), ...listFiles("components")].filter((file) => fs.existsSync(file));
const errors = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const rules = source.match(/\.[^{]+\{[^}]+\}/g) || [];
  for (const rule of rules) {
    if (/display\s*:\s*flex\b/.test(rule) && !/flex-direction\s*:/.test(rule)) {
      errors.push(`${file}: flex rule missing flex-direction: ${rule.slice(0, 80)}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("all flex rules have direction");
