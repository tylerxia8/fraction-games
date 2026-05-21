export type GameLevel = 1 | 2;

export type LevelMeta = {
  id: GameLevel;
  title: string;
  subtitle: string;
  dividerLabel: string;
  equiv: string;
  accent: string;
};

export const LEVELS: LevelMeta[] = [
  {
    id: 1,
    title: 'Level 1',
    subtitle: 'Beam split',
    dividerLabel: '1/2',
    equiv: '3/6 = 2/4 = 1/2',
    accent: '#00b4d8',
  },
  {
    id: 2,
    title: 'Level 2',
    subtitle: 'Quad grid',
    dividerLabel: '1/4',
    equiv: '1/4 = 2/8 = 3/12 = 1/6+1/12',
    accent: '#9d4edd',
  },
];

export const WHOLE_EQUIV = '4×1/4 = 1';

export function getLevelMeta(level: GameLevel): LevelMeta {
  return LEVELS.find((l) => l.id === level) ?? LEVELS[0];
}
