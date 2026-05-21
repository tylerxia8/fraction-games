export type {
  Fraction,
  Piece,
  Zone,
} from './workspace';

export {
  fractionEquals,
  formatFraction,
  simplify,
} from './workspace';

export const HALF = { numerator: 1, denominator: 2 } as const;
export const QUARTER = { numerator: 1, denominator: 4 } as const;
