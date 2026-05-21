import { compareFractions, type Comparison, type Fraction } from './fractionMath';

export type CompareProblem = {
  id: string;
  left: Fraction;
  right: Fraction;
};

export const PROBLEMS_PER_RUN = 10;

const DENOMINATORS = [2, 3, 4, 5, 6, 8, 10, 12] as const;

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function simplify(f: Fraction): Fraction {
  const g = gcd(f.num, f.den);
  return { num: f.num / g, den: f.den / g };
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function randomFraction(): Fraction {
  const den = DENOMINATORS[randomInt(DENOMINATORS.length)];
  const num = randomInt(den - 1) + 1;
  return { num, den };
}

function pairKey(left: Fraction, right: Fraction): string {
  const l = simplify(left);
  const r = simplify(right);
  return `${l.num}/${l.den}|${r.num}/${r.den}`;
}

/** Fresh random problems each call — mixed >, <, and =. */
export function generateProblemSet(count = PROBLEMS_PER_RUN): CompareProblem[] {
  const seen = new Set<string>();
  const byOutcome: Record<Comparison, number> = { '>': 0, '<': 0, '=': 0 };
  const targetEach = Math.max(2, Math.floor(count / 3));
  const problems: CompareProblem[] = [];
  let attempts = 0;
  const maxAttempts = count * 80;

  while (problems.length < count && attempts < maxAttempts) {
    attempts += 1;
    const left = randomFraction();
    const right = randomFraction();
    const key = pairKey(left, right);
    if (seen.has(key)) continue;

    const outcome = compareFractions(left, right);
    if (byOutcome[outcome] >= targetEach + 1) continue;

    seen.add(key);
    byOutcome[outcome] += 1;
    problems.push({
      id: `run-${problems.length}-${attempts}`,
      left,
      right,
    });
  }

  while (problems.length < count && attempts < maxAttempts * 2) {
    attempts += 1;
    const left = randomFraction();
    const right = randomFraction();
    const key = pairKey(left, right);
    if (seen.has(key)) continue;
    seen.add(key);
    problems.push({
      id: `run-${problems.length}-${attempts}`,
      left,
      right,
    });
  }

  return shuffleProblems(problems);
}

export function shuffleProblems(problems: CompareProblem[]): CompareProblem[] {
  const copy = [...problems];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
