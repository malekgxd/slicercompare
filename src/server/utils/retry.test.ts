/**
 * Retry Mechanism Tests
 * Story 2.3: Error Handling & User Feedback Enhancement
 */

import { describe, it, expect, vi } from 'vitest';
import { withRetry, createRetryable } from './retry';

describe('withRetry', () => {
  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const result = await withRetry(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on retryable error', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue('success');

    const result = await withRetry(fn, {
      maxAttempts: 3,
      initialDelayMs: 10, // Short delay for testing
    });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should exhaust retries and throw last error', async () => {
    const error = new Error('persistent error');
    error.code = 'NETWORK_ERROR';
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(fn, {
        maxAttempts: 3,
        initialDelayMs: 10,
      })
    ).rejects.toThrow('persistent error');

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should not retry non-retryable errors', async () => {
    const error = new Error('validation error');
    error.code = 'VALIDATION_ERROR';
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(fn, {
        maxAttempts: 3,
        shouldRetry: (err) => err.code?.includes('NETWORK'),
      })
    ).rejects.toThrow('validation error');

    // Should fail immediately without retries
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call onRetry callback', async () => {
    const onRetry = vi.fn();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue('success');

    await withRetry(fn, {
      maxAttempts: 3,
      initialDelayMs: 10,
      onRetry,
    });

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ message: 'network error' }),
      expect.any(Number)
    );
  });

  it('should use exponential backoff', async () => {
    const onRetry = vi.fn();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue('success');

    await withRetry(fn, {
      maxAttempts: 3,
      initialDelayMs: 100,
      backoffMultiplier: 2,
      onRetry,
    });

    // First retry: 100ms, Second retry: 200ms
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, expect.anything(), 100);
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.anything(), 200);
  });

  it('should respect max delay', async () => {
    const onRetry = vi.fn();
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue('success');

    await withRetry(fn, {
      maxAttempts: 3,
      initialDelayMs: 1000,
      backoffMultiplier: 10,
      maxDelayMs: 1500,
      onRetry,
    });

    // Second retry would be 10000ms, but capped at 1500ms
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, expect.anything(), 1500);
  });
});

describe('createRetryable', () => {
  it('should create retryable function', async () => {
    const originalFn = vi.fn().mockResolvedValue('success');
    const retryableFn = createRetryable(originalFn, { maxAttempts: 3 });

    const result = await retryableFn('arg1', 'arg2');

    expect(result).toBe('success');
    expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should retry created function on failure', async () => {
    const originalFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValue('success');

    const retryableFn = createRetryable(originalFn, {
      maxAttempts: 3,
      initialDelayMs: 10,
    });

    const result = await retryableFn('test');

    expect(result).toBe('success');
    expect(originalFn).toHaveBeenCalledTimes(2);
  });
});
