export default function RiskCard({ area, managedAction }) {
  const levelClass = area.level?.toLowerCase();
  const population = area.riskScore
    ? (80000 + area.riskScore * 900).toLocaleString()
    : "-";
  const heatIndex = area.riskScore ? Math.round(30 + area.riskScore / 12) : "-";

  return (
    <section className="risk-card">
      <div className="dashboard-header">
        <h2>{area.name}</h2>
        <span className={`risk-badge ${levelClass}`}>
          {managedAction ? "MANAGED" : area.level}
        </span>
      </div>

      <p className="label">Heat Vulnerability Index</p>

      <div className="risk-score">
        <span className={levelClass}>{area.riskScore || "-"}</span>
        <small>/100</small>
      </div>

      <div className="risk-bar">
        <div
          className={`risk-fill ${levelClass}`}
          style={{ width: `${area.riskScore || 0}%` }}
        />
      </div>

      {managedAction && (
        <div className="managed-mini-banner">✅ Response action completed</div>
      )}

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
  );
}
