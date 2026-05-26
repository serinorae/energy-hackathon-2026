import { getCapacityClass } from "../../utils/riskUtils";

function getPlaceIcon(code) {
  if (code === "LIBRARY") return "📚";
  if (code === "COMM_CNTR") return "🏢";
  if (code === "CVC_CNTR") return "❄️";
  if (code === "MALL") return "🛍️";
  return "🏢";
}

function getBackupInfo(backupPower) {
  if (backupPower === true) return { icon: "✅", text: "Yes" };
  if (backupPower === false) return { icon: "⚡", text: "No" };
  return { icon: "❔", text: "Unknown" };
}

export default function CoolingPlaceList({ coolingPlaces }) {
  return (
    <section className="panel-card">
      <div className="panel-title">
        <h3>Cooling Places in This Area</h3>
        <small>selected neighbourhood</small>
      </div>

      <div className="centre-list">
        {coolingPlaces.length > 0 ? (
          coolingPlaces.map((place) => {
            const backup = getBackupInfo(place.backupPower);
            const capacityClass = getCapacityClass(place.capacity);

            return (
              <div className="centre-row detailed" key={place.id}>
                <div className="centre-icon">{getPlaceIcon(place.code)}</div>

                <div className="centre-info">
                  <strong>{place.name}</strong>
                  <p>{place.type}</p>
                  <p>{place.address}</p>
                </div>

                <div className="capacity">
                  <span>Capacity</span>
                  <strong>{place.capacity}%</strong>
                  <div className={`mini-bar ${capacityClass}`}>
                    <div style={{ width: `${place.capacity}%` }} />
                  </div>
                </div>

                <div className="backup-status">
                  <span>Backup Power</span>
                  <strong>
                    {backup.icon} {backup.text}
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
  );
}
