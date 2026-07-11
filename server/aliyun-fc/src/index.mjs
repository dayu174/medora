import crypto from "node:crypto";
import OSS from "ali-oss";
import Busboy from "busboy";
import { MAX_AUDIO_BYTES, validateAudioUpload } from "./validation.mjs";

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function setCors(res) {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readAudio(req) {
  return new Promise((resolve, reject) => {
    const parser = Busboy({ headers: req.headers, limits: { files: 1, fileSize: MAX_AUDIO_BYTES } });
    let uploaded = null;
    let rejected = false;

    parser.on("file", (fieldName, stream, info) => {
      if (fieldName !== "audio" || uploaded !== null || rejected) {
        stream.resume();
        return;
      }
      const chunks = [];
      let size = 0;
      stream.on("data", (chunk) => {
        size += chunk.length;
        chunks.push(chunk);
      });
      stream.on("limit", () => { rejected = true; });
      stream.on("end", () => {
        uploaded = { mimeType: info.mimeType || "", size, buffer: Buffer.concat(chunks) };
      });
    });
    parser.on("error", reject);
    parser.on("finish", () => {
      if (rejected) {
        resolve({ mimeType: "audio/mp4", size: MAX_AUDIO_BYTES + 1, buffer: Buffer.alloc(0) });
        return;
      }
      resolve(uploaded);
    });
    req.pipe(parser);
  });
}

function createOssClient() {
  return new OSS({
    region: process.env.OSS_REGION,
    bucket: process.env.OSS_BUCKET,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  });
}

function audioExtension(mimeType) {
  if (mimeType === "audio/mpeg") return "mp3";
  if (mimeType === "audio/wav") return "wav";
  if (mimeType === "audio/aac") return "aac";
  return "m4a";
}

export async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST" || req.url?.split("?")[0] !== "/v1/media/audio") {
    sendJson(res, 404, { error: "not_found" });
    return;
  }

  try {
    const file = await readAudio(req);
    const validation = validateAudioUpload(file);
    if (!validation.ok) {
      sendJson(res, 400, { error: validation.code });
      return;
    }

    const client = createOssClient();
    const prefix = (process.env.TEMP_AUDIO_PREFIX || "medora/transcripts").replace(/\/$/, "");
    const objectKey = `${prefix}/${Date.now()}-${crypto.randomUUID()}.${audioExtension(file.mimeType)}`;
    await client.put(objectKey, file.buffer, {
      headers: { "Content-Type": file.mimeType, "x-oss-object-acl": "private" },
    });

    const ttlSeconds = Number(process.env.SIGNED_URL_TTL_SECONDS || 900);
    const url = client.signatureUrl(objectKey, { method: "GET", expires: ttlSeconds });
    sendJson(res, 200, { url, expiresAt: Date.now() + ttlSeconds * 1000 });
  } catch (error) {
    sendJson(res, 500, { error: "upload_failed" });
  }
}
