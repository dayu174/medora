const fs = require("fs");

const errors = [];

function read(file) {
  if (!fs.existsSync(file)) {
    errors.push(`${file}: missing`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

const manifest = read("manifest.json");
const infoPlist = read("nativeResources/ios/info.plist");
const app = read("App.uvue");
const tabs = read("components/BottomTabs/BottomTabs.uvue");
const home = read("pages/home/index.uvue");
const library = read("pages/library/index.uvue");
const record = read("pages/record/index.uvue");
const voiceCapture = read("components/VoiceCapture/VoiceCapture.uvue");
const archiveFlow = read("components/AiArchiveFlow/AiArchiveFlow.uvue");

if (!manifest.includes('"Record"')) {
  errors.push("manifest must enable the native Record module");
}

if (!infoPlist.includes("NSMicrophoneUsageDescription")) {
  errors.push("iOS native resources must declare microphone usage");
}

if (!voiceCapture.includes("uni.getRecorderManager()")) {
  errors.push("VoiceCapture must initialize the native recorder manager");
}

if (!voiceCapture.includes("onStart(") || !voiceCapture.includes("onStop(")) {
  errors.push("VoiceCapture must react to native start and stop callbacks");
}

if (!voiceCapture.includes("format: 'm4a'")) {
  errors.push("VoiceCapture must record in an iOS-friendly m4a format");
}

if (!voiceCapture.includes("this.$emit('complete'")) {
  errors.push("VoiceCapture must expose the recorded file to the record page");
}

if (!archiveFlow.includes("capturing") || !archiveFlow.includes("structuring") || !archiveFlow.includes("ready")) {
  errors.push("AiArchiveFlow must model capture, structuring, and ready states");
}

if (!record.includes("标题生成器") || !record.includes("saveSimpleKnowledgeCard")) {
  errors.push("record page must use the minimal title-only archive flow");
}

if (record.includes("<VoiceCapture") || record.includes("<AiArchiveFlow")) {
  errors.push("record main page must not expose voice or AI workflow components");
}

if (!app.includes("motion-enter") || !app.includes("motion-press")) {
  errors.push("global styles must provide reusable entry and press motion classes");
}

if (!home.includes("pageReady") || !library.includes("pageReady")) {
  errors.push("home and library must opt into staged page entry motion");
}

if (!tabs.includes("localActive") || !tabs.includes("pressedKey")) {
  errors.push("BottomTabs must provide selection and press animation state");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("motion and voice checks ok");
