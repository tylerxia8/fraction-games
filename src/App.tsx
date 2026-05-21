import { useState } from 'react';
import { LessonShell } from './components/LessonShell/LessonShell';
import { WedgeGameShell } from './games/wedge/WedgeGameShell';
import { CompareCirclesGame } from './games/compare-circles/CompareCirclesGame';
import { CompareFractionsGame } from './games/compare/CompareFractionsGame';
import { GatorFractionsGame } from './games/gator/GatorFractionsGame';
import { Lobby } from './components/Lobby/Lobby';
import type { GameId } from './lobby/games';

export default function App() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  if (activeGame === 'slicer') {
    return <LessonShell onBackToLobby={() => setActiveGame(null)} />;
  }

  if (activeGame === 'wedge') {
    return <WedgeGameShell onBackToLobby={() => setActiveGame(null)} />;
  }

  if (activeGame === 'compare') {
    return <CompareFractionsGame onBackToLobby={() => setActiveGame(null)} />;
  }

  if (activeGame === 'circles') {
    return <CompareCirclesGame onBackToLobby={() => setActiveGame(null)} />;
  }

  if (activeGame === 'gator') {
    return <GatorFractionsGame onBackToLobby={() => setActiveGame(null)} />;
  }

  return <Lobby onSelectGame={setActiveGame} />;
}
