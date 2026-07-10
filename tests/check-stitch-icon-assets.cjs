const fs = require("fs");

const home = fs.readFileSync("pages/home/index.uvue", "utf8");
const tabs = fs.readFileSync("common/medora-data.uts", "utf8");
const bookIcon = fs.readFileSync("static/tabs/book.svg", "utf8");
const avatarIcon = fs.readFileSync("static/tabs/avatar.svg", "utf8");
const calculatorIcon = fs.readFileSync("static/icons/calculator.svg", "utf8");
const errors = [];

if (!home.includes('src="/static/icons/calculator.svg"')) {
  errors.push("home calculator action must use the Stitch calculator SVG");
}

if (!tabs.includes("activeIcon: '/static/tabs/book.svg'")) {
  errors.push("library active tab must use the Stitch knowledge-library SVG");
}

if (!tabs.includes("avatar: '/static/tabs/avatar.svg'")) {
  errors.push("profile tab must use the Stitch doctor SVG");
}

if (!/\.quick-icon-img\s*\{[^}]*width:\s*32px[^}]*height:\s*32px/.test(home)) {
  errors.push("home calculator icon must use a 32px visual frame");
}

if (!bookIcon.includes('viewBox="36 34 56 60"')) {
  errors.push("library SVG must crop its empty canvas for tab-scale visibility");
}

if (!avatarIcon.includes('viewBox="32 28 64 72"')) {
  errors.push("profile SVG must crop its empty canvas for tab-scale visibility");
}

if (!calculatorIcon.includes('viewBox="36 30 56 68"')) {
  errors.push("calculator SVG must crop its empty canvas for quick-action visibility");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Stitch icon asset checks ok");
