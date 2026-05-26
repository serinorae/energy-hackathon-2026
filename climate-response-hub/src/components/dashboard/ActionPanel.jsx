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
      <h3>Suggested coordinator action</h3>

      <div className={`action-card ${levelClass}`}>
        <div className="alert-icon">{managedAction ? "OK" : "!"}</div>
        <div>
          <strong>
            {managedAction ? "Action logged by coordinator" : action}
          </strong>

          {managedAction ? (
            <>
              <p>
                A coordinator has recorded a planned response for this area.
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
              Suggested action is based on prototype heat risk, simulated
              capacity, and estimated vulnerable population.
            </p>
          )}
        </div>
      </div>

      <button
        className={managedAction ? "managed-action-button" : "action-button"}
        disabled={!selectedArea?.code}
        onClick={onOpenModal}
      >
        {managedAction ? "Edit logged action" : "Log coordinator action"}
      </button>

      {managedAction && (
        <button className="delete-action-button" onClick={onDeleteAction}>
          Clear logged action
        </button>
      )}
    </section>
  );
}
