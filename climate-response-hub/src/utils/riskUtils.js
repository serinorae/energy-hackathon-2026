export function getRiskLevel(riskScore) {
  if (riskScore >= 80) return "Critical";
  if (riskScore >= 60) return "High";
  if (riskScore >= 40) return "Moderate";
  return "Lower";
}

export function calculateFinalRisk(areaCode, weatherRisk) {
  const code = Number(areaCode);
  const vulnerabilityRisk = 40 + ((code * 13) % 50);
  const shelterAccessRisk = 30 + ((code * 7) % 60);

  const riskScore = Math.round(
    weatherRisk * 0.5 + vulnerabilityRisk * 0.3 + shelterAccessRisk * 0.2,
  );

  return {
    riskScore,
    level: getRiskLevel(riskScore),
    weatherRisk,
    vulnerabilityRisk,
    shelterAccessRisk,
  };
}

export function getRecommendedAction(level) {
  if (level === "Critical") return "PLAN MOBILE COOLING SUPPORT";
  if (level === "High") return "MONITOR COOLING CENTRE CAPACITY";
  if (level === "Moderate") return "PREPARE COMMUNITY OUTREACH";
  return "CONTINUE MONITORING";
}

export function getCapacityClass(capacity) {
  if (capacity >= 80) return "red";
  if (capacity >= 60) return "orange";
  if (capacity >= 40) return "yellow";
  return "green";
}

export function getCapacityColor(capacity) {
  if (capacity >= 80) return "#ef4444";
  if (capacity >= 60) return "#f97316";
  if (capacity >= 40) return "#eab308";
  return "#22c55e";
}
