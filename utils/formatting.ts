/**
 * Formatting Utilities for Comparison Metrics
 * Story 1.8: Comparison Results Display
 *
 * Utilities to format parsed metrics for user-friendly display in comparison table.
 */

/**
 * Format print time from minutes to human-readable format
 *
 * @param minutes - Print time in minutes
 * @returns Formatted string like "3h 45m" or "45m"
 *
 * @example
 * formatPrintTime(0) → "0m"
 * formatPrintTime(45) → "45m"
 * formatPrintTime(60) → "1h 0m"
 * formatPrintTime(225) → "3h 45m"
 */
export function formatPrintTime(minutes: number | null | undefined): string {
  // Handle null/undefined/0
  if (minutes === null || minutes === undefined || minutes === 0) {
    return '0m';
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}m`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Format filament usage from grams to display string
 *
 * @param filamentData - JSONB object with total and color breakdown
 * @returns Formatted string like "125.4 g"
 *
 * @example
 * formatFilament({ total: 125.4 }) → "125.4 g"
 * formatFilament({ total: 0 }) → "0.0 g"
 * formatFilament(null) → "N/A"
 */
export function formatFilament(
  filamentData: { total?: number; [key: string]: number | undefined } | null | undefined
): string {
  // Handle null/undefined
  if (!filamentData || filamentData.total === undefined || filamentData.total === null) {
    return 'N/A';
  }

  const total = filamentData.total;
  return `${total.toFixed(1)} g`;
}

/**
 * Format support material from grams to display string
 *
 * @param grams - Support material weight in grams
 * @returns Formatted string like "18.5 g" or "0.0 g"
 *
 * @example
 * formatSupport(18.5) → "18.5 g"
 * formatSupport(0) → "0.0 g"
 * formatSupport(null) → "N/A"
 */
export function formatSupport(grams: number | null | undefined): string {
  // Handle null/undefined
  if (grams === null || grams === undefined) {
    return 'N/A';
  }

  return `${grams.toFixed(1)} g`;
}

/**
 * Format a metric value with fallback for parsing errors
 *
 * @param value - The formatted value
 * @param hasParsingError - Whether parsing failed for this result
 * @returns Value or "?" if parsing failed
 */
export function withParsingErrorFallback(
  value: string,
  hasParsingError: boolean
): string {
  return hasParsingError ? '?' : value;
}
