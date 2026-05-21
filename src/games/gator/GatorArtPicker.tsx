import { GATOR_ART_VARIANTS, saveGatorArtVariant, type GatorArtVariant } from './gatorArt';
import { AlligatorMouth, type MouthFacing } from './AlligatorMouth';
import './GatorArtPicker.css';

const PREVIEW_FACINGS: { facing: MouthFacing; label: string }[] = [
  { facing: 'left', label: 'Left is bigger' },
  { facing: 'right', label: 'Right is bigger' },
  { facing: 'equal', label: 'Same size' },
];

type GatorArtPickerProps = {
  selected: GatorArtVariant;
  onSelect: (variant: GatorArtVariant) => void;
  onDone: () => void;
};

export function GatorArtPicker({ selected, onSelect, onDone }: GatorArtPickerProps) {
  return (
    <div className="gator-picker" role="dialog" aria-labelledby="gator-picker-title">
      <div className="gator-picker__panel">
        <h2 id="gator-picker-title">Pick your alligators</h2>
        <p className="gator-picker__intro">
          Choose a look for all three choices. The mouth always opens toward the{' '}
          <strong>bigger</strong> fraction.
        </p>

        <ul className="gator-picker__list">
          {GATOR_ART_VARIANTS.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                className={[
                  'gator-picker__option',
                  selected === v.id && 'gator-picker__option--selected',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  onSelect(v.id);
                  saveGatorArtVariant(v.id);
                }}
              >
                <div className="gator-picker__option-head">
                  <span className="gator-picker__option-name">{v.label}</span>
                  <span className="gator-picker__option-blurb">{v.blurb}</span>
                </div>
                <div className="gator-picker__previews">
                  {PREVIEW_FACINGS.map(({ facing, label }) => (
                    <div key={facing} className="gator-picker__preview">
                      <AlligatorMouth variant={v.id} facing={facing} size="sm" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </button>
            </li>
          ))}
        </ul>

        <button type="button" className="gator-picker__done" onClick={onDone}>
          Use this set
        </button>
      </div>
    </div>
  );
}
