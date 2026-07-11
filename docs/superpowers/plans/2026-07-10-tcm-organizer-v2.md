# TCM Organizer V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved Medora TCM organizer redesign with collapsible editable source material and editable big-formula to small-formula hierarchy.

**Architecture:** The record page stores local image paths with the transient archive payload. The TCM organizer reads that payload into an editable collapsed source section and maintains `bigFormulas -> smallFormulas -> medicines`; shared medicines are derived across all small formulas while each small formula remains owned by one big formula.

**Tech Stack:** uni-app x Uvue, UTS, iPhone 16 Pro layout, existing local storage/event-channel flow.

## Global Constraints

- Images are local reference attachments and must not be sent in ASR or AI archive requests.
- Uvue CSS uses only simple class selectors and supported values.
- AI-supplied content remains editable and unsupported facts stay `待核实`.

### Task 1: Archive Attachment Contract

**Files:**
- Modify: `pages/record/index.uvue`
- Test: `tests/check-tcm-organizer-v2.cjs`

- [ ] Write a failing source-contract test requiring `attachedImages` in the transient archive payload.
- [ ] Run `node tests/check-tcm-organizer-v2.cjs` and observe failure.
- [ ] Store a copy of composer attachments alongside `payload` and `sourceContent`.
- [ ] Re-run the contract test.

### Task 2: TCM Organizer V2

**Files:**
- Modify: `pages/organize-tcm/index.uvue`
- Test: `tests/check-tcm-organizer-v2.cjs`

- [ ] Extend the failing contract test for collapsible editable source, `auto-height` inputs, big-formula and small-formula controls.
- [ ] Replace the linear form with collapsed source, diagnosis, four-diagnosis, treatment, and compact formula summary sections.
- [ ] Add editable `bigFormulas -> smallFormulas -> medicines`; derive shared-medicine labels from medicine names across small formulas.
- [ ] Run static Uvue checks and the organizer contract test.

### Task 3: Verification

**Files:**
- Modify only files failing checks.

- [ ] Run all project static checks plus archive tests.
- [ ] Scan touched Uvue styles for unsupported selectors and CSS values.
- [ ] Review the diff to confirm photos are never included in AI request payloads.
