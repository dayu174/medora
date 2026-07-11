const fs = require("fs");

const source = fs.readFileSync("pages/record/index.uvue", "utf8");
const errors = [];

const requiredText = ["新建记录", "智能归档", "保存"];
for (const text of requiredText) {
  if (!source.includes(text)) errors.push(`record page missing text: ${text}`);
}

const requiredHooks = [
  '@tap="goBack"',
  '@tap="onSmartArchive"',
  'requestSmartArchive',
  'parseArchiveTitle',
  'saveSimpleKnowledgeCard',
];
for (const hook of requiredHooks) {
  if (!source.includes(hook)) errors.push(`record page missing interaction: ${hook}`);
}

if (!source.includes('<scroll-view class="page-scroll" scroll-y="true" :show-scrollbar="false">')) {
  errors.push("record page must use an indicator-free vertical scroll view");
}
if (!source.includes('class="back-hit"') || !/goBack\(\)\s*\{[^}]*uni\.navigateBack/.test(source)) {
  errors.push("record page must expose a working back affordance");
}
if (!source.includes('v-model="draftContent"')) errors.push("record page must keep the transcript editable");
if (source.includes("<VoiceCapture") || source.includes("<AiArchiveFlow")) {
  errors.push("record page must only expose text archive controls");
}
if (!source.includes("标题生成器") || !source.includes('{"title":""}')) {
  errors.push("record page must request a title-only AI result");
}
if (source.includes("showRouteSheet") || source.includes("openArchiveOrganizer")) {
  errors.push("record page must not expose organizer routing in the main flow");
}
if (source.includes('@tap="saveRecord"') || source.includes('v-if="pendingDrafts.length')) {
  errors.push("record page must not expose a pending-draft workflow");
}
if (/console\.log\('\[SmartArchive\]/.test(source)) {
  errors.push("record page must not log AI archive responses");
}
if (!/\.r-main\s*\{[^}]*padding:\s*24px\s+24px\s+0/.test(source)) {
  errors.push("record page must use equal 24px side margins");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("record page checks ok");
