# Technical Decisions Log

_Auto-updated during discovery and planning sessions - you can also add information here yourself_

## Purpose

This document captures technical decisions, preferences, and constraints discovered during project discussions. It serves as input for architecture.md and solution design documents.

## Confirmed Decisions

### Core Technology Stack
- **Frontend Framework:** React
- **Backend/Database:** Supabase (cloud-hosted, free tier for MVP)
- **Slicer Integration:** Bambu Slicer CLI
- **Runtime Environment:** Node.js

### File Format Support
- **Input Formats:** STL and 3MF
- **Output Format:** G-code (via Bambu Slicer CLI)

### Deployment Model
- **MVP Deployment:** Local deployment on print farm operator's machine
- **Future Path:** Docker containerization → Cloud deployment (SaaS)

### Platform Support
- **Operating Systems:** Cross-platform (Windows, macOS, Linux)
- **Browser Support:** Modern browsers (Chrome, Firefox, Edge, Safari - latest 2 versions)

### Development Tools
- **Version Control:** Git
- **Testing:** Jest + React Testing Library (planned for future)

### Configuration Management
- **Storage:** JSON-based configuration serialization in Supabase
- **User Interface:** 2-3 configuration variations per comparison session
- **Full Parameter Access:** All Bambu Slicer settings exposed to user

## Preferences

### Frontend Preferences
- **State Management:** Context API or Redux (based on complexity needs)
- **UI Components:** Material-UI, Ant Design, or custom component library
- **File Upload:** Drag-and-drop interface with progress indication
- **Data Visualization:** Chart.js or Recharts for comparison tables
- **Build Tooling:** Vite or Create React App
- **Package Manager:** npm or yarn

### Backend Preferences
- **API Layer:** Supabase REST API and real-time subscriptions
- **File Storage:** Local filesystem for MVP, Supabase Storage for cloud migration
- **Process Management:** Node.js child processes for CLI invocation

## Constraints

### Technical Constraints
- **Bambu Slicer Dependency:** MVP functionality entirely dependent on Bambu Slicer CLI availability and stability
- **Local Processing:** Slicing performance limited by host machine CPU/RAM capabilities
- **Single-User MVP:** No authentication or multi-user support in initial release
- **File Size Limits:** Handle STL/3MF files up to 500MB (typical complex models)

### Operational Constraints
- **Internal Use Only:** MVP not publicly available or commercially licensed
- **Local Deployment:** Requires technical setup on user's machine
- **Manual Updates:** No automatic update mechanism in MVP

### Resource Constraints
- **Development Resources:** Solo developer (Dee)
- **Timeline:** No strict deadline, targeting rapid MVP delivery
- **Budget:** Minimal budget (leveraging free/open-source tools and Supabase free tier)

### Performance Requirements
- **Target Processing Time:** Complete 3-5 configuration comparison within 5 minutes
- **Concurrent Operations:** Support concurrent slicing operations if system resources allow
- **File Processing:** Handle models up to 500MB without performance degradation

### Security Requirements
- **File Upload Validation:** Size limits and format verification
- **Input Sanitization:** CLI parameters must be sanitized to prevent injection attacks
- **Supabase Security:** Row-level security policies for future multi-user support
- **Attack Surface:** Local deployment minimizes external attack vectors

## To Investigate

### Critical Pre-MVP Research
1. **Bambu Slicer CLI Capabilities** (PRIORITY: HIGH)
   - What is the complete set of parameters exposed via CLI?
   - Does CLI output provide all required metrics (filament per color, support material)?
   - If metrics not in CLI output, what G-code parsing is needed?
   - How reliable is CLI error reporting?
   - Can multiple CLI instances run concurrently without conflicts?
   - **Action:** Conduct CLI capability assessment spike

2. **Performance Characteristics** (PRIORITY: HIGH)
   - What is baseline slicing time for typical models with Bambu CLI?
   - What are memory/CPU requirements for batch processing 3-5 configurations?
   - **Action:** Performance testing with realistic models

3. **STL/3MF Parsing Libraries** (PRIORITY: MEDIUM)
   - Identify suitable npm packages for file parsing
   - Validate library support for file format variations
   - **Action:** Research and evaluate parsing libraries

### Configuration UX Questions
4. **Configuration Schema Design** (PRIORITY: MEDIUM)
   - How should configuration variations be represented in UI?
   - Form fields vs. JSON editor vs. preset system?
   - Optimal UX for parameter modification (clone-and-modify vs. side-by-side)?
   - **Action:** UI mockups and user workflow validation

### Architecture Questions
5. **Data Flow Architecture** (PRIORITY: MEDIUM)
   - Should frontend poll or use real-time subscriptions for results?
   - File storage strategy (temporary vs. persistent)
   - Error handling and retry logic for failed slicing operations
   - **Action:** Architecture design session

6. **Local Deployment Packaging** (PRIORITY: LOW)
   - Setup complexity and documentation needs
   - Docker containerization feasibility
   - **Action:** Prototype deployment process

### Post-MVP Research
7. **Orca Slicer CLI Capabilities** (for Phase 2)
8. **AI/ML Recommendation Approaches** (for Phase 2)
9. **Print Farm API Integration Patterns** (for Phase 2)

## Notes

- This file is automatically updated when technical information is mentioned
- Decisions here are inputs, not final architecture
- Final technical decisions belong in architecture.md
- Implementation details belong in solutions/\*.md and story context or dev notes.

### Source Information
- Extracted from: product-brief-slicercompare-2025-10-30.md
- Date Populated: 2025-10-30
- Populated by: Architect Agent (Winston)
