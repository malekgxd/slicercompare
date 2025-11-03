/**
 * Error Translator Tests
 * Story 2.3: Error Handling & User Feedback Enhancement
 */

import { describe, it, expect } from 'vitest';
import {
  translateCliError,
  translateDatabaseError,
  translateNetworkError,
  translateFilesystemError,
} from './error-translator';

describe('translateCliError', () => {
  it('should translate CLI not found error', () => {
    const result = translateCliError('spawn ENOENT');

    expect(result.code).toBe('CLI_NOT_FOUND');
    expect(result.message).toContain('Bambu Slicer not found');
    expect(result.recoveryGuidance).toContain('install');
  });

  it('should translate permission denied error', () => {
    const result = translateCliError('permission denied EACCES');

    expect(result.code).toBe('CLI_PERMISSION_DENIED');
    expect(result.message).toContain('Permission denied');
  });

  it('should translate timeout error', () => {
    const result = translateCliError('', undefined);

    expect(result.code).toBe('CLI_TIMEOUT');
    expect(result.message).toContain('timed out');
    expect(result.recoveryGuidance).toContain('reducing');
  });

  it('should translate invalid model file error', () => {
    const result = translateCliError('invalid STL file format');

    expect(result.code).toBe('INVALID_MODEL_FILE');
    expect(result.message).toContain('Invalid or corrupted');
  });

  it('should translate out of memory error', () => {
    const result = translateCliError('out of memory OOM');

    expect(result.code).toBe('CLI_OUT_OF_MEMORY');
    expect(result.message).toContain('Insufficient memory');
  });

  it('should translate generic CLI failure with exit code', () => {
    const result = translateCliError('unknown error', 1);

    expect(result.code).toBe('CLI_FAILED');
    expect(result.message).toContain('exited with error code 1');
  });

  it('should translate unknown error', () => {
    const result = translateCliError('some random error', 0);

    expect(result.code).toBe('CLI_UNKNOWN_ERROR');
    expect(result.message).toContain('unexpected error');
  });
});

describe('translateDatabaseError', () => {
  it('should translate connection error', () => {
    const error = { code: 'ECONNREFUSED', message: 'Connection refused' };
    const result = translateDatabaseError(error);

    expect(result.code).toBe('DATABASE_CONNECTION_ERROR');
    expect(result.message).toContain('Unable to connect');
    expect(result.recoveryGuidance).toContain('connection');
  });

  it('should translate timeout error', () => {
    const error = { message: 'Database timeout' };
    const result = translateDatabaseError(error);

    expect(result.code).toBe('DATABASE_TIMEOUT');
    expect(result.message).toContain('timed out');
  });

  it('should translate duplicate key error', () => {
    const error = { code: '23505', message: 'unique constraint violation' };
    const result = translateDatabaseError(error);

    expect(result.code).toBe('DATABASE_DUPLICATE');
    expect(result.message).toContain('already exists');
  });

  it('should translate foreign key error', () => {
    const error = { code: '23503', message: 'foreign key violation' };
    const result = translateDatabaseError(error);

    expect(result.code).toBe('DATABASE_REFERENCE_ERROR');
    expect(result.message).toContain('Referenced record not found');
  });

  it('should translate not found error', () => {
    const error = { message: 'no rows returned' };
    const result = translateDatabaseError(error);

    expect(result.code).toBe('DATABASE_NOT_FOUND');
    expect(result.message).toContain('not found');
  });

  it('should translate generic database error', () => {
    const error = { message: 'unknown database error' };
    const result = translateDatabaseError(error);

    expect(result.code).toBe('DATABASE_ERROR');
    expect(result.message).toContain('database error');
  });
});

describe('translateNetworkError', () => {
  it('should translate network unreachable error', () => {
    const error = { code: 'ENETUNREACH' };
    const result = translateNetworkError(error);

    expect(result.code).toBe('NETWORK_UNREACHABLE');
    expect(result.message).toContain('unreachable');
  });

  it('should translate connection refused error', () => {
    const error = { code: 'ECONNREFUSED' };
    const result = translateNetworkError(error);

    expect(result.code).toBe('NETWORK_CONNECTION_REFUSED');
    expect(result.message).toContain('refused');
  });

  it('should translate timeout error', () => {
    const error = { code: 'ETIMEDOUT' };
    const result = translateNetworkError(error);

    expect(result.code).toBe('NETWORK_TIMEOUT');
    expect(result.message).toContain('timed out');
  });

  it('should translate DNS error', () => {
    const error = { code: 'ENOTFOUND' };
    const result = translateNetworkError(error);

    expect(result.code).toBe('NETWORK_DNS_ERROR');
    expect(result.message).toContain('resolve server address');
  });

  it('should translate generic network error', () => {
    const error = { message: 'some random issue' }; // No specific pattern
    const result = translateNetworkError(error);

    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.message).toContain('network error');
  });
});

describe('translateFilesystemError', () => {
  it('should translate file not found error', () => {
    const error = { code: 'ENOENT' };
    const result = translateFilesystemError(error);

    expect(result.code).toBe('FILE_NOT_FOUND');
    expect(result.message).toContain('not found');
  });

  it('should translate permission denied error', () => {
    const error = { code: 'EACCES' };
    const result = translateFilesystemError(error);

    expect(result.code).toBe('FILE_PERMISSION_DENIED');
    expect(result.message).toContain('Permission denied');
  });

  it('should translate disk full error', () => {
    const error = { code: 'ENOSPC' };
    const result = translateFilesystemError(error);

    expect(result.code).toBe('DISK_FULL');
    expect(result.message).toContain('Insufficient disk space');
  });

  it('should translate generic filesystem error', () => {
    const error = { message: 'filesystem error' };
    const result = translateFilesystemError(error);

    expect(result.code).toBe('FILESYSTEM_ERROR');
    expect(result.message).toContain('file system error');
  });
});
