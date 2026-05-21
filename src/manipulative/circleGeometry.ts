import type { GameLevel } from '../lesson/levels';

export const CX = 100;
export const CY = 100;
export const R = 88;
/** Inner radius for sub-slices so cuts do not look like extra divider spokes. */
export const SUB_SLICE_INNER_R = 48;

/** Fixed orientation: first section starts at top. */
export const HOME_DIVIDER_ANGLE = -90;

export const LEVEL2_MULTI_SPAN = 90;

/** Home positions for the first divider line (Level 2 — four sections). */
export const LEVEL2_HOME_DIVIDERS = [-90, 0, 90, 180] as const;

export const LEVEL2_ROTATION_SNAPS = [...LEVEL2_HOME_DIVIDERS];

const DEG = Math.PI / 180;

export function degToRad(deg: number): number {
  return deg * DEG;
}

export function normalizeAngle(deg: number): number {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a < -180) a += 360;
  return a;
}

export function angleDistance(a: number, b: number): number {
  return Math.abs(normalizeAngle(a - b));
}

export const SNAP_THRESHOLD = 14;

export type CircleSlice = {
  id: string;
  section: number;
  startDeg: number;
  endDeg: number;
  label: string;
  index: number;
  /** > 0 draws an annular wedge (no line from circle center). */
  innerR?: number;
};

function snapIndex(angle: number, snaps: readonly number[]): number {
  const n = normalizeAngle(angle);
  let bestIdx = 0;
  let bestDist = Infinity;
  snaps.forEach((candidate, i) => {
    const d = angleDistance(n, candidate);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  });
  return bestIdx;
}

function snapTo(angle: number, snaps: readonly number[]): number {
  return snaps[snapIndex(angle, snaps)];
}

function pushWedge(
  slices: CircleSlice[],
  wedge: {
    id: string;
    section: number;
    start: number;
    end: number;
    label: string;
    innerR?: number;
  },
): void {
  slices.push({
    id: wedge.id,
    section: wedge.section,
    startDeg: wedge.start,
    endDeg: wedge.end,
    label: wedge.label,
    innerR: wedge.innerR,
    index: slices.length,
  });
}

/** Level 1 — fixed slices; single draggable divider. */
export function buildLevel1Slices(): CircleSlice[] {
  const slices: CircleSlice[] = [];
  for (let i = 0; i < 3; i++) {
    const start = 90 + i * 60;
    pushWedge(slices, {
      id: `left-${i}`,
      section: 0,
      start,
      end: start + 60,
      label: '1/6',
    });
  }
  const rightWedges = [
    { start: 270, end: 360 },
    { start: 0, end: 90 },
  ];
  rightWedges.forEach(({ start, end }, i) => {
    pushWedge(slices, {
      id: `right-${i}`,
      section: 1,
      start,
      end,
      label: '1/4',
    });
  });
  return slices;
}

/** Rotating divider lines only (4 arms on Level 2). Slices stay fixed. */
export function getMultiSectionDividerAngles(
  _level: GameLevel,
  firstLineAngle: number,
): number[] {
  const lines: number[] = [];
  for (let i = 0; i < 4; i++) {
    lines.push(firstLineAngle + i * LEVEL2_MULTI_SPAN);
  }
  return lines;
}

/** Level 2 — 4 full sections from center; smaller cuts as annular sub-slices only. */
export function buildLevel2Slices(): CircleSlice[] {
  const slices: CircleSlice[] = [];
  const a0 = HOME_DIVIDER_ANGLE;
  const a1 = 0;
  const a2 = 90;
  const a3 = 180;
  const ir = SUB_SLICE_INNER_R;

  pushWedge(slices, {
    id: 'q1-base',
    section: 0,
    start: a0,
    end: a1,
    label: '1/4',
  });
  pushWedge(slices, {
    id: 'q2-base',
    section: 1,
    start: a1,
    end: a2,
    label: '',
  });
  pushWedge(slices, {
    id: 'q3-base',
    section: 2,
    start: a2,
    end: a3,
    label: '',
  });
  pushWedge(slices, {
    id: 'q4-base',
    section: 3,
    start: a3,
    end: 270,
    label: '',
  });
  pushWedge(slices, {
    id: 'q2a',
    section: 1,
    start: a1,
    end: 45,
    label: '1/8',
    innerR: ir,
  });
  pushWedge(slices, {
    id: 'q2b',
    section: 1,
    start: 45,
    end: a2,
    label: '1/8',
    innerR: ir,
  });
  for (let i = 0; i < 3; i++) {
    pushWedge(slices, {
      id: `q3-${i}`,
      section: 2,
      start: a2 + i * 30,
      end: a2 + (i + 1) * 30,
      label: '1/12',
      innerR: ir,
    });
  }
  pushWedge(slices, {
    id: 'q4-sixth',
    section: 3,
    start: a3,
    end: 240,
    label: '1/6',
    innerR: ir,
  });
  pushWedge(slices, {
    id: 'q4-twelfth',
    section: 3,
    start: 240,
    end: 270,
    label: '1/12',
    innerR: ir,
  });
  return slices;
}

export function getSlices(level: GameLevel): CircleSlice[] {
  switch (level) {
    case 1:
      return buildLevel1Slices();
    case 2:
      return buildLevel2Slices();
  }
}

/** Level 1 slice lines only. */
export function getSliceLineAngles(level: GameLevel): number[] {
  if (level !== 1) return [];
  const seen = new Set<number>();
  for (const s of buildLevel1Slices()) {
    seen.add(normalizeAngle(s.startDeg));
    seen.add(normalizeAngle(s.endDeg));
  }
  return [...seen].sort((a, b) => a - b);
}

/** Internal cuts between annular sub-slices (same angles as original outer-ring guides). */
const LEVEL2_INTERNAL_SUBDIVISIONS = [45, 120, 150, 240] as const;

export function getInternalSubdivisionAngles(level: GameLevel): number[] {
  if (level === 2) return [...LEVEL2_INTERNAL_SUBDIVISIONS];
  return [];
}

export function getSnappableAngles(level: GameLevel): number[] {
  if (level === 1) {
    const seen = new Set<number>([
      HOME_DIVIDER_ANGLE,
      normalizeAngle(HOME_DIVIDER_ANGLE + 180),
    ]);
    for (const s of buildLevel1Slices()) {
      seen.add(normalizeAngle(s.startDeg));
      seen.add(normalizeAngle(s.endDeg));
    }
    return [...seen];
  }
  return [...LEVEL2_ROTATION_SNAPS];
}

export function snapDivider(level: GameLevel, angle: number): number {
  return snapTo(angle, getSnappableAngles(level));
}

export function isDividerAtHome(angle: number): boolean {
  return angleDistance(angle, HOME_DIVIDER_ANGLE) < SNAP_THRESHOLD;
}

/** Level 2: first divider arm aligned to any of four 90° snap positions. */
export function isLevel2DividerAligned(angle: number): boolean {
  return LEVEL2_ROTATION_SNAPS.some(
    (snap) => angleDistance(angle, snap) < SNAP_THRESHOLD,
  );
}

export function isLevelComplete(level: GameLevel, dividerAngle: number): boolean {
  if (level === 1) {
    return (
      isDividerAtHome(dividerAngle) ||
      angleDistance(dividerAngle, HOME_DIVIDER_ANGLE + 180) < SNAP_THRESHOLD
    );
  }
  return isLevel2DividerAligned(dividerAngle);
}

export function snapToGoal(level: GameLevel, currentAngle = HOME_DIVIDER_ANGLE): number {
  if (level === 1) return HOME_DIVIDER_ANGLE;
  return snapTo(currentAngle, LEVEL2_ROTATION_SNAPS);
}

export function initialDividerAngle(level: GameLevel): number {
  return level === 1 ? 0 : 30;
}

export function wedgePath(
  startDeg: number,
  endDeg: number,
  innerR = 0,
): string {
  const start = degToRad(startDeg);
  const end = degToRad(endDeg);
  const x1 = CX + R * Math.cos(start);
  const y1 = CY + R * Math.sin(start);
  const x2 = CX + R * Math.cos(end);
  const y2 = CY + R * Math.sin(end);
  const xi1 = CX + innerR * Math.cos(start);
  const yi1 = CY + innerR * Math.sin(start);
  const xi2 = CX + innerR * Math.cos(end);
  const yi2 = CY + innerR * Math.sin(end);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  if (innerR > 0) {
    return `M ${xi1} ${yi1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`;
  }
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
}

export function dividerLinePoints(angleDeg: number): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  const rad = degToRad(angleDeg);
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  return {
    x1: CX - R * dx,
    y1: CY - R * dy,
    x2: CX + R * dx,
    y2: CY + R * dy,
  };
}

/** Center → rim on one ray (extends former outer-ring subdivision guides inward). */
export function internalSubdivisionLinePoints(angleDeg: number): {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
} {
  const outer = rimPoint(angleDeg, R);
  return { x1: CX, y1: CY, x2: outer.x, y2: outer.y };
}

export function rimPoint(angleDeg: number, radius = R): { x: number; y: number } {
  const rad = degToRad(angleDeg);
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

export function wedgeMidpoint(
  startDeg: number,
  endDeg: number,
  innerR = 0,
): { x: number; y: number } {
  let mid = (startDeg + endDeg) / 2;
  if (endDeg < startDeg) mid = (startDeg + endDeg + 360) / 2;
  if (mid > 360) mid -= 360;
  const rad = degToRad(mid);
  const labelR = innerR > 0 ? (innerR + R) / 2 : 52;
  return {
    x: CX + labelR * Math.cos(rad),
    y: CY + labelR * Math.sin(rad),
  };
}

export function angleFromPointer(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): number {
  const scale = rect.width / 200;
  const px = (clientX - rect.left) / scale;
  const py = (clientY - rect.top) / scale;
  return (Math.atan2(py - CY, px - CX) * 180) / Math.PI;
}

export function isOnSliceBoundary(level: GameLevel, angle: number): boolean {
  const snaps = getSnappableAngles(level);
  const n = normalizeAngle(angle);
  let bestDist = Infinity;
  for (const candidate of snaps) {
    bestDist = Math.min(bestDist, angleDistance(n, candidate));
  }
  return bestDist < SNAP_THRESHOLD;
}
