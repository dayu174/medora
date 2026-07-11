const fs = require("fs");

const source = fs.readFileSync("pages/library/index.uvue", "utf8");
const onShow = source.indexOf("onShow()")
const methods = source.indexOf("methods:")
const loadCustomCards = source.indexOf("loadCustomCards() {", methods)

if (onShow < 0 || methods < 0 || loadCustomCards < methods) {
  console.error("library lifecycle loader must be declared inside methods");
  process.exit(1);
}

const required = [
  "librarySwipeStates",
  "libraryTouchStart",
  "libraryTouchMove",
  "libraryTouchEnd",
  "deleteLibraryCard",
  "deletedBuiltinKnowledgeCardIds"
];
const missing = required.filter((item) => !source.includes(item));
if (missing.length > 0) {
  console.error(`library swipe delete missing: ${missing.join(", ")}`);
  process.exit(1);
}

if (!source.includes(':class="libraryItemClass(index)"')) {
  console.error("library swipe entry motion must be applied to the outer list item");
  process.exit(1);
}

if (source.includes("entryClass('article-card card'")) {
  console.error("article card must not animate separately from its swipe delete layer");
  process.exit(1);
}

if (source.includes("libraryDeleteClass") || source.includes("library-delete-hidden")) {
  console.error("library delete button should match home: fixed behind the swipe surface");
  process.exit(1);
}

console.log("library lifecycle checks ok");
