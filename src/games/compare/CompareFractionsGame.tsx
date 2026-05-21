import { useCallback, useEffect, useMemo, useState } from 'react';
import { playSnapClick } from '../../manipulative/sounds';
import { getLobbyGame } from '../../lobby/games';
import { RACING_COPY } from '../../lobby/gameThemes';
import { CompareModePicker } from './CompareModePicker';
import { compareFractions, type Comparison } from './fractionMath';
import { FractionDisplay } from './FractionDisplay';
import type { ComparePlayMode } from './mode';
import { generateProblemSet, type CompareProblem } from './problems';
import { RacingCheckeredFlag } from './RacingCheckeredFlag';
import {
  clearBestTimeMs,
  formatElapsed,
  loadBestTimeMs,
  saveBestTimeMs,
} from './timer';
import { useRunTimer } from './useRunTimer';
import './CompareFractionsGame.css';
import './CompareModePicker.css';
import './themes/racing.css';

const RACING_ACCENT = '#e63946';

type CompareFractionsGameProps = {
  onBackToLobby: () => void;
};

type Feedback = 'idle' | 'correct' | 'wrong';

const SYMBOLS: { id: Comparison; label: string; aria: string }[] = [
  { id: '<', label: '<', aria: 'Less than' },
  { id: '>', label: '>', aria: 'Greater than' },
  { id: '=', label: '=', aria: 'Equal to' },
];

export function CompareFractionsGame({ onBackToLobby }: CompareFractionsGameProps) {
  const game = getLobbyGame('compare');
  const [mode, setMode] = useState<ComparePlayMode | null>(null);

  if (mode === null) {
    return (
      <CompareModePicker
        title={game.title}
        accent={RACING_ACCENT}
        theme="racing"
        blurb={RACING_COPY.modeBlurb}
        timedDesc={RACING_COPY.modeTimedDesc}
        practiceDesc={RACING_COPY.modePracticeDesc}
        onSelect={setMode}
        onBack={onBackToLobby}
      />
    );
  }

  return (
    <CompareFractionsRun
      mode={mode}
      onBackToLobby={onBackToLobby}
      onChangeMode={() => setMode(null)}
    />
  );
}

type CompareFractionsRunProps = {
  mode: ComparePlayMode;
  onBackToLobby: () => void;
  onChangeMode: () => void;
};

function CompareFractionsRun({ mode, onBackToLobby, onChangeMode }: CompareFractionsRunProps) {
  const game = getLobbyGame('compare');
  const timed = mode === 'timed';
  const [deck, setDeck] = useState(() => generateProblemSet());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Comparison | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [bestMs, setBestMs] = useState<number | null>(() => (timed ? loadBestTimeMs() : null));
  const [isNewRecord, setIsNewRecord] = useState(false);

  const problem = deck[index] as CompareProblem | undefined;
  const finished = index >= deck.length;
  const answer = problem ? compareFractions(problem.left, problem.right) : null;

  const { elapsedMs, finalMs, stop, reset: resetTimer } = useRunTimer(timed && !finished);

  useEffect(() => {
    if (!timed || !finished || finalMs !== null) return;
    stop();
  }, [timed, finished, finalMs, stop]);

  useEffect(() => {
    if (!timed || finalMs === null) return;
    const prevBest = loadBestTimeMs();
    if (prevBest === null || finalMs < prevBest) {
      setIsNewRecord(true);
      setBestMs(finalMs);
      saveBestTimeMs(finalMs);
    } else {
      setIsNewRecord(false);
      setBestMs(prevBest);
    }
  }, [timed, finalMs]);

  const message = useMemo(() => {
    if (finished) {
      if (timed) {
        if (isNewRecord && finalMs !== null) {
          return `New record — ${formatElapsed(finalMs)}!`;
        }
        return RACING_COPY.done;
      }
      return RACING_COPY.donePractice;
    }
    if (feedback === 'correct') return RACING_COPY.promptCorrect;
    if (feedback === 'wrong') return RACING_COPY.promptWrong;
    return RACING_COPY.promptIdle;
  }, [finished, feedback, isNewRecord, finalMs, timed]);

  const handlePick = useCallback(
    (symbol: Comparison) => {
      if (!problem || feedback === 'correct') return;
      setPicked(symbol);
      if (symbol === answer) {
        setFeedback('correct');
        playSnapClick();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(12);
        }
      } else {
        setFeedback('wrong');
      }
    },
    [problem, answer, feedback],
  );

  const handleNext = useCallback(() => {
    setPicked(null);
    setFeedback('idle');
    setIndex((i) => i + 1);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setDeck(generateProblemSet());
    setIndex(0);
    setPicked(null);
    setFeedback('idle');
    setIsNewRecord(false);
    if (timed) resetTimer();
  }, [timed, resetTimer]);

  const handleResetHighScore = useCallback(() => {
    clearBestTimeMs();
    setBestMs(null);
    setIsNewRecord(false);
  }, []);

  return (
    <div
      className="compare-game compare-racing-game"
      data-game-theme="racing"
      style={{ '--game-accent': RACING_ACCENT } as React.CSSProperties}
    >
      <header className="compare-game__header">
        <button type="button" className="compare-game__back" onClick={onBackToLobby}>
          Lobby
        </button>
        <h1>{game.title}</h1>
        <div className="compare-game__header-meta">
          {timed && !finished && (
            <span className="compare-game__timer" aria-live="off">
              {formatElapsed(elapsedMs)}
            </span>
          )}
          {!finished && (
            <span className="compare-game__progress">
              {index + 1} / {deck.length}
            </span>
          )}
        </div>
      </header>

      {timed && bestMs !== null && !finished && (
        <div className="compare-game__best-hint">
          <span>
            Best: <strong>{formatElapsed(bestMs)}</strong>
          </span>
          <button
            type="button"
            className="compare-game__reset-score"
            onClick={handleResetHighScore}
          >
            Reset high score
          </button>
        </div>
      )}

      <p className="compare-game__prompt" role="status" aria-live="polite">
        {message}
      </p>

      <main className="compare-game__main">
        {finished ? (
          <div className="compare-game__done compare-game__done--racing-finish">
            <RacingCheckeredFlag />
            <h2>Race over!</h2>
            {timed && finalMs !== null && (
              <div className="compare-game__times">
                <p className="compare-game__time-row">
                  <span>This run</span>
                  <strong>{formatElapsed(finalMs)}</strong>
                </p>
                {bestMs !== null && (
                  <p
                    className={[
                      'compare-game__time-row',
                      isNewRecord && 'compare-game__time-row--record',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <span>Fastest</span>
                    <strong>{formatElapsed(bestMs)}</strong>
                  </p>
                )}
                {isNewRecord && (
                  <p className="compare-game__record-badge">New record!</p>
                )}
              </div>
            )}
            <button type="button" className="compare-game__primary" onClick={handlePlayAgain}>
              Play again
            </button>
            <button type="button" className="compare-game__secondary" onClick={onChangeMode}>
              Change mode
            </button>
            <button type="button" className="compare-game__secondary" onClick={onBackToLobby}>
              Back to lobby
            </button>
            {timed && bestMs !== null && (
              <button
                type="button"
                className="compare-game__reset-score compare-game__reset-score--done"
                onClick={handleResetHighScore}
              >
                Reset high score
              </button>
            )}
          </div>
        ) : (
          problem && (
            <>
              <div className="compare-game__row">
                <FractionDisplay
                  fraction={problem.left}
                  side="left"
                  accent={RACING_ACCENT}
                  showBarModel={false}
                />
                <div
                  className={[
                    'compare-game__slot',
                    picked && 'compare-game__slot--filled',
                    feedback === 'correct' && 'compare-game__slot--correct',
                    feedback === 'wrong' && 'compare-game__slot--wrong',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden
                >
                  {picked ?? '?'}
                </div>
                <FractionDisplay
                  fraction={problem.right}
                  side="right"
                  accent={RACING_ACCENT}
                  showBarModel={false}
                />
              </div>

              <div className="compare-game__choices" role="group" aria-label="Comparison symbols">
                {SYMBOLS.map(({ id, label, aria }) => (
                  <button
                    key={id}
                    type="button"
                    className={[
                      'compare-game__symbol',
                      picked === id && 'compare-game__symbol--picked',
                      feedback === 'correct' && picked === id && 'compare-game__symbol--correct',
                      feedback === 'wrong' && picked === id && 'compare-game__symbol--wrong',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={`${aria}: left fraction ${id} right fraction`}
                    disabled={feedback === 'correct'}
                    onClick={() => handlePick(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {feedback === 'correct' && (
                <button type="button" className="compare-game__primary" onClick={handleNext}>
                  {index + 1 >= deck.length ? 'Finish' : 'Next'}
                </button>
              )}
            </>
          )
        )}
      </main>
    </div>
  );
}
