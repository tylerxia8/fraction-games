export const COMPARE_BEST_TIME_KEY = 'compare-fractions-best-ms';

/** e.g. 42.3s or 1:05.2 */
export function formatElapsed(ms: number): string {
  const tenths = Math.floor(ms / 100) / 10;
  const wholeSec = Math.floor(tenths);
  const frac = Math.round((tenths - wholeSec) * 10);

  if (wholeSec >= 60) {
    const minutes = Math.floor(wholeSec / 60);
    const seconds = wholeSec % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}.${frac}`;
  }
  return `${wholeSec}.${frac}s`;
}

export function loadBestTimeMs(): number | null {
  try {
    const raw = localStorage.getItem(COMPARE_BEST_TIME_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

export function saveBestTimeMs(ms: number): void {
  try {
    localStorage.setItem(COMPARE_BEST_TIME_KEY, String(Math.round(ms)));
  } catch {
    /* private mode / blocked */
  }
}

export function clearBestTimeMs(): void {
  try {
    localStorage.removeItem(COMPARE_BEST_TIME_KEY);
  } catch {
    /* private mode / blocked */
  }
}
