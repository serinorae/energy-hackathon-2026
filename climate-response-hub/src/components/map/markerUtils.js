import { getCapacityColor } from "../../utils/riskUtils";

export function emojiIcon(place) {
  const hasBackup = place.backupPower === true;
  const noBackup = place.backupPower === false;
  const backupColor = hasBackup ? "#16a34a" : noBackup ? "#dc2626" : "#6b7280";
  const backupText = hasBackup || noBackup ? "⚡" : "?";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56">
      <circle cx="24" cy="24" r="20" fill="#7c3aed" stroke="white" stroke-width="2"/>
      <text x="24" y="31" text-anchor="middle" font-size="21" font-family="Arial, sans-serif">🏢</text>
      <circle cx="39" cy="39" r="12" fill="${backupColor}" stroke="white" stroke-width="2"/>
      <text x="39" y="45" text-anchor="middle" font-size="13" font-family="Arial, sans-serif">${backupText}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createCoolingPlacePopup(place) {
  return `
    <div style="font-size: 13px; line-height: 1.45;">
      <div style="margin-bottom: 10px;">
        <b>Capacity:</b>
        <span style="color: ${getCapacityColor(place.capacity)}; font-weight: 800;">
          ${place.capacity}%
        </span>
        <div style="width: 100%; height: 8px; background: #334155; border-radius: 999px; overflow: hidden; margin-top: 5px;">
          <div style="width: ${place.capacity}%; height: 100%; background: ${getCapacityColor(place.capacity)}; border-radius: 999px;"></div>
        </div>
      </div>
      <div><b>Type:</b> ${place.type}</div>
      <div><b>Address:</b> ${place.address}</div>
      <div><b>Phone:</b> ${place.phone}</div>
      <div><b>Hours:</b> ${place.hours}</div>
      <div><b>Amenities:</b> ${place.amenities}</div>
    </div>
  `;
}
