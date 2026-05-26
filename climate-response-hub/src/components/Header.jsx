export default function Header() {
  return (
    <header className="top-header">
      <div className="brand">
        <div className="brand-icon">🏙️</div>
        <div>
          <h1>Climate Response Hub</h1>
          <p>Toronto Emergency Coordination Dashboard</p>
        </div>
      </div>

      <div className="weather-banner">
        <div className="warning">⚠️ Heatwave Warning</div>
        <div>
          🌡️ <strong>31°C</strong> Feels like 36°C
        </div>
        <div>📈 Next 3 days High risk conditions</div>
      </div>
    </header>
  );
}
