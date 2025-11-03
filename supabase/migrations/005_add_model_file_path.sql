-- Migration: Add model_file_path to comparison_sessions table
-- Description: Add model_file_path column to store reference to uploaded STL/3MF file
-- Created: 2025-11-02

-- Add model_file_path column
ALTER TABLE comparison_sessions
ADD COLUMN model_file_path TEXT;

-- Add comment for documentation
COMMENT ON COLUMN comparison_sessions.model_file_path IS 'Storage path to the uploaded 3D model file (STL or 3MF)';
