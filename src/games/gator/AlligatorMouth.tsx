import type { GatorArtVariant } from './gatorArt';
import {
  CartoonGator,
  FriendlyGator,
  ProfileGator,
  SymbolGator,
  TriangleGator,
} from './gatorVariants';
import './AlligatorMouth.css';

export type MouthFacing = 'left' | 'right' | 'equal';

type AlligatorMouthProps = {
  facing: MouthFacing;
  variant?: GatorArtVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const RENDERERS = {
  triangle: TriangleGator,
  friendly: FriendlyGator,
  symbol: SymbolGator,
  cartoon: CartoonGator,
  profile: ProfileGator,
} as const;

/** Mouth opens toward the larger fraction (classic gator “eat the bigger” model). */
export function AlligatorMouth({
  facing,
  variant = 'symbol',
  size = 'md',
  className = '',
}: AlligatorMouthProps) {
  const Renderer = RENDERERS[variant];
  const classes = [`gator-mouth--${size}`, `gator-mouth--${facing}`, className]
    .filter(Boolean)
    .join(' ');
  return <Renderer facing={facing} className={classes} />;
}
