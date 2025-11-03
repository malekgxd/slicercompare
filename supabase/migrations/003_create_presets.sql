-- Migration 003: Create Configuration Presets Table
-- Epic 2, Story 2.2: Configuration Preset Management
-- Author: Winston (Architect)
-- Date: 2025-11-01
--
-- Purpose: Enable users to save, load, and manage reusable Bambu Slicer configurations
-- Includes 3 system presets: Fast Print, Quality Print, Standard
--
-- Rollback: DROP TABLE IF EXISTS public.presets CASCADE;

-- ============================================================================
-- STEP 1: Create presets table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.presets (
  -- Primary key
  preset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Ownership
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Preset identification
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

-- ============================================================================
-- STEP 2: Create indexes for performance
-- ============================================================================

-- Index for user preset lookups
CREATE INDEX IF NOT EXISTS idx_presets_user_id
  ON public.presets(user_id)
  WHERE user_id IS NOT NULL;

-- Index for system preset queries
CREATE INDEX IF NOT EXISTS idx_presets_system
  ON public.presets(is_system_preset)
  WHERE is_system_preset = TRUE;

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_presets_created_at
  ON public.presets(created_at DESC);

-- ============================================================================
-- STEP 3: Enable Row Level Security
-- ============================================================================

ALTER TABLE public.presets ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Create RLS Policies
-- ============================================================================

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

-- ============================================================================
-- STEP 5: Temporary policy for MVP (no authentication)
-- ============================================================================

-- TEMPORARY: Allow all operations for MVP (no auth yet)
-- TODO: Remove this policy when Supabase Auth is enabled in production
CREATE POLICY "Allow all operations for MVP"
  ON public.presets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- STEP 6: Seed default system presets
-- ============================================================================

-- Insert 3 system presets: Fast Print, Quality Print, Standard
-- Uses fixed UUIDs for consistency across environments
-- ON CONFLICT DO NOTHING makes this idempotent (safe to re-run)

INSERT INTO public.presets (
  preset_id,
  user_id,
  preset_name,
  description,
  parameters,
  is_system_preset,
  created_at,
  updated_at
)
VALUES
  -- ========================================
  -- Fast Print Preset
  -- ========================================
  (
    'a0000000-0000-0000-0000-000000000001',
    NULL,
    'Fast Print',
    'Optimized for speed - good for prototypes and non-critical parts. Uses larger layer heights and minimal infill for fastest possible print times.',
    jsonb_build_object(
      'layer_height', 0.28,
      'infill_density', 15,
      'support_type', 'tree',
      'printer_model', 'X1_Carbon',
      'print_speed', 150,
      'nozzle_temperature', 220,
      'bed_temperature', 60,
      'wall_thickness', 0.8,
      'top_bottom_thickness', 0.8
    ),
    TRUE,
    NOW(),
    NOW()
  ),

  -- ========================================
  -- Quality Print Preset
  -- ========================================
  (
    'a0000000-0000-0000-0000-000000000002',
    NULL,
    'Quality Print',
    'High quality settings for final parts and customer-facing products. Fine layer heights, strong infill, and slower speeds ensure best surface finish and strength.',
    jsonb_build_object(
      'layer_height', 0.1,
      'infill_density', 30,
      'support_type', 'normal',
      'printer_model', 'X1_Carbon',
      'print_speed', 60,
      'nozzle_temperature', 215,
      'bed_temperature', 60,
      'wall_thickness', 1.6,
      'top_bottom_thickness', 1.2
    ),
    TRUE,
    NOW(),
    NOW()
  ),

  -- ========================================
  -- Standard Preset
  -- ========================================
  (
    'a0000000-0000-0000-0000-000000000003',
    NULL,
    'Standard',
    'Balanced general-purpose settings. Good starting point for most prints with moderate time and quality trade-offs. Recommended for new users.',
    jsonb_build_object(
      'layer_height', 0.2,
      'infill_density', 20,
      'support_type', 'normal',
      'printer_model', 'X1_Carbon',
      'print_speed', 100,
      'nozzle_temperature', 215,
      'bed_temperature', 60,
      'wall_thickness', 1.2,
      'top_bottom_thickness', 1.0
    ),
    TRUE,
    NOW(),
    NOW()
  )
ON CONFLICT (preset_id) DO NOTHING;

-- ============================================================================
-- STEP 7: Verification queries (for manual testing)
-- ============================================================================

-- Verify table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'presets'
  ) THEN
    RAISE EXCEPTION 'Migration failed: presets table does not exist';
  END IF;
END $$;

-- Verify system presets were created
DO $$
DECLARE
  preset_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO preset_count FROM public.presets WHERE is_system_preset = TRUE;

  IF preset_count <> 3 THEN
    RAISE EXCEPTION 'Migration failed: Expected 3 system presets, found %', preset_count;
  END IF;
END $$;

-- ============================================================================
-- Migration Complete
-- ============================================================================

-- Log successful migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 003 completed successfully';
  RAISE NOTICE '  - presets table created';
  RAISE NOTICE '  - 3 indexes created';
  RAISE NOTICE '  - RLS enabled with 5 policies';
  RAISE NOTICE '  - 3 system presets seeded (Fast, Quality, Standard)';
END $$;
