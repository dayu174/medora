const fs = require("fs");
const source = fs.readFileSync("pages/library/index.uvue", "utf8");
const home = fs.readFileSync("pages/home/index.uvue", "utf8");
const required = ["normalizeLibraryCard", "fallbackTitles", "library-header", "search-icon-img", "cards: [] as any[]"];
const missing = required.filter((item) => !source.includes(item));
if (missing.length > 0) { console.error(`library render model missing: ${missing.join(', ')}`); process.exit(1); }
if (source.includes("<AppHeader")) { console.error("library must use the same brand header structure as home"); process.exit(1); }
if (!source.includes("JSON.parse(JSON.stringify(raw))")) { console.error("library must normalize UTS storage objects before reading fields"); process.exit(1); }
if (!home.includes("JSON.parse(JSON.stringify(raw))")) { console.error("home must normalize UTS storage objects before reading fields"); process.exit(1); }
if (!source.includes("storageList(raw: any)") || !source.includes("this.storageList(custom)") || !source.includes("this.storageList(storedIds)")) {
  console.error("library must normalize stored arrays before rendering cards");
  process.exit(1);
}
if (!home.includes("storageList(raw: any)") || !home.includes("this.storageList(stored)")) {
  console.error("home must normalize stored arrays before rendering recent records");
  process.exit(1);
}
const jsonStorageRequirements = ["customKnowledgeCardsJson", "deletedBuiltinKnowledgeCardIdsJson", "readStorageList(jsonKey: string, legacyKey: string)", "writeStorageList(jsonKey: string, legacyKey: string, list: any[])"];
const libraryJsonMissing = jsonStorageRequirements.filter((item) => !source.includes(item));
if (libraryJsonMissing.length > 0) { console.error(`library JSON-first storage missing: ${libraryJsonMissing.join(", ")}`); process.exit(1); }
const homeJsonRequirements = ["homeRecentRecordsJson", "customKnowledgeCardsJson", "deletedBuiltinKnowledgeCardIdsJson", "readStorageList(jsonKey: string, legacyKey: string)", "writeStorageList(jsonKey: string, legacyKey: string, list: any[])"];
const homeJsonMissing = homeJsonRequirements.filter((item) => !home.includes(item));
if (homeJsonMissing.length > 0) { console.error(`home JSON-first storage missing: ${homeJsonMissing.join(", ")}`); process.exit(1); }
console.log("library render model checks ok");
