# AI Archive Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn an editable voice transcript into a safe, structured TCM or Western clinical draft, then open the appropriate editable organizer page.

**Architecture:** The app retains the user's Bailian API Key only in local storage. A small Function Compute service stores a recorded audio file in private OSS and returns a short-lived signed URL; the app calls Bailian ASR and chat completion directly. A small pure TypeScript-compatible UTS helper normalizes model JSON and decides whether to route to TCM, Western, or a user choice sheet.

**Tech Stack:** uni-app x (`.uvue`), UTS, Alibaba Cloud Bailian compatible API, Alibaba Cloud Function Compute, OSS.

## Global Constraints

- Target iPhone 16 Pro and HBuilderX uni-app x only.
- Uvue styles use class selectors and supported layout values only.
- AI may extract or rewrite supplied text only; it must mark unsupported facts as `待补充` or `待核实`.
- Images remain local attachments and are never sent to ASR or the AI archive request.
- Do not send or log a user's Bailian API Key through the upload service.

---

### Task 1: Archive Data Contract

**Files:**
- Create: `utils/archive-payload.uts`
- Create: `tests/archive-payload.test.mjs`

**Interfaces:**
- Produces `normalizeArchivePayload(raw: string): ArchivePayload | null`.
- Produces `resolveArchiveRoute(payload: ArchivePayload): 'tcm' | 'western' | 'uncertain'`.

- [ ] Write a failing Node test with fenced JSON, an invalid response, and an uncertain route.
- [ ] Run `node --test tests/archive-payload.test.mjs` and observe the missing-module failure.
- [ ] Implement strict JSON extraction, trimming and route normalization without adding medical content.
- [ ] Re-run the test until all cases pass.

### Task 2: TCM Organizer

**Files:**
- Create: `pages/organize-tcm/index.uvue`
- Modify: `pages.json`
- Modify: `pages/record/index.uvue`

**Interfaces:**
- Consumes an `archivePayload` saved under a transient storage key.
- Emits `organizeDone` with the existing save contract plus `sourceMode`.

- [ ] Add a failing static contract test checking the page and route registration exist.
- [ ] Implement a single-column TCM organizer matching the Stitch hierarchy: header, source transcript, four inspection chips, analysis, therapy, formula, tags and completion.
- [ ] Keep every generated field editable, preserve blank/uncertain values, and use only class selectors.
- [ ] Verify static Uvue constraints and the page registration.

### Task 3: AI Archive and Routing

**Files:**
- Modify: `pages/record/index.uvue`
- Modify: `pages/organize/index.uvue`

**Interfaces:**
- `onSmartArchive()` sends the edited transcript only.
- `openArchiveResult(payload, source)` opens one organizer or the specialty-choice sheet.

- [ ] Add a failing test for JSON extraction and the three routes.
- [ ] Replace free-text overwrite behavior with a strict JSON prompt and normalized payload.
- [ ] Prefill Western fields using the same transient payload mechanism; preserve existing manual organize behavior.
- [ ] Add retry/error states that keep the user’s edited draft intact.
- [ ] Run the archive-payload test and static source checks.

### Task 4: Voice Transcription Transport

**Files:**
- Create: `server/aliyun-fc/package.json`
- Create: `server/aliyun-fc/src/index.mjs`
- Create: `server/aliyun-fc/.env.example`
- Create: `server/aliyun-fc/README.md`
- Modify: `pages/record/index.uvue`

**Interfaces:**
- FC `POST /v1/media/audio` accepts one recorded file and returns `{ url, expiresAt }`.
- App uploads audio, calls `qwen3-asr-flash` with the returned signed URL, and inserts the transcript into the editable input.

- [ ] Add a failing FC request validation test for non-audio and missing uploads.
- [ ] Implement size/type validation, private OSS upload and short-lived GET URL creation; do not log file bytes, transcript, or API keys.
- [ ] Implement client upload and ASR success/error states; retain the local recording after an error.
- [ ] Verify service syntax and source contract tests.

### Task 5: iPhone and Uvue Verification

**Files:**
- Modify only files affected by failures from this task.

- [ ] Run `node --test tests/archive-payload.test.mjs`.
- [ ] Scan the new/modified Uvue styles for element selectors, unsupported `display` values, and `position: fixed`.
- [ ] Run the project’s available HBuilderX/uni-app static build command; record any environment-only limitation precisely.
- [ ] Review the final diff to ensure unrelated user changes are untouched.
