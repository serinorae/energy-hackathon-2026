import { useState } from "react";
import RiskCard from "./dashboard/RiskCard";
import CoolingPlaceList from "./dashboard/CoolingPlaceList";
import ActionPanel from "./dashboard/ActionPanel";
import ActionModal from "./dashboard/ActionModal";
import AlertPanel from "./dashboard/AlertPanel";
import { useManagedAction } from "./dashboard/useManagedAction";

const EMPTY_AREA = {
  name: "Select a neighbourhood",
  riskScore: 0,
  level: "Waiting",
  coolingPlaces: [],
  coolingPlaceCount: 0,
};

export default function Dashboard({ selectedArea }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const area = selectedArea || EMPTY_AREA;
  const coolingPlaces = area.coolingPlaces || [];

  const { managedAction, actionNote, setActionNote, saveAction, deleteAction } =
    useManagedAction(selectedArea);

  const handleOpenModal = () => {
    if (!selectedArea?.code) return;
    setActionNote(managedAction?.note || "");
    setIsModalOpen(true);
  };

  const handleConfirmAction = () => {
    saveAction();
    setIsModalOpen(false);
  };

  return (
    <>
      <aside className="dashboard">
        <RiskCard area={area} managedAction={managedAction} />
        <CoolingPlaceList coolingPlaces={coolingPlaces} />
        <ActionPanel
          area={area}
          selectedArea={selectedArea}
          managedAction={managedAction}
          onOpenModal={handleOpenModal}
          onDeleteAction={deleteAction}
        />
        <AlertPanel />
      </aside>

      {isModalOpen && (
        <ActionModal
          selectedArea={selectedArea}
          actionNote={actionNote}
          onChangeNote={setActionNote}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleConfirmAction}
        />
      )}
    </>
  );
}
