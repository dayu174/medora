const fs = require("fs");

const app = fs.readFileSync("App.uvue", "utf8");
const tabs = fs.readFileSync("components/BottomTabs/BottomTabs.uvue", "utf8");
const errors = [];

for (const selector of ["tab-icon", "tab-avatar"]) {
  const rule = new RegExp(`\\.${selector}\\s*\\{[^}]*width:\\s*34px[^}]*height:\\s*34px`);
  if (!rule.test(app)) errors.push(`${selector} must use a 34px visual size`);
}

if (!/\.tab-icon-active\s*\{[^}]*scale\(1\.04\)/.test(tabs)) {
  errors.push("active tab icon must use restrained 1.04 scale feedback");
}
if (!/\.tab-avatar-active\s*\{[^}]*scale\(1\.04\)/.test(tabs)) {
  errors.push("active tab avatar must use restrained 1.04 scale feedback");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("bottom tab scale checks ok");
