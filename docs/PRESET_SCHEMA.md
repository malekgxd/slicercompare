# Configuration Preset Schema Design

**Author:** Winston (Architect)
**Date:** 2025-11-01
**Epic:** 2 - Production-Ready Enhancement & Polish
**Story:** 2.2 - Configuration Preset Management
**Version:** 1.0

---

## Executive Summary

This document defines the complete database schema, API design, and implementation strategy for configuration preset management in SlicerCompare. The preset system enables users to save, load, and manage reusable Bambu Slicer configurations, with three system-provided starter presets (Fast, Quality, Standard).

**Key Decisions:**
- **New Table:** `presets` with JSONB parameters storage
- **API Endpoints:** 5 REST endpoints (Create, List, Get, Update, Delete)
- **Default Presets:** 3 system presets seeded on migration
- **Storage Strategy:** JSONB for maximum flexibility and future-proofing
- **Security:** RLS policies prevent users from modifying system presets

---

## Table of Contents

1. [Database Schema](#database-schema)
2. [Design Decisions](#design-decisions)
3. [API Design](#api-design)
4. [Default Presets](#default-presets)
5. [Migration Strategy](#migration-strategy)
6. [Implementation Notes](#implementation-notes)
7. [Security Considerations](#security-considerations)

---

## Database Schema

### Presets Table

```sql
CREATE TABLE IF NOT EXISTS public.presets (
  preset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preset_name TEXT NOT NULL,
  description TEXT,

  -- Bambu Slicer Parameters (JSONB for flexibility)
  parameters JSONB NOT NULL,

  -- System vs User presets
  is_system_preset BOOLEAN NOT NULL DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT preset_name_not_empty CHECK (preset_name <> ''),
  CONSTRAINT unique_preset_name_per_user UNIQUE (user_id, preset_name),
  CONSTRAINT system_presets_no_user_id CHECK (
    (is_system_preset = TRUE AND user_id IS NULL) OR
    (is_system_preset = FALSE AND user_id IS NOT NULL)
  )
);

-- Indexes for performance
CREATE INDEX idx_presets_user_id ON public.presets(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_presets_system ON public.presets(is_system_preset) WHERE is_system_preset = TRUE;
CREATE INDEX idx_presets_created_at ON public.presets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;
```

### TypeScript Type Definitions

```typescript
// types/database.ts additions

export interface Preset {
  preset_id: string;
  user_id: string | null;
  preset_name: string;
  description: string | null;
  parameters: ConfigurationParameters;
  is_system_preset: boolean;
  created_at: string;
  updated_at: string;
}

export interface PresetInsert {
  preset_id?: string;
  user_id?: string | null;
  preset_name: string;
  description?: string | null;
  parameters: ConfigurationParameters;
  is_system_preset?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PresetUpdate {
  preset_name?: string;
  description?: string | null;
  parameters?: ConfigurationParameters;
  updated_at?: string;
}
```

---

## Design Decisions

### Decision 1: JSONB vs Individual Columns for Parameters

**Chosen Approach:** JSONB column (`parameters`)

**Rationale:**

1. **Flexibility:** Bambu Slicer has 50+ parameters. Individual columns would create a massive table.
2. **Future-Proofing:** New slicer parameters can be added without schema migrations.
3. **Consistency:** Matches existing `configurations.parameters` JSONB design.
4. **TypeScript Safety:** Strong typing enforced via `ConfigurationParameters` interface.
5. **Performance:** PostgreSQL JSONB is indexed and queryable when needed.

**Trade-offs:**
- Slightly less queryable than individual columns (acceptable - presets are loaded by ID, not filtered by parameter values)
- Requires application-level validation (already implemented for configurations)

**Parameters Structure:**
```json
{
  "layer_height": 0.2,
  "infill_density": 20,
  "support_type": "normal",
  "printer_model": "X1_Carbon",
  "print_speed": 100,
  "nozzle_temperature": 220,
  "bed_temperature": 60,
  "wall_thickness": 1.2,
  "top_bottom_thickness": 1.0
}
```

---

### Decision 2: System Presets Strategy

**Chosen Approach:** System presets stored in same `presets` table with `is_system_preset = TRUE` and `user_id = NULL`

**Rationale:**

1. **Simplicity:** Single table for all presets avoids JOIN complexity.
2. **Consistent API:** Same endpoints work for both system and user presets.
3. **Clear Distinction:** `is_system_preset` flag and constraint enforce separation.
4. **RLS Protection:** Policies prevent users from modifying/deleting system presets.

**Constraint Enforcement:**
```sql
CONSTRAINT system_presets_no_user_id CHECK (
  (is_system_preset = TRUE AND user_id IS NULL) OR
  (is_system_preset = FALSE AND user_id IS NOT NULL)
)
```

This ensures:
- System presets MUST have `user_id = NULL`
- User presets MUST have a valid `user_id`
- No ambiguous ownership

**Seeding System Presets:**
- Inserted during migration (see Migration Strategy)
- Immutable via RLS policies
- Always returned in preset lists for all users

---

### Decision 3: Preset Naming and Uniqueness

**Chosen Approach:** Preset names must be unique per user

**Constraint:**
```sql
CONSTRAINT unique_preset_name_per_user UNIQUE (user_id, preset_name)
```

**Rationale:**

1. **User Experience:** Prevents confusion with duplicate preset names.
2. **Per-User Scope:** Users can create "Fast Print" even if system preset exists with same name.
3. **System Presets:** Unique globally (user_id is NULL, so system names can't conflict with each other).

**Validation:**
- API validates preset name is not empty
- API returns clear error if name conflicts with existing user preset
- Frontend shows existing preset names to help users avoid conflicts

---

### Decision 4: Versioning Strategy

**Chosen Approach:** No explicit versioning in MVP

**Rationale:**

1. **Simplicity:** Versioning adds significant complexity for MVP.
2. **Update-in-Place:** Users can update presets (captured via `updated_at` timestamp).
3. **Future Path:** If versioning needed, can add `preset_version` column and modify constraints.

**Alternative for Future:**
```sql
-- Future versioning approach (NOT in MVP)
ALTER TABLE presets ADD COLUMN preset_version INTEGER DEFAULT 1;
ALTER TABLE presets ADD COLUMN previous_version_id UUID REFERENCES presets(preset_id);
```

**Current Approach:**
- `updated_at` timestamp tracks last modification
- Users can save modified preset as new preset with different name
- Simple and sufficient for Story 2.2 acceptance criteria

---

### Decision 5: Preset Deletion Policy

**Chosen Approach:** Soft-delete user presets, prevent system preset deletion

**Implementation:**
- User presets: DELETE allowed via RLS policy
- System presets: DELETE blocked via RLS policy
- Cascade deletion: When user deleted, their presets deleted (ON DELETE CASCADE)

**Alternative Considered:** Soft-delete with `is_deleted` flag
- **Rejected:** Adds complexity, not required for MVP
- **Future:** Can add if "preset trash" feature needed

---

## API Design

### Base URL

```
http://localhost:3001/api/presets
```

---

### Endpoint 1: Create Preset

**Request:**
```http
POST /api/presets
Content-Type: application/json

{
  "name": "My Fast PLA",
  "description": "Fast print settings for PLA material",
  "parameters": {
    "layer_height": 0.28,
    "infill_density": 15,
    "support_type": "tree",
    "printer_model": "X1_Carbon",
    "print_speed": 150,
    "nozzle_temperature": 215,
    "bed_temperature": 60
  }
}
```

**Response 201 (Success):**
```json
{
  "preset_id": "550e8400-e29b-41d4-a716-446655440000",
  "preset_name": "My Fast PLA",
  "description": "Fast print settings for PLA material",
  "is_system_preset": false,
  "created_at": "2025-11-01T10:30:00Z"
}
```

**Response 400 (Validation Error):**
```json
{
  "error": {
    "code": "INVALID_PRESET_NAME",
    "message": "Preset name cannot be empty"
  }
}
```

**Response 409 (Conflict):**
```json
{
  "error": {
    "code": "PRESET_NAME_EXISTS",
    "message": "A preset with this name already exists. Please choose a different name."
  }
}
```

---

### Endpoint 2: List All Presets

**Request:**
```http
GET /api/presets
```

**Response 200:**
```json
{
  "presets": [
    {
      "preset_id": "system-fast-001",
      "preset_name": "Fast Print",
      "description": "Optimized for speed - good for prototypes",
      "is_system_preset": true,
      "created_at": "2025-11-01T00:00:00Z"
    },
    {
      "preset_id": "system-quality-001",
      "preset_name": "Quality Print",
      "description": "High quality - best for final parts",
      "is_system_preset": true,
      "created_at": "2025-11-01T00:00:00Z"
    },
    {
      "preset_id": "system-standard-001",
      "preset_name": "Standard",
      "description": "Balanced settings for general use",
      "is_system_preset": true,
      "created_at": "2025-11-01T00:00:00Z"
    },
    {
      "preset_id": "user-001",
      "preset_name": "My Fast PLA",
      "description": "Fast print settings for PLA material",
      "is_system_preset": false,
      "created_at": "2025-11-01T10:30:00Z"
    }
  ]
}
```

**Notes:**
- Returns both system presets and user's personal presets
- System presets always listed first (sorted by name)
- User presets sorted by most recent first
- Lightweight response (no parameters included for performance)

---

### Endpoint 3: Get Preset Details

**Request:**
```http
GET /api/presets/:preset_id
```

**Response 200:**
```json
{
  "preset_id": "550e8400-e29b-41d4-a716-446655440000",
  "preset_name": "My Fast PLA",
  "description": "Fast print settings for PLA material",
  "parameters": {
    "layer_height": 0.28,
    "infill_density": 15,
    "support_type": "tree",
    "printer_model": "X1_Carbon",
    "print_speed": 150,
    "nozzle_temperature": 215,
    "bed_temperature": 60
  },
  "is_system_preset": false,
  "created_at": "2025-11-01T10:30:00Z",
  "updated_at": "2025-11-01T10:30:00Z"
}
```

**Response 404:**
```json
{
  "error": {
    "code": "PRESET_NOT_FOUND",
    "message": "Preset not found"
  }
}
```

---

### Endpoint 4: Update Preset

**Request:**
```http
PUT /api/presets/:preset_id
Content-Type: application/json

{
  "name": "My Optimized PLA",
  "description": "Updated fast print settings",
  "parameters": {
    "layer_height": 0.24,
    "infill_density": 18,
    "support_type": "tree",
    "printer_model": "X1_Carbon",
    "print_speed": 140,
    "nozzle_temperature": 218,
    "bed_temperature": 60
  }
}
```

**Response 200:**
```json
{
  "preset_id": "550e8400-e29b-41d4-a716-446655440000",
  "preset_name": "My Optimized PLA",
  "description": "Updated fast print settings",
  "updated_at": "2025-11-01T14:45:00Z"
}
```

**Response 403 (System Preset):**
```json
{
  "error": {
    "code": "CANNOT_MODIFY_SYSTEM_PRESET",
    "message": "System presets cannot be modified. Save as a new preset instead."
  }
}
```

**Notes:**
- Only user-created presets can be updated
- System presets blocked by RLS policy
- All fields optional (partial updates supported)
- `updated_at` automatically set to NOW()

---

### Endpoint 5: Delete Preset

**Request:**
```http
DELETE /api/presets/:preset_id
```

**Response 200:**
```json
{
  "success": true,
  "message": "Preset deleted successfully"
}
```

**Response 403 (System Preset):**
```json
{
  "error": {
    "code": "CANNOT_DELETE_SYSTEM_PRESET",
    "message": "System presets cannot be deleted"
  }
}
```

**Response 404:**
```json
{
  "error": {
    "code": "PRESET_NOT_FOUND",
    "message": "Preset not found"
  }
}
```

---

### Error Handling

**Standard Error Codes:**

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_PRESET_NAME` | 400 | Preset name empty or invalid characters |
| `INVALID_PARAMETERS` | 400 | Parameters fail validation |
| `PRESET_NAME_EXISTS` | 409 | Preset name conflicts with existing user preset |
| `PRESET_NOT_FOUND` | 404 | Preset ID does not exist or not accessible |
| `CANNOT_MODIFY_SYSTEM_PRESET` | 403 | Attempt to update system preset |
| `CANNOT_DELETE_SYSTEM_PRESET` | 403 | Attempt to delete system preset |
| `UNAUTHORIZED` | 401 | User not authenticated (future) |
| `DATABASE_ERROR` | 500 | Unexpected database error |

**Error Response Format:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly error message",
    "details": "Technical details (dev mode only)"
  }
}
```

---

## Default Presets

### Preset Specifications

#### 1. Fast Print Preset

**Purpose:** Maximize print speed for prototyping and non-critical parts

**Parameters:**
```json
{
  "layer_height": 0.28,
  "infill_density": 15,
  "support_type": "tree",
  "printer_model": "X1_Carbon",
  "print_speed": 150,
  "nozzle_temperature": 220,
  "bed_temperature": 60,
  "wall_thickness": 0.8,
  "top_bottom_thickness": 0.8
}
```

**Use Cases:**
- Rapid prototyping
- Form-fit testing
- Non-structural parts
- Quick iterations

**Expected Results:**
- Fastest print time
- Lower quality (visible layers)
- Minimal material usage
- Adequate strength for testing

---

#### 2. Quality Print Preset

**Purpose:** Maximum quality for final production parts

**Parameters:**
```json
{
  "layer_height": 0.1,
  "infill_density": 30,
  "support_type": "normal",
  "printer_model": "X1_Carbon",
  "print_speed": 60,
  "nozzle_temperature": 215,
  "bed_temperature": 60,
  "wall_thickness": 1.6,
  "top_bottom_thickness": 1.2
}
```

**Use Cases:**
- Final production parts
- Customer-facing products
- Detailed models
- Functional parts requiring precision

**Expected Results:**
- Longest print time
- Highest quality surface finish
- Strongest parts
- Highest material usage

---

#### 3. Standard Preset

**Purpose:** Balanced general-purpose settings

**Parameters:**
```json
{
  "layer_height": 0.2,
  "infill_density": 20,
  "support_type": "normal",
  "printer_model": "X1_Carbon",
  "print_speed": 100,
  "nozzle_temperature": 215,
  "bed_temperature": 60,
  "wall_thickness": 1.2,
  "top_bottom_thickness": 1.0
}
```

**Use Cases:**
- General printing
- Unknown requirements
- Starter settings
- Balanced time/quality trade-off

**Expected Results:**
- Moderate print time
- Good quality
- Reasonable strength
- Moderate material usage

---

### Seed Data SQL

System presets are inserted during migration:

```sql
-- Insert system presets with fixed UUIDs (for consistency across environments)
INSERT INTO public.presets (preset_id, user_id, preset_name, description, parameters, is_system_preset, created_at, updated_at)
VALUES
  -- Fast Print Preset
  (
    'a0000000-0000-0000-0000-000000000001',
    NULL,
    'Fast Print',
    'Optimized for speed - good for prototypes and non-critical parts. Uses larger layer heights and minimal infill.',
    '{"layer_height": 0.28, "infill_density": 15, "support_type": "tree", "printer_model": "X1_Carbon", "print_speed": 150, "nozzle_temperature": 220, "bed_temperature": 60, "wall_thickness": 0.8, "top_bottom_thickness": 0.8}'::jsonb,
    TRUE,
    NOW(),
    NOW()
  ),

  -- Quality Print Preset
  (
    'a0000000-0000-0000-0000-000000000002',
    NULL,
    'Quality Print',
    'High quality settings for final parts and customer-facing products. Fine layer heights and strong infill.',
    '{"layer_height": 0.1, "infill_density": 30, "support_type": "normal", "printer_model": "X1_Carbon", "print_speed": 60, "nozzle_temperature": 215, "bed_temperature": 60, "wall_thickness": 1.6, "top_bottom_thickness": 1.2}'::jsonb,
    TRUE,
    NOW(),
    NOW()
  ),

  -- Standard Preset
  (
    'a0000000-0000-0000-0000-000000000003',
    NULL,
    'Standard',
    'Balanced general-purpose settings. Good starting point for most prints with moderate time and quality.',
    '{"layer_height": 0.2, "infill_density": 20, "support_type": "normal", "printer_model": "X1_Carbon", "print_speed": 100, "nozzle_temperature": 215, "bed_temperature": 60, "wall_thickness": 1.2, "top_bottom_thickness": 1.0}'::jsonb,
    TRUE,
    NOW(),
    NOW()
  )
ON CONFLICT (preset_id) DO NOTHING;
```

**Notes:**
- Fixed UUIDs ensure consistent IDs across environments
- `ON CONFLICT DO NOTHING` makes migration idempotent
- System presets created during migration (not via API)

---

## Migration Strategy

### Migration File: 003_create_presets.sql

**Location:** `supabase/migrations/003_create_presets.sql`

**Execution Order:**
1. Create `presets` table
2. Add constraints and checks
3. Create indexes
4. Enable RLS
5. Create RLS policies
6. Seed system presets

**Rollback Strategy:**
```sql
-- Rollback: Drop presets table (cascades to all policies and indexes)
DROP TABLE IF EXISTS public.presets CASCADE;
```

**Migration Validation:**
```sql
-- Verify table exists
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'presets'
);

-- Verify system presets exist
SELECT COUNT(*) FROM public.presets WHERE is_system_preset = TRUE;
-- Expected: 3

-- Verify RLS enabled
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'presets';
-- Expected: rowsecurity = true
```

---

### Testing Approach

#### Local Testing (Development)

1. **Run Migration:**
   ```bash
   # Using Supabase CLI
   supabase migration up

   # Or manually via SQL client
   psql -h localhost -U postgres -d slicercompare -f supabase/migrations/003_create_presets.sql
   ```

2. **Verify Schema:**
   ```sql
   -- Check table structure
   \d public.presets

   -- Verify constraints
   SELECT conname, contype FROM pg_constraint WHERE conrelid = 'public.presets'::regclass;

   -- Verify indexes
   SELECT indexname FROM pg_indexes WHERE tablename = 'presets';
   ```

3. **Test System Presets:**
   ```sql
   -- Should return 3 presets
   SELECT preset_id, preset_name, is_system_preset FROM public.presets;

   -- Verify parameters are valid JSON
   SELECT preset_name, jsonb_pretty(parameters) FROM public.presets;
   ```

4. **Test RLS Policies:**
   ```sql
   -- Set test user context
   SET LOCAL role authenticated;
   SET LOCAL request.jwt.claim.sub = 'test-user-id';

   -- Should see system presets
   SELECT COUNT(*) FROM public.presets WHERE is_system_preset = TRUE;
   -- Expected: 3

   -- Attempt to delete system preset (should fail)
   DELETE FROM public.presets WHERE is_system_preset = TRUE;
   -- Expected: 0 rows deleted
   ```

#### API Testing

**Test Suite:**
```typescript
// tests/api/presets.test.ts

describe('Presets API', () => {
  test('GET /api/presets returns system presets', async () => {
    const response = await fetch('/api/presets');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.presets.length).toBeGreaterThanOrEqual(3);

    const systemPresets = data.presets.filter(p => p.is_system_preset);
    expect(systemPresets.length).toBe(3);
    expect(systemPresets.map(p => p.preset_name)).toContain('Fast Print');
    expect(systemPresets.map(p => p.preset_name)).toContain('Quality Print');
    expect(systemPresets.map(p => p.preset_name)).toContain('Standard');
  });

  test('POST /api/presets creates user preset', async () => {
    const newPreset = {
      name: 'Test Preset',
      description: 'Test description',
      parameters: {
        layer_height: 0.2,
        infill_density: 20,
        support_type: 'normal',
        printer_model: 'X1_Carbon'
      }
    };

    const response = await fetch('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPreset)
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.preset_name).toBe('Test Preset');
    expect(data.is_system_preset).toBe(false);
  });

  test('DELETE system preset is forbidden', async () => {
    const systemPresetId = 'a0000000-0000-0000-0000-000000000001';

    const response = await fetch(`/api/presets/${systemPresetId}`, {
      method: 'DELETE'
    });

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error.code).toBe('CANNOT_DELETE_SYSTEM_PRESET');
  });
});
```

---

## Implementation Notes

### For Story 2.2 Developer

#### Step 1: Run Migration

```bash
# Apply migration to local database
supabase migration up

# Or via npm script (add to package.json):
npm run db:migrate
```

#### Step 2: Update TypeScript Types

Add to `types/database.ts`:

```typescript
export interface Preset {
  preset_id: string;
  user_id: string | null;
  preset_name: string;
  description: string | null;
  parameters: ConfigurationParameters;
  is_system_preset: boolean;
  created_at: string;
  updated_at: string;
}
```

#### Step 3: Create API Routes

Create `src/server/routes/presets.ts`:

```typescript
import { Router } from 'express';
import { supabase } from '../services/supabase';

const router = Router();

// GET /api/presets - List all presets
router.get('/', async (req, res) => {
  // Implementation here
});

// GET /api/presets/:id - Get preset details
router.get('/:preset_id', async (req, res) => {
  // Implementation here
});

// POST /api/presets - Create preset
router.post('/', async (req, res) => {
  // Implementation here
});

// PUT /api/presets/:id - Update preset
router.put('/:preset_id', async (req, res) => {
  // Implementation here
});

// DELETE /api/presets/:id - Delete preset
router.delete('/:preset_id', async (req, res) => {
  // Implementation here
});

export default router;
```

Register routes in `src/server/index.ts`:
```typescript
import presetsRouter from './routes/presets';
app.use('/api/presets', presetsRouter);
```

#### Step 4: Implement Supabase Service Methods

Create `src/server/services/preset-service.ts`:

```typescript
import { supabase } from './supabase';
import { Preset, PresetInsert } from '../../types/database';

export async function listPresets(userId: string): Promise<Preset[]> {
  const { data, error } = await supabase
    .from('presets')
    .select('preset_id, preset_name, description, is_system_preset, created_at')
    .or(`is_system_preset.eq.true,user_id.eq.${userId}`)
    .order('is_system_preset', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPreset(presetId: string, userId: string): Promise<Preset> {
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('preset_id', presetId)
    .or(`is_system_preset.eq.true,user_id.eq.${userId}`)
    .single();

  if (error) throw error;
  return data;
}

export async function createPreset(preset: PresetInsert): Promise<Preset> {
  const { data, error } = await supabase
    .from('presets')
    .insert(preset)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error('PRESET_NAME_EXISTS');
    }
    throw error;
  }

  return data;
}

export async function updatePreset(
  presetId: string,
  userId: string,
  updates: Partial<PresetInsert>
): Promise<Preset> {
  const { data, error } = await supabase
    .from('presets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('preset_id', presetId)
    .eq('user_id', userId)
    .eq('is_system_preset', false)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('CANNOT_MODIFY_SYSTEM_PRESET');

  return data;
}

export async function deletePreset(presetId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('preset_id', presetId)
    .eq('user_id', userId)
    .eq('is_system_preset', false);

  if (error) throw error;
}
```

#### Step 5: Frontend Integration

Create `src/client/components/PresetManager.tsx`:

```typescript
import { useState, useEffect } from 'react';
import { Preset } from '../../../types/database';

export function PresetManager() {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    fetchPresets();
  }, []);

  async function fetchPresets() {
    const response = await fetch('/api/presets');
    const data = await response.json();
    setPresets(data.presets);
  }

  async function loadPreset(presetId: string) {
    const response = await fetch(`/api/presets/${presetId}`);
    const preset = await response.json();
    // Apply preset.parameters to configuration form
  }

  // Implement save, delete, etc.

  return (
    // UI implementation
  );
}
```

---

## Security Considerations

### Row Level Security (RLS) Policies

```sql
-- Policy 1: All users can read system presets
CREATE POLICY "Anyone can view system presets"
ON public.presets
FOR SELECT
USING (is_system_preset = TRUE);

-- Policy 2: Users can view their own presets
CREATE POLICY "Users can view own presets"
ON public.presets
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 3: Users can create their own presets
CREATE POLICY "Users can create own presets"
ON public.presets
FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  is_system_preset = FALSE
);

-- Policy 4: Users can update their own presets (not system presets)
CREATE POLICY "Users can update own presets"
ON public.presets
FOR UPDATE
USING (
  auth.uid() = user_id AND
  is_system_preset = FALSE
)
WITH CHECK (
  auth.uid() = user_id AND
  is_system_preset = FALSE
);

-- Policy 5: Users can delete their own presets (not system presets)
CREATE POLICY "Users can delete own presets"
ON public.presets
FOR DELETE
USING (
  auth.uid() = user_id AND
  is_system_preset = FALSE
);
```

### Security Validations

**API Level:**
1. Validate preset name is not empty
2. Validate parameters match `ConfigurationParameters` schema
3. Sanitize user input to prevent XSS
4. Verify user ownership before updates/deletes
5. Block system preset modifications

**Database Level:**
1. RLS policies enforce ownership
2. Check constraints prevent invalid data
3. Foreign key constraints maintain referential integrity
4. Unique constraints prevent name conflicts

### Anonymous Users (MVP)

**Current Architecture:**
- MVP has no authentication (`user_id` nullable for anonymous users)
- System presets accessible to all (no authentication required)
- User presets require placeholder user_id

**Implementation for Anonymous Users:**
```typescript
// For MVP: Use session-based temporary user ID
const userId = req.session?.userId || 'anonymous';
```

**Future (Post-MVP):**
- Enable Supabase Auth
- Require authentication for user presets
- Enforce auth.uid() in RLS policies
- Migrate anonymous presets to authenticated users

---

## Acceptance Criteria Mapping

| Story 2.2 Acceptance Criterion | Implementation |
|-------------------------------|----------------|
| 1. "Save as Preset" button stores current configuration to Supabase | POST /api/presets endpoint |
| 2. Preset naming with validation (unique names, no special characters) | Unique constraint + API validation |
| 3. Preset library displays all saved presets with names and timestamps | GET /api/presets + PresetManager UI |
| 4. "Load Preset" applies all parameters from selected preset to current configuration | GET /api/presets/:id + form population |
| 5. "Delete Preset" removes preset from library with confirmation dialog | DELETE /api/presets/:id + confirmation UI |
| 6. Presets persist across browser sessions | Supabase database storage |
| 7. Default/starter presets provided (Standard, Fast, Quality) | Migration seed data + system presets |

---

## Questions & Answers

**Q: What if Bambu Slicer adds new parameters in the future?**
A: JSONB storage is flexible - new parameters can be added without schema migration. Update `ConfigurationParameters` TypeScript interface for type safety.

**Q: Can users modify system presets?**
A: No. RLS policies prevent updates/deletes. Users can load system presets and save as their own copy.

**Q: How do we handle preset conflicts during user migration?**
A: Unique constraint is per-user, so no conflicts. If importing presets, rename conflicting ones.

**Q: Should we allow preset sharing between users?**
A: Not in MVP. Future feature could add `is_public` flag or preset marketplace.

**Q: What happens when a user is deleted?**
A: CASCADE delete ensures all user presets are removed automatically.

---

**End of Document**

_This schema design is ready for implementation in Epic 2 Story 2.2._
