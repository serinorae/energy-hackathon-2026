import { useEffect, useState } from "react";

export default function Dashboard({ selectedArea }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [managedAction, setManagedAction] = useState(null);

  const area = selectedArea || {
    name: "Select a neighbourhood",
    riskScore: 0,
    level: "Waiting",
    coolingPlaces: [],
    coolingPlaceCount: 0,
  };

  useEffect(() => {
    if (!selectedArea?.code) {
      setManagedAction(null);
      setActionNote("");
      return;
    }

    const saved = localStorage.getItem(`managed-district-${selectedArea.code}`);

    if (saved) {
      setManagedAction(JSON.parse(saved));
    } else {
      setManagedAction(null);
    }

    setActionNote("");
  }, [selectedArea]);

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

  const handleOpenModal = () => {
    if (!selectedArea?.code) return;
    setActionNote(managedAction?.note || "");
    setIsModalOpen(true);
  };

  const handleDeleteAction = () => {
    if (!selectedArea?.code) return;

    localStorage.removeItem(`managed-district-${selectedArea.code}`);
    window.dispatchEvent(new Event("managed-district-updated"));

    setManagedAction(null);
    setActionNote("");
  };

  const handleConfirmAction = () => {
    if (!selectedArea?.code) return;

    const newAction = {
      areaCode: selectedArea.code,
      areaName: selectedArea.name,
      note: actionNote,
      status: "managed",
      updatedAt: new Date().toLocaleString(),
    };

    localStorage.setItem(
      `managed-district-${selectedArea.code}`,
      JSON.stringify(newAction),
    );

    window.dispatchEvent(new Event("managed-district-updated"));

    setManagedAction(newAction);
    setIsModalOpen(false);
    setActionNote("");
  };

  return (
    <>
      <aside className="dashboard">
        <section className="risk-card">
          <div className="dashboard-header">
            <h2>{area.name}</h2>
            <span className={`risk-badge ${getLevelClass()}`}>
              {managedAction ? "MANAGED" : area.level}
            </span>
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

          {managedAction && (
            <div className="managed-mini-banner">
              ✅ Response action completed
            </div>
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
            <div className="alert-icon">{managedAction ? "✅" : "⚠️"}</div>
            <div>
              <strong>{managedAction ? "MANAGED SUCCESSFULLY" : action}</strong>

              {managedAction ? (
                <>
                  <p>
                    This district has already been handled by a coordinator.
                  </p>
                  <p>
                    <b>Last update:</b> {managedAction.updatedAt}
                  </p>
                  <p>
                    <b>Note:</b> {managedAction.note || "No note provided."}
                  </p>
                </>
              ) : (
                <p>
                  Recommendation is based on estimated heat risk, nearby cooling
                  capacity, and vulnerable population.
                </p>
              )}
            </div>
          </div>

          <button
            className={
              managedAction ? "managed-action-button" : "action-button"
            }
            disabled={!selectedArea?.code}
            onClick={handleOpenModal}
          >
            {managedAction ? "Update Action Note" : "Mark Action as Completed"}
          </button>
          {managedAction && (
            <button
              className="delete-action-button"
              onClick={handleDeleteAction}
            >
              Delete Managed Record
            </button>
          )}
        </section>

        <section className="panel-card alert-panel">
          <h3>Other Alerts Affecting This Area</h3>
          <p>⚡ Potential Grid Stress</p>
          <small>
            High electricity demand expected. Monitor facility power status.
          </small>
        </section>
      </aside>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Confirm Response Action</h3>

            <p>
              District: <b>{selectedArea?.name}</b>
            </p>

            <textarea
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder="Example: Contacted district coordinator and requested mobile cooling unit deployment."
            />

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button className="confirm-button" onClick={handleConfirmAction}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
