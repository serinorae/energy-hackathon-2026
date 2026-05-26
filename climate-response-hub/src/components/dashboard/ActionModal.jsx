export default function ActionModal({
  selectedArea,
  actionNote,
  onChangeNote,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Log a planned response</h3>

        <p>
          District: <b>{selectedArea?.name}</b>
        </p>

        <textarea
          value={actionNote}
          onChange={(e) => onChangeNote(e.target.value)}
          placeholder="Example: Contacted district coordinator and logged a plan to request mobile cooling support."
        />

        <div className="modal-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Log action
          </button>
        </div>
      </div>
    </div>
  );
}
