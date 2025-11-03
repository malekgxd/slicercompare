/**
 * Error Translator Utility
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * Translates technical errors (CLI, database, network) into user-friendly
 * messages with actionable recovery guidance.
 */

export interface ErrorTranslation {
  code: string;
  message: string;
  recoveryGuidance?: string;
}

/**
 * Translate CLI errors to user-friendly messages
 */
export function translateCliError(stderr: string, exitCode?: number): ErrorTranslation {
  const stderrLower = stderr.toLowerCase();

  // CLI not found
  if (stderrLower.includes('enoent') || stderrLower.includes('command not found')) {
    return {
      code: 'CLI_NOT_FOUND',
      message: 'Bambu Slicer not found on your system.',
      recoveryGuidance: 'Please install Bambu Studio from: https://bambulab.com/en/download/studio',
    };
  }

  // Permission denied
  if (stderrLower.includes('eacces') || stderrLower.includes('permission denied')) {
    return {
      code: 'CLI_PERMISSION_DENIED',
      message: 'Permission denied when running Bambu Slicer.',
      recoveryGuidance: 'Check file permissions or run with appropriate privileges.',
    };
  }

  // Timeout
  if (!stderr && exitCode === undefined) {
    return {
      code: 'CLI_TIMEOUT',
      message: 'Slicing operation timed out after 5 minutes.',
      recoveryGuidance: 'Try reducing the number of configurations or simplifying the model. Check system resources.',
    };
  }

  // Invalid model file
  if (stderrLower.includes('invalid') && (stderrLower.includes('stl') || stderrLower.includes('3mf'))) {
    return {
      code: 'INVALID_MODEL_FILE',
      message: 'Invalid or corrupted model file.',
      recoveryGuidance: 'Verify the file is a valid STL or 3MF file and try re-exporting from your 3D modeling software.',
    };
  }

  // Settings file error
  if (stderrLower.includes('settings') || stderrLower.includes('json')) {
    return {
      code: 'INVALID_SETTINGS',
      message: 'Invalid slicer settings provided.',
      recoveryGuidance: 'Check parameter values are within valid ranges. Contact support if issue persists.',
    };
  }

  // Out of memory
  if (stderrLower.includes('memory') || stderrLower.includes('oom')) {
    return {
      code: 'CLI_OUT_OF_MEMORY',
      message: 'Insufficient memory to complete slicing.',
      recoveryGuidance: 'Close other applications or try with a simpler model. Consider upgrading system RAM.',
    };
  }

  // Generic CLI failure with exit code
  if (exitCode !== undefined && exitCode !== 0) {
    return {
      code: 'CLI_FAILED',
      message: `Bambu Slicer exited with error code ${exitCode}.`,
      recoveryGuidance: 'Check slicer logs for details. Try with default settings or contact support.',
    };
  }

  // Unknown error
  return {
    code: 'CLI_UNKNOWN_ERROR',
    message: 'An unexpected error occurred during slicing.',
    recoveryGuidance: 'Please try again. If the problem persists, contact support with the error details.',
  };
}

/**
 * Translate database errors to user-friendly messages
 */
export function translateDatabaseError(error: any): ErrorTranslation {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code || '';

  // Connection errors
  if (
    message.includes('connection') ||
    message.includes('connect') ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT'
  ) {
    return {
      code: 'DATABASE_CONNECTION_ERROR',
      message: 'Unable to connect to database.',
      recoveryGuidance: 'Check your internet connection and database configuration. Try again in a moment.',
    };
  }

  // Timeout
  if (message.includes('timeout') || code === 'TIMEOUT') {
    return {
      code: 'DATABASE_TIMEOUT',
      message: 'Database operation timed out.',
      recoveryGuidance: 'The server may be slow or overloaded. Please try again.',
    };
  }

  // Constraint violations
  if (message.includes('unique') || message.includes('duplicate') || code === '23505') {
    return {
      code: 'DATABASE_DUPLICATE',
      message: 'This record already exists.',
      recoveryGuidance: 'Check if you already created this item. Try a different name or identifier.',
    };
  }

  // Foreign key violations
  if (message.includes('foreign key') || code === '23503') {
    return {
      code: 'DATABASE_REFERENCE_ERROR',
      message: 'Referenced record not found.',
      recoveryGuidance: 'The related item may have been deleted. Please refresh and try again.',
    };
  }

  // Not found
  if (message.includes('not found') || message.includes('no rows')) {
    return {
      code: 'DATABASE_NOT_FOUND',
      message: 'Requested record not found.',
      recoveryGuidance: 'The item may have been deleted. Please refresh the page.',
    };
  }

  // Generic database error
  return {
    code: 'DATABASE_ERROR',
    message: 'A database error occurred.',
    recoveryGuidance: 'Please try again. Contact support if the problem continues.',
  };
}

/**
 * Translate network errors to user-friendly messages
 */
export function translateNetworkError(error: any): ErrorTranslation {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code || '';

  // Network unreachable
  if (
    code === 'ENETUNREACH' ||
    code === 'EHOSTUNREACH' ||
    message.includes('network') ||
    message.includes('unreachable')
  ) {
    return {
      code: 'NETWORK_UNREACHABLE',
      message: 'Network is unreachable.',
      recoveryGuidance: 'Check your internet connection and try again.',
    };
  }

  // Connection refused
  if (code === 'ECONNREFUSED' || message.includes('connection refused')) {
    return {
      code: 'NETWORK_CONNECTION_REFUSED',
      message: 'Connection refused by server.',
      recoveryGuidance: 'The server may be down or unreachable. Please try again later.',
    };
  }

  // Timeout
  if (code === 'ETIMEDOUT' || code === 'ESOCKETTIMEDOUT' || message.includes('timeout')) {
    return {
      code: 'NETWORK_TIMEOUT',
      message: 'Request timed out.',
      recoveryGuidance: 'Your connection may be slow. Please try again.',
    };
  }

  // DNS resolution failed
  if (code === 'ENOTFOUND' || code === 'EAI_AGAIN' || message.includes('getaddrinfo')) {
    return {
      code: 'NETWORK_DNS_ERROR',
      message: 'Unable to resolve server address.',
      recoveryGuidance: 'Check your DNS settings or internet connection.',
    };
  }

  // Generic network error
  return {
    code: 'NETWORK_ERROR',
    message: 'A network error occurred.',
    recoveryGuidance: 'Check your internet connection and try again.',
  };
}

/**
 * Translate file system errors to user-friendly messages
 */
export function translateFilesystemError(error: any): ErrorTranslation {
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code || '';

  // File not found
  if (code === 'ENOENT' || message.includes('no such file')) {
    return {
      code: 'FILE_NOT_FOUND',
      message: 'File not found.',
      recoveryGuidance: 'The file may have been moved or deleted. Please try uploading again.',
    };
  }

  // Permission denied
  if (code === 'EACCES' || message.includes('permission denied')) {
    return {
      code: 'FILE_PERMISSION_DENIED',
      message: 'Permission denied.',
      recoveryGuidance: 'Insufficient permissions to access the file. Contact support.',
    };
  }

  // Disk full
  if (code === 'ENOSPC' || message.includes('no space')) {
    return {
      code: 'DISK_FULL',
      message: 'Insufficient disk space.',
      recoveryGuidance: 'Server storage is full. Contact support to free up space.',
    };
  }

  // Generic filesystem error
  return {
    code: 'FILESYSTEM_ERROR',
    message: 'A file system error occurred.',
    recoveryGuidance: 'Please try again. Contact support if the problem persists.',
  };
}
