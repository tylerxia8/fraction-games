import { useCallback, useEffect, useMemo, useState } from 'react';
import { playSnapClick } from '../../manipulative/sounds';
import { getLobbyGame } from '../../lobby/games';
import { SPOTLIGHT_COPY } from '../../lobby/gameThemes';
import { CompareModePicker } from '../compare/CompareModePicker';
import '../compare/CompareModePicker.css';
import { compareFractions, type Comparison } from '../compare/fractionMath';
import type { ComparePlayMode } from '../compare/mode';
import { generateProblemSet, type CompareProblem } from '../compare/problems';
import { useRunTimer } from '../compare/useRunTimer';
import '../compare/CompareFractionsGame.css';
import { FractionCircleDisplay } from './FractionCircleDisplay';
import {
  clearCirclesBestTimeMs,
  formatElapsed,
  loadCirclesBestTimeMs,
  saveCirclesBestTimeMs,
} from './timer';
import './FractionCircleDisplay.css';
import './themes/spotlight.css';

const SPOTLIGHT_ACCENT = '#ffc107';
const SPOTLIGHT_CIRCLE_ACCENT = '#ffd54f';

type CompareCirclesGameProps = {
  onBackToLobby: () => void;
};

type Feedback = 'idle' | 'correct' | 'wrong';

const SYMBOLS: { id: Comparison; label: string; aria: string }[] = [
  { id: '<', label: '<', aria: 'Less than' },
  { id: '>', label: '>', aria: 'Greater than' },
  { id: '=', label: '=', aria: 'Equal to' },
];

export function CompareCirclesGame({ onBackToLobby }: CompareCirclesGameProps) {
  const game = getLobbyGame('circles');
  const [mode, setMode] = useState<ComparePlayMode | null>(null);

  if (mode === null) {
    return (
      <CompareModePicker
        title={game.title}
        accent={SPOTLIGHT_ACCENT}
        theme="spotlight"
        blurb={SPOTLIGHT_COPY.modeBlurb}
        timedDesc={SPOTLIGHT_COPY.modeTimedDesc}
        practiceDesc={SPOTLIGHT_COPY.modePracticeDesc}
        onSelect={setMode}
        onBack={onBackToLobby}
      />
    );
  }

  return (
    <CompareCirclesRun
      mode={mode}
      onBackToLobby={onBackToLobby}
      onChangeMode={() => setMode(null)}
    />
  );
}

type CompareCirclesRunProps = {
  mode: ComparePlayMode;
  onBackToLobby: () => void;
  onChangeMode: () => void;
};

function CompareCirclesRun({ mode, onBackToLobby, onChangeMode }: CompareCirclesRunProps) {
  const game = getLobbyGame('circles');
  const timed = mode === 'timed';
  const [deck, setDeck] = useState(() => generateProblemSet());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Comparison | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [bestMs, setBestMs] = useState<number | null>(() =>
    timed ? loadCirclesBestTimeMs() : null,
  );
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
    const prevBest = loadCirclesBestTimeMs();
    if (prevBest === null || finalMs < prevBest) {
      setIsNewRecord(true);
      setBestMs(finalMs);
      saveCirclesBestTimeMs(finalMs);
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
        return SPOTLIGHT_COPY.done;
      }
      return SPOTLIGHT_COPY.donePractice;
    }
    if (feedback === 'correct') return SPOTLIGHT_COPY.promptCorrect;
    if (feedback === 'wrong') return SPOTLIGHT_COPY.promptWrong;
    return SPOTLIGHT_COPY.promptIdle;
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
    clearCirclesBestTimeMs();
    setBestMs(null);
    setIsNewRecord(false);
  }, []);

  const showLabels = feedback === 'correct';

  const circleStyle = {
    '--game-accent': SPOTLIGHT_ACCENT,
    '--circle-accent': SPOTLIGHT_CIRCLE_ACCENT,
  } as React.CSSProperties;

  return (
    <div
      className="compare-game compare-circles-game"
      data-game-theme="spotlight"
      style={circleStyle}
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
          <div className="compare-game__done">
            <p className="compare-game__done-emoji" aria-hidden>
              🎭
            </p>
            <h2>Curtain call!</h2>
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
                <FractionCircleDisplay
                  fraction={problem.left}
                  side="left"
                  accent={SPOTLIGHT_CIRCLE_ACCENT}
                  showLabel={showLabels}
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
                <FractionCircleDisplay
                  fraction={problem.right}
                  side="right"
                  accent={SPOTLIGHT_CIRCLE_ACCENT}
                  showLabel={showLabels}
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
                    aria-label={`${aria}: left circle ${id} right circle`}
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
