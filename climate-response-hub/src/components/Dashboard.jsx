export default function Dashboard({ selectedArea }) {
  const area = selectedArea || {
    name: "Select a neighbourhood",
    riskScore: 0,
    level: "Waiting",
    coolingPlaces: [],
    coolingPlaceCount: 0,
  };

  const getLevelClass = () => area.level?.toLowerCase();

  const population = area.riskScore
    ? (80000 + area.riskScore * 900).toLocaleString()
    : "-";

  const heatIndex = area.riskScore ? Math.round(30 + area.riskScore / 12) : "-";

  const coolingPlaces = area.coolingPlaces || [];

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
          <span className={getLevelClass()}>{area.riskScore || "-"}</span>
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
          <h3>Cooling Places in This Area</h3>
          <small>selected neighbourhood</small>
        </div>

        <div className="centre-list">
          {coolingPlaces.length > 0 ? (
            coolingPlaces.map((place) => {
              const capacityClass =
                place.capacity >= 80
                  ? "red"
                  : place.capacity >= 60
                    ? "orange"
                    : place.capacity >= 40
                      ? "yellow"
                      : "green";

              const backupText =
                place.backupPower === true
                  ? "Yes"
                  : place.backupPower === false
                    ? "No"
                    : "Unknown";

              const backupIcon =
                place.backupPower === true
                  ? "✅"
                  : place.backupPower === false
                    ? "⚡"
                    : "❔";

              return (
                <div className="centre-row detailed" key={place.id}>
                  <div className="centre-icon">
                    {place.code === "LIBRARY"
                      ? "📚"
                      : place.code === "COMM_CNTR"
                        ? "🏢"
                        : place.code === "CVC_CNTR"
                          ? "❄️"
                          : place.code === "MALL"
                            ? "🛍️"
                            : "🏢"}
                  </div>

                  <div className="centre-info">
                    <strong>{place.name}</strong>
                    <p>{place.type}</p>
                    <p>{place.address}</p>
                  </div>

                  <div className="capacity">
                    <span>Capacity</span>
                    <strong>{place.capacity}%</strong>
                    <div className={`mini-bar ${capacityClass}`}>
                      <div style={{ width: `${place.capacity}%` }}></div>
                    </div>
                  </div>

                  <div className="backup-status">
                    <span>Backup Power</span>
                    <strong>
                      {backupIcon} {backupText}
                    </strong>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="nearby-count">
              Select a neighbourhood to view cooling places.
            </p>
          )}
        </div>

        <p className="nearby-count">
          Cooling places found: <strong>{coolingPlaces.length || "-"}</strong>
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
