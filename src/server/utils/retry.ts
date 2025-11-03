/**
 * Retry Mechanism Utility
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * Implements retry logic with exponential backoff for transient errors
 */

import { logger } from './logger';

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any, nextDelayMs: number) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 1000, // 1 second
  maxDelayMs: 16000, // 16 seconds
  backoffMultiplier: 2,
  shouldRetry: (error: any) => {
    // Retry on network and database errors by default
    const code = error?.code?.toLowerCase() || '';
    const message = error?.message?.toLowerCase() || '';

    return (
      // Network errors
      code.includes('econnrefused') ||
      code.includes('etimedout') ||
      code.includes('network') ||
      // Database errors
      code.includes('database') ||
      code.includes('timeout') ||
      message.includes('network') ||
      message.includes('database') ||
      message.includes('timeout')
    );
  },
  onRetry: () => {
    // Default: no-op
  },
};

/**
 * Calculate delay for next retry using exponential backoff
 */
function calculateDelay(attempt: number, options: Required<RetryOptions>): number {
  const delay = options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt - 1);
  return Math.min(delay, options.maxDelayMs);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration options
 * @returns Promise resolving to function result
 * @throws Last error if all retries exhausted
 *
 * @example
 * const data = await withRetry(
 *   () => database.query('SELECT * FROM users'),
 *   { maxAttempts: 3, initialDelayMs: 1000 }
 * );
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts: Required<RetryOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: any;
  let attempt = 0;

  while (attempt < opts.maxAttempts) {
    attempt++;

    try {
      const result = await fn();
      if (attempt > 1) {
        logger.info('retry', `Operation succeeded on attempt ${attempt}/${opts.maxAttempts}`);
      }
      return result;
    } catch (error: any) {
      lastError = error;

      // Check if we should retry this error
      const shouldRetry = opts.shouldRetry(error);

      if (!shouldRetry) {
        logger.warn('retry', 'Error is not retryable, failing immediately', {
          error: error.message,
          attempt,
        });
        throw error;
      }

      // Check if we have attempts left
      if (attempt >= opts.maxAttempts) {
        logger.error('retry', `All ${opts.maxAttempts} retry attempts exhausted`, {
          error: error.message,
          attempt,
        });
        throw error;
      }

      // Calculate delay and wait
      const delayMs = calculateDelay(attempt, opts);

      logger.warn('retry', `Attempt ${attempt}/${opts.maxAttempts} failed, retrying in ${delayMs}ms`, {
        error: error.message,
        nextAttempt: attempt + 1,
        delayMs,
      });

      // Call onRetry callback
      opts.onRetry(attempt, error, delayMs);

      await sleep(delayMs);
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError;
}

/**
 * Create a retryable version of a function
 *
 * @param fn - Async function to make retryable
 * @param options - Retry configuration options
 * @returns New function that retries on failure
 *
 * @example
 * const retryableFetch = createRetryable(
 *   (url: string) => fetch(url),
 *   { maxAttempts: 3 }
 * );
 * const response = await retryableFetch('https://api.example.com/data');
 */
export function createRetryable<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => withRetry(() => fn(...args), options);
}

/**
 * Track retry state for UI display
 */
export interface RetryState {
  attempt: number;
  maxAttempts: number;
  lastError: Error | null;
  isRetrying: boolean;
  nextRetryMs: number | null;
}

/**
 * Create a retry wrapper with state tracking for UI
 *
 * @param fn - Async function to retry
 * @param onStateChange - Callback for state updates
 * @param options - Retry configuration options
 * @returns Promise resolving to function result
 *
 * @example
 * const [retryState, setRetryState] = useState<RetryState>({
 *   attempt: 0,
 *   maxAttempts: 3,
 *   lastError: null,
 *   isRetrying: false,
 *   nextRetryMs: null,
 * });
 *
 * await withRetryTracking(
 *   () => uploadFile(file),
 *   setRetryState,
 *   { maxAttempts: 3 }
 * );
 */
export async function withRetryTracking<T>(
  fn: () => Promise<T>,
  onStateChange: (state: RetryState) => void,
  options: RetryOptions = {}
): Promise<T> {
  const opts: Required<RetryOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return withRetry(fn, {
    ...opts,
    onRetry: (attempt, error, nextDelayMs) => {
      onStateChange({
        attempt,
        maxAttempts: opts.maxAttempts,
        lastError: error,
        isRetrying: true,
        nextRetryMs: nextDelayMs,
      });

      // Call original onRetry if provided
      if (options.onRetry) {
        options.onRetry(attempt, error, nextDelayMs);
      }
    },
  });
}
