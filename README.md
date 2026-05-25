# Climate Response Hub
**A Unified Decision-Support Dashboard for Emergency Management**

---

**Qualifying Video Link:** [Insert YouTube Video Link Here]

**Live Demo:** [Insert Link to your demo drive or hosted app here]

---

## 1. Problem Statement & Unique Value Proposition (UVP)
**Problem:** City emergency coordinators (e.g., Toronto Emergency Management, Toronto Shelter & Support Services) and public health officials often struggle to make rapid decisions during extreme weather events. Massive amounts of fragmented data—including heat vulnerability indexes, live power grid status, and emergency shelter capacity—are siloed across different portals. 

**UVP:** There is a need for a unified, scalable platform that integrates these data sources to provide a single source of truth for proactive disaster management. **Climate Response Hub** solves this by providing a unified command-and-control dashboard that goes beyond static mapping. It uses real-time triage logic to recommend specific, actionable resource deployments (e.g., dispatching mobile cooling units or outreach teams to accessibility blind spots) before an emergency escalates.

---

## 2. Business ROI
- **Economic:** Reduces unnecessary emergency service dispatches by optimizing resource allocation.
- **Operational:** Drastically reduces "tab-switching" cognitive load for coordinators by centralizing data.
- **Efficiency:** Decreases decision-making time from hours of manual analysis to seconds of actionable insight.
- **Equitable Impact:** Ensures life-saving resources reach the most vulnerable populations based on data-driven prioritization.

---

## 3. Submission Artifacts
As required by the hackathon guidelines, our technical and business design documents are available in the `docs/` folder:
* [System Architecture Diagram](./docs/1_architecture_diagram.png)
* [UML & Use Case Diagram (CRUD operations)](./docs/2_uml_usecase.png)
* [Database Schema](./docs/3_database_schema.png)
* [Feasibility Analysis (Business Case) & MVP Roadmap](./docs/4_feasibility_analysis.pdf)

---

## 4. Data Sources
This prototype leverages the Esri ecosystem alongside mock data to demonstrate functionality and decision-making logic:
* **Public & Real Data:** Esri ArcGIS Living Atlas (Climate vulnerability and demographic layers), City of Toronto's Heat Relief Network (locations of 500+ Cool Spaces).
* **Mock Data:** Real-time infrastructure status (e.g., live occupancy of shelters, backup power availability) and dynamic localized priority scores are hardcoded to simulate real-time API integrations during this prototype phase.

---

## 5. Key Features
- **Dynamic Vulnerability Mapping:** Multi-layer overlays combining heat risk, population density, and flood zones.
- **Resilience-First Filtering:** Real-time visibility into shelter operational status, including backup power and live occupancy.
- **Automated Actionable Insights:** AI-driven triage logic that generates specific "Next Best Actions" for coordinators.
- **Single-Pane-of-Glass Dashboard:** Unified interface merging climate and urban data for immediate situational awareness.
- **ArcGIS Ecosystem Integration:** Leveraging professional-grade spatial analysis for urban planning.

---

## 6. System Architecture
The platform consists of three main layers:

### 1) Data Layer
- **ArcGIS Online (Web Maps):** Hosts spatial layers including heat vulnerability indices and shelter locations.
- **Infrastructure Data:** Real-time status of cooling centers (capacity, power resilience).

### 2) Processing Layer
- **Triage Logic:** Processes vulnerability scores and infrastructure status to generate recommended actions.
- **Spatial Analysis:** Uses ArcGIS SDK to calculate optimal routes and identify high-risk hotspots.

### 3) Serving Layer / Web App
- **React Dashboard:** Provides the "Command Center" interface for emergency coordinators.
- **ArcGIS Maps SDK:** Powers the interactive map and spatial data visualization.

### Architecture Diagram (Conceptual)
```mermaid
flowchart LR
    subgraph Data_Layer["Data & Mapping Layer"]
        direction TB
        A[Live Weather Data] -->|Heat Index| C[ArcGIS Web Maps]
        B[Infrastructure Status] -->|Power/Capacity| C
        D[Vulnerability Index] --> C
    end

    subgraph Logic_Layer["Triage & Logic Layer"]
        direction TB
        C -->|Spatial Data| E[Triage Algorithm]
        E -->|Recommended Actions| F[Unified Dashboard]
    end

    subgraph Serving_Layer["Command Center Dashboard"]
        direction TB
        F --> G[Coordinator UI]
    end

    classDef data fill:#d5f5e3 stroke:#27ae60 stroke-width:2px,stroke-dasharray:5 5;
    classDef logic fill:#d6eaf8 stroke:#2980b9 stroke-width:2px,stroke-dasharray:5 5;
    classDef ui fill:#fcf3cf stroke:#f1c40f stroke-width:2px,stroke-dasharray:5 5;

    class C,A,B,D data;
    class E logic;
    class F,G ui;
