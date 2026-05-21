import type { ReactNode } from 'react';
import type { MouthFacing } from './AlligatorMouth';

type VariantProps = {
  facing: MouthFacing;
  className: string;
};

function sizeClass(className: string): string {
  return ['gator-mouth', className].filter(Boolean).join(' ');
}

/** Classic jaw “same size” — two gator buddies + equals. */
function TwinGatorEqualLook({ className }: { className: string }) {
  return (
    <svg className={sizeClass(className)} viewBox="0 0 80 48" aria-hidden>
      <ellipse cx="22" cy="28" rx="16" ry="12" className="gator-mouth__body" />
      <ellipse cx="58" cy="28" rx="16" ry="12" className="gator-mouth__body" />
      <circle cx="22" cy="22" r="5" className="gator-mouth__eye" />
      <circle cx="58" cy="22" r="5" className="gator-mouth__eye" />
      <text x="40" y="32" textAnchor="middle" className="gator-mouth__equals">
        =
      </text>
    </svg>
  );
}

/** Friendly gator “same size” — one happy gator holding an equals sign. */
function FriendlyGatorEqualLook({ className }: { className: string }) {
  return (
    <svg className={sizeClass(className)} viewBox="0 0 80 48" aria-hidden>
      <ellipse cx="40" cy="24" rx="26" ry="18" className="gator-mouth__body" />
      <circle cx="30" cy="18" r="6" className="gator-mouth__eye" />
      <circle cx="50" cy="18" r="6" className="gator-mouth__eye" />
      <circle cx="31" cy="17" r="2.5" className="gator-mouth__pupil" />
      <circle cx="51" cy="17" r="2.5" className="gator-mouth__pupil" />
      <path
        d="M 26 28 Q 40 36 54 28"
        className="gator-mouth__smile"
        fill="none"
      />
      <rect x="28" y="30" width="24" height="14" rx="4" className="gator-mouth__equals-sign" />
      <text x="40" y="40" textAnchor="middle" className="gator-mouth__equals">
        =
      </text>
    </svg>
  );
}

/** 1 — Simple triangle jaw (original style). */
export function TriangleGator({ facing, className }: VariantProps) {
  const cls = sizeClass(className);
  if (facing === 'equal') {
    return <TwinGatorEqualLook className={className} />;
  }
  const points = facing === 'left' ? '8,8 52,24 8,40' : '64,8 20,24 64,40';
  const eyeX = facing === 'left' ? 14 : 58;
  return (
    <svg className={cls} viewBox="0 0 72 48" aria-hidden>
      <polygon points={points} className="gator-mouth__jaw" />
      <circle cx={eyeX} cy="12" r="6" className="gator-mouth__eye" />
      <circle cx={eyeX + (facing === 'left' ? 2 : -2)} cy="11" r="2" className="gator-mouth__pupil" />
    </svg>
  );
}

/** 2 — Round friendly alligator head. */
export function FriendlyGator({ facing, className }: VariantProps) {
  const cls = sizeClass(className);
  if (facing === 'equal') {
    return <FriendlyGatorEqualLook className={className} />;
  }
  const flip = facing === 'right' ? 'scale(-1,1) translate(-80,0)' : undefined;
  return (
    <svg className={cls} viewBox="0 0 80 48" aria-hidden>
      <g transform={flip}>
        <ellipse cx="28" cy="28" rx="22" ry="16" className="gator-mouth__body" />
        <path d="M 48 18 L 72 28 L 48 38 Z" className="gator-mouth__jaw-open" />
        <circle cx="24" cy="20" r="7" className="gator-mouth__eye" />
        <circle cx="26" cy="19" r="2.5" className="gator-mouth__pupil" />
        <ellipse cx="52" cy="26" rx="3" ry="2" className="gator-mouth__nostril" />
      </g>
    </svg>
  );
}

/** Pair of eyes centered above the math-symbol gator. */
function SymbolEyesOnTop() {
  return (
    <>
      <circle cx="31" cy="7" r="5" className="gator-mouth__eye" />
      <circle cx="41" cy="7" r="5" className="gator-mouth__eye" />
      <circle cx="32" cy="6" r="2" className="gator-mouth__pupil" />
      <circle cx="42" cy="6" r="2" className="gator-mouth__pupil" />
    </>
  );
}

/** Rect teeth along a jaw edge (cartoon-chomp style). */
function SymbolTeethAlongEdge(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  count: number,
  hang: 'down' | 'up',
): ReactNode[] {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1);
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t;
    const yOff = hang === 'down' ? 0 : -6;
    return (
      <rect
        key={`tooth-${x}-${y}`}
        x={-1.5}
        y={yOff}
        width={3}
        height={6}
        rx={0.5}
        className="gator-mouth__tooth-fill"
        transform={`translate(${x} ${y}) rotate(${angle})`}
      />
    );
  });
}

/** Left-is-bigger mouth (>) — right-is-bigger mirrors this exactly. */
function SymbolChompMouth() {
  const topInner = { x1: 12, y1: 22, x2: 48, y2: 19 };
  const botInner = { x1: 12, y1: 28, x2: 48, y2: 31 };
  return (
    <>
      <path
        d="M 10 10 L 10 38 L 54 24 Z"
        className="gator-mouth__symbol-outline"
      />
      <path
        d="M 10 38 L 50 31 L 54 24 L 46 27 L 11 27 L 10 38 Z"
        className="gator-mouth__symbol-jaw-bottom"
      />
      <path
        d="M 10 10 L 50 17 L 54 24 L 46 21 L 11 21 L 10 10 Z"
        className="gator-mouth__symbol-jaw-top"
      />
      {SymbolTeethAlongEdge(
        topInner.x1,
        topInner.y1,
        topInner.x2,
        topInner.y2,
        5,
        'down',
      )}
      {SymbolTeethAlongEdge(
        botInner.x1,
        botInner.y1,
        botInner.x2,
        botInner.y2,
        5,
        'up',
      )}
    </>
  );
}

function SymbolChompLeft({ className }: { className: string }) {
  const cls = sizeClass(className);
  return (
    <svg className={cls} viewBox="0 0 72 48" aria-hidden>
      <SymbolEyesOnTop />
      <SymbolChompMouth />
    </svg>
  );
}

function SymbolChompRight({ className }: { className: string }) {
  const cls = sizeClass(className);
  return (
    <svg className={cls} viewBox="0 0 72 48" aria-hidden>
      <SymbolEyesOnTop />
      <g transform="scale(-1, 1) translate(-72, 0)">
        <SymbolChompMouth />
      </g>
    </svg>
  );
}

/** 3 — Thick math-symbol style: eyes on top, open jaw with teeth. */
export function SymbolGator({ facing, className }: VariantProps) {
  const cls = sizeClass(className);
  if (facing === 'equal') {
    return (
      <svg className={cls} viewBox="0 0 72 48" aria-hidden>
        <rect x="8" y="14" width="56" height="22" rx="6" className="gator-mouth__symbol-bg" />
        <SymbolEyesOnTop />
        <text x="36" y="31" textAnchor="middle" className="gator-mouth__symbol-text">
          =
        </text>
      </svg>
    );
  }

  if (facing === 'left') {
    return <SymbolChompLeft className={className} />;
  }

  return <SymbolChompRight className={className} />;
}

/** 4 — Cartoon top/bottom jaws. */
export function CartoonGator({ facing, className }: VariantProps) {
  const cls = sizeClass(className);
  if (facing === 'equal') {
    return (
      <svg className={cls} viewBox="0 0 80 48" aria-hidden>
        <circle cx="28" cy="14" r="5" className="gator-mouth__eye" />
        <circle cx="52" cy="14" r="5" className="gator-mouth__eye" />
        <circle cx="29" cy="13" r="2" className="gator-mouth__pupil" />
        <circle cx="53" cy="13" r="2" className="gator-mouth__pupil" />
        <text x="40" y="32" textAnchor="middle" className="gator-mouth__equals">
          =
        </text>
      </svg>
    );
  }
  const flip = facing === 'right' ? 'scale(-1,1) translate(-80,0)' : undefined;
  return (
    <svg className={cls} viewBox="0 0 80 48" aria-hidden>
      <g transform={flip}>
        <path d="M 10 8 Q 35 4 58 14 L 70 24 L 58 20 Q 35 12 10 16 Z" className="gator-mouth__jaw-top" />
        <path d="M 10 40 Q 35 44 58 34 L 70 24 L 58 28 Q 35 36 10 32 Z" className="gator-mouth__jaw-bottom" />
        <circle cx="20" cy="18" r="5" className="gator-mouth__eye" />
        <circle cx="22" cy="17" r="2" className="gator-mouth__pupil" />
        {[32, 38, 44, 50].map((x) => (
          <rect key={x} x={x} y="21" width="3" height="6" rx="1" className="gator-mouth__tooth-fill" />
        ))}
      </g>
    </svg>
  );
}

/** 5 — Side-profile gator head. */
export function ProfileGator({ facing, className }: VariantProps) {
  const cls = sizeClass(className);
  if (facing === 'equal') {
    return (
      <svg className={cls} viewBox="0 0 80 48" aria-hidden>
        <path
          d="M 8 28 L 20 20 L 20 36 Z M 60 20 L 72 28 L 60 36 Z"
          className="gator-mouth__profile-snout"
        />
        <text x="40" y="32" textAnchor="middle" className="gator-mouth__equals">
          =
        </text>
      </svg>
    );
  }
  const flip = facing === 'right' ? 'scale(-1,1) translate(-80,0)' : undefined;
  return (
    <svg className={cls} viewBox="0 0 80 48" aria-hidden>
      <g transform={flip}>
        <ellipse cx="30" cy="26" rx="20" ry="14" className="gator-mouth__body" />
        <path d="M 42 16 L 76 26 L 42 36 L 48 26 Z" className="gator-mouth__profile-snout" />
        <circle cx="22" cy="20" r="6" className="gator-mouth__eye" />
        <circle cx="24" cy="19" r="2.5" className="gator-mouth__pupil" />
        <path d="M 50 22 L 68 26 L 50 30" className="gator-mouth__smile" fill="none" />
      </g>
    </svg>
  );
}
