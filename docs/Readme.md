# Documentation Overview: Climate Response Hub

This folder (`docs/`) contains the core technical design and business feasibility documents required for the **Seneca Energy Hackathon 2026** submission. 

These four key documents are designed to provide judges—including representatives from Esri Canada, Alectra Utilities, and city officials — with a clear, intuitive understanding of the platform's logical architecture and business value.

---

## File Descriptions

### 1. `system_architecture_diagram.png` (System Architecture Diagram)
A structural diagram visualizing the platform's overall technology stack and data flow.

*   **Data & Mapping Layer:** Demonstrates the integration of actual public datasets (such as climate and demographic data from the Esri ArcGIS Living Atlas and the City of Toronto's 500+ Heat Relief Network locations) with mock APIs simulating real-time infrastructure status.
*   **Processing & Triage Layer:** Represents the core logic layer where Node.js/Express and ArcGIS Spatial Analysis refine the data, allowing the 'Triage Logic Engine' to calculate the localized Energy Equity (Priority) Score.
*   **Serving Layer / UI:** Illustrates a two-way feedback loop where only the processed, actionable logic data is delivered to the React (Vite) dashboard and ArcGIS Maps SDK, and any actions taken by coordinators are fed back and updated in the database.

### 2. `uml_usecase_diagram.png` (UML & Use Case Diagram)

This diagram defines the core CRUD (Create, Read, Update, Delete) functionalities from the perspective of the primary stakeholders: emergency coordinators at Toronto Emergency Management (TEM) and Toronto Shelter & Support Services (TSSS). Instead of a generic system, it specifies actionable, collaborative insights tailored for crisis management to prevent duplicate efforts.

*   **Create (Log Action Plan):** Logging a new dispatch plan (e.g., sending mobile cooling units) to mark a high-risk neighborhood as 'handled' on the shared dashboard, enabling other coordinators to move on to the next critical area.
*   **Read (Assess Situation):** Viewing real-time 'Energy Equity Risk Scores' via Esri GIS data and identifying action gaps by checking the 'badges' of active deployments from other team members.
*   **Update (Track Status):** Synchronizing the real-time status of physical relief operations (e.g., changing from Pending ➔ Deployed ➔ Completed) to maintain transparency across the emergency management team.
*   **Delete/Resolve (Clear):** Removing deployment records from the system once the extreme heat event concludes, clearing the alert status and resetting the dashboard for future crisis readiness.

### 3. `database_schema.png` (Database Schema)
A schema blueprint showcasing the data structure and entity relationships used within the platform.
*   Highlights a **MongoDB (NoSQL)** architecture, selected for its flexibility in handling both spatial data (GeoJSON) and unstructured status data (JSON).
*   Details how climate vulnerability indices, real-time availability and backup power status of cooling centres, and the history of coordinator-approved actions (Action Confirmed) are stored and managed.

### 4. `feasibility_analysis_mvp.pdf` (Feasibility Analysis & MVP Roadmap)
A business case document proving the practical viability (feasibility) of the solution for adoption in public administration and utility operations.
*   **Business ROI:** Analyzes the economic benefits of efficiently targeting limited relief budgets, the operational benefits of reducing coordinators' cognitive load and decision-making time, and the technical stability powered by the Esri ecosystem.
*   **MVP Roadmap:** Outlines a long-term expansion plan, starting with the current Heat Relief prototype and extending within 6 months to include winter cold snap responses and outage risk vulnerability modules for utilities like Alectra.
