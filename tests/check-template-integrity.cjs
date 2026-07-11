const fs = require("fs");
const path = require("path");

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(full));
    if (entry.isFile() && entry.name.endsWith(".uvue")) files.push(full);
  }
  return files;
}

const mojibake = /(鈱|鈰|鈾|锛|绠|寮|璁|鍖|鐥|绉|涓|淇|濡|褰|杈|鐐|鎵|鉁|�)/;
const errors = [];

for (const file of listFiles("pages")) {
  const source = fs.readFileSync(file, "utf8");
  if (mojibake.test(source)) errors.push(`${file}: contains mojibake text`);
  if (/action="[^"]*(?:\r?\n|\/>)/.test(source)) errors.push(`${file}: malformed action attribute`);
  if (/<text[^>]*>[^<]*\/text>/.test(source)) errors.push(`${file}: malformed text closing tag`);
  if (file.replace(/\\/g, "/") === "pages/home/index.uvue" && !source.includes('src="/static/icons/search.png"')) {
    errors.push(`${file}: home header must use the search icon asset`);
  }
  if (file.replace(/\\/g, "/") === "pages/library/index.uvue") {
    if (!source.includes('src="/static/icons/search.png"')) {
      errors.push(`${file}: library header must use the search icon asset`);
    }
    if (source.includes('action="搜"')) {
      errors.push(`${file}: library header must not use the text search action`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("template integrity checks ok");
