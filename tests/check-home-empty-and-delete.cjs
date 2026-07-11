const fs = require("fs");

const home = fs.readFileSync("pages/home/index.uvue", "utf8");
const record = fs.readFileSync("pages/record/index.uvue", "utf8");
const errors = [];

const homeRequirements = [
  "empty-state",
  "记录你的第一条临床发现",
  "示例知识卡片",
  "example-card",
  "homeRecentRecords",
  "loadRecentRecords",
  "home-swipe-card",
  "recentSwipeStates",
  "recentTouchStart",
  "recentTouchMove",
  "recentTouchEnd",
  "deleteRecentRecord",
  "deleteLibraryEntity",
  "customKnowledgeCards",
  "deletedBuiltinKnowledgeCardIds",
  "slice(0, 10)",
  "home-delete-btn",
  "normalizeRecentRecord",
  "未命名临床记录",
  "尚未添加摘要",
  "待分类",
  "临床笔记"
];

for (const item of homeRequirements) {
  if (!home.includes(item)) errors.push(`home state missing: ${item}`);
}

if (!record.includes("homeRecentRecords")) {
  errors.push("archived records must be added to the home recent-record history");
}

if (!record.includes("getOriginalRecord") || !record.includes("firstLine")) {
  errors.push("new archived records must derive a fallback title from the source record");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("home empty state and delete checks ok");
