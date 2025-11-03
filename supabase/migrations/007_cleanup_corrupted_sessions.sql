-- Migration: Cleanup corrupted sessions with filesystem paths
-- Description: Delete all sessions created before Storage upload fix
-- Created: 2025-11-02
--
-- PROBLEM: Old sessions have absolute filesystem paths in model_file_path
-- Example BAD path: C:\Users\dpmal\projects\slicercompare\b648a2d3-6788-472d-9222-b227b65e0b4e\Skull_1.stl
-- Example GOOD path: b648a2d3-6788-472d-9222-b227b65e0b4e/Skull_1.stl
--
-- This migration removes ALL old data to ensure a clean slate.

-- 1. Delete all results (dependent on configurations)
DELETE FROM results;

-- 2. Delete all configurations (dependent on sessions)
DELETE FROM configurations;

-- 3. Delete all comparison sessions
DELETE FROM comparison_sessions;

-- Verify cleanup
DO $$
BEGIN
  RAISE NOTICE 'Cleanup complete. Tables are now empty:';
  RAISE NOTICE '  results: % rows', (SELECT COUNT(*) FROM results);
  RAISE NOTICE '  configurations: % rows', (SELECT COUNT(*) FROM configurations);
  RAISE NOTICE '  comparison_sessions: % rows', (SELECT COUNT(*) FROM comparison_sessions);
END $$;
