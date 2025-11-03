-- Migration: Add flat metric columns to results table
-- Description: Add print_time_minutes and support_material_grams as flat columns for easier querying
-- Created: 2025-11-02
-- Context: Fix parsing error in ComparisonTable - columns were being queried but didn't exist

-- Add print_time_minutes column (extracted from result_data JSONB)
ALTER TABLE results
ADD COLUMN IF NOT EXISTS print_time_minutes INTEGER;

-- Add support_material_grams column (extracted from result_data JSONB)
ALTER TABLE results
ADD COLUMN IF NOT EXISTS support_material_grams INTEGER;

-- Add comments for documentation
COMMENT ON COLUMN results.print_time_minutes IS
  'Print time in minutes (extracted from G-code). Also stored in result_data JSONB for backwards compatibility.';

COMMENT ON COLUMN results.support_material_grams IS
  'Support material usage in grams (extracted from G-code). Also stored in result_data JSONB for backwards compatibility.';

-- Note: We keep result_data JSONB for:
-- 1. Backwards compatibility with existing data
-- 2. Future extensibility (layer count, build volume, etc.)
-- 3. Complete audit trail of parsed data
-- Flat columns are for performance and easier querying in common cases
