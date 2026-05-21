import { useMemo } from 'react';
import { CX, CY, R, wedgePath } from '../../manipulative/circleGeometry';
import type { Fraction } from '../compare/fractionMath';
import './FractionCircleDisplay.css';

type FractionCircleDisplayProps = {
  fraction: Fraction;
  side: 'left' | 'right';
  accent: string;
  /** Show numeric fraction under the circle (e.g. after correct). */
  showLabel?: boolean;
};

function sectorAngles(den: number): { start: number; end: number }[] {
  const span = 360 / den;
  return Array.from({ length: den }, (_, i) => ({
    start: -90 + i * span,
    end: -90 + (i + 1) * span,
  }));
}

export function FractionCircleDisplay({
  fraction,
  side,
  accent,
  showLabel = false,
}: FractionCircleDisplayProps) {
  const sectors = useMemo(() => sectorAngles(fraction.den), [fraction.den]);
  const label = `${fraction.num} over ${fraction.den}`;

  return (
    <div
      className={`circle-frac circle-frac--${side}`}
      style={{ '--circle-accent': accent } as React.CSSProperties}
    >
      <svg
        viewBox="0 0 200 200"
        className="circle-frac__svg"
        role="img"
        aria-label={label}
      >
        <circle cx={CX} cy={CY} r={R} className="circle-frac__rim" />
        {sectors.map(({ start, end }, i) => (
          <path
            key={i}
            d={wedgePath(start, end)}
            className={[
              'circle-frac__slice',
              i < fraction.num && 'circle-frac__slice--filled',
            ]
              .filter(Boolean)
              .join(' ')}
          />
        ))}
        {sectors.map(({ start }, i) => {
          const rad = (start * Math.PI) / 180;
          const x2 = CX + R * Math.cos(rad);
          const y2 = CY + R * Math.sin(rad);
          return (
            <line
              key={`line-${i}`}
              x1={CX}
              y1={CY}
              x2={x2}
              y2={y2}
              className="circle-frac__spoke"
            />
          );
        })}
      </svg>
      {showLabel ? (
        <p className="circle-frac__label" aria-hidden>
          <span className="circle-frac__num">{fraction.num}</span>
          <span className="circle-frac__slash" aria-hidden />
          <span className="circle-frac__den">{fraction.den}</span>
        </p>
      ) : null}
    </div>
  );
}
