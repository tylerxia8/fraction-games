import type { GameLevel } from '../../lesson/levels';
import { PLANET_COPY } from '../../lobby/gameThemes';
import {
  buildLevel1Slices,
  getInternalSubdivisionAngles,
  getSliceLineAngles,
  HOME_DIVIDER_ANGLE,
  LEVEL2_MULTI_SPAN,
  type CircleSlice,
} from '../../manipulative/circleGeometry';

export type WedgePiece = {
  sliceId: string;
  startDeg: number;
  endDeg: number;
  innerR?: number;
  section: number;
  label: string;
};

export type WedgePuzzleConfig = {
  level: GameLevel;
  pieces: WedgePiece[];
  equiv: string;
  hint: string;
  insertMessage: string;
};

export const WEDGE_LEVELS: {
  id: GameLevel;
  title: string;
  subtitle: string;
  accent: string;
}[] = [
  { id: 1, title: 'Level 1', subtitle: 'Terrain wedges', accent: '#5c4d9e' },
  { id: 2, title: 'Level 2', subtitle: 'Orbit assembly', accent: '#7b6cf6' },
];

function sliceToPiece(slice: CircleSlice): WedgePiece {
  return {
    sliceId: slice.id,
    startDeg: slice.startDeg,
    endDeg: slice.endDeg,
    innerR: slice.innerR,
    section: slice.section,
    label: slice.label,
  };
}

/** Level 1 — five wedges: three 1/6 and two 1/4. */
function buildWedgeLevel1Pieces(): WedgePiece[] {
  return buildLevel1Slices().map(sliceToPiece);
}

/**
 * Level 2 — every labeled unit is a full wedge to the center (no quarter bases).
 */
function buildWedgeLevel2Pieces(): WedgePiece[] {
  const a0 = HOME_DIVIDER_ANGLE;
  const a1 = 0;
  const a2 = 90;
  const a3 = 180;
  return [
    { sliceId: 'q1-base', startDeg: a0, endDeg: a1, section: 0, label: '1/4' },
    { sliceId: 'q2a', startDeg: a1, endDeg: 45, section: 1, label: '1/8' },
    { sliceId: 'q2b', startDeg: 45, endDeg: a2, section: 1, label: '1/8' },
    { sliceId: 'q3-0', startDeg: a2, endDeg: a2 + 30, section: 2, label: '1/12' },
    { sliceId: 'q3-1', startDeg: a2 + 30, endDeg: a2 + 60, section: 2, label: '1/12' },
    { sliceId: 'q3-2', startDeg: a2 + 60, endDeg: a3, section: 2, label: '1/12' },
    { sliceId: 'q4-sixth', startDeg: a3, endDeg: 240, section: 3, label: '1/6' },
    { sliceId: 'q4-twelfth', startDeg: 240, endDeg: 270, section: 3, label: '1/12' },
  ];
}

export function getWedgePuzzle(level: GameLevel): WedgePuzzleConfig {
  switch (level) {
    case 1:
      return {
        level: 1,
        pieces: buildWedgeLevel1Pieces(),
        equiv: '3/6 = 2/4 = 1/2',
        hint: PLANET_COPY.hint,
        insertMessage: PLANET_COPY.insertMessage,
      };
    case 2:
      return {
        level: 2,
        pieces: buildWedgeLevel2Pieces(),
        equiv: '1/4 = 2/8 = 3/12 = 1/6+1/12',
        hint: PLANET_COPY.hint,
        insertMessage: PLANET_COPY.insertMessage,
      };
  }
}

export function getWedgeSliceLines(level: GameLevel): number[] {
  return getSliceLineAngles(level);
}

export function getWedgeSubdivisionLines(level: GameLevel): number[] {
  return getInternalSubdivisionAngles(level);
}

export function getWedgePartitionAngles(level: GameLevel): number[] {
  if (level !== 2) return [];
  return [0, 1, 2, 3].map((i) => HOME_DIVIDER_ANGLE + i * LEVEL2_MULTI_SPAN);
}
