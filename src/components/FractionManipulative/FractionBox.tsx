import { FractionCircle } from './FractionCircle';
import type { GameLevel } from '../../lesson/levels';
import type { ScriptStep } from '../../lesson/script';

type FractionBoxProps = {
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
  onSmash: () => void;
  onChoice: (choiceId: string) => void;
  onSliceTap: (sliceId: string, section: number) => void;
  onContinue: () => void;
};

export function FractionBox(props: FractionBoxProps) {
  return (
    <div className="fraction-box fraction-box--circle">
      <FractionCircle {...props} />
    </div>
  );
}
