import { useState } from "react";
import MapScreen from "./components/MapScreen";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import "./App.css";

function App() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className="app">
      <Header />

      <Sidebar />

      <main className="main-content">
        <MapScreen onAreaSelect={setSelectedArea} />
        <SummaryCards />
      </main>

      <Dashboard selectedArea={selectedArea} />
    </div>
  );
}

export default App;
