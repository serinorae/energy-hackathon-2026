# Documentation Overview: Climate Response Hub

This folder (`docs/`) contains the core technical design and business feasibility documents required for the **Seneca Energy Hackathon 2026** submission. 

These four key documents are designed to provide judges—including representatives from Esri Canada, Alectra Utilities, and city officials — with a clear, intuitive understanding of the platform's logical architecture and business value.

---

## File Descriptions

### 1. `system_architecture_diagram.png` (System Architecture Diagram)
A structural diagram visualizing the platform's overall technology stack and data flow.
*   **Data & Mapping Layer:** Demonstrates the integration of actual public datasets (such as climate and demographic data from the Esri ArcGIS Living Atlas [8, 9] and the City of Toronto's 500+ Heat Relief Network locations) with mock APIs simulating real-time infrastructure status.
*   **Processing & Triage Layer:** Represents the core logic layer where Node.js/Express and ArcGIS Spatial Analysis refine the data, allowing the 'Triage Logic Engine' to calculate the localized Energy Equity (Priority) Score.
*   **Serving Layer / UI:** Illustrates a **two-way feedback loop** where only the processed, actionable logic data is delivered to the React (Vite) dashboard and ArcGIS Maps SDK, and any actions taken by coordinators are fed back and updated in the database.

### 2. `uml_usecase_diagram.png` (UML & Use Case Diagram)
This diagram defines the core CRUD (Create, Read, Update, Delete) functionalities from the perspective of the primary stakeholders: emergency coordinators at Toronto Emergency Management (TEM) and Toronto Shelter & Support Services (TSSS). Instead of generic login features, it specifies actionable insights tailored for crisis management.
*   **Create:** Dispatching mobile drinking water trailers or initiating new temporary Resilience Hubs during a heat warning.
*   **Read:** Viewing real-time localized 'Energy Equity Risk Scores' and identifying accessibility blind spots using Esri GIS data.
*   **Update:** Approving extended operating hours for public facilities (e.g., libraries, civic centres) and updating shelter capacities in response to changing conditions.
*   **Delete/Resolve:** Deleting the alert status and recalling temporary dispatched relief resources once the extreme heat event concludes.

### 3. `database_schema.png` (Database Schema)
A schema blueprint showcasing the data structure and entity relationships used within the platform.
*   Highlights a **MongoDB (NoSQL)** architecture, selected for its flexibility in handling both spatial data (GeoJSON) and unstructured status data (JSON).
*   Details how climate vulnerability indices, real-time availability and backup power status of cooling centres, and the history of coordinator-approved actions (Action Confirmed) are stored and managed.

### 4. `feasibility_analysis_mvp.pdf` (Feasibility Analysis & MVP Roadmap)
A business case document proving the practical viability (feasibility) of the solution for adoption in public administration and utility operations.
*   **Business ROI:** Analyzes the economic benefits of efficiently targeting limited relief budgets, the operational benefits of reducing coordinators' cognitive load and decision-making time, and the technical stability powered by the Esri ecosystem.
*   **MVP Roadmap:** Outlines a long-term expansion plan, starting with the current Heat Relief prototype and extending within 6 months to include winter cold snap responses and outage risk vulnerability modules for utilities like Alectra.
