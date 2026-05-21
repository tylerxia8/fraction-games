import './RacingCheckeredFlag.css';

/** Waving checkered flag shown when Racing Fractions run completes. */
export function RacingCheckeredFlag() {
  return (
    <div className="racing-flag" aria-hidden>
      <div className="racing-flag__pole" />
      <div className="racing-flag__cloth">
        <div className="racing-flag__pattern" />
      </div>
    </div>
  );
}
