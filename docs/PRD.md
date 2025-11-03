# slicercompare Product Requirements Document (PRD)

**Author:** Dee
**Date:** 2025-10-30
**Project Level:** 2
**Target Scale:** Level 2: 1-2 epics, 5-15 stories total

---

## Goals and Background Context

### Goals

- Streamline print farm operations by reducing slicer configuration comparison time from manual workflows to approximately 5 minutes
- Enable data-driven optimization with automated batch slicing and comprehensive comparison metrics for 3-5 configurations
- Establish production foundation for daily optimization workflows supporting improved throughput, reduced waste, and faster decision-making

### Background Context

Professional print farms face significant operational challenges in optimizing slicer settings for production workflows. Currently, comparing different slicer configurations requires manually re-slicing the same model multiple times—a process taking several minutes per configuration. When comparing 3-5 configurations in a single session (a daily occurrence for many print farms), this manual workflow becomes extremely time-consuming and error-prone, consuming valuable production time and discouraging frequent optimization that could improve throughput and reduce waste.

SlicerCompare automates this batch processing and comparison workflow through a web-based interface integrated with Bambu Slicer's CLI. By reducing comparison sessions from lengthy manual processes to approximately 5 minutes, the tool enables print farm operators to make data-driven optimization decisions daily without operational friction. The MVP focuses on core comparison functionality for internal use, establishing a foundation for potential future commercial offerings including Orca Slicer support and AI-powered configuration recommendations.

---

## Requirements

### Functional Requirements

**File Management**
- FR001: System shall support upload of STL file format with validation and error handling
- FR002: System shall support upload of 3MF file format with validation and error handling
- FR003: System shall accept a single file per comparison session

**Configuration Management**
- FR004: System shall provide interface to define 2-3 distinct slicer configuration variations
- FR005: System shall expose full access to all Bambu Slicer settings and parameters for configuration
- FR006: System shall allow users to name and identify each configuration variation

**Batch Slicing**
- FR007: System shall integrate with Bambu Slicer CLI for automated slicing operations
- FR008: System shall execute batch processing of all defined configurations sequentially or concurrently
- FR009: System shall display progress indication during slicing operations
- FR010: System shall handle and report errors for failed slicing operations

**Comparison & Results**
- FR011: System shall generate comparison table displaying print time for each configuration
- FR012: System shall display filament usage per color for each configuration
- FR013: System shall display support material requirements for each configuration
- FR014: System shall present comparison results in clear, visually accessible format for decision-making

**G-code Export**
- FR015: System shall enable download of G-code files for each processed configuration
- FR016: System shall apply proper file naming convention using configuration name and original filename

### Non-Functional Requirements

- NFR001: **Performance** - System shall complete batch processing and comparison of 3-5 configurations within 5-minute target timeframe for typical print models
- NFR002: **Reliability** - System shall operate consistently for daily usage sessions without technical failures or data loss
- NFR003: **Compatibility** - System shall support local deployment on Windows, macOS, and Linux operating systems with modern web browsers

---

## User Journeys

### Journey 1: Daily Configuration Optimization for Production Print

**Actor:** Maria, Print Farm Operator

**Goal:** Optimize slicer settings for a customer order to minimize print time while maintaining quality

**Scenario:** Maria has a customer order for 50 identical parts. She needs to determine the optimal slicer configuration to maximize throughput without compromising quality.

**Journey Steps:**

1. **Prepare for Comparison**
   - Maria receives the 3D model file (STL) from the customer
   - She identifies 3 configuration variations to test:
     - Config A: Standard quality, normal supports
     - Config B: Fast print, reduced infill
     - Config C: Adaptive layers, tree supports

2. **Upload Model**
   - Maria opens SlicerCompare web interface
   - Drags and drops the STL file into the upload area
   - System validates file and displays model name confirmation

3. **Define Configurations**
   - Maria creates "Config A" and adjusts Bambu Slicer parameters (layer height: 0.2mm, infill: 20%, supports: normal)
   - Maria creates "Config B" (layer height: 0.28mm, infill: 15%, print speed: +20%)
   - Maria creates "Config C" (adaptive layers, tree supports enabled, infill: 20%)
   - System saves all three configuration variations

4. **Execute Batch Slicing**
   - Maria clicks "Compare Configurations"
   - System displays progress bar showing slicing progress for each configuration
   - Batch processing completes in approximately 4 minutes

5. **Review Comparison Results**
   - System displays comparison table:
     - Config A: 3h 45m, 125g filament, 18g supports
     - Config B: 2h 58m, 110g filament, 18g supports ← **Best time**
     - Config C: 3h 22m, 125g filament, 12g supports ← **Least supports**
   - Maria analyzes trade-offs between time savings and material efficiency

6. **Select and Download**
   - Maria decides Config B offers the best balance for this high-volume order
   - Downloads "ConfigB_customer_part.gcode"
   - Loads G-code to print farm management system for production

**Outcome:** Maria completes the comparison in 5 minutes (vs. 15-20 minutes manual process), confidently selects the optimal configuration, and queues the production run with data-backed settings.

---

## UX Design Principles

1. **Speed and Efficiency** - Interface optimized for daily use with minimal clicks and clear workflow progression
2. **Clarity Over Complexity** - Comparison results presented in simple, scannable format for quick decision-making
3. **Transparency and Trust** - Clear progress indication, error messages, and validation to build user confidence in automation
4. **Professional Functionality** - Full parameter access without oversimplification; users are technical operators who value control

---

## User Interface Design Goals

**Platform:**
- Web application (React-based)
- Desktop/laptop browsers (Chrome, Firefox, Edge, Safari - latest 2 versions)
- Local deployment (not mobile-optimized for MVP)

**Core Screens:**
1. **Upload Screen** - Drag-and-drop file upload with validation feedback
2. **Configuration Builder** - Form interface to define 2-3 slicer configurations with full Bambu Slicer parameter access
3. **Progress Screen** - Real-time batch slicing progress indication
4. **Comparison Results** - Tabular comparison display with download actions
5. **Error Handling** - Clear error messages and recovery guidance

**Key Interaction Patterns:**
- Drag-and-drop file upload
- Form-based configuration definition
- Single-page workflow (wizard-style progression)
- Table-based result comparison
- One-click G-code downloads

**Design Constraints:**
- Local deployment environment (no cloud dependencies beyond Supabase)
- Must work reliably across Windows, macOS, Linux
- No existing design system - clean, functional UI acceptable for MVP
- Accessibility: Standard browser accessibility (keyboard navigation, screen reader compatibility)

---

## Epic List

### **Epic 1: SlicerCompare Foundation & Core Workflow**
**Goal:** Establish project infrastructure and deliver end-to-end comparison workflow with file upload, batch slicing, and basic results display

**Estimated Stories:** 8-10 stories

### **Epic 2: Production-Ready Enhancement & Polish**
**Goal:** Add full parameter access, enhance UX with polished UI and error handling, and prepare system for reliable daily production use

**Estimated Stories:** 5-7 stories

**Total Estimated Stories:** 13-17 stories

> **Note:** Detailed epic breakdown with full story specifications is available in [epics.md](./epics.md)

---

## Out of Scope

### **Explicitly Excluded from MVP:**

**Additional Slicer Support:**
- Orca Slicer integration (reserved for Phase 2)
- Other slicer software support (PrusaSlicer, Cura, etc.)
- Multi-slicer comparison capabilities

**Advanced Features:**
- AI-powered configuration recommendations
- Historical comparison tracking and analytics
- Batch processing of multiple STL files simultaneously
- Advanced metrics (cost analysis, quality predictions, layer-by-layer visualization)

**Multi-User & Collaboration:**
- User authentication and accounts
- Multi-user support and team collaboration
- Configuration sharing and preset libraries
- Role-based access control

**Cloud & Integration:**
- Cloud deployment and hosting
- Print farm management system API integration
- Mobile application or responsive mobile interface
- Webhook notifications or external integrations

**Scope Boundaries:**
- File format support limited to STL and 3MF only (no native CAD formats)
- Configuration limit: 2-3 comparisons per session (not unlimited)
- Single-user, local deployment only
- Internal use only (not publicly available or commercially licensed)
