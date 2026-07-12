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

const sharedTransitionRequirements = [
  "uni.createSelectorQuery",
  "sharedCard",
  "openSharedCard",
  "sharedCardTransform",
  "shared-card-overlay",
  "shared-card-stage",
  "sharedDragStart",
  "sharedDragMove",
  "sharedDragEnd",
  "recent-card-pressed",
  "shared-card-content-layer",
  "sharedContentTransform",
  "resetRecentSwipeStates"
];
for (const item of sharedTransitionRequirements) {
  if (!home.includes(item)) errors.push(`home shared-card transition missing: ${item}`);
}

if (!home.includes("const stageHeight = 480") || !home.includes("const stageTop = 160") || !/\.shared-card-stage\s*\{[^}]*width:\s*361px;[^}]*height:\s*480px/.test(home)) {
  errors.push("shared knowledge card must expand to the centered 60 percent reading panel, not full screen");
}

if (!/\.home-swipe-card\s*\{[^}]*overflow:\s*visible/.test(home)) {
  errors.push("recent card swipe surface must not clip the card while it moves left");
}

if (!/recentTouchStart\([\s\S]*?state\.translateX\s*=\s*0/.test(home)) {
  errors.push("pressing a recent card must reset its existing swipe offset before press feedback");
}

if (home.includes("recent-card-hidden") || home.includes("sharedSourceHidden")) {
  errors.push("shared-card transition must not hide the source card through persistent opacity state");
}

if (!/v-if="recentTranslate\(index\) < -4 && sharedCard == null"/.test(home)) {
  errors.push("delete action must only mount while its card is actively swiped open");
}

if (!/\.home-delete-btn\s*\{[^}]*border-top-right-radius:\s*16px;[^}]*border-bottom-right-radius:\s*16px/.test(home)) {
  errors.push("delete action must retain the rounded right edge after removing swipe clipping");
}

const frostedBackdropRequirements = ["sharedBackdropClass", "shared-card-backdrop-hidden", "shared-card-frost-layer"];
for (const item of frostedBackdropRequirements) {
  if (!home.includes(item)) errors.push(`shared card frosted backdrop missing: ${item}`);
}

if (!/\.shared-card-backdrop\s*\{[^}]*background-color:\s*rgba\(244,\s*247,\s*246,\s*0\.72\)/.test(home)) {
  errors.push("shared card backdrop must use a unified light frosted surface instead of a dark gray scrim");
}

if (!record.includes("homeRecentRecords")) {
  errors.push("archived records must be added to the home recent-record history");
}

if (!record.includes("getOriginalRecord") || !record.includes("firstLine")) {
  errors.push("new archived records must derive a fallback title from the source record");
}

const notificationSwipeRequirements = [
  "armed: boolean",
  "deleting: boolean",
  "const deleteThreshold = 361 * 0.55",
  "deleteActionStyle",
  "finishSwipeDelete",
  "deleteRecentRecordById",
  "home-delete-btn-armed",
  "deletingRecentId"
];
for (const item of notificationSwipeRequirements) {
  if (!home.includes(item)) errors.push(`notification swipe delete missing: ${item}`);
}

if (!/state\.armed\s*=\s*distance\s*>=\s*deleteThreshold/.test(home)) {
  errors.push("swipe deletion must arm at 55 percent of the card width");
}
if (!/setTimeout\(\(\)\s*=>\s*\{\s*this\.deleteRecentRecordById/.test(home)) {
  errors.push("armed release must finish its slide before stable-ID removal");
}
if (!/\.home-delete-btn-armed\s*\{[^}]*background-color:\s*#9f1414/i.test(home)) {
  errors.push("armed delete action must receive a stronger red state");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("home empty state and delete checks ok");
