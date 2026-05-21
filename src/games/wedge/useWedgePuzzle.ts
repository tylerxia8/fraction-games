import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { GameLevel } from '../../lesson/levels';
import { playSmashThunk, playSnapClick } from '../../manipulative/sounds';
import { pointerOverGap } from './wedgeGeometry';
import { getWedgePuzzle } from './wedgePuzzles';

export function useWedgePuzzle(level: GameLevel) {
  const puzzle = getWedgePuzzle(level);
  const [insertedIds, setInsertedIds] = useState<Set<string>>(() => new Set());
  const [activePieceId, setActivePieceId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [smashed, setSmashed] = useState(false);
  const [smashMerging, setSmashMerging] = useState(false);
  const draggingRef = useRef(false);

  const totalPieces = puzzle.pieces.length;
  const placedCount = insertedIds.size;
  const allInserted = placedCount >= totalPieces;

  const activePiece = useMemo(
    () => puzzle.pieces.find((p) => p.sliceId === activePieceId) ?? null,
    [puzzle.pieces, activePieceId],
  );

  const trayPieces = useMemo(
    () => puzzle.pieces.filter((p) => !insertedIds.has(p.sliceId)),
    [puzzle.pieces, insertedIds],
  );

  useEffect(() => {
    setInsertedIds(new Set());
    setActivePieceId(null);
    draggingRef.current = false;
    setIsDragging(false);
    setDragPos(null);
    setSmashed(false);
    setSmashMerging(false);
  }, [level]);

  const pulseSnap = useCallback(() => {
    playSnapClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(12);
    }
  }, []);

  const tryInsert = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      if (!activePiece || insertedIds.has(activePiece.sliceId)) return false;
      if (!pointerOverGap(clientX, clientY, rect, activePiece)) return false;
      setInsertedIds((prev) => new Set(prev).add(activePiece.sliceId));
      setActivePieceId(null);
      draggingRef.current = false;
      setIsDragging(false);
      setDragPos(null);
      pulseSnap();
      return true;
    },
    [activePiece, insertedIds, pulseSnap],
  );

  const startDrag = useCallback(
    (pieceId: string, x: number, y: number) => {
      if (insertedIds.has(pieceId)) return;
      setActivePieceId(pieceId);
      draggingRef.current = true;
      setIsDragging(true);
      setDragPos({ x, y });
    },
    [insertedIds],
  );

  const moveDrag = useCallback((x: number, y: number) => {
    if (!draggingRef.current) return;
    setDragPos({ x, y });
  }, []);

  const endDrag = useCallback(
    (clientX: number, clientY: number, rect: DOMRect) => {
      if (!draggingRef.current) return;
      if (!tryInsert(clientX, clientY, rect)) {
        draggingRef.current = false;
        setIsDragging(false);
        setDragPos(null);
        setActivePieceId(null);
      }
    },
    [tryInsert],
  );

  const cancelDrag = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
    setDragPos(null);
    setActivePieceId(null);
  }, []);

  const smash = useCallback(() => {
    if (!allInserted || smashed) return;
    setSmashMerging(true);
    playSmashThunk();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([20, 40, 20]);
    }
    window.setTimeout(() => {
      setSmashMerging(false);
      setSmashed(true);
    }, 650);
  }, [allInserted, smashed]);

  const reset = useCallback(() => {
    setInsertedIds(new Set());
    setActivePieceId(null);
    draggingRef.current = false;
    setIsDragging(false);
    setDragPos(null);
    setSmashed(false);
    setSmashMerging(false);
  }, []);

  return {
    puzzle,
    insertedIds,
    trayPieces,
    activePiece,
    placedCount,
    totalPieces,
    allInserted,
    isDragging,
    dragPos,
    smashed,
    smashMerging,
    startDrag,
    moveDrag,
    endDrag,
    cancelDrag,
    smash,
    reset,
  };
}
