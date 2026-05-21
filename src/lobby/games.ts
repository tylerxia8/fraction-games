export type GameId = 'slicer' | 'wedge' | 'compare' | 'circles' | 'gator';

export type GameThemeId = 'laser' | 'planet' | 'spotlight' | 'racing' | 'gator';

export type LobbyGame = {
  id: GameId;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  theme: GameThemeId;
  icon: string;
  /** Playable now vs placeholder shell */
  available: boolean;
};

export const LOBBY_GAMES: LobbyGame[] = [
  {
    id: 'slicer',
    title: 'Laser Align',
    subtitle: 'Sync the shield',
    description:
      'Spin the laser until the beams line up through the circle — then sync the shield to prove the fractions match.',
    accent: '#00b4d8',
    theme: 'laser',
    icon: '⚡',
    available: true,
  },
  {
    id: 'wedge',
    title: 'Planet Builder',
    subtitle: 'Assemble the world',
    description:
      'Drag each terrain wedge into orbit and build the planet piece by piece — then see how the fractions match.',
    accent: '#5c4d9e',
    theme: 'planet',
    icon: '🪐',
    available: true,
  },
  {
    id: 'gator',
    title: 'Hungry Gators',
    subtitle: 'Eat the bigger fraction',
    description:
      'Point the alligator’s mouth toward the larger fraction — just like > and < symbols.',
    accent: '#2d6a4f',
    theme: 'gator',
    icon: '🐊',
    available: true,
  },
  {
    id: 'circles',
    title: 'Spotlight Show',
    subtitle: 'Which light is brighter?',
    description:
      'Compare golden spotlight slices on stage. Pick <, >, or = — green when right, red when wrong.',
    accent: '#ffc107',
    theme: 'spotlight',
    icon: '🎭',
    available: true,
  },
  {
    id: 'compare',
    title: 'Racing Fractions',
    subtitle: 'Beat the clock',
    description:
      'Which fraction is faster on the track? Pick <, >, or = — green for right, red for wrong, checkered flag at the finish.',
    accent: '#e63946',
    theme: 'racing',
    icon: '🏎️',
    available: true,
  },
];

export function getLobbyGame(id: GameId): LobbyGame {
  return LOBBY_GAMES.find((g) => g.id === id) ?? LOBBY_GAMES[0];
}
