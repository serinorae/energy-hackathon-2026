import { useEffect, useState } from "react";

export function useManagedAction(selectedArea) {
  const [managedAction, setManagedAction] = useState(null);
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    if (!selectedArea?.code) {
      setManagedAction(null);
      setActionNote("");
      return;
    }

    const saved = localStorage.getItem(`managed-district-${selectedArea.code}`);
    setManagedAction(saved ? JSON.parse(saved) : null);
    setActionNote("");
  }, [selectedArea]);

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
    setManagedAction(newAction);
    setActionNote("");
    return newAction;
  };

  const deleteAction = () => {
    if (!selectedArea?.code) return;
    localStorage.removeItem(`managed-district-${selectedArea.code}`);
    window.dispatchEvent(new Event("managed-district-updated"));
    setManagedAction(null);
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
