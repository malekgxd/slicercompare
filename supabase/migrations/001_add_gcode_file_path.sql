-- Migration: Add gcode_file_path to configurations table
-- Story 1.6: Batch Slicing Engine
-- Date: 2025-10-31

-- Add gcode_file_path column to store generated G-code file location
ALTER TABLE configurations
ADD COLUMN IF NOT EXISTS gcode_file_path TEXT;

-- Add comment for documentation
COMMENT ON COLUMN configurations.gcode_file_path IS 'File path to generated G-code file from Bambu CLI slicing. Null if slicing not yet complete or failed.';

-- Note: processing_status and error_message columns already exist from Story 1.4
-- This migration only adds the missing gcode_file_path column
