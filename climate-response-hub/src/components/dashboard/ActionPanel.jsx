import { getRecommendedAction } from "../../utils/riskUtils";

export default function ActionPanel({
  area,
  selectedArea,
  managedAction,
  onOpenModal,
  onDeleteAction,
}) {
  const levelClass = area.level?.toLowerCase();
  const action = getRecommendedAction(area.level);

  return (
    <section className="panel-card">
      <h3>Recommended Action</h3>

      <div className={`action-card ${levelClass}`}>
        <div className="alert-icon">{managedAction ? "✅" : "⚠️"}</div>
        <div>
          <strong>{managedAction ? "MANAGED SUCCESSFULLY" : action}</strong>

          {managedAction ? (
            <>
              <p>This district has already been handled by a coordinator.</p>
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
        className={managedAction ? "managed-action-button" : "action-button"}
        disabled={!selectedArea?.code}
        onClick={onOpenModal}
      >
        {managedAction ? "Update Action Note" : "Mark Action as Completed"}
      </button>

      {managedAction && (
        <button className="delete-action-button" onClick={onDeleteAction}>
          Delete Managed Record
        </button>
      )}
    </section>
  );
}
