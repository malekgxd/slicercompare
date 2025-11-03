-- Migration: Create configurations table
-- Story: 1.4 - Configuration Data Model
-- Description: Slicer configurations to compare within sessions
-- Created: 2024-10-31

-- Create configurations table
CREATE TABLE configurations (
  config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES comparison_sessions(session_id) ON DELETE CASCADE,
  input_file_id UUID REFERENCES uploaded_files(id) ON DELETE SET NULL,
  config_name VARCHAR(255) NOT NULL,
  parameters JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure parameters is a JSON object, not array or primitive
  CONSTRAINT parameters_is_object CHECK (jsonb_typeof(parameters) = 'object')
);

-- Create indexes for faster queries
CREATE INDEX idx_configs_session_id ON configurations(session_id);
CREATE INDEX idx_configs_input_file_id ON configurations(input_file_id) WHERE input_file_id IS NOT NULL;

-- Create GIN index for JSONB parameter searches
CREATE INDEX idx_configs_parameters ON configurations USING GIN (parameters);

-- Enable Row Level Security
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view configurations in their own sessions
CREATE POLICY "Users can view configs in own sessions"
  ON configurations
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert configurations in their own sessions
CREATE POLICY "Users can create configs in own sessions"
  ON configurations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update configurations in their own sessions
CREATE POLICY "Users can update configs in own sessions"
  ON configurations
  FOR UPDATE
  TO authenticated
  USING (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can delete configurations in their own sessions
CREATE POLICY "Users can delete configs in own sessions"
  ON configurations
  FOR DELETE
  TO authenticated
  USING (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  );

-- Function to enforce maximum 3 active configurations per session
CREATE OR REPLACE FUNCTION check_max_active_configs()
RETURNS TRIGGER AS $$
DECLARE
  active_count INTEGER;
BEGIN
  -- Only check if the configuration is being set to active
  IF NEW.is_active = true THEN
    -- Count current active configurations for this session (excluding current record if UPDATE)
    SELECT COUNT(*)
    INTO active_count
    FROM configurations
    WHERE session_id = NEW.session_id
      AND is_active = true
      AND config_id != COALESCE(NEW.config_id, '00000000-0000-0000-0000-000000000000'::UUID);

    -- Enforce maximum of 3 active configurations
    IF active_count >= 3 THEN
      RAISE EXCEPTION 'Maximum of 3 active configurations per session exceeded. Please deactivate an existing configuration first.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce max active configurations on INSERT and UPDATE
CREATE TRIGGER enforce_max_active_configs
  BEFORE INSERT OR UPDATE ON configurations
  FOR EACH ROW
  EXECUTE FUNCTION check_max_active_configs();

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_configurations_updated_at
  BEFORE UPDATE ON configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments for documentation
COMMENT ON TABLE configurations IS 'Slicer configurations to compare within a session (max 3 active per session)';
COMMENT ON COLUMN configurations.config_id IS 'Unique identifier for the configuration';
COMMENT ON COLUMN configurations.session_id IS 'Reference to the parent comparison session';
COMMENT ON COLUMN configurations.input_file_id IS 'Reference to the uploaded STL/3MF file (nullable if file deleted)';
COMMENT ON COLUMN configurations.config_name IS 'User-provided name for this configuration (e.g., "Fast Print", "High Quality")';
COMMENT ON COLUMN configurations.parameters IS 'JSONB object containing slicer parameters (layer_height, infill_density, etc.)';
COMMENT ON COLUMN configurations.is_active IS 'Whether this configuration is active (max 3 active per session)';
COMMENT ON COLUMN configurations.created_at IS 'Timestamp when the configuration was created';
COMMENT ON COLUMN configurations.updated_at IS 'Timestamp when the configuration was last modified';
