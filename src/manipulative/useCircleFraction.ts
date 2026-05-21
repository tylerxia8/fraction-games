import { useCallback, useEffect, useState } from 'react';
import type { GameLevel } from '../lesson/levels';
import {
  initialDividerAngle,
  isLevelComplete,
  isOnSliceBoundary,
  snapDivider,
  snapToGoal,
} from './circleGeometry';
import { playSmashThunk, playSnapClick } from './sounds';

export function useCircleFraction(level: GameLevel) {
  const [dividerAngle, setDividerAngle] = useState(() => initialDividerAngle(level));
  const [isDragging, setIsDragging] = useState(false);
  const [smashed, setSmashed] = useState(false);
  const [smashMerging, setSmashMerging] = useState(false);
  const [snapPulse, setSnapPulse] = useState(0);

  useEffect(() => {
    setDividerAngle(initialDividerAngle(level));
    setIsDragging(false);
    setSmashed(false);
    setSmashMerging(false);
    setSnapPulse(0);
  }, [level]);

  const complete = isLevelComplete(level, dividerAngle);
  const isEquivalent = complete;

  const pulseSnap = useCallback(() => {
    setSnapPulse((p) => p + 1);
    playSnapClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
  }, []);

  const setAngleFromDrag = useCallback((angle: number) => {
    setDividerAngle(angle);
    setSmashed(false);
    setSmashMerging(false);
  }, []);

  const endDrag = useCallback(() => {
    setIsDragging(false);
    setDividerAngle((a) => {
      const snapped = snapDivider(level, a);
      if (isOnSliceBoundary(level, snapped)) pulseSnap();
      return snapped;
    });
  }, [level, pulseSnap]);

  const startDrag = useCallback(() => {
    setIsDragging(true);
  }, []);

  const snapToGoalPosition = useCallback(() => {
    setDividerAngle((a) => snapToGoal(level, a));
    setSmashed(false);
    pulseSnap();
  }, [level, pulseSnap]);

  const smash = useCallback(() => {
    if (!isEquivalent) return;
    setSmashMerging(true);
    playSmashThunk();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 40, 20]);
    }
    window.setTimeout(() => {
      setSmashMerging(false);
      setSmashed(true);
    }, 650);
  }, [isEquivalent]);

  const reset = useCallback(() => {
    setDividerAngle(initialDividerAngle(level));
    setIsDragging(false);
    setSmashed(false);
    setSmashMerging(false);
    setSnapPulse(0);
  }, [level]);

  return {
    dividerAngle,
    isDragging,
    complete,
    aligned: complete,
    isEquivalent,
    smashed,
    smashMerging,
    snapPulse,
    setAngleFromDrag,
    endDrag,
    startDrag,
    snapToGoalPosition,
    smash,
    reset,
  };
}
