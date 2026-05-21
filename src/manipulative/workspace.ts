export type Zone = 'palette' | 'left' | 'right';

export type Piece = {
  id: string;
  numerator: number;
  denominator: number;
  zone: Zone;
};

export type Fraction = { numerator: number; denominator: number };

export function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function simplify({ numerator, denominator }: Fraction): Fraction {
  if (denominator === 0) return { numerator: 0, denominator: 1 };
  const g = gcd(numerator, denominator);
  return { numerator: numerator / g, denominator: denominator / g };
}

export function fractionEquals(a: Fraction, b: Fraction): boolean {
  const s1 = simplify(a);
  const s2 = simplify(b);
  return s1.numerator === s2.numerator && s1.denominator === s2.denominator;
}

export function sumPieces(pieces: Piece[]): Fraction | null {
  if (pieces.length === 0) return null;
  let n = 0;
  let d = 1;
  for (const p of pieces) {
    n = n * p.denominator + p.numerator * d;
    d = d * p.denominator;
  }
  return simplify({ numerator: n, denominator: d });
}

export function formatFraction(f: Fraction): string {
  const s = simplify(f);
  return `${s.numerator}/${s.denominator}`;
}

export function createInitialPieces(): Piece[] {
  return [
    { id: 'half-1', numerator: 1, denominator: 2, zone: 'palette' },
    { id: 'quarter-1', numerator: 1, denominator: 4, zone: 'palette' },
    { id: 'quarter-2', numerator: 1, denominator: 4, zone: 'palette' },
  ];
}

export function piecesInZone(pieces: Piece[], zone: Zone): Piece[] {
  return pieces.filter((p) => p.zone === zone);
}

/** Lesson goal: 1/2 on the left, two 1/4 blocks on the right (same amount). */
export function checkLessonEquivalence(pieces: Piece[]): boolean {
  const left = piecesInZone(pieces, 'left');
  const right = piecesInZone(pieces, 'right');
  if (left.length === 0 || right.length === 0) return false;

  const leftSum = sumPieces(left);
  const rightSum = sumPieces(right);
  if (!leftSum || !rightSum || !fractionEquals(leftSum, rightSum)) return false;

  const leftHasHalf = left.some(
    (p) => p.numerator === 1 && p.denominator === 2,
  );
  const rightQuarters = right.filter((p) => p.denominator === 4);
  return leftHasHalf && rightQuarters.length >= 2;
}

export function movePiece(
  pieces: Piece[],
  pieceId: string,
  zone: Zone,
): Piece[] {
  return pieces.map((p) => (p.id === pieceId ? { ...p, zone } : p));
}

export function splitHalf(pieces: Piece[], pieceId: string): Piece[] {
  const target = pieces.find((p) => p.id === pieceId);
  if (!target || target.numerator !== 1 || target.denominator !== 2) {
    return pieces;
  }
  const zone = target.zone;
  const without = pieces.filter((p) => p.id !== pieceId);
  return [
    ...without,
    {
      id: `${pieceId}-a`,
      numerator: 1,
      denominator: 4,
      zone,
    },
    {
      id: `${pieceId}-b`,
      numerator: 1,
      denominator: 4,
      zone,
    },
  ];
}

export function returnAllToPalette(pieces: Piece[]): Piece[] {
  return pieces.map((p) => ({ ...p, zone: 'palette' as Zone }));
}
