/**
 * Download Routes
 * Story 1.9: G-code Download Feature
 *
 * Provides secure file download for generated G-code files.
 * Following architecture.md file serving best practices.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * Download G-code file for a configuration
 *
 * GET /api/download/:sessionId/:configId
 *
 * Security:
 * - Validates session ownership
 * - Never exposes absolute file paths
 * - Sanitizes filenames
 *
 * @example
 * GET /api/download/session-uuid-123/config-uuid-456
 * Response: G-code file with Content-Disposition header
 */
router.get('/:sessionId/:configId', async (req: Request, res: Response) => {
  const { sessionId, configId } = req.params;

  logger.info('download', 'Download request received', {
    sessionId,
    configId
  });

  try {
    // Fetch configuration with session info
    const { data: config, error: configError } = await supabase
      .from('configurations')
      .select(`
        config_id,
        config_name,
        gcode_file_path,
        processing_status,
        comparison_sessions!inner (
          session_id,
          model_file_name
        )
      `)
      .eq('config_id', configId)
      .eq('comparison_sessions.session_id', sessionId)
      .single();

    if (configError || !config) {
      logger.error('download', 'Configuration not found', {
        sessionId,
        configId,
        error: configError
      });
      return res.status(404).json({
        error: 'Configuration not found'
      });
    }

    // Verify configuration is complete
    if (config.processing_status !== 'complete') {
      logger.warn('download', 'Configuration not complete', {
        configId,
        status: config.processing_status
      });
      return res.status(400).json({
        error: 'Configuration processing not complete',
        status: config.processing_status
      });
    }

    // Verify G-code file path exists
    if (!config.gcode_file_path) {
      logger.error('download', 'G-code file path missing', { configId });
      return res.status(404).json({
        error: 'G-code file not available'
      });
    }

    // Resolve absolute file path
    const gcodeFilePath = path.resolve(config.gcode_file_path);

    // Verify file exists
    try {
      await fs.access(gcodeFilePath);
    } catch (err) {
      logger.error('download', 'G-code file not found on filesystem', {
        configId,
        filePath: gcodeFilePath,
        error: err
      });
      return res.status(404).json({
        error: 'G-code file not found'
      });
    }

    // Build filename following pattern: {ConfigName}_{OriginalFilename}.gcode
    const session = (config as any).comparison_sessions;
    const configNameSanitized = config.config_name.replace(/[^a-zA-Z0-9-_]/g, '_');
    const originalName = session.model_file_name
      ? session.model_file_name.replace('.3mf', '').replace('.stl', '')
      : 'model';
    const downloadFilename = `${configNameSanitized}_${originalName}.gcode`;

    logger.info('download', 'Sending file', {
      configId,
      filename: downloadFilename,
      filePath: gcodeFilePath
    });

    // Set headers for download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Stream file to client
    res.sendFile(gcodeFilePath, (err) => {
      if (err) {
        logger.error('download', 'Error streaming file', {
          configId,
          error: err
        });
        if (!res.headersSent) {
          res.status(500).json({
            error: 'Failed to download file'
          });
        }
      } else {
        logger.info('download', 'File download complete', {
          configId,
          filename: downloadFilename
        });
      }
    });
  } catch (error: any) {
    logger.error('download', 'Unexpected error during download', {
      sessionId,
      configId,
      error: error.message,
      stack: error.stack
    });

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }
});

export default router;
