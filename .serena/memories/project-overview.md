# SlicerCompare Project Overview

## Purpose
SlicerCompare is a web-based automated batch slicing comparison tool for 3D print configuration optimization. It allows users to upload STL/3MF files, define 2-3 configuration variations, and automatically batch process them through Bambu Slicer CLI to compare results (print time, filament usage, support material).

**Goal:** Reduce manual comparison workflow from 15-20 minutes to approximately 5 minutes.

## Tech Stack

### Frontend
- **Framework:** React 19+
- **Language:** TypeScript
- **Build Tool:** Vite 7+
- **Styling:** Tailwind CSS 4.0
- **State Management:** React Context API
- **Routing:** React Router 7+
- **File Upload:** react-dropzone
- **Notifications:** react-hot-toast

### Backend
- **Runtime:** Node.js 20.19+ or 22.12+
- **Framework:** Express 5+
- **Language:** TypeScript
- **Process Runner:** tsx (with watch mode)
- **File Upload:** multer 2+

### Database
- **Platform:** Supabase (PostgreSQL)
- **ORM:** Supabase JS client

### External Integration
- **Slicer:** Bambu Slicer CLI

### Testing
- **Framework:** Vitest 4+
- **Testing Library:** @testing-library/react 16+
- **DOM Environment:** happy-dom / jsdom

### Development Tools
- **Linter:** ESLint 9+ with TypeScript ESLint
- **Type Checking:** TypeScript 5.9+
- **Package Manager:** npm

## Project Structure

```
slicercompare/
├── src/
│   ├── client/              # React frontend
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # Frontend services
│   │   └── utils/          # Frontend utilities
│   ├── server/             # Node.js backend
│   │   ├── routes/         # API routes (upload, slicing, download)
│   │   ├── services/       # Business logic (bambu-cli, gcode-parser, etc.)
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Backend utilities
│   │   └── scripts/        # Utility scripts
│   ├── shared/             # Shared TypeScript types
│   ├── components/         # Shared components
│   ├── hooks/              # React hooks
│   └── types/              # Type definitions
├── storage/                # Local file storage
│   ├── uploads/            # Uploaded STL/3MF files
│   └── gcode/              # Generated G-code files
├── docs/                   # Project documentation
│   ├── stories/            # User stories
│   ├── spikes/             # Technical spikes
│   ├── contexts/           # Story contexts
│   └── retrospectives/     # Retrospectives
├── bmad/                   # BMAD workflow files
├── tests/                  # Test files
└── public/                 # Static assets
```

## Architecture
- **Client-Server:** React frontend communicates with Express backend via REST API
- **Backend Services:** Express backend manages Bambu CLI invocation, G-code parsing, and business logic
- **Database:** Supabase stores comparison sessions, configurations, and results
- **File Storage:** Local filesystem for temporary uploads and generated G-code files