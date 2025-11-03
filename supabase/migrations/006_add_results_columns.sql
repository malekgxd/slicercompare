-- Migration: Add missing columns to results table
-- Description: Add configuration_id and filament_usage_grams columns
-- Created: 2025-11-02

-- Add configuration_id column (foreign key to configurations table)
ALTER TABLE results
ADD COLUMN IF NOT EXISTS configuration_id UUID REFERENCES configurations(config_id);

-- Add filament_usage_grams column (JSONB to store per-filament breakdown)
ALTER TABLE results
ADD COLUMN IF NOT EXISTS filament_usage_grams JSONB;

-- Add comments for documentation
COMMENT ON COLUMN results.configuration_id IS
  'Foreign key to the configuration that was sliced';

COMMENT ON COLUMN results.filament_usage_grams IS
  'JSON object containing filament usage breakdown by filament type';
