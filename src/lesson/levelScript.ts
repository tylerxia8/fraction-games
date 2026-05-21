import type { GameLevel } from './levels';
import { WHOLE_EQUIV } from './levels';
import type { ScriptStep } from './script';

const base = (steps: Record<string, ScriptStep>) => steps;

const level1 = base({
  explore_intro: {
    id: 'explore_intro',
    message: 'Drag the laser along the grid lines. Line the beam up through the middle.',
    advanceOn: 'equivalence',
  },
  explore_smash: {
    id: 'explore_smash',
    message: 'Beams aligned! Tap Sync Shield! to prove 3/6 and 2/4 match.',
    advanceOn: 'smash',
    showSmash: true,
  },
  instruct: {
    id: 'instruct',
    message: 'Shield synced: 3/6 = 2/4 = 1/2. Same power, different beam splits.',
    advanceOn: 'continue',
  },
  check_q1: {
    id: 'check_q1',
    message: 'The left half has 3 slices of 1/6. What fraction of the whole is that half?',
    advanceOn: 'choice',
    choices: [
      { id: 'half', label: '1/2', correct: true },
      { id: 'sixths', label: '3/6 only', correct: false },
    ],
    onCorrect: 'complete',
    onIncorrect: 'check_q1_wrong',
  },
  check_q1_wrong: {
    id: 'check_q1_wrong',
    message: 'Three sixths fill the left half — that is 1/2 of the circle. Try again!',
    advanceOn: 'choice',
    choices: [{ id: 'half', label: '1/2', correct: true }],
    onCorrect: 'complete',
    onIncorrect: 'check_q1_wrong',
  },
  complete: {
    id: 'complete',
    message: '🎉 Mission 1 clear! Sync Level 2’s quad grid next.',
    advanceOn: 'continue',
  },
});

const level2 = base({
  explore_intro: {
    id: 'explore_intro',
    message:
      'Rotate the quad laser. Lock it at the top — four sectors with different beam splits inside.',
    advanceOn: 'equivalence',
  },
  explore_smash: {
    id: 'explore_smash',
    message: 'Grid locked! Tap Sync Shield! — all four readings match.',
    advanceOn: 'smash',
    showSmash: true,
  },
  instruct: {
    id: 'instruct',
    message: '1/4 = 2/8 = 3/12 = 1/6+1/12 — one shield charge, four names.',
    advanceOn: 'continue',
  },
  check_q1: {
    id: 'check_q1',
    message: 'Which is the same size as 1/4?',
    advanceOn: 'choice',
    choices: [
      { id: 'six_twelfth', label: '1/6 + 1/12', correct: true },
      { id: 'five_twelfths', label: '5/12', correct: false },
    ],
    onCorrect: 'complete',
    onIncorrect: 'check_q1_wrong',
  },
  check_q1_wrong: {
    id: 'check_q1_wrong',
    message: '1/6 + 1/12 = 3/12 = 1/4. Try again!',
    advanceOn: 'choice',
    choices: [{ id: 'six_twelfth', label: '1/6 + 1/12', correct: true }],
    onCorrect: 'complete',
    onIncorrect: 'check_q1_wrong',
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
  1: 'Laser locked — the beam splits the field into equal halves.',
  2: 'Quad laser aligned — top, right, bottom, or left.',
};

export const SMASH_LINES: Record<GameLevel, string> = {
  1: 'Shield reading: same power on both sides — two names, one half!',
  2: 'All sectors report equal charge — fractions synced!',
};
