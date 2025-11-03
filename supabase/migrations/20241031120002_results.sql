-- Migration: Create results table
-- Story: 1.4 - Configuration Data Model
-- Description: Slicing operation results and metrics
-- Created: 2024-10-31

-- Create results table
CREATE TABLE results (
  result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES comparison_sessions(session_id) ON DELETE CASCADE,
  config_id UUID REFERENCES configurations(config_id) ON DELETE SET NULL,
  result_data JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Status must be one of the allowed values
  CONSTRAINT valid_result_status CHECK (status IN ('pending', 'processing', 'completed', 'failed')),

  -- Ensure result_data is a JSON object when not null
  CONSTRAINT result_data_is_object CHECK (result_data IS NULL OR jsonb_typeof(result_data) = 'object'),

  -- Completed results must have completion timestamp
  CONSTRAINT completed_results_have_timestamp CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status != 'completed')
  ),

  -- Failed results should have error message
  CONSTRAINT failed_results_have_error CHECK (
    (status = 'failed' AND error_message IS NOT NULL) OR
    (status != 'failed')
  )
);

-- Create indexes for faster queries
CREATE INDEX idx_results_session_id ON results(session_id);
CREATE INDEX idx_results_config_id ON results(config_id) WHERE config_id IS NOT NULL;
CREATE INDEX idx_results_status ON results(status);

-- Compound index for common query pattern (session + status filter)
CREATE INDEX idx_results_session_status ON results(session_id, status);

-- Create GIN index for JSONB result data searches
CREATE INDEX idx_results_data ON results USING GIN (result_data);

-- Enable Row Level Security
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view results in their own sessions
CREATE POLICY "Users can view results in own sessions"
  ON results
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can insert results in their own sessions
CREATE POLICY "Users can create results in own sessions"
  ON results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update results in their own sessions
CREATE POLICY "Users can update results in own sessions"
  ON results
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

-- RLS Policy: Users can delete results in their own sessions
CREATE POLICY "Users can delete results in own sessions"
  ON results
  FOR DELETE
  TO authenticated
  USING (
    session_id IN (
      SELECT session_id FROM comparison_sessions
      WHERE user_id = auth.uid()
    )
  );

-- Function to automatically set completed_at when status changes to completed
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being set to 'completed' and completed_at is null, set it
  IF NEW.status = 'completed' AND NEW.completed_at IS NULL THEN
    NEW.completed_at = NOW();
  END IF;

  -- If status is being changed from 'completed' to something else, clear completed_at
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically manage completed_at timestamp
CREATE TRIGGER manage_result_completed_at
  BEFORE INSERT OR UPDATE ON results
  FOR EACH ROW
  EXECUTE FUNCTION set_completed_at();

-- Add helpful comments for documentation
COMMENT ON TABLE results IS 'Slicing operation results and extracted metrics from G-code files';
COMMENT ON COLUMN results.result_id IS 'Unique identifier for the result';
COMMENT ON COLUMN results.session_id IS 'Reference to the parent comparison session';
COMMENT ON COLUMN results.config_id IS 'Reference to the configuration that generated this result (nullable if config deleted)';
COMMENT ON COLUMN results.result_data IS 'JSONB object containing parsed metrics (print_time, filament_usage, etc.)';
COMMENT ON COLUMN results.status IS 'Result processing status: pending, processing, completed, or failed';
COMMENT ON COLUMN results.completed_at IS 'Timestamp when slicing and parsing completed successfully';
COMMENT ON COLUMN results.error_message IS 'Error message if slicing or parsing failed';
COMMENT ON COLUMN results.created_at IS 'Timestamp when the result record was created';
