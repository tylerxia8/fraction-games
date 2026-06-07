# Fraction Equivalence — Clone Synthesis Tutor

One-week prototype: scripted chat tutor + interactive fraction manipulative for iPad web.

## Live demo

**https://tylerxia8.github.io/fraction-games/**

## Demo video

<!-- TODO: record 3–5 min walkthrough -->
[deliverables/demo.mp4](./deliverables/demo.mp4) (or hosted link)

## iPad roadmap

[docs/ipad-roadmap.md](./docs/ipad-roadmap.md) · sketches in [docs/ipad-sketches/](./docs/ipad-sketches/)

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (test on iPad via same Wi‑Fi or deployed build).

```bash
npm run build
npm run preview
```

## How to play (your game)

1. Run `npm.cmd run dev` and open the URL (iPad Safari on same Wi‑Fi for touch testing).
2. Tap **Continue** through the tutor intro.
3. **Drag the orange knob** on the circle edge to place the divider along the slice lines (or tap **Snap to half**).
4. Align the divider **straight through the middle** so the left half (3 slices of 1/3) and right half (4 slices of 1/4) are equal.
5. Tap **Smash!**, then finish the quiz.

## Technical approach

- **Stack:** Vite, React 19, TypeScript
- **Tutor:** `src/lesson/script.ts` — scripted steps + branching (no LLM)
- **Lesson controller:** `src/components/LessonShell/LessonShell.tsx` — wires chat to manipulative events
- **Manipulative logic:** `src/manipulative/circleGeometry.ts` + `useCircleFraction.ts`
- **UI:** `FractionCircle` (SVG slices + draggable divider; teaching copy on the circle)

## Repo layout

| Path | Purpose |
|------|---------|
| `src/components/TutorChat/` | Chat UI |
| `src/components/FractionManipulative/` | Fraction box / blocks |
| `src/components/LessonShell/` | App shell + phase state |
| `src/lesson/` | Script + flow |
| `src/manipulative/` | Piece types + equivalence helpers |
| `docs/` | iPad roadmap + sketches |
| `deliverables/` | Demo video |
| `CHECKLIST.md` | Full project checklist |

## Reference briefs

PDFs in repo root (cohort + Superbuilders PRD).
