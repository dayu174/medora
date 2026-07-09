const fs = require("fs");

const source = fs.readFileSync("pages/record/index.uvue", "utf8");
const errors = [];

const requiredText = [
  "记录发现",
  "采集数据并添加临床笔记。",
  "科室选择",
  "疾病名称",
  "点击拍摄或上传",
  "临床笔记",
  "详细笔记",
  "症状",
  "用药/方案",
  "标签（可选）",
  "扫描文档",
  "保存记录"
];

for (const text of requiredText) {
  if (!source.includes(text)) {
    errors.push(`record page missing text: ${text}`);
  }
}

const requiredHooks = [
  "@tap=\"goBack\"",
  "@tap=\"openUploadSheet\"",
  "@tap=\"autoArchive\"",
  "@tap=\"addTag\"",
  "@tap=\"openScanSheet\"",
  "@tap=\"saveRecord\"",
  "showUploadSheet",
  "showScanSheet"
];

for (const hook of requiredHooks) {
  if (!source.includes(hook)) {
    errors.push(`record page missing interaction hook: ${hook}`);
  }
}

if (!source.includes('class="record-back-hit"') || !source.includes('class="record-back-icon"')) {
  errors.push("record page must show a tappable back arrow in the top-left corner");
}

if (!/goBack\(\)\s*\{[^}]*uni\.navigateBack/.test(source)) {
  errors.push("record page back arrow must navigate back");
}

if (!source.includes('<scroll-view class="dept-scroll" scroll-x="true" :show-scrollbar="false">')) {
  errors.push("record page department row must be horizontally scrollable without a visible scrollbar");
}

if (!source.includes('<scroll-view class="page-scroll" scroll-y="true" :show-scrollbar="false">')) {
  errors.push("record page main content must hide the iOS scroll indicator");
}

if (!/padding-left\s*:\s*24px/.test(source) || !/padding-right\s*:\s*24px/.test(source)) {
  errors.push("record page must use equal 24px left and right page margins");
}

if (!/padding-top\s*:\s*16px/.test(source)) {
  errors.push("record page top spacing must be compact enough for the first viewport");
}

if (!/padding-bottom\s*:\s*220px/.test(source)) {
  errors.push("record page must reserve bottom space for action buttons and the tab bar");
}

if (!/font-size\s*:\s*24px/.test(source)) {
  errors.push("record page title must match the Stitch headline size");
}

const compactRules = [
  ["record sections", /\.record-section\s*\{[^}]*margin-top:\s*16px/],
  ["disease input", /\.record-input\s*\{[^}]*height:\s*46px/],
  ["upload button", /\.upload-box\s*\{[^}]*height:\s*50px/],
  ["detail note", /\.detail-textarea\s*\{[^}]*height:\s*96px/],
  ["symptoms and treatment fields", /\.mini-textarea\s*\{[^}]*height:\s*54px/],
  ["bottom action stack", /\.action-stack\s*\{[^}]*margin-top:\s*18px/]
];

for (const [name, pattern] of compactRules) {
  if (!pattern.test(source)) {
    errors.push(`record page ${name} must use the compact iPhone layout`);
  }
}

const alignedWidthRules = [
  ["department scroller", /\.dept-scroll\s*\{[^}]*width:\s*100%/],
  ["disease input", /\.record-input\s*\{[^}]*width:\s*100%/],
  ["upload button", /\.upload-box\s*\{[^}]*width:\s*100%/],
  ["section divider", /\.record-divider\s*\{[^}]*width:\s*100%/],
  ["note header", /\.note-head\s*\{[^}]*width:\s*100%/],
  ["detail note", /\.detail-textarea\s*\{[^}]*width:\s*100%/],
  ["two-column grid", /\.two-grid\s*\{[^}]*width:\s*100%/],
  ["symptoms and treatment fields", /\.mini-textarea\s*\{[^}]*width:\s*100%/],
  ["action area", /\.action-stack\s*\{[^}]*width:\s*100%/],
  ["scan button", /\.scan-button\s*\{[^}]*width:\s*100%/],
  ["save button", /\.save-button\s*\{[^}]*width:\s*100%/]
];

for (const [name, pattern] of alignedWidthRules) {
  if (!pattern.test(source)) {
    errors.push(`record page ${name} must align to the same 24px page margins`);
  }
}

const borderBoxRules = [
  ["disease input", /\.record-input\s*\{[^}]*box-sizing:\s*border-box/],
  ["detail note", /\.detail-textarea\s*\{[^}]*box-sizing:\s*border-box/],
  ["symptoms and treatment fields", /\.mini-textarea\s*\{[^}]*box-sizing:\s*border-box/]
];

for (const [name, pattern] of borderBoxRules) {
  if (!pattern.test(source)) {
    errors.push(`record page ${name} must include padding inside its responsive width`);
  }
}

if (!/\.mini-field\s*\{[^}]*flex:\s*1/.test(source) || !/\.mini-field-left\s*\{[^}]*margin-right:\s*16px/.test(source)) {
  errors.push("record page two-column fields must use responsive flex columns");
}

if (!/class="record-modal-mask"/.test(source)) {
  errors.push("record page must use an in-page modal sheet for button feedback");
}

if (/[锟�]|璁板|绉戝|鐤剧|涓村|鏅鸿|鎵/.test(source)) {
  errors.push("record page contains mojibake text");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("record page checks ok");
