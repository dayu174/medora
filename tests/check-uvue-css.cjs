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
const unsupported = [
  ["display:block", /display\s*:\s*block\b/],
  ["display:inline-block", /display\s*:\s*inline-block\b/],
  ["display:grid", /display\s*:\s*grid\b/],
  ["100vh", /100vh/],
  ["env()", /env\(/],
  ["constant()", /constant\(/],
  ["calc()", /calc\(/],
  ["position:fixed", /position\s*:\s*fixed\b/],
  ["font-weight:800", /font-weight\s*:\s*800\b/],
  ["negative letter-spacing", /letter-spacing\s*:\s*-\d/],
];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const styleBlocks = source.match(/<style[\s\S]*?<\/style>/g) || [];
  for (const block of styleBlocks) {
    const style = block.replace(/<style[^>]*>/, "").replace("</style>", "");
    if (file.replace(/\\/g, "/") === "pages/record/index.uvue" && /background-color\s*:\s*#000000\b/i.test(style)) {
      errors.push(`${file}: record page must use the Medora light background`);
    }
    if (file.replace(/\\/g, "/") === "pages/record/index.uvue" && /min-width\s*:/.test(style)) {
      errors.push(`${file}: record page should use fixed widths for native stability`);
    }
    for (const [name, pattern] of unsupported) {
      if (pattern.test(style)) errors.push(`${file}: unsupported ${name}`);
    }
    const rules = style.match(/([^{}]+)\{/g) || [];
    for (const rule of rules) {
      const selector = rule.slice(0, -1).trim();
      if (!selector || selector.startsWith("@")) continue;
      for (const part of selector.split(",")) {
        const item = part.trim();
        if (!item.startsWith(".")) errors.push(`${file}: selector must be class-only: ${item}`);
        if (/[\s>+~:#\[]/.test(item)) errors.push(`${file}: selector must be simple class: ${item}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("uvue css checks ok");
