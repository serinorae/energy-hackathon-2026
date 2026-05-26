# Documentation Overview: Climate Response Hub

This folder (`docs/`) contains the core technical design and business feasibility documents required for the **Seneca Energy Hackathon 2026** submission. 

These four key documents are designed to provide judges—including representatives from Esri Canada, Alectra Utilities, and city officials — with a clear, intuitive understanding of the platform's logical architecture and business value.

---

## File Descriptions

### 1. `system_architecture_diagram.png` (System Architecture Diagram)
A structural diagram visualizing the platform's overall technology stack and data flow.
*   **Data & Mapping Layer:** Demonstrates the integration of actual public datasets (such as climate and demographic data from the Esri ArcGIS Living Atlas and the City of Toronto's 500+ Heat Relief Network locations) with mock APIs simulating real-time infrastructure status.
*   **Processing & Triage Layer:** Represents the core logic layer where **React's state management and Open-Meteo API (providing 12-hour forecasts)** refine the data. **ArcGIS Spatial Analysis** calculates distances and localized Energy Equity Scores to provide actionable insights.
*   **Serving Layer / UI:** Illustrates a two-way feedback loop where processed data is delivered to the React (Vite) dashboard, and actions taken by coordinators are fed back and updated using **`localStorage` (simulating a real-time database for this MVP)** to prevent duplicate efforts.

### 2. `uml_usecase_diagram.png` (UML & Use Case Diagram)
This diagram defines the core CRUD (Create, Read, Update, Delete) functionalities from the perspective of the primary stakeholders: emergency coordinators at Toronto Emergency Management (TEM) and Toronto Shelter & Support Services (TSSS). Instead of a generic system, it specifies actionable, collaborative insights tailored for crisis management to prevent duplicate efforts.
*   **Create (Log Action Plan):** Logging a new dispatch plan (e.g., **requesting 20 mobile cooling units for Mitchell Field Community Center in Willowdale East**) to mark a high-risk neighborhood as 'handled' on the shared dashboard.
*   **Read (Assess Situation):** Viewing real-time 'Energy Equity Risk Scores' via Esri GIS data and identifying action gaps by checking the 'badges' of active deployments from other team members.
*   **Update (Track Status):** Synchronizing the real-time status of physical relief operations (e.g., **another coordinator updating the status from 'Pending' to 'Deployed' once the units have arrived**) to maintain transparency across the emergency management team.
*   **Delete/Resolve (Clear):** Removing deployment records from the system once the extreme heat event concludes, clearing the alert status and resetting the dashboard for future crisis readiness.

### 3. `database_schema.png` (Database Schema)
A schema blueprint showcasing the data structure and entity relationships used within the platform.
*   Highlights a **MongoDB (NoSQL)** conceptual architecture, selected for its flexibility in handling both spatial data (GeoJSON) and unstructured status data. **(Note: The current MVP simulates this via React `localStorage`).**
*   **Ensures strict data privacy** by requiring no individual resident data (aggregating only neighborhood statistics) and supports Role-Based Access Control (RBAC) for secure emergency operations data handling.

### 4. `feasibility_analysis_mvp.pdf` (Feasibility Analysis & MVP Roadmap)
A business case document proving the practical viability (feasibility) of the solution for adoption in public administration and utility operations.
*   **Business ROI & Impact:** Analyzes the economic benefits of efficiently targeting limited relief budgets, and the operational feasibility of low core infrastructure costs. Directly aligns with the **Government of Canada’s target to implement adaptation measures by 2026 and eliminate extreme heatwave deaths by 2040**.
*   **MVP Roadmap:** Outlines a long-term expansion plan. Starting with the current Heat Relief prototype (integrating precise distance measurements to cooling centers), expanding within 6 months to include **early warning modules for other climate risks such as severe snowstorms and flash floods**.
