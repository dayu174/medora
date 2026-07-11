import assert from "node:assert/strict";
import { validateAudioUpload } from "../server/aliyun-fc/src/validation.mjs";

assert.deepEqual(validateAudioUpload({ mimeType: "audio/mp4", size: 1024 }), { ok: true });
assert.equal(validateAudioUpload({ mimeType: "image/jpeg", size: 1024 }).code, "unsupported_type");
assert.equal(validateAudioUpload({ mimeType: "audio/mp4", size: 11 * 1024 * 1024 }).code, "file_too_large");
assert.equal(validateAudioUpload(null).code, "missing_audio");

console.log("audio upload validation checks ok");
