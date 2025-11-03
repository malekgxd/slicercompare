/**
 * Centralized Error Handling Middleware
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * Express middleware for consistent error responses following architecture.md patterns
 */

import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logger } from '../utils/logger';
import {
  translateCliError,
  translateDatabaseError,
  translateNetworkError,
  translateFilesystemError,
} from '../utils/error-translator';

/**
 * API Error Response Format
 * Following architecture.md Error Handling (lines 552-559)
 */
interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

/**
 * Custom error class with code and status
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Validation Error (400)
 */
export class ValidationError extends AppError {
  constructor(message: string, code: string = 'VALIDATION_ERROR', details?: string) {
    super(code, message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code: string = 'NOT_FOUND') {
    super(code, message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Determine HTTP status code from error
 */
function getStatusCode(error: any): number {
  // AppError or custom errors with statusCode
  if (error.statusCode) {
    return error.statusCode;
  }

  // Multer file size error
  if (error.code === 'LIMIT_FILE_SIZE') {
    return 413;
  }

  // Validation errors
  if (error.name === 'ValidationError' || error.code?.includes('INVALID_')) {
    return 400;
  }

  // Not found
  if (error.code === 'NOT_FOUND' || error.message?.includes('not found')) {
    return 404;
  }

  // Database/network errors that can't be processed
  if (error.code?.includes('DATABASE') || error.code?.includes('NETWORK')) {
    return 503; // Service Unavailable
  }

  // Default to 500
  return 500;
}

/**
 * Extract error code from error object
 */
function getErrorCode(error: any): string {
  // Explicit code
  if (error.code && typeof error.code === 'string') {
    return error.code;
  }

  // Error name as fallback
  if (error.name && error.name !== 'Error') {
    return error.name.replace(/Error$/, '').toUpperCase();
  }

  return 'UNKNOWN_ERROR';
}

/**
 * Central error handling middleware
 * Must be registered after all routes
 */
export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Don't handle if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = getStatusCode(err);
  let errorCode = getErrorCode(err);
  let message = err.message || 'An unexpected error occurred';
  let recoveryGuidance: string | undefined;

  // Translate specific error types
  if (err.code?.startsWith('CLI_') || err.message?.includes('bambu') || err.message?.includes('slic')) {
    const translation = translateCliError(err.stderr || err.message, err.exitCode);
    errorCode = translation.code;
    message = translation.message;
    recoveryGuidance = translation.recoveryGuidance;
  } else if (err.code?.includes('DATABASE') || err.message?.toLowerCase().includes('database')) {
    const translation = translateDatabaseError(err);
    errorCode = translation.code;
    message = translation.message;
    recoveryGuidance = translation.recoveryGuidance;
  } else if (
    err.code?.includes('NETWORK') ||
    err.code?.includes('ECONNREFUSED') ||
    err.code?.includes('ETIMEDOUT')
  ) {
    const translation = translateNetworkError(err);
    errorCode = translation.code;
    message = translation.message;
    recoveryGuidance = translation.recoveryGuidance;
  } else if (err.code?.includes('ENOENT') || err.code?.includes('EACCES') || err.code?.includes('ENOSPC')) {
    const translation = translateFilesystemError(err);
    errorCode = translation.code;
    message = translation.message;
    recoveryGuidance = translation.recoveryGuidance;
  }

  // Log the error with full details
  logger.error('api', message, {
    path: req.path,
    method: req.method,
    errorCode,
    statusCode,
    error: err,
    stack: err.stack,
  });

  // Build response
  const response: ApiErrorResponse = {
    error: {
      code: errorCode,
      message,
      // Include recovery guidance in message if available
      ...(recoveryGuidance && { message: `${message} ${recoveryGuidance}` }),
      // Include technical details in development only
      ...(process.env.NODE_ENV === 'development' && { details: err.stack }),
    },
  };

  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 * Register before error handler but after all routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  const response: ApiErrorResponse = {
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  };

  res.status(404).json(response);
}
