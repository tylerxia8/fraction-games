import './SmashEffects.css';

type SmashEffectsProps = {
  active: boolean;
  merging: boolean;
};

const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: 20 + (i * 7) % 60,
  top: 15 + ((i * 11) % 70),
  delay: i * 0.04,
}));

export function SmashEffects({ active, merging }: SmashEffectsProps) {
  if (!active && !merging) return null;

  return (
    <div
      className={`smash-effects ${merging ? 'smash-effects--merging' : ''} ${active ? 'smash-effects--active' : ''}`}
      aria-hidden
    >
      {SPARKLES.map((s) => (
        <span
          key={s.id}
          className="smash-effects__sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <span className="smash-effects__burst">💥</span>
    </div>
  );
}
