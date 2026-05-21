import { useCallback, useMemo, useRef } from 'react';
import type { GameLevel } from '../../lesson/levels';
import { getLevelMeta } from '../../lesson/levels';
import type { ScriptStep } from '../../lesson/script';
import {
  angleFromPointer,
  dividerLinePoints,
  getInternalSubdivisionAngles,
  internalSubdivisionLinePoints,
  getMultiSectionDividerAngles,
  getSliceLineAngles,
  getSlices,
  rimPoint,
  wedgeMidpoint,
  wedgePath,
  type CircleSlice,
} from '../../manipulative/circleGeometry';
import { LASER_COPY } from '../../lobby/gameThemes';
import { SmashEffects } from './SmashEffects';
import './FractionCircle.css';

type FractionCircleProps = {
  level: GameLevel;
  message: string;
  step: ScriptStep;
  dividerAngle: number;
  complete: boolean;
  smashed: boolean;
  smashMerging: boolean;
  isDragging: boolean;
  snapPulse: number;
  showSmash?: boolean;
  showContinue?: boolean;
  onAngleChange: (angle: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onSnapGoal: () => void;
  onSmash: () => void;
  onChoice: (choiceId: string) => void;
  onContinue: () => void;
};

function sliceClass(level: GameLevel, slice: CircleSlice): string {
  if (level === 1) {
    return `fraction-circle__slice fraction-circle__slice--l1-${slice.section === 0 ? 'left' : 'right'}`;
  }
  return `fraction-circle__slice fraction-circle__slice--s${slice.section}`;
}

function unitLabelClass(level: GameLevel, slice: CircleSlice): string {
  if (level === 1) {
    return `fraction-circle__unit-label fraction-circle__unit-label--l1-${slice.section === 0 ? 'left' : 'right'}`;
  }
  return `fraction-circle__unit-label fraction-circle__unit-label--s${slice.section}`;
}

export function FractionCircle({
  level,
  message,
  step,
  dividerAngle,
  complete,
  smashed,
  smashMerging,
  isDragging,
  snapPulse,
  showSmash = false,
  showContinue = false,
  onAngleChange,
  onDragStart,
  onDragEnd,
  onSnapGoal,
  onSmash,
  onChoice,
  onContinue,
}: FractionCircleProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const meta = getLevelMeta(level);

  const slices = useMemo(() => getSlices(level), [level]);
  const dividerAngles = useMemo(
    () => getMultiSectionDividerAngles(level, dividerAngle),
    [level, dividerAngle],
  );
  const sliceLineAngles = useMemo(() => getSliceLineAngles(level), [level]);
  const internalSubdivisionAngles = useMemo(
    () => getInternalSubdivisionAngles(level),
    [level],
  );
  const isMultiSection = level === 2;
  const handleLine = dividerLinePoints(dividerAngle);

  const showChoices = step.choices && step.choices.length > 0;
  const showExploreTools =
    !showChoices && (step.id === 'explore_intro' || step.id === 'explore_smash');

  const snapLabel = level === 1 ? LASER_COPY.snapL1 : LASER_COPY.snapL2;

  const updateAngle = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      onAngleChange(angleFromPointer(clientX, clientY, rect));
    },
    [onAngleChange],
  );

  const renderSlicePath = (slice: CircleSlice) => (
    <path
      key={slice.id}
      d={wedgePath(slice.startDeg, slice.endDeg, slice.innerR ?? 0)}
      className={[
        sliceClass(level, slice),
        slice.innerR ? 'fraction-circle__slice--annular' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );

  const renderSliceLabel = (slice: CircleSlice) => {
    if (!slice.label) return null;
    const { x, y } = wedgeMidpoint(slice.startDeg, slice.endDeg, slice.innerR ?? 0);
    return (
      <text
        key={`${slice.id}-label`}
        x={x}
        y={y}
        className={[
          unitLabelClass(level, slice),
          slice.label.length > 5 && 'fraction-circle__unit-label--small',
        ]
          .filter(Boolean)
          .join(' ')}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {slice.label}
      </text>
    );
  };

  const mergeClass =
    smashMerging || smashed ? 'fraction-circle__slices-wrap--merge' : '';

  return (
    <section
      className="fraction-circle"
      aria-label={`Level ${level} laser align mission`}
      data-level={level}
      data-game-theme="laser"
    >
      <div className="fraction-circle__teach" role="status" aria-live="polite">
        <p className="fraction-circle__teach-text">{message}</p>
      </div>

      <div
        className={[
          'fraction-circle__stage',
          complete && 'fraction-circle__stage--aligned',
          smashed && 'fraction-circle__stage--smashed',
          smashMerging && 'fraction-circle__stage--merging',
          isDragging && 'fraction-circle__stage--dragging',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <SmashEffects active={smashed} merging={smashMerging} />

        <svg
          ref={svgRef}
          viewBox="0 0 200 200"
          className="fraction-circle__svg"
          role="img"
          aria-label={`Level ${level} circle with ${meta.dividerLabel} slices`}
        >
          <circle cx={100} cy={100} r={88} className="fraction-circle__rim" />

          <g className={`fraction-circle__slices-wrap ${mergeClass}`}>
            {slices.map(renderSlicePath)}
            {slices.map(renderSliceLabel)}
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
                className="fraction-circle__slice-line"
              />
            );
          })}

          {internalSubdivisionAngles.map((deg) => (
            <line
              key={`subdiv-${deg}`}
              {...internalSubdivisionLinePoints(deg)}
              className="fraction-circle__subdivision-line"
            />
          ))}

          {isMultiSection ? (
            <g className="fraction-circle__partition-group">
              {dividerAngles.map((deg, i) => (
                <line
                  key={`divider-${i}-${deg}`}
                  {...dividerLinePoints(deg)}
                  className={[
                    'fraction-circle__partition',
                    complete && 'fraction-circle__partition--aligned',
                    isDragging && 'fraction-circle__partition--dragging',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ stroke: meta.accent }}
                />
              ))}
            </g>
          ) : (
            <line
              {...dividerLinePoints(dividerAngle)}
              className={[
                'fraction-circle__divider',
                complete && 'fraction-circle__divider--aligned',
                isDragging && 'fraction-circle__divider--dragging',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ stroke: meta.accent }}
            />
          )}
        </svg>

        <button
          type="button"
          key={snapPulse}
          className={[
            'fraction-circle__handle',
            isDragging && 'fraction-circle__handle--dragging',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            left: `${((handleLine.x2 / 200) * 100).toFixed(2)}%`,
            top: `${((handleLine.y2 / 200) * 100).toFixed(2)}%`,
          }}
          aria-label={`Drag the ${meta.dividerLabel} divider`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            onDragStart();
            updateAngle(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 0) return;
            updateAngle(e.clientX, e.clientY);
          }}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <span
            className="fraction-circle__handle-knob"
            style={{ background: meta.accent }}
          />
        </button>
      </div>

      {complete && step.id === 'explore_smash' && (
        <p className="fraction-circle__equiv" aria-hidden>
          {meta.equiv}
        </p>
      )}

      <div className="fraction-circle__actions">
        {showChoices &&
          step.choices!.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className="fraction-circle__choice"
              onClick={() => onChoice(choice.id)}
            >
              {choice.label}
            </button>
          ))}

        {showContinue && (
          <button
            type="button"
            className="fraction-circle__continue"
            onClick={onContinue}
          >
            {step.id === 'complete' ? 'Choose level' : 'Continue'}
          </button>
        )}

        {showExploreTools && (
          <div className="fraction-circle__toolbar">
            <button
              type="button"
              className="fraction-circle__tool"
              onClick={onSnapGoal}
              disabled={complete}
            >
              {complete ? LASER_COPY.snapReady : snapLabel}
            </button>
            <button
              type="button"
              className={`fraction-circle__smash ${complete ? 'fraction-circle__smash--ready' : ''}`}
              onClick={onSmash}
              disabled={!showSmash || !complete || smashed || smashMerging}
            >
              {smashed
                ? LASER_COPY.smashed
                : smashMerging
                  ? LASER_COPY.smashMerging
                  : LASER_COPY.smashReady}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
