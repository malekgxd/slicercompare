# Story 2.2: Configuration Preset Management - Implementation Guide

**Epic:** 2 - Production-Ready Enhancement & Polish
**Story:** 2.2 - Configuration Preset Management
**Architect:** Winston
**Date:** 2025-11-01

---

## Quick Start

This guide provides step-by-step implementation instructions for Story 2.2. For complete schema details, see [PRESET_SCHEMA.md](../PRESET_SCHEMA.md).

---

## User Story

**As a print farm operator,**
**I want to save and load configuration presets,**
**So that I can quickly reuse proven settings without re-entering parameters.**

---

## Acceptance Criteria

1. ✅ "Save as Preset" button stores current configuration to Supabase
2. ✅ Preset naming with validation (unique names, no special characters)
3. ✅ Preset library displays all saved presets with names and timestamps
4. ✅ "Load Preset" applies all parameters from selected preset to current configuration
5. ✅ "Delete Preset" removes preset from library with confirmation dialog
6. ✅ Presets persist across browser sessions
7. ✅ Default/starter presets provided (Standard, Fast, Quality)

---

## Implementation Checklist

### Phase 1: Database Migration (15 min)

- [ ] Run migration: `supabase migration up` or execute `003_create_presets.sql`
- [ ] Verify 3 system presets created: `SELECT * FROM presets WHERE is_system_preset = TRUE;`
- [ ] Test RLS policies work correctly

**Files:**
- ✅ `supabase/migrations/003_create_presets.sql` (already created by architect)

---

### Phase 2: TypeScript Types (10 min)

- [ ] Add `Preset` types to `types/database.ts`

**Code to Add:**

```typescript
// Add to types/database.ts

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

// Add to Database interface
export interface Database {
  public: {
    Tables: {
      // ... existing tables ...
      presets: {
        Row: Preset;
        Insert: PresetInsert;
        Update: PresetUpdate;
      }
    }
  }
}
```

---

### Phase 3: Backend Service Layer (45 min)

- [ ] Create `src/server/services/preset-service.ts`
- [ ] Implement CRUD operations with Supabase client
- [ ] Add error handling for unique constraint violations

**Create:** `src/server/services/preset-service.ts`

```typescript
import { supabase } from './supabase';
import { Preset, PresetInsert, PresetUpdate } from '../../../types/database';

/**
 * List all presets accessible to the user (system + user's own)
 */
export async function listPresets(userId: string): Promise<Preset[]> {
  const { data, error } = await supabase
    .from('presets')
    .select('preset_id, preset_name, description, is_system_preset, created_at')
    .or(`is_system_preset.eq.true,user_id.eq.${userId}`)
    .order('is_system_preset', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get a single preset by ID (with full parameters)
 */
export async function getPreset(presetId: string, userId: string): Promise<Preset> {
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('preset_id', presetId)
    .or(`is_system_preset.eq.true,user_id.eq.${userId}`)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('PRESET_NOT_FOUND');
    }
    throw error;
  }

  return data;
}

/**
 * Create a new user preset
 */
export async function createPreset(preset: PresetInsert): Promise<Preset> {
  const { data, error } = await supabase
    .from('presets')
    .insert({
      ...preset,
      is_system_preset: false, // Force user presets
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    // Unique constraint violation
    if (error.code === '23505') {
      throw new Error('PRESET_NAME_EXISTS');
    }
    throw error;
  }

  return data;
}

/**
 * Update an existing user preset
 */
export async function updatePreset(
  presetId: string,
  userId: string,
  updates: PresetUpdate
): Promise<Preset> {
  const { data, error } = await supabase
    .from('presets')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('preset_id', presetId)
    .eq('user_id', userId)
    .eq('is_system_preset', false)
    .select()
    .single();

  if (error) throw error;

  if (!data) {
    throw new Error('CANNOT_MODIFY_SYSTEM_PRESET');
  }

  return data;
}

/**
 * Delete a user preset
 */
export async function deletePreset(presetId: string, userId: string): Promise<void> {
  const { error, count } = await supabase
    .from('presets')
    .delete()
    .eq('preset_id', presetId)
    .eq('user_id', userId)
    .eq('is_system_preset', false);

  if (error) throw error;

  if (count === 0) {
    throw new Error('CANNOT_DELETE_SYSTEM_PRESET');
  }
}
```

---

### Phase 4: API Routes (45 min)

- [ ] Create `src/server/routes/presets.ts`
- [ ] Implement 5 REST endpoints
- [ ] Add validation middleware
- [ ] Register routes in Express app

**Create:** `src/server/routes/presets.ts`

```typescript
import { Router, Request, Response } from 'express';
import {
  listPresets,
  getPreset,
  createPreset,
  updatePreset,
  deletePreset
} from '../services/preset-service';
import { PresetInsert } from '../../../types/database';

const router = Router();

/**
 * GET /api/presets
 * List all presets (system + user's own)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // TODO: Get userId from auth session (for now, use placeholder)
    const userId = req.session?.userId || 'anonymous';

    const presets = await listPresets(userId);

    res.status(200).json({ presets });
  } catch (error) {
    console.error('Error listing presets:', error);
    res.status(500).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to retrieve presets'
      }
    });
  }
});

/**
 * GET /api/presets/:preset_id
 * Get preset details with full parameters
 */
router.get('/:preset_id', async (req: Request, res: Response) => {
  try {
    const { preset_id } = req.params;
    const userId = req.session?.userId || 'anonymous';

    const preset = await getPreset(preset_id, userId);

    res.status(200).json(preset);
  } catch (error: any) {
    if (error.message === 'PRESET_NOT_FOUND') {
      res.status(404).json({
        error: {
          code: 'PRESET_NOT_FOUND',
          message: 'Preset not found'
        }
      });
      return;
    }

    console.error('Error getting preset:', error);
    res.status(500).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to retrieve preset'
      }
    });
  }
});

/**
 * POST /api/presets
 * Create a new user preset
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, parameters } = req.body;
    const userId = req.session?.userId || 'anonymous';

    // Validation
    if (!name || name.trim() === '') {
      res.status(400).json({
        error: {
          code: 'INVALID_PRESET_NAME',
          message: 'Preset name cannot be empty'
        }
      });
      return;
    }

    if (!parameters) {
      res.status(400).json({
        error: {
          code: 'INVALID_PARAMETERS',
          message: 'Parameters are required'
        }
      });
      return;
    }

    const newPreset: PresetInsert = {
      user_id: userId,
      preset_name: name,
      description: description || null,
      parameters,
      is_system_preset: false
    };

    const preset = await createPreset(newPreset);

    res.status(201).json({
      preset_id: preset.preset_id,
      preset_name: preset.preset_name,
      description: preset.description,
      is_system_preset: preset.is_system_preset,
      created_at: preset.created_at
    });
  } catch (error: any) {
    if (error.message === 'PRESET_NAME_EXISTS') {
      res.status(409).json({
        error: {
          code: 'PRESET_NAME_EXISTS',
          message: 'A preset with this name already exists. Please choose a different name.'
        }
      });
      return;
    }

    console.error('Error creating preset:', error);
    res.status(500).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to create preset'
      }
    });
  }
});

/**
 * PUT /api/presets/:preset_id
 * Update an existing user preset
 */
router.put('/:preset_id', async (req: Request, res: Response) => {
  try {
    const { preset_id } = req.params;
    const { name, description, parameters } = req.body;
    const userId = req.session?.userId || 'anonymous';

    const updates: any = {};
    if (name !== undefined) updates.preset_name = name;
    if (description !== undefined) updates.description = description;
    if (parameters !== undefined) updates.parameters = parameters;

    const preset = await updatePreset(preset_id, userId, updates);

    res.status(200).json({
      preset_id: preset.preset_id,
      preset_name: preset.preset_name,
      description: preset.description,
      updated_at: preset.updated_at
    });
  } catch (error: any) {
    if (error.message === 'CANNOT_MODIFY_SYSTEM_PRESET') {
      res.status(403).json({
        error: {
          code: 'CANNOT_MODIFY_SYSTEM_PRESET',
          message: 'System presets cannot be modified. Save as a new preset instead.'
        }
      });
      return;
    }

    console.error('Error updating preset:', error);
    res.status(500).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to update preset'
      }
    });
  }
});

/**
 * DELETE /api/presets/:preset_id
 * Delete a user preset
 */
router.delete('/:preset_id', async (req: Request, res: Response) => {
  try {
    const { preset_id } = req.params;
    const userId = req.session?.userId || 'anonymous';

    await deletePreset(preset_id, userId);

    res.status(200).json({
      success: true,
      message: 'Preset deleted successfully'
    });
  } catch (error: any) {
    if (error.message === 'CANNOT_DELETE_SYSTEM_PRESET') {
      res.status(403).json({
        error: {
          code: 'CANNOT_DELETE_SYSTEM_PRESET',
          message: 'System presets cannot be deleted'
        }
      });
      return;
    }

    console.error('Error deleting preset:', error);
    res.status(500).json({
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to delete preset'
      }
    });
  }
});

export default router;
```

**Register Routes in** `src/server/index.ts`:

```typescript
import presetsRouter from './routes/presets';

// ... existing routes ...
app.use('/api/presets', presetsRouter);
```

---

### Phase 5: Frontend Components (1.5 hours)

- [ ] Create `src/client/components/PresetManager.tsx`
- [ ] Create `src/client/components/PresetLibrary.tsx`
- [ ] Create `src/client/hooks/usePresets.ts`
- [ ] Integrate with ConfigurationForm

**Create:** `src/client/hooks/usePresets.ts`

```typescript
import { useState, useEffect } from 'react';
import { Preset } from '../../../types/database';

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPresets() {
    try {
      setLoading(true);
      const response = await fetch('/api/presets');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to load presets');
      }

      setPresets(data.presets);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadPreset(presetId: string) {
    const response = await fetch(`/api/presets/${presetId}`);
    const preset = await response.json();

    if (!response.ok) {
      throw new Error(preset.error?.message || 'Failed to load preset');
    }

    return preset;
  }

  async function savePreset(name: string, description: string, parameters: any) {
    const response = await fetch('/api/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, parameters })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to save preset');
    }

    await fetchPresets(); // Refresh list
    return data;
  }

  async function deletePreset(presetId: string) {
    const response = await fetch(`/api/presets/${presetId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to delete preset');
    }

    await fetchPresets(); // Refresh list
  }

  useEffect(() => {
    fetchPresets();
  }, []);

  return {
    presets,
    loading,
    error,
    loadPreset,
    savePreset,
    deletePreset,
    refreshPresets: fetchPresets
  };
}
```

**Create:** `src/client/components/PresetLibrary.tsx`

```typescript
import { useState } from 'react';
import { Preset } from '../../../types/database';

interface PresetLibraryProps {
  presets: Preset[];
  onLoadPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
}

export function PresetLibrary({ presets, onLoadPreset, onDeletePreset }: PresetLibraryProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const systemPresets = presets.filter(p => p.is_system_preset);
  const userPresets = presets.filter(p => !p.is_system_preset);

  function handleDelete(presetId: string) {
    if (deleteConfirm === presetId) {
      onDeletePreset(presetId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(presetId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  return (
    <div className="preset-library">
      <h2>Preset Library</h2>

      {/* System Presets */}
      <section>
        <h3>System Presets</h3>
        <div className="preset-list">
          {systemPresets.map(preset => (
            <div key={preset.preset_id} className="preset-card system">
              <div className="preset-info">
                <h4>{preset.preset_name}</h4>
                <p>{preset.description}</p>
              </div>
              <button onClick={() => onLoadPreset(preset.preset_id)}>
                Load
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* User Presets */}
      {userPresets.length > 0 && (
        <section>
          <h3>My Presets</h3>
          <div className="preset-list">
            {userPresets.map(preset => (
              <div key={preset.preset_id} className="preset-card user">
                <div className="preset-info">
                  <h4>{preset.preset_name}</h4>
                  <p>{preset.description}</p>
                  <small>{new Date(preset.created_at).toLocaleDateString()}</small>
                </div>
                <div className="preset-actions">
                  <button onClick={() => onLoadPreset(preset.preset_id)}>
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(preset.preset_id)}
                    className="delete"
                  >
                    {deleteConfirm === preset.preset_id ? 'Confirm Delete?' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

**Integrate with ConfigurationForm:**

```typescript
// In ConfigurationForm.tsx

import { usePresets } from '../hooks/usePresets';
import { PresetLibrary } from './PresetLibrary';

export function ConfigurationForm() {
  const [showPresets, setShowPresets] = useState(false);
  const { presets, loadPreset, savePreset, deletePreset } = usePresets();

  async function handleLoadPreset(presetId: string) {
    const preset = await loadPreset(presetId);
    // Populate form with preset.parameters
    setFormValues(preset.parameters);
    setShowPresets(false);
  }

  async function handleSavePreset() {
    const name = prompt('Enter preset name:');
    const description = prompt('Enter description (optional):');

    if (name) {
      await savePreset(name, description || '', formValues);
    }
  }

  return (
    <div>
      {/* Configuration form fields */}

      <div className="preset-controls">
        <button onClick={() => setShowPresets(!showPresets)}>
          {showPresets ? 'Hide Presets' : 'Load Preset'}
        </button>
        <button onClick={handleSavePreset}>
          Save as Preset
        </button>
      </div>

      {showPresets && (
        <PresetLibrary
          presets={presets}
          onLoadPreset={handleLoadPreset}
          onDeletePreset={deletePreset}
        />
      )}
    </div>
  );
}
```

---

### Phase 6: Testing (30 min)

- [ ] Test migration creates system presets
- [ ] Test API endpoints with Postman/curl
- [ ] Test frontend UI flows
- [ ] Test error handling

**Manual API Tests:**

```bash
# List presets
curl http://localhost:3001/api/presets

# Get preset details
curl http://localhost:3001/api/presets/a0000000-0000-0000-0000-000000000001

# Create preset
curl -X POST http://localhost:3001/api/presets \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Preset","parameters":{"layer_height":0.2}}'

# Delete preset
curl -X DELETE http://localhost:3001/api/presets/USER_PRESET_ID
```

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Migration runs successfully
- [ ] API endpoints functional and tested
- [ ] Frontend UI implemented and styled
- [ ] Error handling working correctly
- [ ] System presets visible and loadable
- [ ] User presets can be created, loaded, and deleted
- [ ] Code reviewed and committed

---

## Time Estimate

- Database Migration: 15 min
- TypeScript Types: 10 min
- Backend Service: 45 min
- API Routes: 45 min
- Frontend Components: 1.5 hours
- Testing: 30 min

**Total: 3.5 hours**

---

## Reference Documents

- [PRESET_SCHEMA.md](../PRESET_SCHEMA.md) - Complete schema design and rationale
- [architecture.md](../architecture.md) - Overall system architecture
- [epics.md](../epics.md) - Story 2.2 acceptance criteria

---

**Good luck! You've got this!**
