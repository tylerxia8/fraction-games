import {
  CX,
  CY,
  R,
  normalizeAngle,
  rimPoint,
  type CircleSlice,
} from '../../manipulative/circleGeometry';
import type { WedgePiece } from './wedgePuzzles';

/** @deprecated Use WedgePiece — kept as alias for geometry helpers. */
export type WedgeGapInfo = WedgePiece;

const GAP_SNAP_DEG = 28;

export function clientToSvg(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number } {
  const scale = rect.width / 200;
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

function angleInArc(angle: number, startDeg: number, endDeg: number): boolean {
  const a = normalizeAngle(angle);
  const start = normalizeAngle(startDeg);
  const end = normalizeAngle(endDeg);
  if (start <= end) {
    return a >= start - GAP_SNAP_DEG && a <= end + GAP_SNAP_DEG;
  }
  return a >= start - GAP_SNAP_DEG || a <= end + GAP_SNAP_DEG;
}

export function pointerOverGap(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  gap: WedgeGapInfo,
): boolean {
  const { x, y } = clientToSvg(clientX, clientY, rect);
  const mid = gapMidpoint(gap);
  if (Math.hypot(x - mid.x, y - mid.y) < 32) return true;

  const dx = x - CX;
  const dy = y - CY;
  const dist = Math.hypot(dx, dy);
  const inner = gap.innerR ?? 0;
  if (dist < inner + 8 || dist > R + 14) return false;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return angleInArc(angle, gap.startDeg, gap.endDeg);
}

export function gapMidpoint(gap: WedgePiece): { x: number; y: number } {
  let mid = (gap.startDeg + gap.endDeg) / 2;
  if (gap.endDeg < gap.startDeg) mid = (gap.startDeg + gap.endDeg + 360) / 2;
  if (mid > 360) mid -= 360;
  const rad = (mid * Math.PI) / 180;
  const labelR = gap.innerR ? (gap.innerR + R) / 2 : 52;
  return {
    x: CX + labelR * Math.cos(rad),
    y: CY + labelR * Math.sin(rad),
  };
}

export function sliceCssClass(level: 1 | 2, slice: CircleSlice): string {
  if (level === 1) {
    const side = slice.section === 0 ? 'left' : 'right';
    return `wedge-circle__slice wedge-circle__slice--l1-${side}`;
  }
  return `wedge-circle__slice wedge-circle__slice--s${slice.section}`;
}

export function gapCssClass(level: 1 | 2, gap: WedgePiece): string {
  if (level === 1) {
    const side = gap.section === 0 ? 'left' : 'right';
    return `wedge-circle__gap wedge-circle__gap--l1-${side}`;
  }
  return `wedge-circle__gap wedge-circle__gap--s${gap.section}`;
}

export function insertedCssClass(level: 1 | 2, gap: WedgePiece): string {
  if (level === 1) {
    const side = gap.section === 0 ? 'left' : 'right';
    return `wedge-circle__inserted wedge-circle__inserted--l1-${side}`;
  }
  return `wedge-circle__inserted wedge-circle__inserted--s${gap.section}`;
}

/** Same fill/stroke as in-circle slices (e.g. the other 1/8). */
export function wedgePieceSliceClasses(level: 1 | 2, gap: WedgePiece): string {
  const pseudo = { section: gap.section } as CircleSlice;
  return [
    sliceCssClass(level, pseudo),
    gap.innerR ? 'wedge-circle__slice--annular' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

/** Crop preview SVG so annular wedges fill the tray (not a tiny corner sliver). */
export function wedgePieceViewBox(
  startDeg: number,
  endDeg: number,
  innerR = 0,
  pad = 12,
): string {
  const pts: { x: number; y: number }[] = [];
  const steps = Math.max(4, Math.ceil(Math.abs(endDeg - startDeg) / 15));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const deg = startDeg + (endDeg - startDeg) * t;
    pts.push(rimPoint(deg, innerR));
    pts.push(rimPoint(deg, R));
  }
  if (innerR === 0) {
    pts.push({ x: CX, y: CY });
  }
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minX + pad;
  const h = Math.max(...ys) - minY + pad;
  return `${minX} ${minY} ${w} ${h}`;
}
