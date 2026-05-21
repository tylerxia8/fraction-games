import type { GameLevel } from '../lesson/levels';

/** Slicer — Laser Align */
export const LASER_COPY = {
  levelMenuSub: 'Two missions — align the laser, then sync the shield.',
  exploreHintL1: 'Drag the laser arm along the grid. Line it up straight through the middle.',
  exploreHintL2: 'Move the laser to the top, right, bottom, or left — four lock positions.',
  snapReady: 'Beams aligned ✓',
  snapL1: 'Align Laser',
  snapL2: 'Lock Beams',
  smashReady: 'Sync Shield!',
  smashMerging: 'Syncing…',
  smashed: 'Shield synced!',
  level1Sub: 'Beam split',
  level2Sub: 'Quad grid',
};

/** Wedge — Planet Builder */
export const PLANET_COPY = {
  levelMenuSub: 'Build each planet — place every terrain wedge in orbit.',
  hint: 'Drag each terrain wedge into its orbit slot on the planet.',
  insertMessage: 'Orbit complete! The planet is whole — the fractions line up.',
  allInserted: 'Planet assembled! Tap “See the match!” to power up the core.',
  dragging: 'Guide the wedge into its matching orbit slot.',
  smashReady: 'Power the core!',
  smashMerging: 'Charging…',
  smashed: 'Core online!',
};

/** Compare Circles — Spotlight Show */
export const SPOTLIGHT_COPY = {
  modeBlurb: 'Which spotlight is brighter? Compare the lit slices with <, >, or =.',
  modeTimedDesc: 'Race through 10 stage pairs under the lights.',
  modePracticeDesc: 'No clock — take in each spotlight at your own pace.',
  promptIdle: 'Which circle has more light? Pick <, >, or =.',
  promptWrong: 'Count the golden lit slices. Which spotlight shines more?',
  promptCorrect: 'Encore! The stage lights agree with your sign.',
  done: 'Curtain call! Play again to beat your best time!',
  donePractice: 'Curtain call! Every spotlight compared perfectly.',
};

/** Compare Fractions — Racing Fractions */
export const RACING_COPY = {
  modeBlurb: 'Which fraction is faster on the track? Pick <, >, or = to pass the finish.',
  modeTimedDesc: 'Race through 10 laps — fastest run wins the cup.',
  modePracticeDesc: 'Pit stop mode — no clock, just compare each pair.',
  promptIdle: 'Which fraction is bigger? Pick <, >, or = to win the lap.',
  promptWrong: 'Which number is larger? The faster car has the bigger fraction.',
  promptCorrect: 'Green flag! You picked the right sign.',
  done: 'Race over! Play again to beat your fastest lap.',
  donePractice: 'Race over! Every lap compared correctly.',
};

export function getSlicerLevelAccent(level: GameLevel): string {
  return level === 1 ? '#00b4d8' : '#9d4edd';
}
