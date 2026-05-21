export type Fraction = { num: number; den: number };

export type Comparison = '>' | '<' | '=';

/** How left compares to right: left > right → '>'. */
export function compareFractions(left: Fraction, right: Fraction): Comparison {
  const a = left.num * right.den;
  const b = right.num * left.den;
  if (a > b) return '>';
  if (a < b) return '<';
  return '=';
}
