const fs = require("fs");

const source = fs.readFileSync("pages/knowledge-detail/index.uvue", "utf8");
const required = [
  "detail-delete-button",
  "confirmDelete",
  "deleteKnowledgeCard",
  "uni.showModal",
  "customKnowledgeCards",
  "customKnowledgeCardsJson",
  "readStorageList(jsonKey: string, legacyKey: string)",
  "writeStorageList(jsonKey: string, legacyKey: string, list: any[])",
  "diseaseId"
];

const missing = required.filter((item) => !source.includes(item));
if (missing.length > 0) {
  console.error(`knowledge detail delete control missing: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("knowledge detail delete checks ok");
