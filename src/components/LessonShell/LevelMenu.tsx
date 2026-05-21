import { LEVELS, type GameLevel } from '../../lesson/levels';
import { LASER_COPY } from '../../lobby/gameThemes';
import './LevelMenu.css';

type LevelMenuProps = {
  unlocked: GameLevel;
  onSelect: (level: GameLevel) => void;
};

export function LevelMenu({ unlocked, onSelect }: LevelMenuProps) {
  return (
    <div className="level-menu">
      <h2 className="level-menu__title">Choose a level</h2>
      <p className="level-menu__sub">{LASER_COPY.levelMenuSub}</p>
      <ul className="level-menu__list">
        {LEVELS.map((level) => {
          const locked = level.id > unlocked;
          return (
            <li key={level.id}>
              <button
                type="button"
                className="level-menu__card"
                disabled={locked}
                style={{ '--level-accent': level.accent } as React.CSSProperties}
                onClick={() => onSelect(level.id)}
              >
                <span className="level-menu__badge">{level.title}</span>
                <span className="level-menu__name">{level.subtitle}</span>
                <span className="level-menu__frac">{level.dividerLabel} divider</span>
                <span className="level-menu__equiv">{level.equiv}</span>
                {locked && <span className="level-menu__lock">Complete earlier levels first</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
