import type { GameThemeId } from '../../lobby/games';
import type { ComparePlayMode } from './mode';
import './CompareModePicker.css';

type CompareModePickerProps = {
  title: string;
  accent: string;
  blurb: string;
  theme?: GameThemeId;
  timedDesc?: string;
  practiceDesc?: string;
  onSelect: (mode: ComparePlayMode) => void;
  onBack: () => void;
};

export function CompareModePicker({
  title,
  accent,
  blurb,
  theme,
  timedDesc = 'Race through all 10 pairs and try to beat your fastest time.',
  practiceDesc = 'No clock — take your time and focus on comparing.',
  onSelect,
  onBack,
}: CompareModePickerProps) {
  return (
    <div
      className="compare-mode"
      data-game-theme={theme}
      style={{ '--game-accent': accent } as React.CSSProperties}
    >
      <header className="compare-mode__header">
        <button type="button" className="compare-mode__back" onClick={onBack}>
          Lobby
        </button>
        <h1>{title}</h1>
      </header>

      <main className="compare-mode__main">
        <p className="compare-mode__blurb">{blurb}</p>
        <p className="compare-mode__prompt">How do you want to play?</p>

        <div className="compare-mode__choices">
          <button
            type="button"
            className="compare-mode__choice"
            onClick={() => onSelect('timed')}
          >
            <span className="compare-mode__choice-icon" aria-hidden>
              ⏱
            </span>
            <span className="compare-mode__choice-title">Timed</span>
            <span className="compare-mode__choice-desc">{timedDesc}</span>
          </button>
          <button
            type="button"
            className="compare-mode__choice"
            onClick={() => onSelect('untimed')}
          >
            <span className="compare-mode__choice-icon" aria-hidden>
              ☺
            </span>
            <span className="compare-mode__choice-title">Practice</span>
            <span className="compare-mode__choice-desc">{practiceDesc}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
