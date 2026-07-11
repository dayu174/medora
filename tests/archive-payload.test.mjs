import assert from "node:assert/strict";
import fs from "node:fs";

function loadArchivePayload() {
  const source = fs
    .readFileSync("common/archive-payload.uts", "utf8")
    .replace(/export function/g, "function");
  return Function(`${source}; return { parseArchivePayload, resolveArchiveRoute };`)();
}

const { parseArchivePayload, resolveArchiveRoute } = loadArchivePayload();

{
  const payload = parseArchivePayload("```json\n{\"route\":\"tcm\",\"tcm\":{\"patternAnalysis\":\"脾胃虚弱\",\"tags\":[\"待核实\", 12]}}\n```");
  assert.equal(payload.route, "tcm");
  assert.equal(payload.tcm.patternAnalysis, "脾胃虚弱");
  assert.deepEqual(payload.tcm.tags, ["待核实"]);
}

{
  const payload = parseArchivePayload("这不是 JSON");
  assert.equal(payload, null);
}

{
  assert.equal(resolveArchiveRoute({ route: "western" }), "western");
  assert.equal(resolveArchiveRoute({ route: "unknown" }), "uncertain");
}

console.log("archive payload checks ok");
