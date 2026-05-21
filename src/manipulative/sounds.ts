/** Short Web Audio cues — no external files. */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.12,
): void {
  try {
    const ac = getCtx();
    if (ac.state === 'suspended') void ac.resume();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch {
    /* autoplay blocked */
  }
}

export function playSnapClick(): void {
  tone(520, 0.06, 'square', 0.08);
  tone(780, 0.04, 'sine', 0.05);
}

export function playSmashThunk(): void {
  tone(120, 0.18, 'triangle', 0.2);
  tone(80, 0.25, 'sine', 0.15);
  setTimeout(() => tone(400, 0.12, 'sine', 0.1), 80);
}

export function playSliceCut(): void {
  tone(340, 0.08, 'sawtooth', 0.06);
}
