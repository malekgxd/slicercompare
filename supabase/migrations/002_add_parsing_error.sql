-- Migration: Add parsing_error to results table
-- Story 1.7: Results Parser & Storage
-- Date: 2025-10-31

-- Add parsing_error column to store G-code parsing errors
ALTER TABLE results
ADD COLUMN IF NOT EXISTS parsing_error TEXT;

-- Add comment for documentation
COMMENT ON COLUMN results.parsing_error IS 'Error message if G-code parsing failed. Null if parsing successful. Configuration is still considered complete even with parsing errors.';

-- Note: This allows graceful degradation - configuration completes even if parsing fails
-- User can still download G-code file (Story 1.9) even without parsed metrics
