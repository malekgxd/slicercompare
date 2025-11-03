# slicercompare - Epic Breakdown

**Author:** Dee
**Date:** 2025-10-30
**Project Level:** 2
**Target Scale:** Level 2: 1-2 epics, 5-15 stories total

---

## Overview

This document provides the detailed epic breakdown for slicercompare, expanding on the high-level epic list in the [PRD](./PRD.md).

Each epic includes:

- Expanded goal and value proposition
- Complete story breakdown with user stories
- Acceptance criteria for each story
- Story sequencing and dependencies

**Epic Sequencing Principles:**

- Epic 1 establishes foundational infrastructure and initial functionality
- Subsequent epics build progressively, each delivering significant end-to-end value
- Stories within epics are vertically sliced and sequentially ordered
- No forward dependencies - each story builds only on previous work

---

## Epic 1: SlicerCompare Foundation & Core Workflow

**Expanded Goal:** Establish the foundational infrastructure for SlicerCompare including React application, Supabase backend, and local development environment. Deliver a working end-to-end comparison workflow that accepts file uploads, integrates with Bambu Slicer CLI for batch processing, and displays comparison results with G-code download capability. This epic creates the core value loop and validates the technical approach.

**Estimated Stories:** 9 stories

---

**Story 1.1: Project Setup & Infrastructure**

As a developer,
I want a fully configured React application with Supabase backend and local development environment,
So that I have a solid foundation to build SlicerCompare features.

**Acceptance Criteria:**
1. React application initialized with Vite or Create React App
2. Supabase project created with connection configured in React app
3. Basic routing structure in place (home/upload, results pages)
4. Development environment runs locally without errors
5. Git repository initialized with .gitignore configured
6. README with setup instructions created
7. Basic application shell renders successfully

**Prerequisites:** None

---

**Story 1.2: File Upload Foundation**

As a print farm operator,
I want to upload STL or 3MF files through a drag-and-drop interface,
So that I can easily provide models for comparison.

**Acceptance Criteria:**
1. Drag-and-drop upload area implemented and visually clear
2. File validation confirms STL and 3MF formats only
3. File size validation (e.g., max 500MB) with clear error messages
4. Uploaded file stored temporarily in local filesystem or Supabase storage
5. Upload progress indicator displays during file transfer
6. File name and format displayed after successful upload
7. Clear error handling for invalid files or upload failures

**Prerequisites:** Story 1.1

---

**Story 1.3: Bambu Slicer CLI Integration Spike**

As a developer,
I want to validate Bambu Slicer CLI capabilities and integration approach,
So that I understand feasibility and can design the batch slicing engine correctly.

**Acceptance Criteria:**
1. Bambu Slicer CLI successfully invoked from Node.js process
2. Test slicing operation completes with sample STL file
3. CLI parameter passing validated (layer height, infill, supports, etc.)
4. G-code output file generated and accessible
5. Output parsing strategy defined for extracting metrics (time, filament, supports)
6. Error handling approach documented for CLI failures
7. Spike findings documented with code examples for reference

**Prerequisites:** Story 1.1

---

**Story 1.4: Configuration Data Model**

As a developer,
I want a Supabase database schema for storing configurations and comparison sessions,
So that user data persists reliably across sessions.

**Acceptance Criteria:**
1. Supabase tables created: `comparison_sessions`, `configurations`, `results`
2. Schema supports 2-3 configurations per session
3. Configuration parameters stored as JSON or structured fields
4. Foreign key relationships established between tables
5. Basic CRUD operations tested through Supabase client
6. Database migrations or schema definitions version controlled
7. Test data seeded for development

**Prerequisites:** Story 1.1

---

**Story 1.5: Simple Configuration UI**

As a print farm operator,
I want to define 2-3 slicer configurations with basic Bambu parameters,
So that I can specify which settings variations to compare.

**Acceptance Criteria:**
1. Form UI displays fields for configuration name and basic parameters
2. Supported parameters: layer height, infill percentage, support type (normal/tree)
3. UI allows creating 2-3 distinct configurations
4. Configuration names are required and validated for uniqueness
5. Form validation prevents invalid parameter values (e.g., negative infill)
6. Configurations saved to Supabase when user proceeds
7. Clear visual distinction between Config A, B, C

**Prerequisites:** Story 1.2, Story 1.4

---

**Story 1.6: Batch Slicing Engine**

As a print farm operator,
I want the system to automatically slice my uploaded file with all defined configurations,
So that I don't have to manually run each configuration separately.

**Acceptance Criteria:**
1. Backend service invokes Bambu CLI once per configuration
2. Uploaded file path passed correctly to CLI
3. Configuration parameters applied to each CLI invocation
4. Slicing operations run sequentially or concurrently based on system capability
5. Progress tracking updates for each configuration (pending, processing, complete)
6. G-code output files generated for each configuration
7. Errors during slicing captured and reported to user
8. System handles CLI timeouts gracefully

**Prerequisites:** Story 1.3, Story 1.5

---

**Story 1.7: Results Parser & Storage**

As a developer,
I want to parse G-code output to extract comparison metrics and store them in Supabase,
So that the comparison table has accurate data to display.

**Acceptance Criteria:**
1. Parser extracts print time from G-code comments or metadata
2. Parser calculates total filament usage (per color if applicable)
3. Parser extracts support material requirements
4. Parsed metrics stored in `results` table linked to configuration
5. Parsing errors handled gracefully with fallback values or error flags
6. Results data structure supports future metric additions
7. Unit tests validate parsing logic with sample G-code files

**Prerequisites:** Story 1.6

---

**Story 1.8: Comparison Results Display**

As a print farm operator,
I want to see a comparison table showing print time, filament usage, and support material for each configuration,
So that I can make an informed decision about which settings to use.

**Acceptance Criteria:**
1. Comparison table displays all configurations side-by-side
2. Columns include: Configuration Name, Print Time, Filament Usage, Support Material
3. Data pulled from Supabase results table
4. Table is visually clear and easy to scan
5. Print time formatted in hours and minutes (e.g., "3h 45m")
6. Filament and support material displayed with units (grams)
7. Loading state shown while results are being processed

**Prerequisites:** Story 1.7

---

**Story 1.9: G-code Download Feature**

As a print farm operator,
I want to download the G-code file for any configuration,
So that I can use the optimal settings for my production run.

**Acceptance Criteria:**
1. Download button/link available for each configuration in results table
2. Clicking download triggers G-code file download
3. Downloaded file named using pattern: `{ConfigName}_{OriginalFilename}.gcode`
4. File downloads correctly without corruption
5. Download works across supported browsers (Chrome, Firefox, Edge, Safari)
6. Clear indication which configuration is being downloaded
7. Error handling if G-code file not available

**Prerequisites:** Story 1.8

---

## Epic 2: Production-Ready Enhancement & Polish

**Expanded Goal:** Transform the foundational prototype into a production-ready tool by exposing full Bambu Slicer parameter control, enhancing user experience with polished UI and comprehensive error handling, optimizing performance to meet the 5-minute target, and providing deployment documentation. This epic ensures SlicerCompare is reliable, efficient, and ready for daily production use in print farm operations.

**Estimated Stories:** 6 stories

---

**Story 2.1: Full Bambu Slicer Parameter Exposure**

As a print farm operator,
I want access to all Bambu Slicer parameters in the configuration UI,
So that I can test any setting variation without limitation.

**Acceptance Criteria:**
1. Configuration UI exposes all major Bambu Slicer parameters (print speed, temperature, retraction, cooling, etc.)
2. Parameters organized into logical categories (Quality, Speed, Support, Advanced)
3. Each parameter includes label, input field, and default value
4. Parameter validation prevents invalid values with helpful error messages
5. UI remains usable despite expanded parameter set (collapsible sections, search/filter)
6. All parameters correctly passed to Bambu CLI during slicing
7. Configuration can be reviewed before execution showing all non-default values

**Prerequisites:** Story 1.5, Story 1.6

---

**Story 2.2: Configuration Preset Management**

As a print farm operator,
I want to save and load configuration presets,
So that I can quickly reuse proven settings without re-entering parameters.

**Acceptance Criteria:**
1. "Save as Preset" button stores current configuration to Supabase
2. Preset naming with validation (unique names, no special characters)
3. Preset library displays all saved presets with names and timestamps
4. "Load Preset" applies all parameters from selected preset to current configuration
5. "Delete Preset" removes preset from library with confirmation dialog
6. Presets persist across browser sessions
7. Default/starter presets provided (Standard, Fast, Quality)

**Prerequisites:** Story 2.1

---

**Story 2.3: Enhanced Progress & Error Handling**

As a print farm operator,
I want detailed progress updates and clear error messages,
So that I understand what's happening and can resolve issues quickly.

**Acceptance Criteria:**
1. Progress display shows current step for each configuration (Queued, Slicing, Parsing, Complete)
2. Real-time progress percentage or time estimate displayed during slicing
3. Error messages are user-friendly and actionable (not raw CLI errors)
4. Common errors include recovery guidance (e.g., "Bambu Slicer not found - install instructions: ...")
5. Failed configurations clearly marked with error icon and message
6. Successful configurations proceed normally even if others fail
7. Retry option available for failed configurations

**Prerequisites:** Story 1.6, Story 1.8

---

**Story 2.4: UI Polish & Visual Refinement**

As a print farm operator,
I want a polished, professional interface,
So that the tool is pleasant to use and easy to navigate daily.

**Acceptance Criteria:**
1. Consistent visual design system applied (colors, typography, spacing)
2. Clear visual hierarchy guides user through workflow steps
3. Helpful tooltips/hints for complex parameters or features
4. Responsive layout works well on different desktop screen sizes
5. Loading states and transitions feel smooth and professional
6. Success/error states use appropriate colors and icons
7. Overall interface feels cohesive and intentional (not prototype-like)

**Prerequisites:** Story 1.8, Story 2.1

---

**Story 2.5: Performance Optimization & Testing**

As a print farm operator,
I want batch slicing to complete within the 5-minute target,
So that the tool delivers on its efficiency promise.

**Acceptance Criteria:**
1. Concurrent slicing implemented if system resources allow (multiple CLI processes)
2. Performance testing conducted with realistic STL/3MF files (typical complexity, size)
3. 3-5 configuration comparison completes within 5 minutes for test models
4. File upload and parsing optimized to minimize overhead
5. Memory usage remains reasonable during batch processing
6. Performance bottlenecks identified and addressed
7. Known limitations documented (e.g., very complex models may exceed target)

**Prerequisites:** Story 1.6, Story 1.7

---

**Story 2.6: Documentation & Production Deployment**

As a print farm operator,
I want clear setup instructions and documentation,
So that I can install and use SlicerCompare confidently.

**Acceptance Criteria:**
1. README includes system requirements (OS, Node.js, Bambu Slicer)
2. Step-by-step installation guide covers all setup steps
3. Supabase configuration instructions provided
4. Bambu Slicer CLI installation and path configuration documented
5. User guide explains workflow from upload to download
6. Troubleshooting section addresses common issues
7. Local deployment tested on Windows, macOS, or Linux (at least primary OS)

**Prerequisites:** Story 2.5

---

## Story Guidelines Reference

**Story Format:**

```
**Story [EPIC.N]: [Story Title]**

As a [user type],
I want [goal/desire],
So that [benefit/value].

**Acceptance Criteria:**
1. [Specific testable criterion]
2. [Another specific criterion]
3. [etc.]

**Prerequisites:** [Dependencies on previous stories, if any]
```

**Story Requirements:**

- **Vertical slices** - Complete, testable functionality delivery
- **Sequential ordering** - Logical progression within epic
- **No forward dependencies** - Only depend on previous work
- **AI-agent sized** - Completable in 2-4 hour focused session
- **Value-focused** - Integrate technical enablers into value-delivering stories

---

**For implementation:** Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown.
