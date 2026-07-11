const fs = require("fs");

const organizer = fs.readFileSync("pages/organize/index.uvue", "utf8");
const errors = [];

const required = [
  "整理记录（临床）",
  "showOriginalRecord",
  "toggleOriginalRecord",
  "referenceImages",
  "previewReferenceImage",
  "addReferenceImages",
  "removeReferenceImage",
  "治疗方案",
  "treatmentGoals",
  "addTreatmentGoal",
  "removeTreatmentGoal",
  "addMedication",
  "addNonDrugAction",
  "risk",
  "showMonitoring",
  "toggleMonitoring",
  "monitoringItems",
  "reviewMilestones",
  "showClinicalNotes",
  "auto-height"
];

for (const item of required) {
  if (!organizer.includes(item)) errors.push(`clinical organizer missing: ${item}`);
}

if (organizer.includes("AI 整理")) {
  errors.push("clinical organizer must not show an AI organizing badge");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("clinical organizer v2 checks ok");
