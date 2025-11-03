/**
 * Structured Logging Utility
 * Following architecture.md Logging Strategy (lines 629-682)
 * Enhanced in Story 2.3 with error categorization and stack traces
 *
 * Provides consistent logging across all server services with structured JSON output
 */

type LogLevel = 'info' | 'warn' | 'error';

type ErrorCategory = 'upload' | 'processing' | 'system' | 'network' | 'database' | 'validation' | 'unknown';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  metadata?: any;
}

interface ErrorLogEntry extends LogEntry {
  category?: ErrorCategory;
  stack?: string;
  errorCode?: string;
}

/**
 * Sensitive field patterns to filter from logs
 */
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /api[_-]?key/i,
  /auth/i,
  /bearer/i,
];

/**
 * Filter sensitive information from metadata
 */
function filterSensitiveData(metadata: any): any {
  if (!metadata || typeof metadata !== 'object') {
    return metadata;
  }

  const filtered = { ...metadata };

  for (const key in filtered) {
    // Check if key matches sensitive patterns
    if (SENSITIVE_PATTERNS.some(pattern => pattern.test(key))) {
      filtered[key] = '[REDACTED]';
      continue;
    }

    // Recursively filter nested objects
    if (typeof filtered[key] === 'object' && filtered[key] !== null) {
      filtered[key] = filterSensitiveData(filtered[key]);
    }
  }

  return filtered;
}

/**
 * Determine error category from context and error details
 */
function categorizeError(context: string, error?: any): ErrorCategory {
  const contextLower = context.toLowerCase();
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorCode = error?.code?.toLowerCase() || '';

  // Upload errors
  if (contextLower.includes('upload') || errorCode.includes('invalid_file') || errorCode.includes('file_too_large')) {
    return 'upload';
  }

  // Processing errors (CLI, slicing, parsing)
  if (
    contextLower.includes('slicing') ||
    contextLower.includes('cli') ||
    contextLower.includes('parsing') ||
    errorCode.includes('cli_')
  ) {
    return 'processing';
  }

  // Network errors
  if (
    errorCode.includes('econnrefused') ||
    errorCode.includes('etimedout') ||
    errorCode.includes('network') ||
    errorMessage.includes('network')
  ) {
    return 'network';
  }

  // Database errors
  if (
    contextLower.includes('database') ||
    contextLower.includes('supabase') ||
    errorCode.includes('database') ||
    errorMessage.includes('database')
  ) {
    return 'database';
  }

  // Validation errors
  if (
    contextLower.includes('validation') ||
    errorCode.includes('invalid_') ||
    errorCode.includes('validation')
  ) {
    return 'validation';
  }

  // System errors
  if (
    errorCode.includes('enoent') ||
    errorCode.includes('eacces') ||
    errorCode.includes('enospc') ||
    errorMessage.includes('system')
  ) {
    return 'system';
  }

  return 'unknown';
}

class Logger {
  private log(level: LogLevel, context: string, message: string, metadata?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata: metadata ? filterSensitiveData(metadata) : undefined
    };

    // In development, use pretty-printed JSON for readability
    if (process.env.NODE_ENV === 'development') {
      const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m';
      const reset = '\x1b[0m';
      console[level === 'error' ? 'error' : 'log'](
        `${color}[${entry.level.toUpperCase()}]${reset} ${entry.context} - ${entry.message}`,
        metadata ? JSON.stringify(filterSensitiveData(metadata), null, 2) : ''
      );
    } else {
      // In production, use compact JSON for log aggregation
      console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry));
    }
  }

  info(context: string, message: string, metadata?: any) {
    this.log('info', context, message, metadata);
  }

  warn(context: string, message: string, metadata?: any) {
    this.log('warn', context, message, metadata);
  }

  /**
   * Enhanced error logging with categorization and stack traces
   * Story 2.3: Added error categorization, stack trace capture, and sensitive data filtering
   */
  error(context: string, message: string, metadata?: any) {
    const category = categorizeError(context, metadata?.error || metadata);
    const stack = metadata?.error?.stack || (new Error()).stack;

    const errorEntry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      context,
      message,
      category,
      errorCode: metadata?.error?.code || metadata?.errorCode,
      stack,
      metadata: metadata ? filterSensitiveData(metadata) : undefined
    };

    // In development, use pretty-printed output with stack trace
    if (process.env.NODE_ENV === 'development') {
      const color = '\x1b[31m';
      const reset = '\x1b[0m';
      console.error(
        `${color}[ERROR:${category.toUpperCase()}]${reset} ${errorEntry.context} - ${errorEntry.message}`,
        metadata ? JSON.stringify(filterSensitiveData(metadata), null, 2) : '',
        stack ? `\n${stack}` : ''
      );
    } else {
      // In production, use compact JSON for log aggregation
      console.error(JSON.stringify(errorEntry));
    }
  }
}

export const logger = new Logger();
