# Medora Audio Upload Service

This Function Compute HTTP handler accepts one multipart field named `audio`, stores it in a private OSS bucket, and returns a short-lived signed GET URL. It never receives the user's Bailian API Key.

## Deploy

1. Create a private OSS bucket and add an OSS lifecycle rule that deletes `medora/transcripts/` objects after 1 day.
2. Create an Alibaba Cloud Function Compute Node.js 20 HTTP function. Set the handler to `src/index.handler`.
3. Add the environment variables from `.env.example` in Function Compute. Keep `OSS_ACCESS_KEY_SECRET` in FC configuration only.
4. Install deployment dependencies with `npm install` in this directory, then deploy the function through the FC console or Serverless Devs.
5. Copy the HTTPS function URL without a trailing slash. In Medora Settings, paste it into `语音服务地址`.

The app uploads a recorded M4A file, receives a signed URL, and calls Bailian ASR directly with the API Key stored only on the device. Signed URLs expire after 15 minutes by default; the OSS lifecycle rule removes the temporary recording after 24 hours.
