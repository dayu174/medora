import assert from "node:assert/strict";
import fs from "node:fs";

function loadDataModule() {
  const source = fs
    .readFileSync("common/medora-data.uts", "utf8")
    .replace(/export const/g, "const");
  return Function(`${source}; return { tabs, records, knowledgeCards, settingsSections, accountItems, notifications, calculators, heartFailure };`)();
}

function loadMedicalModule() {
  const source = fs
    .readFileSync("common/medical.uts", "utf8")
    .replace(/export function/g, "function");
  return Function(`${source}; return { calculateBmi, getBmiStatus };`)();
}

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test("app data exposes Medora tab navigation", () => {
  const { tabs } = loadDataModule();
  assert.deepEqual(tabs.map((tab) => tab.text), ["首页", "资料库", "我的"]);
  assert.equal(tabs[0].path, "/pages/home/index");
  assert.equal(tabs[0].activeIcon, "/static/tabs/home-active.png");
  assert.equal(tabs[1].icon, "/static/tabs/book.png");
  assert.equal(tabs[2].avatar, "/static/tabs/avatar.svg");
});

test("records include Stitch clinical examples", () => {
  const { records } = loadDataModule();
  assert.equal(records[0].title, "急性阑尾炎");
  assert.ok(records.some((record) => record.title === "社区获得性肺炎"));
});

test("knowledge data includes heart failure detail", () => {
  const { heartFailure } = loadDataModule();
  assert.equal(heartFailure.title, "心力衰竭");
  assert.ok(heartFailure.symptomGroups.length >= 2);
  assert.ok(heartFailure.treatments.coreDrugs.length >= 4);
});

test("settings data exposes account and notification routes", () => {
  const { settingsSections } = loadDataModule();
  const paths = settingsSections.flatMap((section) => section.items.map((item) => item.path));
  assert.ok(paths.includes("/pages/account-security/index"));
  assert.ok(paths.includes("/pages/notifications/index"));
});

test("calculateBmi returns a one-decimal BMI", () => {
  const { calculateBmi } = loadMedicalModule();
  assert.equal(calculateBmi("175", "68"), "22.2");
});

test("calculateBmi rejects invalid measurements", () => {
  const { calculateBmi } = loadMedicalModule();
  assert.equal(calculateBmi("", "68"), "");
  assert.equal(calculateBmi("175", "0"), "");
});

test("getBmiStatus maps normal BMI to Chinese copy", () => {
  const { getBmiStatus } = loadMedicalModule();
  assert.equal(getBmiStatus("22.2").label, "正常范围");
});

let failures = 0;
for (const item of tests) {
  try {
    item.fn();
    console.log(`ok - ${item.name}`);
  } catch (error) {
    failures += 1;
    console.error(`not ok - ${item.name}`);
    console.error(error);
  }
}

if (failures > 0) process.exit(1);
