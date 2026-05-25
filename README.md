# Climate Response Hub
## DEMO: 
[Link to your demo drive or hosted app here]

## Problem Statement
City emergency coordinators and public health officials often struggle to make rapid decisions during extreme weather events. Massive amounts of fragmented data—including heat vulnerability indexes, live power grid status, and emergency shelter capacity—are siloed across different portals. There is a need for a unified, scalable platform that integrates these data sources to provide a single source of truth for proactive disaster management.

---

## Solution
**Climate Response Hub** solves this by providing a unified command-and-control dashboard for emergency management. 
- **Real-time Integration:** Merges live weather forecasts, infrastructure health, and community vulnerability data.
- **Actionable Insights:** Uses triage logic to recommend specific resource deployments (e.g., mobile cooling units).
- **Unified Interface:** Replaces fragmented map portals with a single dashboard for rapid decision-making.

---

## Features
- **Dynamic Vulnerability Mapping:** Multi-layer overlays combining heat risk, population density, and flood zones.
- **Resilience-First Filtering:** Real-time visibility into shelter operational status, including backup power and live occupancy.
- **Automated Actionable Insights:** AI-driven triage logic that generates specific "Next Best Actions" for coordinators.
- **Single-Pane-of-Glass Dashboard:** Unified interface merging climate and urban data for immediate situational awareness.
- **ArcGIS Ecosystem Integration:** Leveraging professional-grade spatial analysis for urban planning.

---

## Architecture
The platform consists of three main layers:

### 1. Data Layer
- **ArcGIS Online (Web Maps):** Hosts spatial layers including heat vulnerability indices and shelter locations.
- **Infrastructure Data:** Real-time status of cooling centers (capacity, power resilience).

### 2. Processing Layer
- **Triage Logic:** Processes vulnerability scores and infrastructure status to generate recommended actions.
- **Spatial Analysis:** Uses ArcGIS SDK to calculate optimal routes and identify high-risk hotspots.

### 3. Serving Layer / Web App
- **React Dashboard:** Provides the "Command Center" interface for emergency coordinators.
- **ArcGIS Maps SDK:** Powers the interactive map and spatial data visualization.

---

## Architecture Diagram (Conceptual)

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
