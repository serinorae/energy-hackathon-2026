export default function Dashboard({ selectedArea }) {
  const area = selectedArea || {
    name: "Select a neighbourhood",
    riskScore: 0,
    level: "Waiting",
  };

  const getLevelClass = () => area.level?.toLowerCase();

  const population = area.riskScore
    ? (80000 + area.riskScore * 900).toLocaleString()
    : "-";

  const heatIndex = area.riskScore ? Math.round(30 + area.riskScore / 12) : "-";

  const nearbyCentres = area.riskScore
    ? area.riskScore >= 80
      ? 2
      : area.riskScore >= 60
        ? 4
        : 6
    : "-";

  const action =
    area.level === "Critical"
      ? "DEPLOY MOBILE COOLING UNIT"
      : area.level === "High"
        ? "MONITOR COOLING CENTRE CAPACITY"
        : area.level === "Moderate"
          ? "PREPARE COMMUNITY OUTREACH"
          : "CONTINUE MONITORING";

  return (
    <aside className="dashboard">
      <section className="risk-card">
        <div className="dashboard-header">
          <h2>{area.name}</h2>
          <span className={`risk-badge ${getLevelClass()}`}>{area.level}</span>
        </div>

        <p className="label">Heat Vulnerability Index</p>

        <div className="risk-score">
          <span>{area.riskScore || "-"}</span>
          <small>/100</small>
        </div>

        <div className="risk-bar">
          <div
            className={`risk-fill ${getLevelClass()}`}
            style={{ width: `${area.riskScore || 0}%` }}
          ></div>
        </div>

        <div className="metric-grid">
          <div className="metric-box">
            <span className="metric-icon">👥</span>
            <p>Population</p>
            <strong>{population}</strong>
          </div>

          <div className="metric-box">
            <span className="metric-icon">🌡️</span>
            <p>Forecast High</p>
            <strong>34°C</strong>
          </div>

          <div className="metric-box">
            <span className="metric-icon">💧</span>
            <p>Heat Index</p>
            <strong>{heatIndex}°C</strong>
          </div>
        </div>
      </section>

      <section className="panel-card">
        <div className="panel-title">
          <h3>Nearest Cooling Centres</h3>
          <small>within 5 km</small>
        </div>

        <div className="centre-list">
          <div className="centre-row">
            <div className="centre-icon">🏢</div>
            <div className="centre-info">
              <strong>Metro Toronto Library</strong>
              <p>0.8 km</p>
            </div>
            <div className="capacity">
              <span>92%</span>
              <div className="mini-bar">
                <div style={{ width: "92%" }}></div>
              </div>
            </div>
          </div>

          <div className="centre-row">
            <div className="centre-icon">🏢</div>
            <div className="centre-info">
              <strong>Allan Gardens Centre</strong>
              <p>1.6 km</p>
            </div>
            <div className="capacity">
              <span>76%</span>
              <div className="mini-bar orange">
                <div style={{ width: "76%" }}></div>
              </div>
            </div>
          </div>

          <div className="centre-row">
            <div className="centre-icon">🏢</div>
            <div className="centre-info">
              <strong>Community Centre</strong>
              <p>2.1 km</p>
            </div>
            <div className="capacity">
              <span>54%</span>
              <div className="mini-bar yellow">
                <div style={{ width: "54%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <p className="nearby-count">
          Cooling centres nearby: <strong>{nearbyCentres}</strong>
        </p>
      </section>

      <section className="panel-card">
        <h3>Recommended Action</h3>

        <div className={`action-card ${getLevelClass()}`}>
          <div className="alert-icon">⚠️</div>
          <div>
            <strong>{action}</strong>
            <p>
              Recommendation is based on estimated heat risk, nearby cooling
              capacity, and vulnerable population.
            </p>
          </div>
        </div>
      </section>

      <section className="panel-card alert-panel">
        <h3>Other Alerts Affecting This Area</h3>
        <p>⚡ Potential Grid Stress</p>
        <small>
          High electricity demand expected. Monitor facility power status.
        </small>
      </section>
    </aside>
  );
}
