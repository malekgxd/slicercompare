/**
 * G-code Parser Service
 * Story 1.7: Results Parser & Storage
 *
 * Parses Bambu Slicer G-code comment headers to extract comparison metrics.
 * Following architecture.md G-code Parsing Pattern (lines 382-434) and ADR-007.
 */

import { promises as fs } from 'fs';
import { logger } from '../utils/logger';

export interface ParsedMetrics {
  printTimeMinutes: number;
  filamentUsageGrams: { [color: string]: number };
  supportMaterialGrams: number;
  // Future extension points
  layerCount?: number;
  estimatedCost?: number;
  buildVolumeUsage?: number;
}

/**
 * Parse G-code file to extract comparison metrics from comment headers
 *
 * PATTERN: Following architecture.md G-code Parsing Pattern (lines 382-434)
 * FORMAT: Bambu Slicer comment format validated in Story 1.3
 * PERFORMANCE: Reads only first 500 lines (metadata is in header)
 * ERROR HANDLING: Throws if critical metrics (print time) not found with debug info
 */
export async function parseGcode(gcodeFilePath: string): Promise<ParsedMetrics> {
  logger.info('parser', 'Starting G-code parsing', { gcodeFilePath });

  try {
    // Read file content
    const content = await fs.readFile(gcodeFilePath, 'utf-8');
    const lines = content.split('\n');

    // Check first 500 lines for metadata (increased for better compatibility)
    const headerLines = lines.slice(0, 500);

    const metrics: ParsedMetrics = {
      printTimeMinutes: 0,
      filamentUsageGrams: {},
      supportMaterialGrams: 0
    };

    let timeLineFound = '';

    for (const line of headerLines) {
      // Parse estimated printing time - improved regex to handle more formats
      // Supports multiple formats:
      // - "; estimated printing time (normal mode) = 3h 45m 12s"
      // - "; model printing time: 20h 13m 31s; total estimated time: 20h 21m 22s"
      // - "; total estimated time: 20h 21m 22s"
      // - "; model printing time: 27m 33s" (no hours when < 1 hour)
      // - "; printing time: 45m 10s" (without "estimated" or "model")
      // - "; print time = 2h 30m" (alternative format)
      const timeMatch = line.match(/(?:estimated\s+printing\s+time|model\s+printing\s+time|total\s+estimated\s+time|printing\s+time|print\s+time)[^:=]*[:=]\s*(?:(\d+)h\s*)?(\d+)m/i);
      if (timeMatch && metrics.printTimeMinutes === 0) {
        const hours = timeMatch[1] ? parseInt(timeMatch[1], 10) : 0;
        const minutes = parseInt(timeMatch[2], 10);
        metrics.printTimeMinutes = hours * 60 + minutes;
        timeLineFound = line.trim();
        logger.info('parser', 'Print time extracted', {
          hours,
          minutes,
          totalMinutes: metrics.printTimeMinutes,
          matchedLine: timeLineFound
        });
      }

      // Parse total filament usage (grams)
      // Supports multiple formats:
      // - "; filament used [g] = 125.4"
      // - "; total filament weight [g] : 154.57,62.08,95.33"
      // - "; total filament weight [g] : 184.94"
      // Note: Space before and after [g] is common in Bambu Studio output
      const filamentMatch = line.match(/(?:filament\s+used|total\s+filament\s+weight)\s*\[g\]\s*[:=]\s*([\d.,\s]+)/i);
      if (filamentMatch) {
        const values = filamentMatch[1].split(',').map(s => parseFloat(s.trim())).filter(v => !isNaN(v));

        if (values.length > 1) {
          // Multi-color filament
          metrics.filamentUsageGrams.total = values.reduce((sum, val) => sum + val, 0);
          values.forEach((grams, index) => {
            metrics.filamentUsageGrams[`color${index + 1}`] = grams;
          });
          logger.info('parser', 'Multi-color filament extracted', {
            colors: values.length,
            total: metrics.filamentUsageGrams.total
          });
        } else if (values.length === 1) {
          // Single filament
          metrics.filamentUsageGrams.total = values[0];
          logger.info('parser', 'Filament usage extracted', { grams: values[0] });
        }
      }

      // Parse support material (grams)
      // Example: "; support material [g] = 18.3"
      const supportMatch = line.match(/support material \[g\]\s*=\s*([\d.]+)/i);
      if (supportMatch) {
        metrics.supportMaterialGrams = Math.round(parseFloat(supportMatch[1]));
        logger.info('parser', 'Support material extracted', {
          grams: metrics.supportMaterialGrams
        });
      }

      // Optional: Parse layer count for future use
      // Example: "; layer_count = 320"
      const layerMatch = line.match(/layer[_\s]count\s*=\s*(\d+)/i);
      if (layerMatch) {
        metrics.layerCount = parseInt(layerMatch[1], 10);
        logger.info('parser', 'Layer count extracted', { layers: metrics.layerCount });
      }
    }

    // Validation: Print time is REQUIRED (critical metric per Decision 5)
    if (metrics.printTimeMinutes === 0) {
      // Look for any time-related lines for debugging
      const timeLines = headerLines.filter(line =>
        line.toLowerCase().includes('time') && line.startsWith(';')
      ).slice(0, 5);

      const debugInfo = timeLines.length > 0
        ? `Found time-related lines: ${timeLines.map(l => l.trim()).join(' | ')}`
        : 'No time-related comments found in first 500 lines';

      logger.error('parser', 'Failed to parse print time', {
        gcodeFilePath,
        debugInfo,
        linesChecked: headerLines.length
      });

      throw new Error(`Failed to parse print time from G-code. ${debugInfo}`);
    }

    // Filament and support are optional - default to 0 if not found
    if (!metrics.filamentUsageGrams.total) {
      metrics.filamentUsageGrams.total = 0;
      logger.warn('parser', 'Filament usage not found, using fallback value', { gcode: gcodeFilePath });
    }

    logger.info('parser', 'G-code parsing completed successfully', {
      gcodeFilePath,
      printTimeMinutes: metrics.printTimeMinutes,
      filamentTotal: metrics.filamentUsageGrams.total,
      supportGrams: metrics.supportMaterialGrams
    });

    return metrics;
  } catch (error: any) {
    // Re-throw with additional context
    logger.error('parser', 'G-code parsing failed', {
      gcodeFilePath,
      error: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to parse G-code file: ${error.message}`);
  }
}

/**
 * Parse G-code with fallback values (graceful degradation)
 *
 * Used when parsing is not critical to workflow success.
 * Returns fallback values if parsing fails instead of throwing.
 */
export async function parseGcodeWithFallback(
  gcodeFilePath: string
): Promise<{ metrics: ParsedMetrics; error?: string }> {
  try {
    const metrics = await parseGcode(gcodeFilePath);
    return { metrics };
  } catch (error: any) {
    logger.warn('parser', 'G-code parsing failed, using fallback values', {
      gcodeFilePath,
      error: error.message
    });

    return {
      metrics: {
        printTimeMinutes: 0,
        filamentUsageGrams: { total: 0 },
        supportMaterialGrams: 0
      },
      error: error.message
    };
  }
}
