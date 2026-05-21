import type { GameLevel } from '../../lesson/levels';
import { getWedgePuzzle, WEDGE_LEVELS } from './wedgePuzzles';
import './WedgeLevelMenu.css';

type WedgeLevelMenuProps = {
  unlocked: GameLevel;
  onSelect: (level: GameLevel) => void;
};

export function WedgeLevelMenu({ unlocked, onSelect }: WedgeLevelMenuProps) {
  return (
    <div className="wedge-level-menu">
      <h2 className="wedge-level-menu__title">Choose a level</h2>
      <p className="wedge-level-menu__sub">
        Build each planet — place every terrain wedge in orbit.
      </p>
      <ul className="wedge-level-menu__list">
        {WEDGE_LEVELS.map((level) => {
          const locked = level.id > unlocked;
          const puzzle = getWedgePuzzle(level.id);
          return (
            <li key={level.id}>
              <button
                type="button"
                className="wedge-level-menu__card"
                disabled={locked}
                style={{ '--level-accent': level.accent } as React.CSSProperties}
                onClick={() => onSelect(level.id)}
              >
                <span className="wedge-level-menu__badge">{level.title}</span>
                <span className="wedge-level-menu__name">{level.subtitle}</span>
                <span className="wedge-level-menu__frac">
                  {puzzle.pieces.length} slices to place
                </span>
                <span className="wedge-level-menu__equiv">{puzzle.equiv}</span>
                {locked && (
                  <span className="wedge-level-menu__lock">Complete earlier levels first</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
