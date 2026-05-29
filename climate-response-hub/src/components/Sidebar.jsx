export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <button className="active">Overview</button>
      </nav>

      <div className="legend">
        <h3>Legend</h3>
        <p>Heat Vulnerability <span className="data-note">Prototype estimate</span></p>
        <span>
          <b className="critical-box"></b> Critical (80-100)
        </span>
        <span>
          <b className="high-box"></b> High (60-79)
        </span>
        <span>
          <b className="moderate-box"></b> Moderate (40-59)
        </span>
        <span>
          <b className="lower-box"></b> Lower (0-39)
        </span>
      </div>

      <div className="facility-legend">
        <div className="legend-row">
          <span className="legend-icon cooling">C</span>
          <span>Cooling Centre</span>
        </div>

        <div className="legend-row">
          <span className="legend-icon backup-yes">P</span>
          <span>Has Backup Power <em className="data-note">Demo data</em></span>
        </div>

        <div className="legend-row">
          <span className="legend-icon backup-no">!</span>
          <span>No Backup Power <em className="data-note">Demo data</em></span>
        </div>

        <div className="legend-row">
          <span className="legend-icon backup-unknown">?</span>
          <span>Unknown</span>
        </div>
      </div>
    </aside>
  );
}
