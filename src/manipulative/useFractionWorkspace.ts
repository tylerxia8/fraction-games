import { useCallback, useState } from 'react';
import {
  checkLessonEquivalence,
  createInitialPieces,
  movePiece,
  splitHalf,
  type Piece,
  type Zone,
} from './workspace';

export function useFractionWorkspace() {
  const [pieces, setPieces] = useState<Piece[]>(createInitialPieces);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [smashed, setSmashed] = useState(false);

  const isEquivalent = checkLessonEquivalence(pieces);

  const selectPiece = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const placeInZone = useCallback(
    (zone: Zone) => {
      if (!selectedId || zone === 'palette') return;
      setPieces((prev) => movePiece(prev, selectedId, zone));
      setSelectedId(null);
      setSmashed(false);
    },
    [selectedId],
  );

  const returnToPalette = useCallback(() => {
    if (!selectedId) return;
    setPieces((prev) => movePiece(prev, selectedId, 'palette'));
    setSelectedId(null);
    setSmashed(false);
  }, [selectedId]);

  const splitSelected = useCallback(() => {
    if (!selectedId) return;
    setPieces((prev) => splitHalf(prev, selectedId));
    setSelectedId(null);
    setSmashed(false);
  }, [selectedId]);

  const smash = useCallback(() => {
    if (!checkLessonEquivalence(pieces)) return;
    setSmashed(true);
  }, [pieces]);

  const resetWorkspace = useCallback(() => {
    setPieces(createInitialPieces());
    setSelectedId(null);
    setSmashed(false);
  }, []);

  return {
    pieces,
    selectedId,
    isEquivalent,
    smashed,
    selectPiece,
    placeInZone,
    returnToPalette,
    splitSelected,
    smash,
    resetWorkspace,
  };
}
