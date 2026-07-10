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

function count(source, pattern) {
  return (source.match(pattern) || []).length;
}

const errors = [];

for (const file of listFiles("pages")) {
  const source = fs.readFileSync(file, "utf8");
  const template = source.replace(/<!--[\s\S]*?-->/g, "");
  if (!template.includes('<scroll-view class="page-scroll" scroll-y="true" :show-scrollbar="false">')) {
    errors.push(`${file}: missing page-scroll`);
  }
  if (template.includes("<BottomTabs")) {
    const bottomTabsIndex = template.indexOf("<BottomTabs");
    const lastScrollCloseIndex = template.lastIndexOf("</scroll-view>");
    if (bottomTabsIndex < lastScrollCloseIndex) errors.push(`${file}: BottomTabs must sit outside page-scroll`);
  }
  const viewOpen = count(template, /<view(\s|>)/g);
  const viewClose = count(template, /<\/view>/g);
  if (viewOpen !== viewClose) errors.push(`${file}: view tags unbalanced`);
  const scrollOpen = count(template, /<scroll-view(\s|>)/g);
  const scrollClose = count(template, /<\/scroll-view>/g);
  if (scrollOpen !== scrollClose) errors.push(`${file}: scroll-view tags unbalanced`);
}

if (fs.existsSync("App.uvue")) {
  const app = fs.readFileSync("App.uvue", "utf8");
  const rule = app.match(/\.bottom-nav\s*\{[^}]+\}/);
  if (rule && /position\s*:/.test(rule[0])) errors.push("App.uvue: bottom-nav should not use position");
  const phoneFrameRule = app.match(/\.phone-frame\s*\{[^}]+\}/);
  if (phoneFrameRule && /max-width\s*:\s*390px/.test(phoneFrameRule[0])) {
    errors.push("App.uvue: phone-frame must not cap the app to 390px on iPhone 16 Pro");
  }
  if (rule && /max-width\s*:\s*390px/.test(rule[0])) {
    errors.push("App.uvue: bottom-nav must not cap the app to 390px on iPhone 16 Pro");
  }
  if (/width\s*:\s*390px/.test(app)) {
    errors.push("App.uvue: app shell must not use fixed 390px widths");
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("scroll layout checks ok");
