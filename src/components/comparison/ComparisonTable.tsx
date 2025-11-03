/**
 * Comparison Table Component
 * Story 1.8 & 1.9: Comparison Results Display & G-code Download
 *
 * Displays side-by-side comparison of slicing results for all configurations.
 * Polls for real-time updates during batch slicing.
 */

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useComparisonResults, type ComparisonResult } from '@/hooks/useComparisonResults';
import { formatPrintTime, formatFilament, formatSupport, withParsingErrorFallback } from '@/utils/formatting';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

interface ComparisonTableProps {
  sessionId: string;
}

/**
 * Full result data with metrics from Supabase
 */
interface ResultWithMetrics {
  configuration_id: string;
  print_time_minutes: number;
  filament_usage_grams: { total: number; [color: string]: number };
  support_material_grams: number;
  parsing_error: string | null;
}

/**
 * Comparison Table - displays slicing results side-by-side
 *
 * Features:
 * - Real-time polling for progress updates
 * - Loading states for configurations being processed
 * - Graceful error handling for parsing failures
 * - Formatted metrics (time, filament, support)
 *
 * @example
 * <ComparisonTable sessionId="session-uuid-123" />
 */
export function ComparisonTable({ sessionId }: ComparisonTableProps) {
  const [resultsWithMetrics, setResultsWithMetrics] = useState<Map<string, ResultWithMetrics>>(new Map());
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [downloadingConfigId, setDownloadingConfigId] = useState<string | null>(null);

  // Poll session status for real-time updates
  const {
    results,
    isLoading: isLoadingStatus,
    error: statusError,
    allComplete,
    progress
  } = useComparisonResults({
    sessionId,
    onAllComplete: () => {
      console.log('[ComparisonTable] All configurations complete');
    }
  });

  /**
   * Fetch full results with metrics from Supabase
   */
  const fetchResultsWithMetrics = async () => {
    setIsLoadingMetrics(true);

    try {
      const { data, error } = await supabase
        .from('results')
        .select(`
          configuration_id,
          print_time_minutes,
          filament_usage_grams,
          support_material_grams,
          parsing_error
        `)
        .in('configuration_id', results.map(r => r.configurationId));

      if (error) {
        console.error('[ComparisonTable] Error fetching results:', error);
        return;
      }

      if (data) {
        const metricsMap = new Map<string, ResultWithMetrics>();
        data.forEach((result: any) => {
          metricsMap.set(result.configuration_id, result);
        });
        setResultsWithMetrics(metricsMap);
      }
    } catch (error) {
      console.error('[ComparisonTable] Error fetching metrics:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  /**
   * Handle G-code file download
   * Story 1.9: G-code Download Feature
   */
  const handleDownload = async (configId: string, configName: string) => {
    setDownloadingConfigId(configId);

    try {
      const response = await fetch(`/api/download/${sessionId}/${configId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Download failed');
      }

      // Get filename from Content-Disposition header or fallback
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${configName}.gcode`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) {
          filename = match[1];
        }
      }

      // Create blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('[ComparisonTable] Download started:', filename);
    } catch (error: any) {
      console.error('[ComparisonTable] Download error:', error);
      alert(`Failed to download G-code: ${error.message}`);
    } finally {
      setDownloadingConfigId(null);
    }
  };

  // Fetch metrics when results update
  useEffect(() => {
    if (results.length > 0) {
      fetchResultsWithMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  // Handle errors
  if (statusError) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-error-200)] bg-[var(--color-error-50)] p-6">
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 text-[var(--color-error-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-[var(--color-error-800)]">Error Loading Results</h3>
            <p className="mt-1 text-sm text-[var(--color-error-700)]">{statusError.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Initial loading state
  if (isLoadingStatus && results.length === 0) {
    return (
      <div className="space-y-4">
        <SkeletonLoader type="list" />
      </div>
    );
  }

  // No results yet
  if (results.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-neutral-50)] p-12 text-center">
        <div className="mx-auto h-12 w-12 text-[var(--color-neutral-400)]">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-[var(--color-text-primary)]">No Results Yet</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Start batch slicing to see comparison results here.
        </p>
      </div>
    );
  }

  /**
   * Get metric value with status-aware display
   */
  const getMetricDisplay = (configId: string, status: string, getMetric: (metrics: ResultWithMetrics) => string): string => {
    if (status === 'queued') {
      return 'Queued';
    }
    if (status === 'slicing') {
      return 'Processing...';
    }
    if (status === 'failed') {
      return 'Failed';
    }

    const metrics = resultsWithMetrics.get(configId);
    if (!metrics) {
      return isLoadingMetrics ? 'Loading...' : '—';
    }

    const hasError = metrics.parsing_error !== null;
    const value = getMetric(metrics);
    return withParsingErrorFallback(value, hasError);
  };

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      {!allComplete && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-info-200)] bg-[var(--color-info-50)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LoadingSpinner size="sm" />
              <div>
                <p className="text-sm font-medium text-[var(--color-info-900)]">
                  Processing Configurations
                </p>
                <p className="text-sm text-[var(--color-info-700)]">
                  {progress.completedCount} of {progress.totalCount} complete
                  {progress.failedCount > 0 && ` · ${progress.failedCount} failed`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-background-primary)] shadow-[var(--shadow-sm)]">
        <table className="w-full divide-y divide-[var(--color-border-default)]">
          <thead className="bg-[var(--color-neutral-50)]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                Configuration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                Print Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                Filament
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                Support
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
                Download
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)] bg-[var(--color-background-primary)]">
            {results.map((result) => {
              const metrics = resultsWithMetrics.get(result.configurationId);
              const hasParsingError = metrics?.parsing_error !== null;

              return (
                <tr key={result.configurationId} className="hover:bg-[var(--color-neutral-50)] transition-colors">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="font-medium text-[var(--color-text-primary)]">
                          {result.configurationName}
                        </div>
                        {result.errorMessage && (
                          <div className="mt-1 text-xs text-[var(--color-error-600)]">
                            {result.errorMessage}
                          </div>
                        )}
                        {hasParsingError && (
                          <div className="mt-1 text-xs text-[var(--color-warning-600)]">
                            Parsing error: {metrics?.parsing_error}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--color-text-primary)]">
                    {getMetricDisplay(
                      result.configurationId,
                      result.status,
                      (m) => formatPrintTime(m.print_time_minutes)
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--color-text-primary)]">
                    {getMetricDisplay(
                      result.configurationId,
                      result.status,
                      (m) => formatFilament(m.filament_usage_grams)
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--color-text-primary)]">
                    {getMetricDisplay(
                      result.configurationId,
                      result.status,
                      (m) => formatSupport(m.support_material_grams)
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        result.status === 'complete'
                          ? 'bg-[var(--color-success-100)] text-[var(--color-success-800)]'
                          : result.status === 'failed'
                          ? 'bg-[var(--color-error-100)] text-[var(--color-error-800)]'
                          : result.status === 'slicing'
                          ? 'bg-[var(--color-info-100)] text-[var(--color-info-800)]'
                          : 'bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)]'
                      }`}
                    >
                      {result.status === 'complete' ? '✓ Complete' :
                       result.status === 'failed' ? '✗ Failed' :
                       result.status === 'slicing' ? 'Slicing...' :
                       'Queued'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {result.status === 'complete' ? (
                      <button
                        onClick={() => handleDownload(result.configurationId, result.configurationName)}
                        disabled={downloadingConfigId === result.configurationId}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--color-primary-600)] bg-[var(--color-primary-50)] rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label={`Download ${result.configurationName}`}
                      >
                        {downloadingConfigId === result.configurationId ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-sm text-[var(--color-text-disabled)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Completion Message */}
      {allComplete && progress.failedCount === 0 && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-success-200)] bg-[var(--color-success-50)] p-4">
          <div className="flex items-center gap-3">
            <svg className="h-6 w-6 text-[var(--color-success-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-[var(--color-success-900)]">
                All configurations processed successfully
              </p>
              <p className="text-sm text-[var(--color-success-700)]">
                You can now download G-code files or start a new comparison.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
