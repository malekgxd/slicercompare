-- Migration: Create uploaded_files table for Story 1.2
-- Created: 2025-10-30
-- Description: Stores metadata for uploaded STL and 3MF files

-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,  -- Supabase Storage path: uploaded-models/{uuid}/{filename}
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL CHECK (mime_type IN (
    'model/stl',
    'application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
    'application/sla'  -- Alternative STL MIME type
  )),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'completed', 'failed'))
);

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_uploaded_files_status ON uploaded_files(status);

-- Create index for uploaded_at queries (most recent files)
CREATE INDEX IF NOT EXISTS idx_uploaded_files_uploaded_at ON uploaded_files(uploaded_at DESC);

-- Add comments for documentation
COMMENT ON TABLE uploaded_files IS 'Stores metadata for files uploaded to Supabase Storage';
COMMENT ON COLUMN uploaded_files.id IS 'Unique identifier for the uploaded file';
COMMENT ON COLUMN uploaded_files.filename IS 'Original filename as provided by user';
COMMENT ON COLUMN uploaded_files.file_path IS 'Path in Supabase Storage bucket (uploaded-models/{uuid}/{filename})';
COMMENT ON COLUMN uploaded_files.file_size IS 'File size in bytes';
COMMENT ON COLUMN uploaded_files.mime_type IS 'Validated MIME type (model/stl or 3MF)';
COMMENT ON COLUMN uploaded_files.uploaded_at IS 'Timestamp when file was uploaded';
COMMENT ON COLUMN uploaded_files.status IS 'Processing status: uploaded, processing, completed, failed';
