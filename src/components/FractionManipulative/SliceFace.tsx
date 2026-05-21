/** Soft, friendly faces (edu-app style — no harsh outlines). */

export type FaceMood = 'happy' | 'curious' | 'excited';

type SliceFaceProps = {
  x: number;
  y: number;
  mood: FaceMood;
};

export function SliceFace({ x, y, mood }: SliceFaceProps) {
  const mouth =
    mood === 'excited'
      ? 'M -4.5 3.5 Q 0 8 4.5 3.5'
      : mood === 'curious'
        ? 'M -3 5 Q 0 5.8 3 5'
        : 'M -4 4 Q 0 6.5 4 4';

  return (
    <g
      className={`slice-face slice-face--${mood}`}
      transform={`translate(${x}, ${y})`}
    >
      <ellipse rx={11} ry={10} className="slice-face__glow" />

      {mood === 'excited' ? (
        <>
          <path
            d="M -5.5 -2.5 Q -3.5 -4.5 -1.5 -2.5"
            className="slice-face__cheer-eye"
          />
          <path
            d="M 1.5 -2.5 Q 3.5 -4.5 5.5 -2.5"
            className="slice-face__cheer-eye"
          />
        </>
      ) : (
        <>
          <ellipse
            cx={mood === 'curious' ? -4.5 : -3.5}
            cy={-0.5}
            rx={1.8}
            ry={2.2}
            className="slice-face__eye"
          />
          <ellipse
            cx={mood === 'curious' ? 4.5 : 3.5}
            cy={-0.5}
            rx={1.8}
            ry={2.2}
            className="slice-face__eye"
          />
        </>
      )}

      <circle cx={-6} cy={2} r={1.6} className="slice-face__cheek" />
      <circle cx={6} cy={2} r={1.6} className="slice-face__cheek" />
      <path
        d={mouth}
        className="slice-face__mouth"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}
