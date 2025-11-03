-- Seed Data for SlicerCompare Development
-- Story: 1.4 - Configuration Data Model
-- Description: Creates test data for development and testing
-- Usage: psql -U postgres -d slicercompare < seed.sql
-- Note: This script requires a test user to exist in auth.users
--       For local development, create a test user through Supabase Auth UI first

-- Create a test user UUID (replace with actual test user ID in production)
-- This assumes you have a test user with this specific UUID
-- In local development, you'll need to replace this with your actual test user ID
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;

  session1_id UUID;
  session2_id UUID;
  session3_id UUID;

  config1_id UUID;
  config2_id UUID;
  config3_id UUID;
  config4_id UUID;
  config5_id UUID;
  config6_id UUID;
BEGIN
  -- Insert 3 test comparison sessions
  INSERT INTO comparison_sessions (session_id, user_id, session_name, status, created_at)
  VALUES
    (gen_random_uuid(), test_user_id, 'Calibration Cube Comparison', 'active', NOW() - INTERVAL '5 days'),
    (gen_random_uuid(), test_user_id, 'Phone Stand Speed Test', 'completed', NOW() - INTERVAL '10 days'),
    (gen_random_uuid(), test_user_id, 'Miniature Quality Tests', 'archived', NOW() - INTERVAL '30 days')
  RETURNING session_id INTO session1_id;

  -- Get session IDs for reference
  SELECT session_id INTO session1_id FROM comparison_sessions WHERE session_name = 'Calibration Cube Comparison';
  SELECT session_id INTO session2_id FROM comparison_sessions WHERE session_name = 'Phone Stand Speed Test';
  SELECT session_id INTO session3_id FROM comparison_sessions WHERE session_name = 'Miniature Quality Tests';

  -- Insert 6 configurations (2 per session)

  -- Session 1 configs: Different layer heights
  INSERT INTO configurations (config_id, session_id, config_name, parameters, is_active, created_at)
  VALUES (
    gen_random_uuid(),
    session1_id,
    'Standard Quality - 0.2mm',
    jsonb_build_object(
      'layer_height', 0.2,
      'infill_density', 20,
      'support_type', 'none',
      'printer_model', 'X1_Carbon',
      'print_speed', 100,
      'nozzle_temperature', 220,
      'bed_temperature', 60
    ),
    true,
    NOW() - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(),
    session1_id,
    'High Quality - 0.1mm',
    jsonb_build_object(
      'layer_height', 0.1,
      'infill_density', 30,
      'support_type', 'none',
      'printer_model', 'X1_Carbon',
      'print_speed', 80,
      'nozzle_temperature', 220,
      'bed_temperature', 60
    ),
    true,
    NOW() - INTERVAL '5 days'
  )
  RETURNING config_id INTO config1_id;

  -- Get config IDs
  SELECT config_id INTO config1_id FROM configurations WHERE session_id = session1_id AND config_name = 'Standard Quality - 0.2mm';
  SELECT config_id INTO config2_id FROM configurations WHERE session_id = session1_id AND config_name = 'High Quality - 0.1mm';

  -- Session 2 configs: Different support types
  INSERT INTO configurations (config_id, session_id, config_name, parameters, is_active, created_at)
  VALUES (
    gen_random_uuid(),
    session2_id,
    'Fast Print - Tree Supports',
    jsonb_build_object(
      'layer_height', 0.28,
      'infill_density', 15,
      'support_type', 'tree',
      'printer_model', 'P1P',
      'print_speed', 150,
      'nozzle_temperature', 200
    ),
    true,
    NOW() - INTERVAL '10 days'
  ),
  (
    gen_random_uuid(),
    session2_id,
    'Fast Print - Normal Supports',
    jsonb_build_object(
      'layer_height', 0.28,
      'infill_density', 15,
      'support_type', 'normal',
      'printer_model', 'P1P',
      'print_speed', 150,
      'nozzle_temperature', 200
    ),
    true,
    NOW() - INTERVAL '10 days'
  )
  RETURNING config_id INTO config3_id;

  SELECT config_id INTO config3_id FROM configurations WHERE session_id = session2_id AND config_name = 'Fast Print - Tree Supports';
  SELECT config_id INTO config4_id FROM configurations WHERE session_id = session2_id AND config_name = 'Fast Print - Normal Supports';

  -- Session 3 configs: Different infill densities
  INSERT INTO configurations (config_id, session_id, config_name, parameters, is_active, created_at)
  VALUES (
    gen_random_uuid(),
    session3_id,
    'Low Infill - 15%',
    jsonb_build_object(
      'layer_height', 0.16,
      'infill_density', 15,
      'support_type', 'tree',
      'printer_model', 'A1_Mini',
      'print_speed', 100
    ),
    true,
    NOW() - INTERVAL '30 days'
  ),
  (
    gen_random_uuid(),
    session3_id,
    'High Infill - 40%',
    jsonb_build_object(
      'layer_height', 0.16,
      'infill_density', 40,
      'support_type', 'tree',
      'printer_model', 'A1_Mini',
      'print_speed', 100
    ),
    true,
    NOW() - INTERVAL '30 days'
  )
  RETURNING config_id INTO config5_id;

  SELECT config_id INTO config5_id FROM configurations WHERE session_id = session3_id AND config_name = 'Low Infill - 15%';
  SELECT config_id INTO config6_id FROM configurations WHERE session_id = session3_id AND config_name = 'High Infill - 40%';

  -- Insert 10 results (distributed across configurations)

  -- Session 1 results (active session - some pending, some completed)
  INSERT INTO results (session_id, config_id, result_data, status, completed_at, created_at)
  VALUES
    -- Config 1 - completed
    (
      session1_id,
      config1_id,
      jsonb_build_object(
        'print_time_seconds', 1800,
        'filament_usage_grams', 8.5,
        'filament_usage_mm', 2834.5,
        'support_material_grams', 0,
        'layer_count', 100,
        'gcode_file_path', 'generated-gcode/' || session1_id || '/config1.gcode',
        'parsed_at', (NOW() - INTERVAL '4 days')::TEXT
      ),
      'completed',
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '5 days'
    ),
    -- Config 2 - completed
    (
      session1_id,
      config2_id,
      jsonb_build_object(
        'print_time_seconds', 3600,
        'filament_usage_grams', 9.2,
        'filament_usage_mm', 3067.0,
        'support_material_grams', 0,
        'layer_count', 200,
        'gcode_file_path', 'generated-gcode/' || session1_id || '/config2.gcode',
        'parsed_at', (NOW() - INTERVAL '4 days')::TEXT
      ),
      'completed',
      NOW() - INTERVAL '4 days',
      NOW() - INTERVAL '5 days'
    );

  -- Session 2 results (completed session - all completed)
  INSERT INTO results (session_id, config_id, result_data, status, completed_at, created_at)
  VALUES
    -- Config 3 - completed
    (
      session2_id,
      config3_id,
      jsonb_build_object(
        'print_time_seconds', 2400,
        'filament_usage_grams', 15.3,
        'filament_usage_mm', 5100.0,
        'support_material_grams', 2.8,
        'layer_count', 75,
        'gcode_file_path', 'generated-gcode/' || session2_id || '/config3.gcode',
        'parsed_at', (NOW() - INTERVAL '9 days')::TEXT,
        'model_height_mm', 21.0
      ),
      'completed',
      NOW() - INTERVAL '9 days',
      NOW() - INTERVAL '10 days'
    ),
    -- Config 4 - completed
    (
      session2_id,
      config4_id,
      jsonb_build_object(
        'print_time_seconds', 2700,
        'filament_usage_grams', 17.1,
        'filament_usage_mm', 5700.0,
        'support_material_grams', 4.5,
        'layer_count', 75,
        'gcode_file_path', 'generated-gcode/' || session2_id || '/config4.gcode',
        'parsed_at', (NOW() - INTERVAL '9 days')::TEXT,
        'model_height_mm', 21.0
      ),
      'completed',
      NOW() - INTERVAL '9 days',
      NOW() - INTERVAL '10 days'
    ),
    -- Additional result for config 3 (retry)
    (
      session2_id,
      config3_id,
      NULL,
      'failed',
      NULL,
      NOW() - INTERVAL '10 days'
    );

  -- Session 3 results (archived session - mixed statuses)
  INSERT INTO results (session_id, config_id, result_data, status, completed_at, error_message, created_at)
  VALUES
    -- Config 5 - completed
    (
      session3_id,
      config5_id,
      jsonb_build_object(
        'print_time_seconds', 5400,
        'filament_usage_grams', 6.8,
        'filament_usage_mm', 2267.0,
        'support_material_grams', 1.2,
        'layer_count', 156,
        'gcode_file_path', 'generated-gcode/' || session3_id || '/config5.gcode',
        'parsed_at', (NOW() - INTERVAL '29 days')::TEXT
      ),
      'completed',
      NOW() - INTERVAL '29 days',
      NULL,
      NOW() - INTERVAL '30 days'
    ),
    -- Config 6 - completed
    (
      session3_id,
      config6_id,
      jsonb_build_object(
        'print_time_seconds', 7200,
        'filament_usage_grams', 10.5,
        'filament_usage_mm', 3500.0,
        'support_material_grams', 2.1,
        'layer_count', 156,
        'gcode_file_path', 'generated-gcode/' || session3_id || '/config6.gcode',
        'parsed_at', (NOW() - INTERVAL '29 days')::TEXT
      ),
      'completed',
      NOW() - INTERVAL '29 days',
      NULL,
      NOW() - INTERVAL '30 days'
    ),
    -- Config 5 - failed (earlier attempt)
    (
      session3_id,
      config5_id,
      NULL,
      'failed',
      NULL,
      'CLI process timed out after 120 seconds',
      NOW() - INTERVAL '30 days'
    ),
    -- Config 6 - failed (earlier attempt)
    (
      session3_id,
      config6_id,
      NULL,
      'failed',
      NULL,
      'Invalid STL file: mesh is not manifold',
      NOW() - INTERVAL '30 days'
    ),
    -- Pending result for testing
    (
      session3_id,
      config5_id,
      NULL,
      'pending',
      NULL,
      NULL,
      NOW() - INTERVAL '2 hours'
    );

  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Created 3 sessions, 6 configurations, and 10 results';
  RAISE NOTICE 'Test user ID: %', test_user_id;
END $$;
