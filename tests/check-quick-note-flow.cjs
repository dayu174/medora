const fs = require("fs");
const record = fs.readFileSync("pages/record/index.uvue", "utf8");
const library = fs.readFileSync("pages/library/index.uvue", "utf8");
const home = fs.readFileSync("pages/home/index.uvue", "utf8");
const files = [record, library, home];
const requirements = ["saveSimpleKnowledgeCard", "simple_note", "sourceContent", "simple-note-card", "openCardFocus", "card-focus-mask", "openRecentCard"];
const missing = requirements.filter((item) => !files.some((source) => source.includes(item)));
if (missing.length > 0) { console.error(`simple knowledge flow missing: ${missing.join(', ')}`); process.exit(1); }
const saveStart = record.indexOf("saveSimpleKnowledgeCard(");
const saveEnd = record.indexOf("transcribeVoice", saveStart);
const save = saveStart >= 0 && saveEnd > saveStart ? record.slice(saveStart, saveEnd) : "";
if (!save.includes("homeRecentRecords")) {
  console.error("simple knowledge save does not synchronize homeRecentRecords");
  process.exit(1);
}
if (!record.includes("storageList(raw: any)") || !save.includes("this.storageList(stored)") || !save.includes("this.storageList(storedRecent)")) {
  console.error("simple knowledge save must normalize storage arrays before updating them");
  process.exit(1);
}
if (!save.includes("customKnowledgeCardsJson") || !save.includes("homeRecentRecordsJson") || !record.includes("readStorageList(jsonKey: string, legacyKey: string)") || !record.includes("writeStorageList(jsonKey: string, legacyKey: string, list: any[])")) {
  console.error("simple knowledge save must persist JSON-first storage for iPhone cross-page reads");
  process.exit(1);
}
if (record.includes("MedoraArchiveDebug")) {
  console.error("temporary archive debug logging must be removed");
  process.exit(1);
}
if (record.includes("setTimeout(() => {\n              this.handleArchivePayload")) {
  console.error("archive persistence is delayed until after the success preview");
  process.exit(1);
}
if (!library.includes("simple-note-divider") || !library.includes("simple-note-source-label")) {
  console.error("simple knowledge cards must visibly separate the title from the original record");
  process.exit(1);
}
if (!library.includes(".simple-note-title { color: #294b48; font-size: 20px; line-height: 28px; font-weight: 700;") || !library.includes(".simple-note-content { height: 40px; overflow: hidden; color: #66716e; font-size: 13px; line-height: 20px;")) {
  console.error("simple knowledge cards must give titles stronger visual hierarchy than source content");
  process.exit(1);
}
if (!home.includes("recent-record-source-label") || !home.includes("recent-record-divider")) {
  console.error("recent record cards must visibly separate titles from source content");
  process.exit(1);
}
if (!library.includes("sourceContent: sourceContent")) {
  console.error("library normalization must retain original content for simple note cards");
  process.exit(1);
}
console.log("simple knowledge flow checks ok");
