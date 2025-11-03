/**
 * Comparison Results Hook
 * Story 1.8: Comparison Results Display
 *
 * Fetches comparison results with polling for real-time updates during slicing.
 * Uses GET /api/sessions/:id/status endpoint from Story 1.6.
 */

import { usePolling } from './usePolling';

/**
 * Configuration with processing status
 */
export interface ConfigurationStatus {
  id: string;
  name: string;
  status: 'queued' | 'slicing' | 'complete' | 'failed';
  error?: string;
}

/**
 * Session status response from API
 * Matches slicing-batch.ts getSlicingStatus() return type
 */
export interface SessionStatus {
  sessionId: string;
  sessionStatus: string;
  configurations: ConfigurationStatus[];
  allComplete: boolean;
  completedCount: number;
  failedCount: number;
  totalCount: number;
  inProgressCount: number;
}

/**
 * Result data for comparison table display
 * Maps to results table schema and gcode-parser ParsedMetrics
 */
export interface ComparisonResult {
  configurationId: string;
  configurationName: string;
  printTimeMinutes: number | null;
  filamentUsageGrams: { total: number; [color: string]: number } | null;
  supportMaterialGrams: number | null;
  parsingError: string | null;
  status: 'queued' | 'slicing' | 'complete' | 'failed';
  errorMessage?: string;
}

interface UseComparisonResultsOptions {
  /**
   * Session ID to fetch results for
   */
  sessionId: string;

  /**
   * Whether to enable polling
   * @default true
   */
  enabled?: boolean;

  /**
   * Callback when all configurations complete
   */
  onAllComplete?: () => void;
}

interface UseComparisonResultsReturn {
  /**
   * Comparison results for all configurations
   */
  results: ComparisonResult[];

  /**
   * Session status information
   */
  sessionStatus: SessionStatus | null;

  /**
   * Whether currently fetching
   */
  isLoading: boolean;

  /**
   * Error from API call
   */
  error: Error | null;

  /**
   * Whether polling is active
   */
  isPolling: boolean;

  /**
   * Whether all configurations are complete
   */
  allComplete: boolean;

  /**
   * Progress metrics
   */
  progress: {
    completedCount: number;
    failedCount: number;
    totalCount: number;
    inProgressCount: number;
  };
}

/**
 * Fetch comparison results with real-time polling
 *
 * @example
 * const { results, allComplete, progress } = useComparisonResults({
 *   sessionId: 'session-uuid',
 *   onAllComplete: () => console.log('All done!')
 * });
 */
export function useComparisonResults({
  sessionId,
  enabled = true,
  onAllComplete
}: UseComparisonResultsOptions): UseComparisonResultsReturn {
  /**
   * Fetch session status from API
   */
  const fetchSessionStatus = async (): Promise<SessionStatus> => {
    const response = await fetch(`/api/sessions/${sessionId}/status`);

    if (!response.ok) {
      throw new Error(`Failed to fetch session status: ${response.statusText}`);
    }

    return response.json();
  };

  /**
   * Poll session status with usePolling hook
   */
  const {
    data: sessionStatus,
    isLoading,
    error,
    isPolling
  } = usePolling<SessionStatus>({
    fetchFn: fetchSessionStatus,
    interval: 2000, // ADR-004: 2-second polling
    enabled,
    shouldStopPolling: (data) => data?.allComplete === true,
    onPollingStop: onAllComplete
  });

  /**
   * Transform session status into comparison results
   * Fetches full results from Supabase for completed configurations
   */
  const results: ComparisonResult[] = sessionStatus?.configurations.map((config) => ({
    configurationId: config.id,
    configurationName: config.name,
    // Status endpoint doesn't include metrics, so we'll fetch them separately
    // For now, return placeholder - will be enriched by ComparisonTable component
    printTimeMinutes: null,
    filamentUsageGrams: null,
    supportMaterialGrams: null,
    parsingError: null,
    status: config.status,
    errorMessage: config.error
  })) || [];

  return {
    results,
    sessionStatus,
    isLoading,
    error,
    isPolling,
    allComplete: sessionStatus?.allComplete ?? false,
    progress: {
      completedCount: sessionStatus?.completedCount ?? 0,
      failedCount: sessionStatus?.failedCount ?? 0,
      totalCount: sessionStatus?.totalCount ?? 0,
      inProgressCount: sessionStatus?.inProgressCount ?? 0
    }
  };
}
