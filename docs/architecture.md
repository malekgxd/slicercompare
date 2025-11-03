# Decision Architecture - slicercompare

## Executive Summary

SlicerCompare is a web-based batch slicing automation tool built with a React frontend and Node.js backend, integrated with Bambu Slicer CLI for processing 3D print configurations. The architecture follows a traditional client-server pattern with local filesystem storage, optimized for single-user desktop deployment with a 5-minute processing target. Key architectural decisions prioritize simplicity and performance appropriate for a Level 2 project while maintaining a clear path to cloud deployment.

## Project Initialization

**First implementation story (Story 1.1) should execute:**

```bash
# Step 1: Create Vite + React + TypeScript project
npm create vite@latest slicercompare -- --template react-ts

cd slicercompare

# Step 2: Install dependencies
npm install

# Step 3: Install Tailwind CSS 4.0
npm install tailwindcss@next @tailwindcss/vite

# Step 4: Install backend dependencies
npm install express @supabase/supabase-js cors dotenv p-limit

# Step 5: Install dev dependencies
npm install -D @types/express @types/cors @types/node vitest @testing-library/react @testing-library/jest-dom
```

**Vite Configuration:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

**Tailwind CSS Setup:**
```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This starter provides: React 18+, TypeScript, Vite build tooling, Tailwind CSS 4.0, ESLint, and hot module replacement.

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| **Frontend Framework** | React | 18+ | Epic 1, Epic 2 | Modern, component-based UI with excellent ecosystem |
| **Build Tool** | Vite | Latest | Epic 1 | Fast dev server and optimized builds |
| **Language** | TypeScript | Latest | All | Type safety reduces runtime errors and improves developer experience |
| **Styling** | Tailwind CSS | 4.0 | Epic 1, Epic 2 | Utility-first CSS for rapid UI development |
| **Backend Framework** | Express | 4.x | Epic 1 | Simple, proven Node.js framework for REST APIs |
| **Database** | Supabase (PostgreSQL) | Latest | Epic 1 | Cloud PostgreSQL with excellent client libraries |
| **State Management** | React Context API | Built-in | Epic 1, Epic 2 | Sufficient for linear workflow, no external dependencies |
| **File Storage** | Local Filesystem | N/A | Epic 1 | Simple, fast, appropriate for local deployment MVP |
| **CLI Integration** | Node.js child_process | Built-in | Epic 1 | Secure process spawning for Bambu Slicer CLI |
| **Concurrency Control** | p-limit | 5.x | Epic 1, Epic 2 | Limit concurrent CLI processes to 3 for resource management |
| **Progress Tracking** | HTTP Polling | N/A | Epic 1, Epic 2 | Simple 2-second polling, reliable across network conditions |
| **Testing Framework** | Vitest | Latest | Epic 2 | Fast, Vite-native unit testing |
| **Component Testing** | React Testing Library | Latest | Epic 2 | Best practice for React component testing |
| **E2E Testing** | Playwright | Latest | Epic 2 | Cross-browser end-to-end testing (Story 2.5) |

---

## Project Structure

```
slicercompare/
├── src/
│   ├── client/                    # React frontend
│   │   ├── components/
│   │   │   ├── FileUpload.tsx
│   │   │   ├── FileUpload.test.tsx
│   │   │   ├── ConfigurationForm.tsx
│   │   │   ├── ConfigurationForm.test.tsx
│   │   │   ├── ProgressDisplay.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   └── ComparisonTable.test.tsx
│   │   ├── contexts/
│   │   │   └── ComparisonContext.tsx
│   │   ├── hooks/
│   │   │   ├── usePolling.ts
│   │   │   └── useFileUpload.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── server/                    # Node.js backend
│   │   ├── index.ts              # Express server entry
│   │   ├── routes/
│   │   │   ├── sessions.ts       # Session management endpoints
│   │   │   ├── configurations.ts # Configuration endpoints
│   │   │   └── slicing.ts        # Slicing and results endpoints
│   │   ├── services/
│   │   │   ├── supabase.ts       # Supabase client and DB operations
│   │   │   ├── bambu-cli.ts      # CLI integration service
│   │   │   ├── bambu-cli.test.ts
│   │   │   ├── gcode-parser.ts   # G-code parsing logic
│   │   │   ├── gcode-parser.test.ts
│   │   │   └── file-storage.ts   # File system operations
│   │   ├── middleware/
│   │   │   ├── error-handler.ts  # Centralized error handling
│   │   │   └── validation.ts     # Input validation
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── logger.ts         # Structured logging
│   │
│   └── shared/                    # Shared types between client/server
│       └── types.ts
│
├── storage/                       # Local file storage
│   ├── uploads/                  # Uploaded STL/3MF files
│   │   └── {session-id}/
│   └── gcode/                    # Generated G-code files
│       └── {session-id}/
│           └── {config-id}.gcode
│
├── supabase/
│   └── migrations/               # Database schema migrations
│
├── tests/
│   └── e2e/                      # Playwright E2E tests
│
├── public/
├── package.json
├── tsconfig.json
├── tsconfig.server.json          # Separate config for server
├── vite.config.ts
├── vitest.config.ts
└── .env.example
```

---

## Epic to Architecture Mapping

| Epic | Primary Components | Backend Services | Database Tables |
|------|-------------------|------------------|-----------------|
| **Epic 1: Foundation & Core Workflow** | FileUpload, ConfigurationForm, ProgressDisplay, ComparisonTable | sessions.ts, bambu-cli.ts, gcode-parser.ts, file-storage.ts | comparison_sessions, configurations, results |
| **Epic 2: Production Enhancement** | Enhanced ConfigurationForm (all params), PresetManager, ErrorBoundary, LoadingStates | Enhanced validation, retry logic, concurrent processing optimization | configurations (expanded parameters column) |

---

## Technology Stack Details

### Core Technologies

**Frontend:**
- **React 18+** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool with fast HMR and optimized production builds
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **React Context API** - Built-in state management

**Backend:**
- **Node.js 20.19+** - JavaScript runtime (required by Vite)
- **Express 4.x** - Web application framework
- **@supabase/supabase-js** - Supabase client library
- **p-limit** - Concurrency control for CLI processes

**Database:**
- **Supabase (PostgreSQL)** - Cloud-hosted PostgreSQL database

**External Dependencies:**
- **Bambu Slicer CLI** - Must be installed on host system

### Integration Points

**Frontend → Backend:**
- REST API over HTTP
- JSON request/response format
- Polling endpoint for progress updates (`GET /api/sessions/:id/status`)

**Backend → Supabase:**
- Supabase JavaScript client
- PostgreSQL database operations via client library
- Connection string stored in environment variables

**Backend → Bambu CLI:**
- Node.js `child_process.spawn()` for process invocation
- Command-line arguments passed as array (security)
- stdout/stderr capture for progress and error handling
- 5-minute timeout per slicing operation

**Backend → Filesystem:**
- Local directory structure: `./storage/uploads/` and `./storage/gcode/`
- File paths stored in database as strings
- Cleanup strategy: Manual or cron-based (deferred to Story 2.6)

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### 1. CLI Invocation Pattern

**CRITICAL: All agents MUST use this pattern for Bambu Slicer CLI integration**

```typescript
// src/server/services/bambu-cli.ts
import { spawn } from 'child_process';
import path from 'path';

interface BambuCliOptions {
  inputFile: string;
  outputFile: string;
  layerHeight: number;
  infill: number;
  supportType: 'normal' | 'tree';
  // ... other parameters
}

interface SlicingResult {
  success: boolean;
  gcodeFile?: string;
  error?: string;
}

export async function invokeBambuSlicer(
  options: BambuCliOptions,
  configId: string
): Promise<SlicingResult> {

  // 1. Sanitize file paths - NEVER trust user input
  const sanitizedInput = path.resolve(options.inputFile);
  const sanitizedOutput = path.resolve(options.outputFile);

  // 2. Build CLI arguments as array (prevents shell injection)
  const args = [
    '--input', sanitizedInput,
    '--output', sanitizedOutput,
    '--layer-height', options.layerHeight.toString(),
    '--infill', options.infill.toString(),
    '--support-type', options.supportType,
    // Add more parameters as needed
  ];

  // 3. Spawn process with security settings
  return new Promise((resolve, reject) => {
    const cli = spawn('bambu-slicer-cli', args, {
      timeout: 300000, // 5 minutes max
      shell: false,     // SECURITY: Never use shell mode
      cwd: process.cwd()
    });

    let stdout = '';
    let stderr = '';

    // 4. Capture output
    cli.stdout.on('data', (data) => {
      stdout += data.toString();
      // Optional: Parse progress and update database
    });

    cli.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // 5. Handle completion
    cli.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, gcodeFile: sanitizedOutput });
      } else {
        resolve({
          success: false,
          error: `CLI exited with code ${code}: ${stderr}`
        });
      }
    });

    // 6. Handle errors
    cli.on('error', (err) => {
      resolve({
        success: false,
        error: `Failed to spawn CLI: ${err.message}`
      });
    });
  });
}
```

### 2. Concurrent Processing Pattern

**All agents MUST use p-limit for batch slicing operations**

```typescript
// src/server/services/slicing-batch.ts
import pLimit from 'p-limit';
import { invokeBambuSlicer } from './bambu-cli';
import { supabase } from './supabase';

export async function batchSliceConfigurations(
  sessionId: string,
  configurations: Configuration[]
): Promise<void> {

  // Limit to 3 concurrent CLI processes
  const limit = pLimit(3);

  // Create slicing tasks
  const slicingTasks = configurations.map(config =>
    limit(async () => {
      try {
        // Update status to 'slicing'
        await supabase
          .from('configurations')
          .update({ processing_status: 'slicing' })
          .eq('id', config.id);

        // Invoke CLI
        const result = await invokeBambuSlicer({
          inputFile: config.inputFile,
          outputFile: `./storage/gcode/${sessionId}/${config.id}.gcode`,
          ...config.parameters
        }, config.id);

        if (result.success) {
          // Parse G-code and save results
          const metrics = await parseGcode(result.gcodeFile);
          await saveResults(config.id, metrics);

          // Update status to 'complete'
          await supabase
            .from('configurations')
            .update({ processing_status: 'complete' })
            .eq('id', config.id);
        } else {
          // Update status to 'failed'
          await supabase
            .from('configurations')
            .update({
              processing_status: 'failed',
              error_message: result.error
            })
            .eq('id', config.id);
        }
      } catch (error) {
        // Log and mark as failed
        logger.error('slicing', 'Unexpected error', { configId: config.id, error });
        await supabase
          .from('configurations')
          .update({
            processing_status: 'failed',
            error_message: error.message
          })
          .eq('id', config.id);
      }
    })
  );

  // Wait for all to complete (failures don't block others)
  await Promise.allSettled(slicingTasks);
}
```

### 3. G-code Parsing Pattern

**All agents MUST use this pattern for extracting metrics from G-code**

```typescript
// src/server/services/gcode-parser.ts
import fs from 'fs/promises';

interface ParsedMetrics {
  printTimeMinutes: number;
  filamentUsageGrams: { [color: string]: number };
  supportMaterialGrams: number;
}

export async function parseGcode(gcodeFilePath: string): Promise<ParsedMetrics> {
  const content = await fs.readFile(gcodeFilePath, 'utf-8');
  const lines = content.split('\n').slice(0, 100); // Check first 100 lines for metadata

  const metrics: ParsedMetrics = {
    printTimeMinutes: 0,
    filamentUsageGrams: {},
    supportMaterialGrams: 0
  };

  for (const line of lines) {
    // Parse estimated printing time
    // Example: "; estimated printing time (normal mode) = 3h 45m 12s"
    const timeMatch = line.match(/estimated printing time.*=\s*(\d+)h\s*(\d+)m/i);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      metrics.printTimeMinutes = hours * 60 + minutes;
    }

    // Parse total filament usage
    // Example: "; filament used [g] = 125.4"
    const filamentMatch = line.match(/filament used \[g\]\s*=\s*([\d.]+)/i);
    if (filamentMatch) {
      metrics.filamentUsageGrams.total = parseFloat(filamentMatch[1]);
    }

    // Parse support material
    // Example: "; support material [g] = 18.3"
    const supportMatch = line.match(/support material \[g\]\s*=\s*([\d.]+)/i);
    if (supportMatch) {
      metrics.supportMaterialGrams = parseFloat(supportMatch[1]);
    }
  }

  // Validation: Ensure we found the critical metrics
  if (metrics.printTimeMinutes === 0) {
    throw new Error('Failed to parse print time from G-code');
  }

  return metrics;
}
```

**Note:** Story 1.3 (CLI Spike) MUST validate the exact comment format that Bambu Slicer outputs and update these regex patterns accordingly.

### 4. HTTP Polling Pattern

**Frontend agents MUST use this pattern for progress tracking**

```typescript
// src/client/hooks/usePolling.ts
import { useEffect, useState } from 'react';

interface ProgressStatus {
  sessionId: string;
  configurations: {
    id: string;
    name: string;
    status: 'queued' | 'slicing' | 'complete' | 'failed';
    error?: string;
  }[];
  allComplete: boolean;
}

export function useSlicingProgress(sessionId: string | null) {
  const [progress, setProgress] = useState<ProgressStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    setIsPolling(true);

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/sessions/${sessionId}/status`);
        const status = await response.json();
        setProgress(status);

        // Stop polling when all configs complete or failed
        if (status.allComplete) {
          setIsPolling(false);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Poll immediately
    pollStatus();

    // Then poll every 2 seconds
    const interval = setInterval(pollStatus, 2000);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [sessionId]);

  return { progress, isPolling };
}
```

---

## Consistency Rules

### Naming Conventions

**All agents MUST follow these naming patterns:**

**Database Tables & Columns:**
- Tables: `snake_case`, plural: `comparison_sessions`, `configurations`, `results`
- Columns: `snake_case`: `session_id`, `print_time_minutes`, `created_at`
- Foreign keys: `{table}_id` format: `session_id`, `configuration_id`
- Timestamps: `created_at`, `updated_at`

**API Endpoints:**
- REST pattern: `/api/{resource}` using plural nouns
- Examples: `/api/sessions`, `/api/configurations`, `/api/sessions/:id/status`
- Parameter format: `:id`, `:sessionId`, `:configId`

**TypeScript/JavaScript:**
- Files: `kebab-case`: `bambu-cli.ts`, `gcode-parser.ts`, `file-upload.tsx`
- Components: `PascalCase`: `FileUpload.tsx`, `ComparisonTable.tsx`
- Functions/variables: `camelCase`: `invokeBambuSlicer`, `parseGcode`, `sessionId`
- Types/Interfaces: `PascalCase`: `Configuration`, `SlicingResult`, `ParsedMetrics`
- Constants: `SCREAMING_SNAKE_CASE`: `MAX_FILE_SIZE`, `CLI_TIMEOUT`

**File Organization:**
- Test files: Co-located with source, `.test.ts` suffix: `gcode-parser.test.ts`
- Type files: `types/index.ts` in each major directory
- Shared types: `src/shared/types.ts` for client/server shared definitions

### Code Organization

**Directory Structure:**
- **Feature-based** for frontend components: `components/FileUpload/`, not `components/buttons/`
- **Layer-based** for backend: `routes/`, `services/`, `middleware/`
- **Co-located tests**: `service.ts` + `service.test.ts` in same directory

**Import Order:**
```typescript
// 1. External dependencies
import { useEffect, useState } from 'react';
import express from 'express';

// 2. Internal absolute imports (if using path aliases)
import { Configuration } from '@/types';

// 3. Relative imports
import { parseGcode } from './gcode-parser';
```

### Error Handling

**All agents MUST use standardized error handling:**

**API Error Response Format:**
```typescript
interface ApiError {
  error: {
    code: string;        // Machine-readable: 'CLI_TIMEOUT', 'INVALID_FILE'
    message: string;     // User-friendly message
    details?: string;    // Technical details for logging
  }
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input format)
- `422` - Unprocessable Entity (valid format but can't process)
- `500` - Internal Server Error

**Error Code Standards:**
```typescript
const ERROR_CODES = {
  // Upload errors (400)
  INVALID_FILE: 'INVALID_FILE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  MISSING_FILE: 'MISSING_FILE',

  // Processing errors (422)
  CLI_TIMEOUT: 'CLI_TIMEOUT',
  CLI_FAILED: 'CLI_FAILED',
  PARSE_FAILED: 'PARSE_FAILED',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',

  // System errors (500)
  DATABASE_ERROR: 'DATABASE_ERROR',
  FILESYSTEM_ERROR: 'FILESYSTEM_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};
```

**User-Friendly Error Messages:**
```typescript
const ERROR_MESSAGES = {
  CLI_TIMEOUT: 'Slicing took too long. Try a simpler model or fewer configurations.',
  CLI_NOT_FOUND: 'Bambu Slicer not found. Please ensure it is installed and the path is configured correctly.',
  INVALID_FILE: 'File format not supported. Please upload an STL or 3MF file.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 500MB.',
  PARSE_FAILED: 'Could not read slicing results. The G-code format may be unexpected.'
};
```

**Error Handling Middleware:**
```typescript
// src/server/middleware/error-handler.ts
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('api', err.message, { path: req.path, error: err });

  // Map known errors to appropriate status codes
  const statusCode = err instanceof ValidationError ? 400 : 500;
  const errorCode = err.code || 'UNKNOWN_ERROR';

  res.status(statusCode).json({
    error: {
      code: errorCode,
      message: ERROR_MESSAGES[errorCode] || 'An unexpected error occurred.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
}
```

**Resilience Pattern:**
- Individual configuration failures MUST NOT stop other configurations from processing
- Failed configurations marked in database with `processing_status: 'failed'` and `error_message`
- Frontend displays successful results alongside error messages for failed configs

### Logging Strategy

**All agents MUST use structured logging:**

```typescript
// src/server/utils/logger.ts
type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: any;
}

class Logger {
  private log(level: LogLevel, context: string, message: string, metadata?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata
    };

    console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
  }

  info(context: string, message: string, metadata?: any) {
    this.log('info', context, message, metadata);
  }

  warn(context: string, message: string, metadata?: any) {
    this.log('warn', context, message, metadata);
  }

  error(context: string, message: string, metadata?: any) {
    this.log('error', context, message, metadata);
  }
}

export const logger = new Logger();
```

**Log Levels:**
- **INFO:** Session created, file uploaded, slicing started, slicing completed, results parsed
- **WARN:** CLI timeout warning, parsing warnings, retry attempts, validation warnings
- **ERROR:** CLI crashes, database errors, filesystem errors, unexpected failures

**Usage Examples:**
```typescript
logger.info('session', 'New comparison session created', { sessionId, fileName });
logger.warn('cli', 'Slicing approaching timeout', { configId, elapsed: 240000 });
logger.error('cli', 'Slicing process failed', { configId, exitCode: 1, stderr });
```

---

## Data Architecture

### Database Schema

**Supabase PostgreSQL Tables:**

```sql
-- comparison_sessions table
CREATE TABLE comparison_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_file_name TEXT NOT NULL,
  uploaded_file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  user_id UUID  -- Nullable for MVP (no authentication)
);

-- configurations table
CREATE TABLE configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES comparison_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parameters JSONB NOT NULL,  -- All Bambu Slicer settings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processing_status TEXT NOT NULL DEFAULT 'queued' CHECK (processing_status IN ('queued', 'slicing', 'complete', 'failed')),
  error_message TEXT
);

-- results table
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  configuration_id UUID NOT NULL REFERENCES configurations(id) ON DELETE CASCADE,
  print_time_minutes INTEGER NOT NULL,
  filament_usage_grams JSONB NOT NULL,  -- e.g., {"total": 125.4, "color1": 95.2, "color2": 30.2}
  support_material_grams INTEGER NOT NULL,
  gcode_file_path TEXT NOT NULL,
  parsed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_configurations_session_id ON configurations(session_id);
CREATE INDEX idx_results_configuration_id ON results(configuration_id);
```

**TypeScript Type Definitions:**

```typescript
// src/shared/types.ts
export interface ComparisonSession {
  id: string;
  created_at: string;
  uploaded_file_name: string;
  uploaded_file_path: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  user_id?: string;
}

export interface Configuration {
  id: string;
  session_id: string;
  name: string;
  parameters: BambuParameters;  // JSONB
  created_at: string;
  processing_status: 'queued' | 'slicing' | 'complete' | 'failed';
  error_message?: string;
}

export interface BambuParameters {
  layerHeight: number;
  infill: number;
  supportType: 'normal' | 'tree';
  printSpeed?: number;
  temperature?: number;
  // Expand in Story 2.1 for full parameter access
  [key: string]: any;  // Allow additional parameters
}

export interface Result {
  id: string;
  configuration_id: string;
  print_time_minutes: number;
  filament_usage_grams: {
    total: number;
    [color: string]: number;  // Multi-color support
  };
  support_material_grams: number;
  gcode_file_path: string;
  parsed_at: string;
}
```

**Data Relationships:**
- `comparison_sessions` 1:N `configurations` (one session has many configs)
- `configurations` 1:1 `results` (one config produces one result)
- Cascade deletes: Deleting a session deletes all related configs and results

---

## API Contracts

### REST API Endpoints

**Base URL:** `http://localhost:3001/api`

**1. Create Comparison Session**
```http
POST /api/sessions

Response 201:
{
  "sessionId": "uuid",
  "createdAt": "2025-10-30T12:00:00Z"
}
```

**2. Upload File**
```http
POST /api/sessions/:sessionId/upload
Content-Type: multipart/form-data

Body:
  file: <binary STL or 3MF file>

Response 200:
{
  "fileName": "model.stl",
  "filePath": "./storage/uploads/uuid/model.stl",
  "fileSize": 1234567
}

Error 400:
{
  "error": {
    "code": "INVALID_FILE",
    "message": "File format not supported. Please upload an STL or 3MF file."
  }
}
```

**3. Create Configuration**
```http
POST /api/sessions/:sessionId/configurations

Body:
{
  "name": "Config A",
  "parameters": {
    "layerHeight": 0.2,
    "infill": 20,
    "supportType": "normal"
  }
}

Response 201:
{
  "configurationId": "uuid",
  "name": "Config A",
  "status": "queued"
}
```

**4. Start Batch Slicing**
```http
POST /api/sessions/:sessionId/slice

Response 202:
{
  "message": "Batch slicing started",
  "configurations": [
    { "id": "uuid1", "name": "Config A", "status": "queued" },
    { "id": "uuid2", "name": "Config B", "status": "queued" }
  ]
}
```

**5. Get Session Status (Polling Endpoint)**
```http
GET /api/sessions/:sessionId/status

Response 200:
{
  "sessionId": "uuid",
  "configurations": [
    {
      "id": "uuid1",
      "name": "Config A",
      "status": "complete"
    },
    {
      "id": "uuid2",
      "name": "Config B",
      "status": "slicing"
    },
    {
      "id": "uuid3",
      "name": "Config C",
      "status": "failed",
      "error": "CLI_TIMEOUT"
    }
  ],
  "allComplete": false
}
```

**6. Get Results**
```http
GET /api/sessions/:sessionId/results

Response 200:
{
  "sessionId": "uuid",
  "results": [
    {
      "configurationId": "uuid1",
      "name": "Config A",
      "printTimeMinutes": 225,
      "filamentUsageGrams": { "total": 125.4 },
      "supportMaterialGrams": 18
    },
    {
      "configurationId": "uuid2",
      "name": "Config B",
      "printTimeMinutes": 178,
      "filamentUsageGrams": { "total": 110.2 },
      "supportMaterialGrams": 18
    }
  ]
}
```

**7. Download G-code**
```http
GET /api/gcode/:configurationId/download

Response 200:
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="ConfigA_model.gcode"

<G-code file binary>
```

---

## Security Architecture

### Input Validation

**File Upload Security:**
- File type validation: Only `.stl` and `.3mf` extensions allowed
- File size limit: 500MB maximum
- MIME type verification
- Virus scanning (deferred to production deployment)

**CLI Parameter Sanitization:**
- All file paths resolved with `path.resolve()` to prevent directory traversal
- Parameters validated against expected types and ranges
- **NEVER use shell execution** - always use `spawn()` with argument array
- Timeout enforcement: 5 minutes per slicing operation

**API Input Validation:**
- Request body schema validation using middleware
- SQL injection prevention via Supabase parameterized queries
- XSS prevention via React's built-in escaping

### Authentication & Authorization

**MVP (No Authentication):**
- Single-user local deployment
- No login or user accounts
- All sessions accessible

**Future (Post-MVP):**
- Supabase Auth integration
- Row-level security (RLS) policies
- Session ownership validation

### Data Protection

**File Storage:**
- Local filesystem permissions (owner read/write only)
- Session-based directory isolation: `./storage/uploads/{session-id}/`
- Cleanup policy: Manual for MVP, automated in production

**Database:**
- Supabase connection over HTTPS
- Environment variable for connection string (`.env`)
- No sensitive data stored (no user credentials in MVP)

---

## Performance Considerations

### NFR001: 5-Minute Processing Target

**Strategy:**
- **Concurrent CLI execution** - 3 parallel processes via `p-limit`
- **Local file I/O** - No network overhead for file operations
- **Efficient polling** - 2-second intervals balance responsiveness and server load

**Expected Performance:**
- 1 configuration @ 2 min average = 2 minutes total ✅
- 3 configurations @ 2 min each = ~2 minutes total (parallel) ✅
- 5 configurations @ 2 min each = ~4 minutes total (3 parallel + 2 sequential) ✅

**Performance Monitoring:**
- Story 2.5 validates performance with realistic models
- Log slicing durations for each configuration
- Identify and address bottlenecks

### Optimization Strategies

**Frontend:**
- Vite's optimized production build
- Lazy loading for routes (if multi-page in future)
- Tailwind CSS purge for minimal CSS bundle

**Backend:**
- Streaming file uploads (avoid loading entire file in memory)
- Async/await for non-blocking I/O
- Database connection pooling via Supabase client

**File System:**
- Temporary storage on fast local disk (SSD preferred)
- Avoid network-mounted storage for uploads/gcode

---

## Deployment Architecture

### MVP Deployment (Local)

**Target Environment:**
- Developer's local machine (Windows, macOS, or Linux)
- Node.js 20.19+ installed
- Bambu Slicer CLI installed and in PATH

**Deployment Steps:**
1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment variables (`.env`)
4. Run database migrations (Supabase CLI or manual SQL)
5. Start backend: `npm run server`
6. Start frontend: `npm run dev`
7. Access at `http://localhost:5173`

**Environment Variables:**
```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=development
PORT=3001
BAMBU_CLI_PATH=/usr/local/bin/bambu-slicer-cli  # Optional if in PATH
```

### Future Deployment (Cloud)

**Path to Production:**
1. **Containerization** - Docker image for backend + frontend
2. **Cloud Hosting** - Deploy to Vercel (frontend) + Railway/Render (backend)
3. **File Storage Migration** - Switch to Supabase Storage
4. **Authentication** - Enable Supabase Auth
5. **CI/CD** - GitHub Actions for automated testing and deployment

**Not in MVP Scope:**
- Multi-user support
- Cloud deployment
- Authentication
- Production monitoring

---

## Development Environment

### Prerequisites

**Required:**
- Node.js 20.19+ or 22.12+
- npm or yarn package manager
- Git version control
- Bambu Slicer CLI (installed and accessible)
- Supabase account (free tier)

**Recommended:**
- VS Code with TypeScript and Tailwind CSS extensions
- PostgreSQL client (for database inspection)
- Postman or similar for API testing

### Setup Commands

```bash
# 1. Create project
npm create vite@latest slicercompare -- --template react-ts
cd slicercompare

# 2. Install dependencies
npm install

# 3. Install Tailwind CSS
npm install tailwindcss@next @tailwindcss/vite

# 4. Install backend dependencies
npm install express @supabase/supabase-js cors dotenv p-limit

# 5. Install dev dependencies
npm install -D @types/express @types/cors @types/node vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react

# 6. Create storage directories
mkdir -p storage/uploads storage/gcode

# 7. Copy environment template
cp .env.example .env

# 8. Edit .env with your Supabase credentials
# (Open .env and add SUPABASE_URL and SUPABASE_ANON_KEY)

# 9. Start development servers
npm run dev       # Frontend (Vite)
npm run server    # Backend (Express) - add this script to package.json
```

**package.json Scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "server": "tsx watch src/server/index.ts",
    "test": "vitest",
    "lint": "eslint ."
  }
}
```

---

## Architecture Decision Records (ADRs)

### ADR-001: Vite + React + TypeScript

**Decision:** Use Vite as build tool with React and TypeScript

**Rationale:**
- Vite provides fastest development experience with HMR
- React is modern, component-based, well-documented
- TypeScript adds type safety, reducing runtime errors
- Industry standard stack with excellent ecosystem

**Affects:** Epic 1, Epic 2

---

### ADR-002: Local Filesystem Storage

**Decision:** Store uploaded files and G-code on local filesystem, not Supabase Storage

**Rationale:**
- Simpler implementation for Level 2 MVP
- Faster file I/O (no network overhead) supports NFR001 (5-minute target)
- Local deployment model doesn't require cloud storage
- Can migrate to Supabase Storage when moving to cloud deployment

**Affects:** Epic 1 (Stories 1.2, 1.6, 1.9)

**Trade-offs:**
- Not cloud-ready (acceptable for MVP)
- Manual cleanup required (deferred to Story 2.6)

---

### ADR-003: Node.js Backend with Express

**Decision:** Build backend with Node.js and Express framework

**Rationale:**
- CLI integration requires Node.js child_process capability
- Keeps full stack in JavaScript/TypeScript ecosystem
- Express is simple, proven, sufficient for Level 2 REST API
- Unified language reduces context switching

**Affects:** Epic 1

**Alternatives Considered:**
- Direct Supabase client from React (rejected: can't invoke CLI from browser)
- Python Flask backend (rejected: adds language complexity)

---

### ADR-004: HTTP Polling for Progress Tracking

**Decision:** Use 2-second HTTP polling instead of WebSockets

**Rationale:**
- Simpler implementation (no persistent connection state)
- Reliable across all network conditions
- 2-second delay acceptable for 5-minute processing window
- Sufficient for Level 2 MVP scope

**Affects:** Epic 1 (Story 1.6), Epic 2 (Story 2.3)

**Alternatives Considered:**
- WebSockets (rejected: over-engineering for MVP)
- Server-Sent Events (rejected: added complexity without major benefit)

---

### ADR-005: Limited Concurrency (3 Parallel Processes)

**Decision:** Use `p-limit` to cap concurrent CLI processes at 3

**Rationale:**
- Meets NFR001 performance target (5 configs in ~4 minutes)
- Prevents system resource exhaustion
- Balances speed with stability
- Configurable for different hardware capabilities

**Affects:** Epic 1 (Story 1.6), Epic 2 (Story 2.5)

**Performance Impact:**
- 3 configs: ~2 minutes (all parallel)
- 5 configs: ~4 minutes (3 parallel + 2 sequential)

---

### ADR-006: React Context API for State Management

**Decision:** Use React Context API instead of external state library

**Rationale:**
- Sufficient for linear workflow (upload → configure → slice → compare)
- No external dependencies needed
- Simpler for Level 2 project scope
- Can upgrade to Zustand/Redux if complexity increases

**Affects:** Epic 1, Epic 2

**Alternatives Considered:**
- Redux Toolkit (rejected: overkill for simple state)
- Zustand (rejected: unnecessary dependency for MVP)

---

### ADR-007: Comment-Based G-code Parsing

**Decision:** Parse G-code metadata from comment headers using regex

**Rationale:**
- Standard approach for slicer-generated G-code
- Lightweight, no external dependencies
- Story 1.3 (CLI Spike) validates exact format
- Fallback strategy defined if comments unreliable

**Affects:** Epic 1 (Story 1.7)

**Risk Mitigation:**
- Story 1.3 MUST validate Bambu Slicer comment format
- Update regex patterns based on spike findings
- Document fallback if CLI supports JSON export mode

---

_Generated by BMAD Decision Architecture Workflow v1.3_
_Date: 2025-10-30_
_For: Dee_
_Architect: Winston_
