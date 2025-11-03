# Configuration Preset Schema - Architecture Handoff

**Architect:** Winston
**Date:** 2025-11-01
**Epic:** 2 - Production-Ready Enhancement & Polish
**Story:** 2.2 - Configuration Preset Management
**Status:** ✅ Design Complete - Ready for Implementation

---

## Executive Summary

The configuration preset management system has been fully designed and is ready for implementation. All schema design, API specifications, default presets, and migration files are complete.

**Time to Implementation:** ~3.5 hours for developer

---

## Deliverables Created

### 1. Complete Schema Documentation
**File:** `docs/PRESET_SCHEMA.md` (28.6 KB)

Comprehensive documentation covering:
- ✅ Database schema design with full CREATE TABLE statement
- ✅ Design decisions (JSONB vs columns, system presets, versioning)
- ✅ API endpoint specifications (5 REST endpoints)
- ✅ Default preset specifications (Fast, Quality, Standard)
- ✅ RLS security policies
- ✅ Migration strategy and rollback plan
- ✅ Testing approach
- ✅ Implementation notes

### 2. Production-Ready Migration File
**File:** `supabase/migrations/003_create_presets.sql` (7.9 KB)

Ready-to-run SQL migration including:
- ✅ `presets` table creation
- ✅ 3 performance indexes
- ✅ Row-level security (RLS) enabled
- ✅ 5 RLS policies (+ 1 temporary MVP policy)
- ✅ 3 system presets seeded (Fixed UUIDs)
- ✅ Verification checks
- ✅ Idempotent (safe to re-run)

### 3. Developer Implementation Guide
**File:** `docs/stories/story-2-2-implementation-guide.md` (18.9 KB)

Step-by-step implementation instructions:
- ✅ Phase-by-phase checklist
- ✅ Complete code samples for all layers
- ✅ API route implementations
- ✅ Frontend component examples
- ✅ Testing commands
- ✅ Time estimates per phase

---

## Key Design Decisions

### 1. JSONB Parameters Storage
**Decision:** Store all Bambu parameters in JSONB column
**Rationale:** Flexibility, future-proofing, consistency with existing schema
**Impact:** Parameters can be added without schema migrations

### 2. System Presets in Same Table
**Decision:** System presets share `presets` table with `is_system_preset = TRUE`
**Rationale:** Simpler API, consistent querying, protected by RLS
**Impact:** Single table handles both system and user presets

### 3. Unique Names Per User
**Decision:** `UNIQUE(user_id, preset_name)` constraint
**Rationale:** Prevent user confusion, allow same names across users
**Impact:** Users can't duplicate preset names (good UX)

### 4. No Versioning in MVP
**Decision:** No preset versioning in initial implementation
**Rationale:** Simplicity for MVP, can add later if needed
**Impact:** Users update presets in-place (tracked via `updated_at`)

### 5. RLS Security Model
**Decision:** Comprehensive RLS policies prevent system preset modification
**Rationale:** Users can't delete/modify system presets
**Impact:** System presets are immutable and globally available

---

## System Presets Defined

### Fast Print (UUID: a0000000-0000-0000-0000-000000000001)
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
**Use Case:** Rapid prototyping, non-critical parts

### Quality Print (UUID: a0000000-0000-0000-0000-000000000002)
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
**Use Case:** Final production parts, customer-facing products

### Standard (UUID: a0000000-0000-0000-0000-000000000003)
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
**Use Case:** Balanced general-purpose printing

---

## API Endpoints Designed

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/presets` | List all presets (system + user) |
| GET | `/api/presets/:id` | Get preset with full parameters |
| POST | `/api/presets` | Create new user preset |
| PUT | `/api/presets/:id` | Update user preset |
| DELETE | `/api/presets/:id` | Delete user preset |

**Error Codes Defined:**
- `INVALID_PRESET_NAME` (400)
- `INVALID_PARAMETERS` (400)
- `PRESET_NAME_EXISTS` (409)
- `PRESET_NOT_FOUND` (404)
- `CANNOT_MODIFY_SYSTEM_PRESET` (403)
- `CANNOT_DELETE_SYSTEM_PRESET` (403)
- `DATABASE_ERROR` (500)

---

## Implementation Phases

### Phase 1: Database Migration (15 min)
Run `003_create_presets.sql` migration file

### Phase 2: TypeScript Types (10 min)
Add `Preset` interface to `types/database.ts`

### Phase 3: Backend Service Layer (45 min)
Create `preset-service.ts` with CRUD operations

### Phase 4: API Routes (45 min)
Create `routes/presets.ts` with 5 endpoints

### Phase 5: Frontend Components (1.5 hours)
- `usePresets.ts` hook
- `PresetLibrary.tsx` component
- Integration with `ConfigurationForm.tsx`

### Phase 6: Testing (30 min)
Manual and automated tests

**Total Estimated Time:** 3.5 hours

---

## Testing Strategy

### Database Testing
```sql
-- Verify table exists
SELECT * FROM information_schema.tables WHERE table_name = 'presets';

-- Verify system presets
SELECT preset_name, is_system_preset FROM presets WHERE is_system_preset = TRUE;

-- Test RLS policies
DELETE FROM presets WHERE is_system_preset = TRUE; -- Should fail
```

### API Testing
```bash
# List presets
curl http://localhost:3001/api/presets

# Get preset
curl http://localhost:3001/api/presets/a0000000-0000-0000-0000-000000000001

# Create preset
curl -X POST http://localhost:3001/api/presets \
  -H "Content-Type: application/json" \
  -d '{"name":"My Preset","parameters":{"layer_height":0.2}}'
```

### Frontend Testing
- Load system presets and verify display
- Create user preset
- Load user preset into form
- Update user preset
- Delete user preset (with confirmation)
- Attempt to delete system preset (should fail gracefully)

---

## Rollback Plan

If migration needs to be reverted:

```sql
DROP TABLE IF EXISTS public.presets CASCADE;
```

This will cascade delete all policies and indexes.

---

## Next Steps for Developer

1. **Read** `docs/PRESET_SCHEMA.md` for complete understanding
2. **Follow** `docs/stories/story-2-2-implementation-guide.md` step-by-step
3. **Run** `supabase/migrations/003_create_presets.sql`
4. **Implement** backend services and API routes
5. **Build** frontend components
6. **Test** all acceptance criteria
7. **Verify** Story 2.2 Definition of Done

---

## Success Criteria (From Story 2.2)

- [x] Presets table schema designed
- [x] API endpoints specified
- [x] Default presets defined
- [x] Migration SQL written
- [x] RLS policies designed
- [x] `PRESET_SCHEMA.md` created
- [x] `003_create_presets.sql` created
- [x] Implementation guide created

**All architectural tasks complete!** ✅

---

## Architecture Validation

### Consistency with Existing System
- ✅ Follows existing naming conventions (snake_case tables, UUID primary keys)
- ✅ Uses JSONB for parameters (matches `configurations.parameters`)
- ✅ Consistent with Supabase patterns from `architecture.md`
- ✅ RLS policies match existing pattern
- ✅ Error handling follows established error codes

### Future-Proofing
- ✅ JSONB allows new parameters without migration
- ✅ System preset pattern scalable to more presets
- ✅ Can add versioning later without breaking changes
- ✅ Can add preset sharing/marketplace in future
- ✅ Authentication-ready (RLS policies designed for auth.uid())

### Performance Considerations
- ✅ 3 indexes optimize common queries
- ✅ Partial indexes reduce index size
- ✅ JSONB efficiently stores structured data
- ✅ Lightweight list endpoint (no parameters)
- ✅ Caching-friendly (presets rarely change)

---

## Questions Answered

**Q: Why JSONB instead of individual columns?**
A: Flexibility for 50+ Bambu parameters, consistent with existing schema, future-proof.

**Q: Can users modify system presets?**
A: No. RLS policies block updates/deletes. Users can load and save as their own copy.

**Q: What if preset names conflict?**
A: Unique constraint per user prevents duplicates. Clear error message guides user.

**Q: How do system presets work without user_id?**
A: `user_id IS NULL` for system presets, enforced by check constraint and RLS policies.

**Q: What happens when Bambu adds new parameters?**
A: JSONB flexibly stores new parameters. Update TypeScript interface for type safety.

---

## References

- **Full Documentation:** `docs/PRESET_SCHEMA.md`
- **Migration File:** `supabase/migrations/003_create_presets.sql`
- **Implementation Guide:** `docs/stories/story-2-2-implementation-guide.md`
- **Architecture:** `docs/architecture.md`
- **Story Details:** `docs/epics.md` (Story 2.2)

---

## Architect Sign-Off

**Status:** ✅ **APPROVED FOR IMPLEMENTATION**

All design work is complete and validated against:
- Epic 2 Story 2.2 acceptance criteria
- Existing architecture patterns
- Supabase best practices
- Security requirements
- Performance considerations

The developer implementing Story 2.2 has all necessary specifications and can proceed with confidence.

**Estimated Implementation Time:** 3.5 hours
**Complexity:** Medium
**Risk Level:** Low

---

**Winston, Architect**
**2025-11-01**

_"The architecture is sound. The path is clear. Now bring it to life!"_
