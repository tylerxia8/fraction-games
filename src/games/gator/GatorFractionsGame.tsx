import { useCallback, useMemo, useState } from 'react';
import { FractionDisplay } from '../compare/FractionDisplay';
import { generateProblemSet } from '../compare/problems';
import { compareFractions, type Comparison } from '../compare/fractionMath';
import type { CompareProblem } from '../compare/problems';
import { playSnapClick } from '../../manipulative/sounds';
import { getLobbyGame } from '../../lobby/games';
import { AlligatorMouth, type MouthFacing } from './AlligatorMouth';
import { GatorArtPicker } from './GatorArtPicker';
import { loadGatorArtVariant, type GatorArtVariant } from './gatorArt';
import './GatorFractionsGame.css';

type GatorFractionsGameProps = {
  onBackToLobby: () => void;
};

type Feedback = 'idle' | 'correct' | 'wrong';

type GatorChoice = {
  comparison: Comparison;
  facing: MouthFacing;
  caption: string;
  aria: string;
};

const GATOR_CHOICES: GatorChoice[] = [
  {
    comparison: '>',
    facing: 'left',
    caption: 'Left is bigger',
    aria: 'Alligator eats the left — left fraction is greater',
  },
  {
    comparison: '<',
    facing: 'right',
    caption: 'Right is bigger',
    aria: 'Alligator eats the right — right fraction is greater',
  },
  {
    comparison: '=',
    facing: 'equal',
    caption: 'Same size',
    aria: 'Fractions are equal — no one gets eaten',
  },
];

function facingForComparison(c: Comparison): MouthFacing {
  if (c === '>') return 'left';
  if (c === '<') return 'right';
  return 'equal';
}

export function GatorFractionsGame({ onBackToLobby }: GatorFractionsGameProps) {
  const game = getLobbyGame('gator');
  const [deck, setDeck] = useState(() => generateProblemSet());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Comparison | null>(null);
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const [artVariant, setArtVariant] = useState<GatorArtVariant>(() => loadGatorArtVariant());
  const [showArtPicker, setShowArtPicker] = useState(false);

  const problem = deck[index] as CompareProblem | undefined;
  const finished = index >= deck.length;
  const answer = problem ? compareFractions(problem.left, problem.right) : null;
  const chompSide =
    feedback === 'correct' && answer === '>'
      ? 'left'
      : feedback === 'correct' && answer === '<'
        ? 'right'
        : null;

  const message = useMemo(() => {
    if (finished) return 'Nice feeding! The gators ate every bigger fraction. Play again!';
    if (feedback === 'correct') {
      return 'Chomp! The alligator’s mouth opened toward the bigger fraction.';
    }
    if (feedback === 'wrong') {
      return 'Point the gator’s mouth toward the larger fraction — it eats the bigger one!';
    }
    return 'The hungry alligator always eats the larger fraction. Which way should its mouth open?';
  }, [finished, feedback]);

  const handlePick = useCallback(
    (symbol: Comparison) => {
      if (!problem || feedback === 'correct') return;
      setPicked(symbol);
      if (symbol === answer) {
        setFeedback('correct');
        playSnapClick();
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([12, 24, 12]);
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
  }, []);

  return (
    <div
      className="gator-game"
      style={{ '--game-accent': game.accent } as React.CSSProperties}
    >
      <header className="gator-game__header">
        <button type="button" className="gator-game__back" onClick={onBackToLobby}>
          Lobby
        </button>
        <h1>{game.title}</h1>
        <div className="gator-game__header-actions">
          <button
            type="button"
            className="gator-game__pick-art"
            onClick={() => setShowArtPicker(true)}
          >
            Gator look
          </button>
          {!finished && (
            <span className="gator-game__progress">
              {index + 1} / {deck.length}
            </span>
          )}
        </div>
      </header>

      {showArtPicker && (
        <GatorArtPicker
          selected={artVariant}
          onSelect={setArtVariant}
          onDone={() => setShowArtPicker(false)}
        />
      )}

      <p className="gator-game__prompt" role="status" aria-live="polite">
        {message}
      </p>

      <main className="gator-game__main">
        {finished ? (
          <div className="gator-game__done">
            <AlligatorMouth
              variant={artVariant}
              facing="left"
              size="lg"
              className="gator-game__done-gator"
            />
            <h2>All fed!</h2>
            <p className="gator-game__done-tip">
              Remember: the mouth opens toward the <strong>bigger</strong> number, just like
              &gt; and &lt;.
            </p>
            <button type="button" className="gator-game__primary" onClick={handlePlayAgain}>
              Play again
            </button>
            <button type="button" className="gator-game__secondary" onClick={onBackToLobby}>
              Back to lobby
            </button>
          </div>
        ) : (
          problem && (
            <>
              <div
                className={[
                  'gator-game__row',
                  chompSide === 'left' && 'gator-game__row--chomp-left',
                  chompSide === 'right' && 'gator-game__row--chomp-right',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div
                  className={[
                    'gator-game__frac',
                    chompSide === 'left' && 'gator-game__frac--chomped',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <FractionDisplay
                    fraction={problem.left}
                    side="left"
                    accent={game.accent}
                    showBarModel={feedback === 'correct'}
                  />
                </div>
                <div
                  className={[
                    'gator-game__center',
                    picked && 'gator-game__center--filled',
                    feedback === 'correct' && 'gator-game__center--correct',
                    feedback === 'wrong' && 'gator-game__center--wrong',
                    chompSide === 'left' && 'gator-game__center--chomp-left',
                    chompSide === 'right' && 'gator-game__center--chomp-right',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {picked ? (
                    <AlligatorMouth
                      variant={artVariant}
                      facing={facingForComparison(picked)}
                      size="lg"
                      className={
                        feedback === 'correct'
                          ? [
                              'gator-mouth--chomp',
                              chompSide === 'left' && 'gator-mouth--chomp-left',
                              chompSide === 'right' && 'gator-mouth--chomp-right',
                              answer === '=' && 'gator-mouth--chomp-equal',
                            ]
                              .filter(Boolean)
                              .join(' ')
                          : ''
                      }
                    />
                  ) : (
                    <span className="gator-game__center-hint" aria-hidden>
                      ?
                    </span>
                  )}
                </div>
                <div
                  className={[
                    'gator-game__frac',
                    chompSide === 'right' && 'gator-game__frac--chomped',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <FractionDisplay
                    fraction={problem.right}
                    side="right"
                    accent={game.accent}
                    showBarModel={feedback === 'correct'}
                  />
                </div>
              </div>

              <p className="gator-game__legend">
                <span className="gator-game__legend-item">
                  <AlligatorMouth variant={artVariant} facing="left" size="sm" /> mouth opens
                  toward the{' '}
                  <strong>bigger</strong> fraction
                </span>
              </p>

              <div className="gator-game__choices" role="group" aria-label="Alligator choices">
                {GATOR_CHOICES.map(({ comparison, facing, caption, aria }) => (
                  <button
                    key={comparison}
                    type="button"
                    className={[
                      'gator-game__choice',
                      picked === comparison && 'gator-game__choice--picked',
                      feedback === 'correct' &&
                        picked === comparison &&
                        'gator-game__choice--correct',
                      feedback === 'correct' &&
                        picked === comparison &&
                        'gator-game__choice--chomp',
                      feedback === 'wrong' &&
                        picked === comparison &&
                        'gator-game__choice--wrong',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={aria}
                    disabled={feedback === 'correct'}
                    onClick={() => handlePick(comparison)}
                  >
                    <AlligatorMouth
                      variant={artVariant}
                      facing={facing}
                      size="md"
                      className={
                        feedback === 'correct' && picked === comparison
                          ? [
                              'gator-mouth--chomp',
                              chompSide === 'left' && comparison === '>' && 'gator-mouth--chomp-left',
                              chompSide === 'right' && comparison === '<' && 'gator-mouth--chomp-right',
                              answer === '=' && comparison === '=' && 'gator-mouth--chomp-equal',
                            ]
                              .filter(Boolean)
                              .join(' ')
                          : ''
                      }
                    />
                    <span className="gator-game__choice-caption">{caption}</span>
                    <span className="gator-game__choice-symbol" aria-hidden>
                      {comparison}
                    </span>
                  </button>
                ))}
              </div>

              {feedback === 'correct' && (
                <button type="button" className="gator-game__primary" onClick={handleNext}>
                  {index + 1 >= deck.length ? 'Finish' : 'Next chomp'}
                </button>
              )}
            </>
          )
        )}
      </main>
    </div>
  );
}
