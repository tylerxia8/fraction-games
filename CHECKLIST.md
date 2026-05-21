# Week 4 — Clone Synthesis Tutor (Fraction Equivalence)

**Demo:** Friday noon · **Concept:** 1/2 = 2/4 · **Platform:** iPad web browser

Use this checklist against the paths below. Check items as you complete them.

---

## Repo map (current → target)

| Path | Status | Purpose |
|------|--------|---------|
| `*.pdf` | ✅ Present | Cohort + hiring-partner briefs (reference only) |
| `extracted-text.txt` | ✅ Present | PDF text export (optional; safe to delete) |
| `extract-pdf.js` | ✅ Present | One-off PDF tool (optional; move to `scripts/` or delete) |
| `package.json` | ✅ Present | Vite + React; `dev` / `build` / `preview` |
| `README.md` | ⚠️ Stub | Run instructions + technical approach (fill TBDs) |
| `docs/ipad-roadmap.md` | ⚠️ Stub | Touch targets, gestures, iPad vs desktop |
| `docs/ipad-sketches/` | ✅ Present | Sketches/screenshots for roadmap |
| `deliverables/demo.mp4` | ⬜ Create | 3–5 min demo (or link in README) |
| `public/` | ✅ Present | Static assets (icons, sounds if any) |
| `src/` | ✅ Present | Application source (stubs wired) |
| `index.html` | ✅ Present | App entry (Vite) |
| `scripts/extract-pdf.js` | ✅ Present | Optional PDF text tool |

---

## Friday deliverables (turn-in)

### `README.md` (repo root)

- [ ] How to install dependencies and run locally
- [ ] **Live deployed URL** (clickable)
- [ ] Short **technical approach** (stack, architecture, key decisions)
- [ ] Link to demo video (`deliverables/demo.mp4` or hosted URL)
- [ ] Link to `docs/ipad-roadmap.md`

### Deployed web app

- [ ] Public URL works in a **fresh browser** (not only your dev machine)
- [ ] Single lesson: **fraction equivalence** only
- [ ] No “imagine if” — full flow runnable without setup explanation

### `deliverables/demo.mp4` (or external link in README)

- [ ] **3–5 minutes** (cohort kickoff requirement)
- [ ] Shows **conversational tutor** flow (right + wrong answers)
- [ ] Shows **manipulative** (drag, combine, split/smash)
- [ ] Shows lesson **start → win** (check for understanding)

### `docs/ipad-roadmap.md` + `docs/ipad-sketches/`

- [ ] How the lesson layout works on iPad (chat + manipulative)
- [ ] **Minimum touch target** sizes (e.g. 44pt) called out
- [ ] Gestures: drag, drop, snap, smash (what each does)
- [ ] What differs from desktop (if anything)
- [ ] At least one sketch or screenshot in `docs/ipad-sketches/`

---

## Product requirements (map to `src/`)

### `src/components/TutorChat/` — conversational tutor

- [ ] Chat-style UI (messages from tutor + student)
- [ ] **`src/lesson/script.ts`** — scripted dialogue (no LLM required)
- [ ] Warm, encouraging tone throughout
- [ ] Branching on **correct** vs **incorrect** answers
- [ ] Tutor prompts tied to manipulative state where it matters

### `src/components/FractionManipulative/` — interactive workspace

- [ ] Visual **fraction box** / blocks (e.g. 1/2, 1/4 pieces)
- [ ] Student can **drag** pieces
- [ ] Student can **combine** pieces
- [ ] Student can **split** pieces
- [ ] Signature **“smash”** (or equivalent) gesture for equivalence
- [ ] Feedback when combinations match equivalent amounts (1/2 ↔ 2/4)

### `src/lesson/flow.ts` — lesson structure

- [ ] **Explore** — student plays with manipulative before heavy questioning
- [ ] **Instruct** — tutor asks formal questions
- [ ] **Check** — short assessment (several problems)
- [ ] Lesson **ends on success** (“I got it” moment — clear win state)
- [ ] Wrong-answer **recovery** scripted (warmth on miss)

### `src/components/LessonShell/` (or `App.tsx`) — layout

- [ ] Tutor + manipulative **side by side** (or stacked on narrow/iPad)
- [ ] iPad-friendly layout (readable, tappable, no desktop-only hover)
- [ ] Lesson state drives which script step + which manipulative affordances are active

---

## iPad & quality (`src/` + `docs/`)

### `src/` — touch & performance

- [ ] Tested on **physical iPad** (cohort device)
- [ ] Tap targets large enough for child fingers (document sizes in roadmap)
- [ ] No tiny click-only controls; touch-first interactions
- [ ] Drag/drop works with touch (not mouse-only)
- [ ] No horizontal scroll or clipped UI on iPad viewport
- [ ] Feels like **exploration**, not homework (copy, pacing, motion)

### `docs/ipad-roadmap.md`

- [ ] Thursday iPad test notes captured (bugs fixed or listed as known)
- [ ] Roadmap matches what you actually built (not aspirational only)

---

## Hiring-partner polish (whole repo)

- [ ] Read briefs in `*.pdf` twice; every deliverable above checked
- [ ] Researched **Synthesis / Superbuilders** brand (colors, fonts, tone) — reflect in `src/styles/` or theme
- [ ] Loading / empty states where needed
- [ ] Basic error handling (broken state, invalid actions)
- [ ] README + demo frame value **for the partner**, not only features
- [ ] Mock presentation practiced (architecture, “why this way?”)
- [ ] Optional: one small **extra** feature with rationale in README

---

## 5-day schedule (by folder)

### Monday — `docs/` + paper, no app required yet

- [ ] Read `Superbuilders-Synthesis.pdf` + `Week 4 Kickoff — Clone Synthesis Tutor.pdf`
- [ ] Play/reference Synthesis; note “lean in” moments
- [ ] Paper sketch of full lesson → informs `src/lesson/script.ts` + `flow.ts`
- [ ] Define **smash** gesture and win state on paper
- [ ] Scaffold repo: `src/`, `public/`, `docs/`, `deliverables/`, app `package.json` scripts

### Tuesday — `src/components/FractionManipulative/`

- [ ] Manipulative on screen
- [ ] Drag, drop, snap working
- [ ] Ignore tutor wiring today if needed

### Wednesday — `src/components/TutorChat/` + `src/lesson/`

- [ ] `script.ts` complete with branches
- [ ] Chat wired to lesson state
- [ ] Chat ↔ manipulative sync (tutor reacts to student actions)

### Thursday — iPad + `docs/ipad-roadmap.md`

- [ ] iPad test pass; fix tap/drag issues in `src/`
- [ ] Draft roadmap + add sketches to `docs/ipad-sketches/`
- [ ] Polish wrong-answer recovery in `script.ts`

### Friday (noon) — root deliverables

- [ ] Deploy → URL in `README.md`
- [ ] Record → `deliverables/demo.mp4`
- [ ] Finalize `README.md` + `docs/ipad-roadmap.md`
- [ ] Quick pass: all sections in **Friday deliverables** above

---

## Suggested `src/` tree (create as you go)

```text
src/
├── main.tsx                 # bootstrap
├── App.tsx                  # or LessonShell layout
├── components/
│   ├── TutorChat/
│   │   └── TutorChat.tsx
│   ├── FractionManipulative/
│   │   └── FractionBox.tsx
│   └── LessonShell/
│       └── LessonShell.tsx
├── lesson/
│   ├── script.ts            # dialogue + branching
│   └── flow.ts              # explore → instruct → check
├── manipulative/
│   └── types.ts             # fraction piece types, snap rules
└── styles/
    └── theme.css            # Synthesis-adjacent brand tokens
```

---

## Out of scope (do not checklist)

- Full curriculum or multiple lessons
- Adaptive / LLM tutor
- User accounts or backend (unless you explicitly choose otherwise)

---

## Cleanup (optional)

- [ ] Remove or relocate `extract-pdf.js`, `extracted-text.txt` if not needed for the app
- [ ] Add `.gitignore` for `node_modules/`, `dist/`, `.env`
- [ ] Separate app `package.json` from PDF tooling if you keep both

---

## Quick reference

| Judged on | Primary paths |
|-----------|----------------|
| Interaction quality | `src/components/TutorChat/`, `src/components/FractionManipulative/` |
| Lesson coherence | `src/lesson/script.ts`, `src/lesson/flow.ts` |
| Demo-readiness | Deployed URL, `README.md`, `deliverables/demo.mp4`, `docs/ipad-roadmap.md` |
