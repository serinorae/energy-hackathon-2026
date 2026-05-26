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
        <h3>Confirm Response Action</h3>

        <p>
          District: <b>{selectedArea?.name}</b>
        </p>

        <textarea
          value={actionNote}
          onChange={(e) => onChangeNote(e.target.value)}
          placeholder="Example: Contacted district coordinator and requested mobile cooling unit deployment."
        />

        <div className="modal-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
