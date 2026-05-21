import type { Fraction } from './fractionMath';
import './FractionDisplay.css';

type FractionDisplayProps = {
  fraction: Fraction;
  side: 'left' | 'right';
  accent: string;
  /** When false, hide the bar model until the answer is revealed. Default true. */
  showBarModel?: boolean;
};

export function FractionDisplay({
  fraction,
  side,
  accent,
  showBarModel = true,
}: FractionDisplayProps) {
  const pct = Math.min(100, (fraction.num / fraction.den) * 100);

  return (
    <div
      className={`frac-display frac-display--${side}`}
      style={{ '--frac-accent': accent, '--frac-pct': `${pct}%` } as React.CSSProperties}
    >
      <p className="frac-display__value" aria-label={`${fraction.num} over ${fraction.den}`}>
        <span className="frac-display__num">{fraction.num}</span>
        <span className="frac-display__bar" aria-hidden />
        <span className="frac-display__den">{fraction.den}</span>
      </p>
      {showBarModel ? (
        <div className="frac-display__model frac-display__model--revealed" aria-hidden>
          <div className="frac-display__model-fill" />
        </div>
      ) : null}
    </div>
  );
}
