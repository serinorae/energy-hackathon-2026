export default function RiskToggle({
  riskMode,
  onCurrentClick,
  onForecastClick,
}) {
  return (
    <div className="risk-toggle">
      <button
        className={riskMode === "current" ? "active" : ""}
        onClick={onCurrentClick}
      >
        Current
      </button>

      <button
        className={riskMode === "forecast" ? "active" : ""}
        onClick={onForecastClick}
      >
        12-Hour Forecast
      </button>
    </div>
  );
}
