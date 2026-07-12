const fs = require("fs");

const home = fs.readFileSync("pages/home/index.uvue", "utf8");
const errors = [];
const requiredMarkup = [
  "新建记录",
  "记录此刻想记住的医学知识...",
  "inline-record-close",
  "inline-record-count",
  "inlineArchiveClass()",
  "onInlineSmartArchive",
  "closeInlineComposer",
  "inlineComposerFocused"
];
const requiredMotion = [
  "transition-property: width, height, border-radius, opacity, padding-left, padding-right",
  "transition-duration: 380ms",
  "transition-delay: 30ms",
  "transition-delay: 90ms",
  "transition-delay: 40ms",
  "overflow: hidden"
];

for (const item of requiredMarkup) {
  if (!home.includes(item)) errors.push(`composer UI contract missing: ${item}`);
}
for (const item of requiredMotion) {
  if (!home.includes(item)) errors.push(`composer motion contract missing: ${item}`);
}

if (!/\.inline-record-content-active\s*\{[^}]*height:\s*152px;[^}]*opacity:\s*1;[^}]*transform:\s*translateY\(0\)/.test(home)) {
  errors.push("composer final layout must remain the current visible state");
}
if (!/\.quick-calc-collapsing\s*\{[^}]*transition-delay:\s*40ms/.test(home)) {
  errors.push("calculator collapse must begin after record card expansion starts");
}
if (!/\.quick-record-summary-hidden\s*\{[^}]*transition-delay:\s*30ms/.test(home)) {
  errors.push("compact card summary must fade after root expansion begins");
}
if (!/:focus="inlineComposerFocused"/.test(home)) {
  errors.push("textarea focus must be independent from the opening state");
}
if (!/setTimeout\(\(\)\s*=>\s*\{\s*if\s*\(this\.inlineComposerOpen\)\s*this\.inlineComposerFocused\s*=\s*true\s*\},\s*400\)/.test(home)) {
  errors.push("composer focus must wait until the opening transition has finished");
}
if (!/closeInlineComposer\(\)\s*\{[\s\S]*?this\.inlineComposerFocused\s*=\s*false/.test(home)) {
  errors.push("closing the composer must cancel delayed focus");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("inline record card motion checks ok");
