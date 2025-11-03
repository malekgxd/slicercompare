# SlicerCompare

Automated batch slicing comparison tool for 3D print configuration optimization.

## Overview

SlicerCompare is a web-based tool that automates the process of comparing different Bambu Slicer configurations. Upload your STL or 3MF file, define 2-3 configuration variations, and SlicerCompare will batch process them through Bambu Slicer CLI and display comparison results (print time, filament usage, support material) to help you optimize your print settings.

**Target Time Savings:** Reduce manual comparison workflow from 15-20 minutes to approximately 5 minutes.

## Features

- **File Upload:** Drag-and-drop interface for STL and 3MF files
- **Configuration Management:** Define and compare 2-3 slicer configurations
- **Batch Processing:** Automated slicing with Bambu Slicer CLI
- **Results Comparison:** Side-by-side comparison table of print time, filament usage, and support material
- **G-code Download:** Download optimized G-code for your chosen configuration

## System Requirements

### Required

- **Node.js:** 20.19+ or 22.12+
- **npm:** Latest version
- **Bambu Slicer CLI:** Installed and accessible in PATH (or specify path in .env)

### Supported Platforms

- Windows
- macOS
- Linux

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slicercompare
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a free Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Create a `.env` file in the project root (use `.env.example` as template)
5. Add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
NODE_ENV=development
PORT=3001
```

### 4. Install Bambu Slicer CLI

- Download and install Bambu Studio/Slicer from [Bambu Lab](https://bambulab.com)
- Ensure the CLI executable is in your system PATH, or specify the path in `.env`:

```env
BAMBU_CLI_PATH=/path/to/bambu-slicer-cli
```

## Running the Application

### Development Mode

Start both frontend and backend servers:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
npm run server
```
Backend API will be available at `http://localhost:3001`

### Access the Application

Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
slicercompare/
├── src/
│   ├── client/           # React frontend
│   │   ├── components/   # React components
│   │   └── pages/        # Page components
│   ├── server/           # Node.js backend
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── middleware/   # Express middleware
│   └── shared/           # Shared TypeScript types
├── storage/              # Local file storage
│   ├── uploads/          # Uploaded STL/3MF files
│   └── gcode/            # Generated G-code files
├── docs/                 # Project documentation
└── public/               # Static assets
```

## Technology Stack

- **Frontend:** React 18+, TypeScript, Vite, Tailwind CSS 4.0
- **Backend:** Node.js 20+, Express 4.x, TypeScript
- **Database:** Supabase (PostgreSQL)
- **Slicer Integration:** Bambu Slicer CLI
- **State Management:** React Context API
- **Routing:** React Router

## Development Scripts

```bash
npm run dev        # Start frontend dev server (Vite)
npm run server     # Start backend server with hot reload (tsx watch)
npm run build      # Build for production
npm run test       # Run tests (Vitest)
npm run lint       # Run ESLint
```

## Architecture

SlicerCompare uses a client-server architecture:

1. **React Frontend** - Handles UI, file uploads, configuration forms, and results display
2. **Express Backend** - Manages Bambu CLI invocation, G-code parsing, and business logic
3. **Supabase Database** - Stores comparison sessions, configurations, and results
4. **Local Filesystem** - Temporary storage for uploaded files and generated G-code

For detailed architecture decisions and implementation patterns, see `docs/architecture.md`.

## Current Status

**Story 1.1: Project Setup & Infrastructure** ✅ Complete

The foundational infrastructure is in place:
- React application with Vite and TypeScript
- Tailwind CSS 4.0 configured
- Express backend server
- Basic routing structure
- Supabase connection ready (pending user project creation)
- Local storage directories created

**Next Steps:**
- Story 1.2: File Upload Foundation
- Story 1.3: Bambu Slicer CLI Integration Spike
- Story 1.4: Configuration Data Model

See `docs/epics.md` for complete feature roadmap.

## Contributing

This project follows the BMAD (Business-Minded Agile Development) methodology. See `bmad/` directory for workflow documentation.

## License

[License information to be added]

## Support

For issues or questions, please refer to the project documentation in the `docs/` directory or open an issue in the repository.
