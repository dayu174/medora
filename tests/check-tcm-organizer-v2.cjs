const fs = require("fs");

const settings = fs.readFileSync("pages/settings/index.uvue", "utf8");
const organizer = fs.readFileSync("pages/organize-tcm/index.uvue", "utf8");
const errors = [];

if (!settings.includes("实验室功能") || !settings.includes("openLaboratory('tcm')")) {
  errors.push("TCM organizer must be reachable from settings laboratory");
}

const organizerRequirements = [
  "原始资料",
  "showOriginalRecord",
  "toggleOriginalRecord",
  "source-editor",
  "previewReferenceImage",
  "addReferenceImages",
  "removeReferenceImage",
  "auto-height",
  "bigFormulas",
  "smallFormulas",
  "toggleFormulaStructure",
  "addBigFormula",
  "addSmallFormula",
  "isSharedMedicine",
  "方药结构",
  "辨证分析"
];

for (const requirement of organizerRequirements) {
  if (!organizer.includes(requirement)) errors.push(`TCM organizer missing: ${requirement}`);
}

if (organizer.includes("AI 整理")) {
  errors.push("TCM organizer must not show an AI organizing badge");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("TCM organizer v2 checks ok");
