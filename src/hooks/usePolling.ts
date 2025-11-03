/**
 * Polling Hook for Real-Time Progress Updates
 * Story 1.8: Comparison Results Display
 *
 * Generic polling hook following architecture.md ADR-004 pattern.
 * Polls an endpoint at regular intervals and returns latest data.
 */

import { useEffect, useRef, useState } from 'react';

interface UsePollingOptions<T> {
  /**
   * Function to fetch data
   */
  fetchFn: () => Promise<T>;

  /**
   * Polling interval in milliseconds
   * @default 2000 (2 seconds per ADR-004)
   */
  interval?: number;

  /**
   * Whether polling should be active
   * @default true
   */
  enabled?: boolean;

  /**
   * Stop condition - if returns true, polling stops
   */
  shouldStopPolling?: (data: T | null) => boolean;

  /**
   * Callback when polling stops
   */
  onPollingStop?: () => void;
}

interface UsePollingReturn<T> {
  /**
   * Latest data from polling
   */
  data: T | null;

  /**
   * Whether currently fetching
   */
  isLoading: boolean;

  /**
   * Error from last fetch
   */
  error: Error | null;

  /**
   * Whether polling is currently active
   */
  isPolling: boolean;

  /**
   * Manually stop polling
   */
  stopPolling: () => void;

  /**
   * Manually restart polling
   */
  startPolling: () => void;

  /**
   * Manually trigger a fetch (outside of polling cycle)
   */
  refetch: () => Promise<void>;
}

/**
 * Custom hook for polling an endpoint at regular intervals
 *
 * @example
 * const { data, isPolling } = usePolling({
 *   fetchFn: () => fetch('/api/status').then(r => r.json()),
 *   interval: 2000,
 *   shouldStopPolling: (data) => data?.status === 'complete'
 * });
 */
export function usePolling<T>({
  fetchFn,
  interval = 2000, // ADR-004: 2-second polling
  enabled = true,
  shouldStopPolling,
  onPollingStop
}: UsePollingOptions<T>): UsePollingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(enabled);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  /**
   * Fetch data and update state
   */
  const fetchData = async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn();

      if (!isMountedRef.current) return;

      setData(result);

      // Check stop condition
      if (shouldStopPolling && shouldStopPolling(result)) {
        stopPolling();
        onPollingStop?.();
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('[usePolling] Fetch error:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  /**
   * Stop polling
   */
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  };

  /**
   * Start polling
   */
  const startPolling = () => {
    if (!isPolling) {
      setIsPolling(true);
      fetchData(); // Immediate fetch
    }
  };

  /**
   * Manual refetch
   */
  const refetch = async () => {
    await fetchData();
  };

  // Setup polling interval
  useEffect(() => {
    if (!enabled || !isPolling) {
      stopPolling();
      return;
    }

    // Initial fetch
    fetchData();

    // Setup interval
    intervalRef.current = setInterval(() => {
      fetchData();
    }, interval);

    // Cleanup on unmount or dependency change
    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isPolling, interval]);

  // Track mount status for safe state updates
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    isPolling,
    stopPolling,
    startPolling,
    refetch
  };
}
