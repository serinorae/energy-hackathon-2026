export default function Header() {
  return (
    <header className="top-header">
      <div className="brand">
        <div className="brand-icon">CRH</div>
        <div>
          <h1>Climate Response Hub</h1>
          <p>Heat-vulnerability decision support · Toronto</p>
        </div>
      </div>

      <div className="weather-banner">
        <span className="demo-pill">Demo scenario</span>
        <div className="warning">Heatwave advisory — sample conditions</div>
        <div>
          <strong>31°C</strong> feels like 36°C{" "}
          <span className="data-note">Demo data</span>
        </div>
        <div>Demo scenario: 3-day high-risk period</div>
      </div>
    </header>
  );
}
