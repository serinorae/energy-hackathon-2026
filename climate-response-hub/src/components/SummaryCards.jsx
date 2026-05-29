export default function SummaryCards({ selectedArea }) {
  const area = selectedArea || {
    riskScore: 0,
    level: "Waiting",
    coolingPlaces: [],
  };

  const coolingPlaces = area.coolingPlaces || [];

  const criticalNeighbourhoods =
    area.riskScore >= 80 ? 4 : area.riskScore >= 60 ? 2 : 1;

  const highRiskPeople = area.riskScore
    ? Math.round(80000 + area.riskScore * 900).toLocaleString()
    : "-";

  const availableCentres = coolingPlaces.length || "-";

  const centresAtCapacity = coolingPlaces.filter(
    (place) => place.capacity >= 80,
  ).length;

  return (
    <section className="summary-cards">
      <div className="summary-card">
        <p>Nearby Critical Risk Areas</p>
        <strong className="red">{criticalNeighbourhoods}</strong>
        <span>prototype estimate</span>
      </div>

      <div className="summary-card">
        <p>People at High Risk</p>
        <strong className="orange">{highRiskPeople}</strong>
        <span>prototype estimate</span>
      </div>

      <div className="summary-card">
        <p>Cooling Places in Area</p>
        <strong className="green">{availableCentres}</strong>
        <span>Toronto Open Data</span>
      </div>

      <div className="summary-card">
        <p>Centres at Capacity &gt; 80%</p>
        <strong className="red">{centresAtCapacity}</strong>
        <span>simulated for MVP</span>
      </div>
    </section>
  );
}
