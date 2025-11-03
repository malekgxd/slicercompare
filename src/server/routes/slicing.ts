/**
 * Slicing API Routes
 * Story 1.6: Batch Slicing Engine
 *
 * Endpoints:
 * - POST /api/sessions/:id/slice - Start batch slicing
 * - GET /api/sessions/:id/status - Get slicing status (polling)
 */

import express, { type Request, type Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { batchSliceConfigurations, getSlicingStatus } from '../services/slicing-batch';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';
import type { Configuration } from '../../../types/database.js';

const router = express.Router();

/**
 * POST /api/sessions/:id/slice
 *
 * Start batch slicing for all configurations in a session
 *
 * Returns 202 Accepted immediately, processing happens in background
 * Frontend polls GET /api/sessions/:id/status for progress
 */
router.post('/sessions/:id/slice', async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  try {
    logger.info('api', 'Batch slicing requested', { sessionId });

    // 1. Validate session exists
    const { data: session, error: sessionError } = await supabase
      .from('comparison_sessions')
      .select('session_id, session_name, model_file_path, status')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !session) {
      logger.warn('api', 'Session not found', { sessionId });
      return res.status(404).json({
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found'
        }
      });
    }

    // 2. Check if file uploaded
    if (!session.model_file_path) {
      logger.warn('api', 'No file uploaded for session', { sessionId });
      return res.status(400).json({
        error: {
          code: 'NO_FILE_UPLOADED',
          message: 'No file uploaded for this session. Please upload a file first.'
        }
      });
    }

    // 3. Get configurations for session
    const { data: configurations, error: configError } = await supabase
      .from('configurations')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_active', true);

    if (configError) {
      logger.error('api', 'Failed to fetch configurations', { sessionId, error: configError });
      return res.status(500).json({
        error: {
          code: 'DATABASE_ERROR',
          message: 'Failed to fetch configurations'
        }
      });
    }

    // 4. Validate at least 2 configurations
    if (!configurations || configurations.length < 2) {
      logger.warn('api', 'Insufficient configurations', { sessionId, count: configurations?.length || 0 });
      return res.status(400).json({
        error: {
          code: 'INSUFFICIENT_CONFIGURATIONS',
          message: 'At least 2 configurations required to start slicing. Please add more configurations.'
        }
      });
    }

    // 5. Check if already processing
    if (session.status === 'processing') {
      logger.warn('api', 'Session already processing', { sessionId });
      return res.status(400).json({
        error: {
          code: 'ALREADY_PROCESSING',
          message: 'This session is already being processed'
        }
      });
    }

    // 6. Create storage directory for this session
    const gcodeDir = path.join(process.cwd(), 'storage', 'gcode', sessionId);
    try {
      await fs.mkdir(gcodeDir, { recursive: true });
      logger.info('api', 'G-code directory created', { gcodeDir });
    } catch (error: any) {
      logger.error('api', 'Failed to create G-code directory', { gcodeDir, error: error.message });
      return res.status(500).json({
        error: {
          code: 'FILESYSTEM_ERROR',
          message: 'Failed to create output directory'
        }
      });
    }

    // 7. Update session status to 'processing'
    await supabase
      .from('comparison_sessions')
      .update({ status: 'processing', updated_at: new Date().toISOString() })
      .eq('session_id', sessionId);

    // 8. Start batch slicing (fire-and-forget)
    // Don't await - let it run in background
    batchSliceConfigurations(sessionId, configurations as Configuration[])
      .catch(error => {
        logger.error('api', 'Batch slicing failed catastrophically', {
          sessionId,
          error: error.message,
          stack: error.stack
        });
      });

    // 9. Return 202 Accepted immediately
    logger.info('api', 'Batch slicing started', { sessionId, configCount: configurations.length });
    res.status(202).json({
      message: 'Batch slicing started',
      sessionId,
      configurations: configurations.map(c => ({
        id: c.config_id,
        name: c.config_name,
        status: 'queued'
      }))
    });
  } catch (error: any) {
    logger.error('api', 'Unexpected error in slice endpoint', {
      sessionId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
});

/**
 * GET /api/sessions/:id/status
 *
 * Get slicing status for a session (polling endpoint)
 *
 * Frontend calls this every 2 seconds (ADR-004)
 * Returns current status of all configurations
 */
router.get('/sessions/:id/status', async (req: Request, res: Response) => {
  const sessionId = req.params.id;

  try {
    const status = await getSlicingStatus(sessionId);

    if (!status) {
      return res.status(404).json({
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found'
        }
      });
    }

    res.status(200).json(status);
  } catch (error: any) {
    logger.error('api', 'Error fetching slicing status', {
      sessionId,
      error: error.message
    });
    res.status(500).json({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch slicing status'
      }
    });
  }
});

export default router;
