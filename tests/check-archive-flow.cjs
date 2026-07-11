const fs = require("fs");

const record = fs.readFileSync("pages/record/index.uvue", "utf8");
const archive = fs.readFileSync("common/archive-payload.uts", "utf8");
const settings = fs.readFileSync("pages/settings/index.uvue", "utf8");
const errors = [];

if (!archive.includes("parseArchiveTitle")) errors.push("archive helper must parse a title-only AI result");
if (!record.includes("标题生成器") || !record.includes('{"title":""}')) errors.push("record AI prompt must request only a title");
if (!record.includes("saveSimpleKnowledgeCard")) errors.push("record page must save title plus original text as a simple knowledge card");
if (record.includes("showRouteSheet") || record.includes("openArchiveOrganizer")) errors.push("record main flow must not route into clinical organizer pages");
if (!settings.includes("实验室功能") || !settings.includes("openLaboratory")) errors.push("experimental organizer pages must be accessed from settings laboratory");

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("archive flow contract checks ok");
