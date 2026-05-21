import type { Piece } from '../../manipulative/workspace';
import './FractionPiece.css';

type FractionPieceProps = {
  piece: Piece;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
};

export function FractionPiece({
  piece,
  selected,
  onSelect,
  compact = false,
}: FractionPieceProps) {
  const label = `${piece.numerator}/${piece.denominator}`;
  const sizeClass =
    piece.denominator === 2 ? 'fraction-piece--half' : 'fraction-piece--quarter';

  return (
    <button
      type="button"
      className={`fraction-piece ${sizeClass} ${selected ? 'fraction-piece--selected' : ''} ${compact ? 'fraction-piece--compact' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${label} block${selected ? ', selected' : ''}`}
    >
      <span className="fraction-piece__label">{label}</span>
    </button>
  );
}
