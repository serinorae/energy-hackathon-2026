import { useState } from "react";
import MapScreen from "./components/MapScreen";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className="app">
      <MapScreen onAreaSelect={setSelectedArea} />
      <Dashboard selectedArea={selectedArea} />
    </div>
  );
}

export default App;
