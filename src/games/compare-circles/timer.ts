export const COMPARE_CIRCLES_BEST_TIME_KEY = 'compare-circles-best-ms';

export { formatElapsed } from '../compare/timer';

export function loadCirclesBestTimeMs(): number | null {
  try {
    const raw = localStorage.getItem(COMPARE_CIRCLES_BEST_TIME_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function saveCirclesBestTimeMs(ms: number): void {
  try {
    localStorage.setItem(COMPARE_CIRCLES_BEST_TIME_KEY, String(Math.round(ms)));
  } catch {
    /* private mode / blocked */
  }
}

export function clearCirclesBestTimeMs(): void {
  try {
    localStorage.removeItem(COMPARE_CIRCLES_BEST_TIME_KEY);
  } catch {
    /* private mode / blocked */
  }
}
