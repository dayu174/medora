const fs = require("fs");

const source = fs.readFileSync("pages/home/index.uvue", "utf8");
const errors = [];

if (!source.includes("quick-record-card")) {
  errors.push("home quick action must style start-record as the primary dark card");
}

if (!source.includes("quick-symbol-box")) {
  errors.push("home quick action must use a framed plus icon block");
}

if (!source.includes('src="/static/icons/calculator.png"')) {
  errors.push("home calculator action must use the calculator icon asset");
}

if (!source.includes("quick-title-light")) {
  errors.push("home start-record title must use light text");
}

if (!/\.quick-card\s*\{[^}]*height:\s*128px/.test(source)) {
  errors.push("home quick action cards must use the reference 128px height");
}

if (!/\.quick-title\s*\{[^}]*font-size:\s*17px/.test(source)) {
  errors.push("home quick action title must use the compact 17px reference size");
}

if (!/\.quick-title\s*\{[^}]*line-height:\s*24px/.test(source)) {
  errors.push("home quick action title must use a 24px line-height to avoid clipping");
}

if (!/\.quick-calc-icon\s*\{[^}]*width:\s*30px/.test(source)) {
  errors.push("home calculator icon must be scaled to the reference 30px width");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("home quick action checks ok");
