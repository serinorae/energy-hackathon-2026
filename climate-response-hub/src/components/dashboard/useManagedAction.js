import { useState } from "react";

function loadManagedAction(areaCode) {
  if (!areaCode) return null;

  const saved = localStorage.getItem(`managed-district-${areaCode}`);
  return saved ? JSON.parse(saved) : null;
}

export function useManagedAction(selectedArea) {
  const [actionNote, setActionNote] = useState("");
  const [revision, setRevision] = useState(0);

  const managedAction = loadManagedAction(selectedArea?.code, revision);

  const saveAction = () => {
    if (!selectedArea?.code) return null;

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
    setRevision((current) => current + 1);
    setActionNote("");
    return newAction;
  };

  const deleteAction = () => {
    if (!selectedArea?.code) return;
    localStorage.removeItem(`managed-district-${selectedArea.code}`);
    window.dispatchEvent(new Event("managed-district-updated"));
    setRevision((current) => current + 1);
    setActionNote("");
  };

  return {
    managedAction,
    actionNote,
    setActionNote,
    saveAction,
    deleteAction,
  };
}
