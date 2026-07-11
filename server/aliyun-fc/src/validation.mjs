const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/aac",
  "audio/mp4",
  "audio/m4a",
  "audio/mpeg",
  "audio/wav",
  "audio/x-m4a",
]);

export function validateAudioUpload(file) {
  if (!file || !file.mimeType || !Number.isFinite(file.size) || file.size <= 0) {
    return { ok: false, code: "missing_audio" };
  }
  if (!SUPPORTED_AUDIO_TYPES.has(file.mimeType.toLowerCase())) {
    return { ok: false, code: "unsupported_type" };
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return { ok: false, code: "file_too_large" };
  }
  return { ok: true };
}

export { MAX_AUDIO_BYTES };
