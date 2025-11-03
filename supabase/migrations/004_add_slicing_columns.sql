-- Migration: Add slicing workflow columns to configurations table
-- Story: 1.6 - Batch Slicing Engine
-- Description: Add processing_status, error_message, and gcode_file_path columns
-- Created: 2025-11-01

-- Add processing_status column
ALTER TABLE configurations
ADD COLUMN processing_status VARCHAR(50) DEFAULT 'draft';

-- Add error_message column for slicing errors
ALTER TABLE configurations
ADD COLUMN error_message TEXT;

-- Add gcode_file_path column
ALTER TABLE configurations
ADD COLUMN gcode_file_path TEXT;

-- Create index on processing_status for faster filtering
CREATE INDEX idx_configs_processing_status ON configurations(processing_status);

-- Add comments for documentation
COMMENT ON COLUMN configurations.processing_status IS 'Status of slicing process: draft, queued, slicing, complete, failed';
COMMENT ON COLUMN configurations.error_message IS 'Error message if slicing failed';
COMMENT ON COLUMN configurations.gcode_file_path IS 'Path to generated G-code file';
