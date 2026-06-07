import type { GameLevel } from './levels';
import { WHOLE_EQUIV } from './levels';
import type { ScriptStep } from './script';

const base = (steps: Record<string, ScriptStep>) => steps;

const level1 = base({
  explore_intro: {
    id: 'explore_intro',
    message:
      'Press the glowing circle and drag it around the rim. Line the laser straight through the middle!',
    advanceOn: 'equivalence',
  },
  explore_smash: {
    id: 'explore_smash',
    message: 'Beams locked! Tap Sync Shield! to prove both sides match.',
    advanceOn: 'smash',
    showSmash: true,
  },
  instruct: {
    id: 'instruct',
    message: 'Shield synced! Left side: 3 sixth-beams. Right side: 2 quarter-beams. Same power — different splits.',
    advanceOn: 'continue',
  },
  check_q1: {
    id: 'check_q1',
    message: 'Shield scan: tap the side where the beams are split into SIXTHS.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapSections: [0],
    onCorrect: 'check_q2',
    onIncorrect: 'check_q1_wrong',
  },
  check_q1_wrong: {
    id: 'check_q1_wrong',
    message: 'Those are quarter-beams on the right. Scan the LEFT side — look for 1/6 labels.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapSections: [0],
    onCorrect: 'check_q2',
    onIncorrect: 'check_q1_wrong',
  },
  check_q2: {
    id: 'check_q2',
    message: 'That side has 3 sixth-beams. What fraction of the WHOLE shield is that?',
    advanceOn: 'choice',
    choices: [
      { id: 'half', label: '1/2 of the shield', correct: true },
      { id: 'third', label: '1/3 of the shield', correct: false },
      { id: 'sixths_only', label: '3/6 — not a half', correct: false },
    ],
    onCorrect: 'check_q3',
    onIncorrect: 'check_q2_wrong',
  },
  check_q2_wrong: {
    id: 'check_q2_wrong',
    message: 'Three sixths fill exactly HALF the circle. 3/6 = 1/2!',
    advanceOn: 'choice',
    choices: [{ id: 'half', label: '1/2 of the shield', correct: true }],
    onCorrect: 'check_q3',
    onIncorrect: 'check_q2_wrong',
  },
  check_q3: {
    id: 'check_q3',
    message: 'Last scan: tap a sector on the RIGHT that reads 1/4.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapSections: [1],
    onCorrect: 'check_q4',
    onIncorrect: 'check_q3_wrong',
  },
  check_q3_wrong: {
    id: 'check_q3_wrong',
    message: 'Look on the RIGHT half — each orange sector is labeled 1/4.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapSections: [1],
    onCorrect: 'check_q4',
    onIncorrect: 'check_q3_wrong',
  },
  check_q4: {
    id: 'check_q4',
    message: 'Synced! Two 1/4 sectors on the right are the same shield size as…',
    advanceOn: 'choice',
    choices: [
      { id: 'three_sixths', label: 'Three 1/6 sectors on the left', correct: true },
      { id: 'two_sixths', label: 'Two 1/6 sectors on the left', correct: false },
      { id: 'one_quarter', label: 'Just one 1/4 sector', correct: false },
    ],
    onCorrect: 'complete',
    onIncorrect: 'check_q4_wrong',
  },
  check_q4_wrong: {
    id: 'check_q4_wrong',
    message: '2 × 1/4 = 1/2 and 3 × 1/6 = 1/2 — same half, same shield power!',
    advanceOn: 'choice',
    choices: [
      { id: 'three_sixths', label: 'Three 1/6 sectors on the left', correct: true },
    ],
    onCorrect: 'complete',
    onIncorrect: 'check_q4_wrong',
  },
  complete: {
    id: 'complete',
    message: '🎉 Mission 1 clear! Quad-grid Level 2 is online.',
    advanceOn: 'continue',
  },
});

const level2 = base({
  explore_intro: {
    id: 'explore_intro',
    message:
      'Press the glowing circle and drag it around the rim. Lock the grid at top, right, bottom, or left.',
    advanceOn: 'equivalence',
  },
  explore_smash: {
    id: 'explore_smash',
    message: 'Grid locked! Tap Sync Shield! — all four sectors should match.',
    advanceOn: 'smash',
    showSmash: true,
  },
  instruct: {
    id: 'instruct',
    message: 'All synced! One quarter of the shield can look like 1/4, 2/8, 3/12, or 1/6 + 1/12.',
    advanceOn: 'continue',
  },
  check_q1: {
    id: 'check_q1',
    message: 'Tap the sector that shows 1/4 of the whole shield.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapIds: ['q1-base'],
    onCorrect: 'check_q2',
    onIncorrect: 'check_q1_wrong',
  },
  check_q1_wrong: {
    id: 'check_q1_wrong',
    message: 'Find the big green wedge at the top — it is labeled 1/4.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapIds: ['q1-base'],
    onCorrect: 'check_q2',
    onIncorrect: 'check_q1_wrong',
  },
  check_q2: {
    id: 'check_q2',
    message: 'The purple zone has two 1/8 beams. Together they equal…',
    advanceOn: 'choice',
    choices: [
      { id: 'quarter', label: '1/4 of the shield', correct: true },
      { id: 'eighth', label: '1/8 of the shield', correct: false },
      { id: 'half', label: '1/2 of the shield', correct: false },
    ],
    onCorrect: 'check_q3',
    onIncorrect: 'check_q2_wrong',
  },
  check_q2_wrong: {
    id: 'check_q2_wrong',
    message: 'Two eighths = 2/8 = 1/4. Same shield charge, simpler name!',
    advanceOn: 'choice',
    choices: [{ id: 'quarter', label: '1/4 of the shield', correct: true }],
    onCorrect: 'check_q3',
    onIncorrect: 'check_q2_wrong',
  },
  check_q3: {
    id: 'check_q3',
    message: 'Tap the sector that matches 1/6 + 1/12.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapIds: ['q4-sixth', 'q4-twelfth'],
    onCorrect: 'check_q4',
    onIncorrect: 'check_q3_wrong',
  },
  check_q3_wrong: {
    id: 'check_q3_wrong',
    message: 'Check the yellow zone: one 1/6 beam plus one 1/12 beam = 3/12 = 1/4.',
    advanceOn: 'choice',
    tapMode: true,
    correctTapIds: ['q4-sixth', 'q4-twelfth'],
    onCorrect: 'check_q4',
    onIncorrect: 'check_q3_wrong',
  },
  check_q4: {
    id: 'check_q4',
    message:
      'Synced! A 1/6 beam plus a 1/12 beam in the yellow zone are the same shield size as…',
    advanceOn: 'choice',
    choices: [
      { id: 'quarter_sector', label: 'One 1/4 sector (green wedge at top)', correct: true },
      { id: 'eighth_sector', label: 'One 1/8 sector (purple zone)', correct: false },
      { id: 'two_twelfths', label: 'Two 1/12 sectors only', correct: false },
    ],
    onCorrect: 'complete',
    onIncorrect: 'check_q4_wrong',
  },
  check_q4_wrong: {
    id: 'check_q4_wrong',
    message: '1/6 + 1/12 = 3/12 = 1/4 — same shield charge as the green wedge!',
    advanceOn: 'choice',
    choices: [
      { id: 'quarter_sector', label: 'One 1/4 sector (green wedge at top)', correct: true },
    ],
    onCorrect: 'complete',
    onIncorrect: 'check_q4_wrong',
  },
  complete: {
    id: 'complete',
    message: `🎉 Shield fully synced! ${WHOLE_EQUIV}`,
    advanceOn: 'continue',
  },
});

const SCRIPTS: Record<GameLevel, Record<string, ScriptStep>> = {
  1: level1,
  2: level2,
};

export function getLevelStep(level: GameLevel, stepId: string): ScriptStep {
  const script = SCRIPTS[level];
  return script[stepId] ?? script.explore_intro;
}

export function phaseForStep(stepId: string): 'explore' | 'instruct' | 'check' | 'complete' {
  if (stepId === 'complete') return 'complete';
  if (stepId.startsWith('check')) return 'check';
  if (stepId.startsWith('instruct') || stepId === 'explore_smash') return 'instruct';
  return 'explore';
}

export const SNAP_GOAL_LINES: Record<GameLevel, string> = {
  1: 'Laser locked! The beam splits the shield straight down the middle.',
  2: 'Quad laser aligned — four equal sectors online.',
};

export const SMASH_LINES: Record<GameLevel, string> = {
  1: 'Same shield power on both sides — two names, one half!',
  2: 'All sectors report equal charge — fractions synced!',
};

export function isTapCorrect(
  step: ScriptStep,
  sliceId: string,
  section: number,
): boolean {
  if (step.correctTapIds?.includes(sliceId)) return true;
  if (step.correctTapSections?.includes(section)) return true;
  return false;
}
