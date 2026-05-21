import { useCallback, useEffect, useMemo, useState } from 'react';
import { FractionBox } from '../FractionManipulative/FractionBox';
import { useCircleFraction } from '../../manipulative/useCircleFraction';
import type { GameLevel } from '../../lesson/levels';
import { getLevelMeta } from '../../lesson/levels';
import {
  getLevelStep,
  phaseForStep,
  SMASH_LINES,
  SNAP_GOAL_LINES,
} from '../../lesson/levelScript';
import { getLobbyGame } from '../../lobby/games';
import { LASER_COPY } from '../../lobby/gameThemes';
import { LevelMenu } from './LevelMenu';
import '../../styles/theme.css';
import './LessonShell.css';
import './themes/laser.css';

function exploreHint(level: GameLevel, complete: boolean): string | null {
  if (complete) return null;
  return level === 1 ? LASER_COPY.exploreHintL1 : LASER_COPY.exploreHintL2;
}

type LessonShellProps = {
  onBackToLobby: () => void;
};

export function LessonShell({ onBackToLobby }: LessonShellProps) {
  const [screen, setScreen] = useState<'menu' | 'play'>('menu');
  const [level, setLevel] = useState<GameLevel>(1);
  const [unlocked, setUnlocked] = useState<GameLevel>(1);
  const [stepId, setStepId] = useState('explore_intro');
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  const circle = useCircleFraction(level);
  const step = getLevelStep(level, stepId);
  const phase = phaseForStep(stepId);
  const meta = getLevelMeta(level);
  const lobby = getLobbyGame('slicer');

  useEffect(() => {
    const prev = document.title;
    document.title = lobby.title;
    return () => {
      document.title = prev;
    };
  }, [lobby.title]);

  const exploreOverride =
    stepId === 'explore_intro' ? exploreHint(level, circle.complete) : null;

  const displayMessage = useMemo(() => {
    if (flashMessage) return flashMessage;
    if (exploreOverride) return exploreOverride;
    return step.message;
  }, [flashMessage, exploreOverride, step.message]);

  useEffect(() => {
    setFlashMessage(null);
  }, [stepId, level]);

  useEffect(() => {
    if (stepId === 'explore_intro' && circle.isEquivalent) {
      setStepId('explore_smash');
    }
  }, [stepId, circle.isEquivalent]);

  useEffect(() => {
    if (stepId === 'explore_smash' && circle.smashed) {
      const t = window.setTimeout(() => setStepId('instruct'), 1100);
      return () => window.clearTimeout(t);
    }
  }, [stepId, circle.smashed]);

  const startLevel = useCallback((next: GameLevel) => {
    setLevel(next);
    setStepId('explore_intro');
    setFlashMessage(null);
    setScreen('play');
  }, []);

  const goToStep = useCallback((nextId: string) => {
    setStepId(nextId);
  }, []);

  const handleContinue = useCallback(() => {
    if (stepId === 'instruct') {
      goToStep('check_q1');
      return;
    }
    if (stepId === 'complete') {
      const nextUnlock = Math.min(2, level + 1) as GameLevel;
      setUnlocked((u) => (nextUnlock > u ? nextUnlock : u));
      if (level < 2) {
        startLevel((level + 1) as GameLevel);
      } else {
        setScreen('menu');
      }
      return;
    }
  }, [stepId, level, goToStep, startLevel]);

  const handleChoice = useCallback(
    (choiceId: string) => {
      const choice = step.choices?.find((c) => c.id === choiceId);
      if (!choice) return;
      const nextId = choice.correct ? step.onCorrect : step.onIncorrect;
      if (nextId) goToStep(nextId);
    },
    [step, goToStep],
  );

  const handleSnapGoal = useCallback(() => {
    setFlashMessage(SNAP_GOAL_LINES[level]);
    circle.snapToGoalPosition();
  }, [circle, level]);

  const handleSmash = useCallback(() => {
    setFlashMessage(SMASH_LINES[level]);
    circle.smash();
  }, [circle, level]);

  const showContinue =
    step.advanceOn === 'continue' && stepId !== 'explore_intro';

  const showSmash = step.showSmash ?? stepId === 'explore_smash';

  return (
    <div className="lesson-shell" data-phase={phase} data-game-theme="laser">
      <header className="lesson-shell__header">
        <h1>{lobby.title}</h1>
        <div className="lesson-shell__nav">
          {screen === 'play' && (
            <button
              type="button"
              className="lesson-shell__back"
              onClick={() => setScreen('menu')}
            >
              Levels
            </button>
          )}
          <button
            type="button"
            className="lesson-shell__back"
            onClick={onBackToLobby}
          >
            Lobby
          </button>
        </div>
        {screen === 'play' && (
          <span className="lesson-shell__phase" style={{ color: meta.accent }}>
            {meta.title}
          </span>
        )}
      </header>

      <div className="lesson-shell__main">
        {screen === 'menu' ? (
          <LevelMenu unlocked={unlocked} onSelect={startLevel} />
        ) : (
          <FractionBox
            level={level}
            message={displayMessage}
            step={step}
            dividerAngle={circle.dividerAngle}
            complete={circle.complete}
            smashed={circle.smashed}
            smashMerging={circle.smashMerging}
            isDragging={circle.isDragging}
            snapPulse={circle.snapPulse}
            showSmash={showSmash}
            showContinue={showContinue}
            onAngleChange={circle.setAngleFromDrag}
            onDragStart={circle.startDrag}
            onDragEnd={circle.endDrag}
            onSnapGoal={handleSnapGoal}
            onSmash={handleSmash}
            onChoice={handleChoice}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
}
