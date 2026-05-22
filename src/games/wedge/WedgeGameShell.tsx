import { useCallback, useMemo, useState } from 'react';
import type { GameLevel } from '../../lesson/levels';
import { getLobbyGame } from '../../lobby/games';
import { PLANET_COPY } from '../../lobby/gameThemes';
import { WedgeCircle } from './WedgeCircle';
import { WedgeLevelMenu } from './WedgeLevelMenu';
import { useWedgePuzzle } from './useWedgePuzzle';
import './WedgeGameShell.css';
import './WedgeLevelMenu.css';
import './themes/planet.css';

type WedgeGameShellProps = {
  onBackToLobby: () => void;
};

export function WedgeGameShell({ onBackToLobby }: WedgeGameShellProps) {
  const lobby = getLobbyGame('wedge');
  const [screen, setScreen] = useState<'menu' | 'play'>('menu');
  const [level, setLevel] = useState<GameLevel>(1);
  const [unlocked, setUnlocked] = useState<GameLevel>(1);

  const wedge = useWedgePuzzle(level);

  const message = useMemo(() => {
    if (wedge.smashed) return wedge.puzzle.insertMessage;
    if (wedge.allInserted) return PLANET_COPY.allInserted;
    if (wedge.isDragging) return PLANET_COPY.dragging;
    return `${wedge.puzzle.hint} (${wedge.placedCount} of ${wedge.totalPieces} in orbit)`;
  }, [wedge]);

  const startLevel = useCallback((next: GameLevel) => {
    setLevel(next);
    setScreen('play');
  }, []);

  const handleContinue = useCallback(() => {
    const nextUnlock = Math.min(2, level + 1) as GameLevel;
    setUnlocked((u) => (nextUnlock > u ? nextUnlock : u));
    if (level < 2) {
      startLevel((level + 1) as GameLevel);
    } else {
      setScreen('menu');
    }
  }, [level, startLevel]);

  const handleDragStart = useCallback(
    (pieceId: string, clientX: number, clientY: number) => {
      wedge.startDrag(pieceId, clientX, clientY);
    },
    [wedge.startDrag],
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      wedge.moveDrag(clientX, clientY);
    },
    [wedge.moveDrag],
  );

  const handleDragEnd = useCallback(
    (clientX: number, clientY: number, svgRect: DOMRect) => {
      wedge.endDrag(clientX, clientY, svgRect);
    },
    [wedge.endDrag],
  );

  const handleDragCancel = useCallback(() => {
    wedge.cancelDrag();
  }, [wedge.cancelDrag]);

  const levelAccent = level === 1 ? '#5c4d9e' : '#7b6cf6';

  return (
    <div
      className="wedge-shell"
      data-game-theme="planet"
      style={{ '--wedge-accent': levelAccent } as React.CSSProperties}
    >
      <header className="wedge-shell__header">
        <h1>{lobby.title}</h1>
        <div className="wedge-shell__nav">
          {screen === 'play' && (
            <button type="button" className="wedge-shell__back" onClick={() => setScreen('menu')}>
              Levels
            </button>
          )}
          <button type="button" className="wedge-shell__back" onClick={onBackToLobby}>
            Lobby
          </button>
        </div>
        {screen === 'play' && (
          <span className="wedge-shell__phase">
            Level {level} · {wedge.placedCount}/{wedge.totalPieces}
          </span>
        )}
      </header>

      <div className="wedge-shell__main">
        {screen === 'menu' ? (
          <WedgeLevelMenu unlocked={unlocked} onSelect={startLevel} />
        ) : (
          <WedgeCircle
            level={level}
            puzzle={wedge.puzzle}
            message={message}
            insertedIds={wedge.insertedIds}
            trayPieces={wedge.trayPieces}
            activePiece={wedge.activePiece}
            isDragging={wedge.isDragging}
            dragPos={wedge.dragPos}
            allInserted={wedge.allInserted}
            smashed={wedge.smashed}
            smashMerging={wedge.smashMerging}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            onSmash={wedge.smash}
            onContinue={handleContinue}
            showContinue={wedge.smashed}
          />
        )}
      </div>
    </div>
  );
}
