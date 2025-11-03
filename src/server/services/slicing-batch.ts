/**
 * Batch Slicing Orchestration Service
 * Story 1.6: Batch Slicing Engine
 *
 * Orchestrates batch processing of multiple configurations with concurrency control.
 * Following architecture.md Concurrent Processing Pattern (lines 307-375) and ADR-005.
 */

import pLimit from 'p-limit';
import path from 'path';
import { promises as fs } from 'fs';
import { invokeBambuSlicer, type BambuCliOptions } from './bambu-cli';
import { parseGcodeWithFallback, type ParsedMetrics } from './gcode-parser';
import { supabase } from './supabase';
import { logger } from '../utils/logger';
import type { Configuration, ConfigurationParameters } from '../../../types/database.js';

// ADR-005: Limit concurrent CLI processes to 3
const CONCURRENCY_LIMIT = 3;

export interface BatchSlicingProgress {
  sessionId: string;
  totalConfigurations: number;
  completedCount: number;
  failedCount: number;
  inProgressCount: number;
}

/**
 * Save parsed metrics to results table
 * Story 1.7: Results Parser & Storage
 *
 * Uses correct schema: session_id, config_id, result_data (JSONB), status, error_message
 */
async function saveResults(
  sessionId: string,
  configurationId: string,
  metrics: ParsedMetrics,
  gcodeFilePath: string,
  parsingError?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('results')
      .insert({
        session_id: sessionId,
        configuration_id: configurationId,  // Use configuration_id (added in migration 006)
        result_data: {  // Store metrics in JSONB for backwards compatibility
          printTimeMinutes: metrics.printTimeMinutes,
          filamentUsageGrams: metrics.filamentUsageGrams,
          supportMaterialGrams: metrics.supportMaterialGrams,
          gcodeFilePath,
          parsedAt: new Date().toISOString()
        },
        // Flat columns for easier querying (added in migration 008)
        print_time_minutes: metrics.printTimeMinutes,
        filament_usage_grams: metrics.filamentUsageGrams,
        support_material_grams: metrics.supportMaterialGrams,
        parsing_error: parsingError || null,
        status: parsingError ? 'failed' : 'completed',
        error_message: parsingError || null
      });

    if (error) {
      logger.error('results', 'Failed to save results to database', {
        sessionId,
        configurationId,
        error: error.message
      });
      throw error;
    }

    logger.info('results', 'Results saved successfully', {
      sessionId,
      configurationId,
      printTime: metrics.printTimeMinutes,
      filament: metrics.filamentUsageGrams.total,
      support: metrics.supportMaterialGrams
    });
  } catch (error: any) {
    logger.error('results', 'Error saving results', {
      sessionId,
      configurationId,
      error: error.message
    });
    throw error;
  }
}

/**
 * Batch slice all configurations for a session
 *
 * RESILIENCE: Individual failures don't stop other configurations
 * PATTERN: Promise.allSettled (not Promise.all) for resilience
 * CONCURRENCY: Limited to 3 parallel processes via p-limit (ADR-005)
 */
export async function batchSliceConfigurations(
  sessionId: string,
  configurations: Configuration[]
): Promise<BatchSlicingProgress> {
  logger.info('slicing', 'Batch slicing started', {
    sessionId,
    configCount: configurations.length
  });

  // Get session details for input file
  const { data: session, error: sessionError } = await supabase
    .from('comparison_sessions')
    .select('model_file_path')
    .eq('session_id', sessionId)
    .single();

  if (sessionError || !session) {
    logger.error('slicing', 'Session not found', { sessionId, error: sessionError });
    throw new Error('Session not found');
  }

  const storagePath = session.model_file_path;
  if (!storagePath) {
    logger.error('slicing', 'No file uploaded for session', { sessionId });
    throw new Error('No file uploaded for session');
  }

  // Download file from Supabase Storage to local temp directory
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('uploaded-models')
    .download(storagePath);

  if (downloadError || !fileData) {
    logger.error('slicing', 'Failed to download file from storage', {
      sessionId,
      storagePath,
      error: downloadError
    });
    throw new Error(`Failed to download file: ${downloadError?.message || 'Unknown error'}`);
  }

  // Save to local temp file
  const tempDir = path.join(process.cwd(), 'storage', 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  const fileName = path.basename(storagePath);
  const localFilePath = path.join(tempDir, `${sessionId}-${fileName}`);

  // Write blob to file
  const buffer = Buffer.from(await fileData.arrayBuffer());
  await fs.writeFile(localFilePath, buffer);

  logger.info('slicing', 'File downloaded from storage', {
    sessionId,
    storagePath,
    localPath: localFilePath,
    fileSize: buffer.length
  });

  const inputFilePath = localFilePath;

  // Create concurrency limiter (ADR-005: 3 parallel processes)
  const limit = pLimit(CONCURRENCY_LIMIT);

  let completedCount = 0;
  let failedCount = 0;

  // Create slicing tasks
  const slicingTasks = configurations.map(config =>
    limit(async () => {
      try {
        logger.info('cli', 'Starting configuration slicing', {
          configId: config.config_id,
          configName: config.config_name
        });

        // Update status to 'slicing'
        await supabase
          .from('configurations')
          .update({ processing_status: 'slicing', updated_at: new Date().toISOString() })
          .eq('config_id', config.config_id);

        // Parse configuration parameters
        const params = config.parameters as unknown as ConfigurationParameters;

        // Build CLI options
        const cliOptions: BambuCliOptions = {
          inputFile: inputFilePath,
          outputFile: path.join(process.cwd(), 'storage', 'gcode', sessionId, `${config.config_id}.gcode`),

          // Printer configuration
          printerModel: params.printer_model,

          // Quality settings
          layerHeight: params.layer_height,
          initialLayerHeight: params.initial_layer_height || params.layer_height, // Default to layer_height
          wallLoops: params.wall_loops || 3,
          topShellLayers: params.top_shell_layers || 4,
          bottomShellLayers: params.bottom_shell_layers || 3,

          // Infill settings
          infillDensity: params.infill_density,
          infillPattern: params.infill_pattern || 'grid',

          // Support settings
          enableSupport: params.support_type !== 'none',
          supportType: params.support_type === 'tree' ? 'tree' : 'normal',
          supportThresholdAngle: params.support_threshold_angle || 45,

          // Speed settings
          outerWallSpeed: params.outer_wall_speed || 80,
          innerWallSpeed: params.inner_wall_speed || 120,
          sparseInfillSpeed: params.sparse_infill_speed || 150,
          initialLayerSpeed: params.initial_layer_speed || 50,

          // Temperature settings
          nozzleTemperature: params.nozzle_temperature || 220, // Default PLA temp
          bedTemperature: params.bed_temperature || 60 // Default PLA bed temp
        };

        // Invoke CLI
        const result = await invokeBambuSlicer(cliOptions, config.config_id);

        if (result.success) {
          // Story 1.7: Parse G-code and save results
          const parseResult = await parseGcodeWithFallback(result.gcodeFile!);

          // Save results to database (with or without parsing error)
          await saveResults(
            sessionId,  // Added: session_id is required!
            config.config_id,
            parseResult.metrics,
            result.gcodeFile!,
            parseResult.error
          );

          // Store G-code file path in configuration
          await supabase
            .from('configurations')
            .update({
              gcode_file_path: result.gcodeFile,
              processing_status: 'complete',
              updated_at: new Date().toISOString()
            })
            .eq('config_id', config.config_id);

          completedCount++;
          logger.info('cli', 'Configuration slicing completed', {
            configId: config.config_id,
            duration: result.duration,
            gcodeFile: result.gcodeFile,
            parseSuccess: !parseResult.error,
            printTime: parseResult.metrics.printTimeMinutes
          });
        } else {
          // Mark configuration as failed
          await supabase
            .from('configurations')
            .update({
              processing_status: 'failed',
              error_message: result.error,
              updated_at: new Date().toISOString()
            })
            .eq('config_id', config.config_id);

          failedCount++;
          logger.error('cli', 'Configuration slicing failed', {
            configId: config.config_id,
            error: result.error,
            errorCode: result.errorCode
          });
        }
      } catch (error: any) {
        // Unexpected error during orchestration
        logger.error('slicing', 'Unexpected error during slicing', {
          configId: config.config_id,
          error: error.message,
          stack: error.stack
        });

        // Mark as failed
        await supabase
          .from('configurations')
          .update({
            processing_status: 'failed',
            error_message: 'Unexpected error: ' + error.message,
            updated_at: new Date().toISOString()
          })
          .eq('config_id', config.config_id);

        failedCount++;
      }
    })
  );

  // Wait for all to complete (failures don't block others)
  await Promise.allSettled(slicingTasks);

  // Update session status
  const finalStatus = failedCount === configurations.length ? 'failed' : 'completed';
  await supabase
    .from('comparison_sessions')
    .update({
      status: finalStatus,
      updated_at: new Date().toISOString()
    })
    .eq('session_id', sessionId);

  logger.info('slicing', 'Batch slicing completed', {
    sessionId,
    totalCount: configurations.length,
    completedCount,
    failedCount,
    finalStatus
  });

  return {
    sessionId,
    totalConfigurations: configurations.length,
    completedCount,
    failedCount,
    inProgressCount: 0
  };
}

/**
 * Get slicing status for a session
 * Used by polling endpoint (GET /api/sessions/:id/status)
 */
export async function getSlicingStatus(sessionId: string) {
  // Query session and configurations in single query
  const { data: session, error: sessionError } = await supabase
    .from('comparison_sessions')
    .select(`
      session_id,
      session_name,
      status,
      configurations (
        config_id,
        config_name,
        processing_status,
        error_message
      )
    `)
    .eq('session_id', sessionId)
    .single();

  if (sessionError || !session) {
    logger.error('slicing', 'Session not found for status check', { sessionId, error: sessionError });
    return null;
  }

  const configurations = (session as any).configurations as Array<{
    config_id: string;
    config_name: string;
    processing_status: string;
    error_message: string | null;
  }>;

  const completedCount = configurations.filter(c => c.processing_status === 'complete').length;
  const failedCount = configurations.filter(c => c.processing_status === 'failed').length;
  const inProgressCount = configurations.filter(c => c.processing_status === 'slicing').length;
  const allComplete = completedCount + failedCount === configurations.length;

  return {
    sessionId: session.session_id,
    sessionStatus: session.status,
    configurations: configurations.map(c => ({
      id: c.config_id,
      name: c.config_name,
      status: c.processing_status,
      error: c.error_message || undefined
    })),
    allComplete,
    completedCount,
    failedCount,
    totalCount: configurations.length,
    inProgressCount
  };
}
