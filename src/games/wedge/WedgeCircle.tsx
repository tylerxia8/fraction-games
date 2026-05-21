import { useCallback, useEffect, useId, useRef } from 'react';
import type { GameLevel } from '../../lesson/levels';
import {
  dividerLinePoints,
  internalSubdivisionLinePoints,
  rimPoint,
  wedgePath,
} from '../../manipulative/circleGeometry';
import { SmashEffects } from '../../components/FractionManipulative/SmashEffects';
import {
  gapCssClass,
  gapMidpoint,
  pointerOverGap,
  wedgePieceSliceClasses,
  wedgePieceViewBox,
} from './wedgeGeometry';
import { PLANET_COPY } from '../../lobby/gameThemes';
import {
  getWedgePartitionAngles,
  getWedgeSliceLines,
  getWedgeSubdivisionLines,
  type WedgePiece,
  type WedgePuzzleConfig,
} from './wedgePuzzles';
import './WedgeCircle.css';
import './themes/planet.css';

type WedgeCircleProps = {
  level: GameLevel;
  puzzle: WedgePuzzleConfig;
  message: string;
  insertedIds: Set<string>;
  trayPieces: WedgePiece[];
  activePiece: WedgePiece | null;
  isDragging: boolean;
  dragPos: { x: number; y: number } | null;
  allInserted: boolean;
  smashed: boolean;
  smashMerging: boolean;
  onDragStart: (pieceId: string, clientX: number, clientY: number) => void;
  onDragMove: (clientX: number, clientY: number) => void;
  onDragEnd: (clientX: number, clientY: number, svgRect: DOMRect) => void;
  onDragCancel: () => void;
  onSmash: () => void;
  onContinue: () => void;
  showContinue: boolean;
};

export function WedgeCircle({
  level,
  puzzle,
  message,
  insertedIds,
  trayPieces,
  activePiece,
  isDragging,
  dragPos,
  allInserted,
  smashed,
  smashMerging,
  onDragStart,
  onDragMove,
  onDragEnd,
  onDragCancel,
  onSmash,
  onContinue,
  showContinue,
}: WedgeCircleProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const planetGradId = useId().replace(/:/g, '');
  const sliceLineAngles = getWedgeSliceLines(level);
  const subdivisionAngles = getWedgeSubdivisionLines(level);
  const partitionAngles = getWedgePartitionAngles(level);

  const getSvgRect = useCallback((): DOMRect | null => {
    return svgRef.current?.getBoundingClientRect() ?? null;
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      onDragMove(e.clientX, e.clientY);
    };

    const onUp = (e: PointerEvent) => {
      const rect = getSvgRect();
      if (rect) {
        onDragEnd(e.clientX, e.clientY, rect);
      } else {
        onDragCancel();
      }
    };

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [isDragging, onDragMove, onDragEnd, onDragCancel, getSvgRect]);

  const nearActiveGap =
    isDragging &&
    activePiece &&
    dragPos &&
    (() => {
      const rect = getSvgRect();
      return rect ? pointerOverGap(dragPos.x, dragPos.y, rect, activePiece) : false;
    })();

  let floatStyle: React.CSSProperties | undefined;
  if (isDragging && dragPos && activePiece && stageRef.current) {
    const stageRect = stageRef.current.getBoundingClientRect();
    const svgWidth = svgRef.current?.getBoundingClientRect().width ?? 280;
    floatStyle = {
      left: dragPos.x - stageRect.left - svgWidth / 2,
      top: dragPos.y - stageRect.top - svgWidth / 2,
      width: svgWidth,
      height: svgWidth,
    };
  }

  const stageClass = [
    'wedge-circle__stage',
    allInserted && 'wedge-circle__stage--inserted',
    smashed && 'wedge-circle__stage--smashed',
    smashMerging && 'wedge-circle__stage--merging',
    isDragging && 'wedge-circle__stage--dragging',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      className="wedge-circle"
      data-level={level}
      data-game-theme="planet"
      aria-label="Planet builder puzzle"
    >
      <div className="wedge-circle__teach" role="status" aria-live="polite">
        <p className="wedge-circle__teach-text">{message}</p>
      </div>

      <div ref={stageRef} className={stageClass}>
        <SmashEffects active={smashed} merging={smashMerging} />

        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          className="wedge-circle__svg"
          role="img"
          aria-label="Planet assembly board"
        >
          <defs>
            <radialGradient id={`${planetGradId}-body`} cx="38%" cy="32%" r="68%">
              <stop offset="0%" stopColor="#7ec8f0" />
              <stop offset="45%" stopColor="#3d7ab8" />
              <stop offset="100%" stopColor="#1a3560" />
            </radialGradient>
            <radialGradient id={`${planetGradId}-shine`} cx="28%" cy="22%" r="35%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle
            cx={100}
            cy={100}
            r={86}
            className="wedge-circle__planet-body"
            fill={`url(#${planetGradId}-body)`}
          />
          <circle
            cx={100}
            cy={100}
            r={86}
            className="wedge-circle__planet-shine"
            fill={`url(#${planetGradId}-shine)`}
            pointerEvents="none"
          />
          <circle cx={100} cy={100} r={88} className="wedge-circle__rim" />

          <g
            className={[
              'wedge-circle__slices-wrap',
              smashMerging && 'wedge-circle__slices-wrap--merge',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {puzzle.pieces.map((piece) => {
              const placed = insertedIds.has(piece.sliceId);
              const isHot =
                nearActiveGap && activePiece?.sliceId === piece.sliceId && !placed;
              const pieceClass = wedgePieceSliceClasses(level, piece);
              const mid = gapMidpoint(piece);

              return (
                <g key={piece.sliceId}>
                  {placed ? (
                    <path
                      d={wedgePath(piece.startDeg, piece.endDeg, piece.innerR ?? 0)}
                      className={pieceClass}
                    />
                  ) : (
                    <path
                      d={wedgePath(piece.startDeg, piece.endDeg, piece.innerR ?? 0)}
                      className={[
                        pieceClass,
                        gapCssClass(level, piece),
                        isHot && 'wedge-circle__gap--hot',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    />
                  )}
                  {placed && piece.label ? (
                    <text
                      x={mid.x}
                      y={mid.y}
                      className={`wedge-circle__unit-label wedge-circle__unit-label--l${level}-${piece.section}`}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {piece.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>

          {sliceLineAngles.map((deg) => {
            const inner = rimPoint(deg, 14);
            const outer = rimPoint(deg, 88);
            return (
              <line
                key={`slice-line-${deg}`}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                className="wedge-circle__slice-line"
              />
            );
          })}

          {subdivisionAngles.map((deg) => (
            <line
              key={`subdiv-${deg}`}
              {...internalSubdivisionLinePoints(deg)}
              className="wedge-circle__subdivision-line"
            />
          ))}

          {partitionAngles.map((deg, i) => (
            <line
              key={`part-${i}`}
              {...dividerLinePoints(deg)}
              className={[
                'wedge-circle__partition',
                allInserted && 'wedge-circle__partition--aligned',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          ))}

          {level === 1 && allInserted && (
            <>
              <line
                {...dividerLinePoints(-90)}
                className="wedge-circle__divider wedge-circle__divider--aligned"
              />
              <line
                {...dividerLinePoints(90)}
                className="wedge-circle__divider wedge-circle__divider--aligned"
              />
            </>
          )}
        </svg>

        {trayPieces.length > 0 && (
          <div className="wedge-circle__tray" role="group" aria-label="Slices to place">
            {trayPieces.map((piece) => {
              const hidden =
                isDragging && activePiece?.sliceId === piece.sliceId;
              const viewBox = wedgePieceViewBox(
                piece.startDeg,
                piece.endDeg,
                piece.innerR ?? 0,
              );
              const mid = gapMidpoint(piece);
              const pieceClass = wedgePieceSliceClasses(level, piece);

              return (
                <button
                  key={piece.sliceId}
                  type="button"
                  className={[
                    'wedge-circle__piece-tray',
                    hidden && 'wedge-circle__piece-tray--hidden',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-label={`Drag ${piece.label} into the circle`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onDragStart(piece.sliceId, e.clientX, e.clientY);
                  }}
                >
                  <svg viewBox={viewBox} className="wedge-circle__piece-svg" aria-hidden>
                    <path
                      d={wedgePath(piece.startDeg, piece.endDeg, piece.innerR ?? 0)}
                      className={pieceClass}
                    />
                    {piece.label ? (
                      <text
                        x={mid.x}
                        y={mid.y}
                        className={`wedge-circle__unit-label wedge-circle__unit-label--l${level}-${piece.section}`}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {piece.label}
                      </text>
                    ) : null}
                  </svg>
                </button>
              );
            })}
          </div>
        )}

        {isDragging && activePiece && dragPos && floatStyle && (
          <div
            className={[
              'wedge-circle__piece-float',
              nearActiveGap && 'wedge-circle__piece-float--hot',
            ]
              .filter(Boolean)
              .join(' ')}
            style={floatStyle}
            aria-hidden
          >
            <svg viewBox="0 0 200 200" className="wedge-circle__piece-float-svg" aria-hidden>
              <path
                d={wedgePath(
                  activePiece.startDeg,
                  activePiece.endDeg,
                  activePiece.innerR ?? 0,
                )}
                className={wedgePieceSliceClasses(level, activePiece)}
              />
            </svg>
          </div>
        )}
      </div>

      {allInserted && smashed && (
        <p className="wedge-circle__equiv" aria-hidden>
          {puzzle.equiv}
        </p>
      )}

      <div className="wedge-circle__actions">
        {allInserted && !smashed && !smashMerging && (
          <button
            type="button"
            className="wedge-circle__smash wedge-circle__smash--ready"
            onClick={onSmash}
          >
            {PLANET_COPY.smashReady}
          </button>
        )}
        {smashMerging && (
          <button type="button" className="wedge-circle__smash" disabled>
            {PLANET_COPY.smashMerging}
          </button>
        )}
        {smashed && (
          <button type="button" className="wedge-circle__smash" disabled>
            {PLANET_COPY.smashed}
          </button>
        )}
        {showContinue && (
          <button type="button" className="wedge-circle__continue" onClick={onContinue}>
            {level < 2 ? 'Next level' : 'Choose level'}
          </button>
        )}
      </div>
    </section>
  );
}
