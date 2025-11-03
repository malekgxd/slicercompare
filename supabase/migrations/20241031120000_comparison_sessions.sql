-- Migration: Create comparison_sessions table
-- Story: 1.4 - Configuration Data Model
-- Description: User comparison projects/sessions table
-- Created: 2024-10-31

-- Create comparison_sessions table
CREATE TABLE comparison_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Status must be one of the allowed values
  CONSTRAINT valid_session_status CHECK (status IN ('active', 'completed', 'archived'))
);

-- Create indexes for faster queries
CREATE INDEX idx_sessions_user_id ON comparison_sessions(user_id);
CREATE INDEX idx_sessions_status ON comparison_sessions(status);
CREATE INDEX idx_sessions_created_at ON comparison_sessions(created_at DESC);

-- Add compound index for common query pattern (user + status filter)
CREATE INDEX idx_sessions_user_status ON comparison_sessions(user_id, status);

-- Enable Row Level Security
ALTER TABLE comparison_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON comparison_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own sessions
CREATE POLICY "Users can create own sessions"
  ON comparison_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own sessions
CREATE POLICY "Users can update own sessions"
  ON comparison_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
  ON comparison_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update function on UPDATE
CREATE TRIGGER update_comparison_sessions_updated_at
  BEFORE UPDATE ON comparison_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments for documentation
COMMENT ON TABLE comparison_sessions IS 'User comparison projects/sessions for storing slicer configuration comparisons';
COMMENT ON COLUMN comparison_sessions.session_id IS 'Unique identifier for the comparison session';
COMMENT ON COLUMN comparison_sessions.user_id IS 'Reference to the user who owns this session';
COMMENT ON COLUMN comparison_sessions.session_name IS 'Optional user-provided name for the session';
COMMENT ON COLUMN comparison_sessions.status IS 'Session lifecycle status: active, completed, or archived';
COMMENT ON COLUMN comparison_sessions.created_at IS 'Timestamp when the session was created';
COMMENT ON COLUMN comparison_sessions.updated_at IS 'Timestamp when the session was last modified';
