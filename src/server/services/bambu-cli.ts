/**
 * Bambu Slicer CLI Integration Service
 * Story 1.6: Batch Slicing Engine
 * Story 2.1: Full Bambu Slicer Parameter Exposure
 *
 * Provides secure, production-ready CLI invocation following ADR-003 patterns.
 * Based on Story 1.3 spike findings and architecture.md CLI Invocation Pattern.
 */

import { spawn } from 'child_process';
import path from 'path';
import { promises as fs } from 'fs';
import { logger } from '../utils/logger';
import { createSettingsFile as generateSettingsFile } from './settings-generator';
import type { SettingsConfig } from './settings-generator';

// CLI Configuration from Story 1.3 findings
const BAMBU_CLI_PATH = process.env.BAMBU_CLI_PATH || 'C:\\Program Files\\Bambu Studio\\bambu-studio.exe';
const CLI_TIMEOUT = 5 * 60 * 1000; // 5 minutes (ADR-005)

/**
 * Bambu CLI Options - Story 2.1: Expanded with Tier 1 Essential Parameters
 *
 * Based on BAMBU_PARAMETERS.md Tier 1 specifications
 */
export interface BambuCliOptions {
  // File paths
  inputFile: string;
  outputFile: string;

  // Printer configuration
  printerModel: 'X1_Carbon' | 'P1P' | 'P1S' | 'A1_Mini';

  // === TIER 1 QUALITY SETTINGS ===
  /** Layer height in mm (0.08-0.36mm, default: 0.2mm) */
  layerHeight: number;
  /** First layer height in mm (0.1-0.4mm, default: 0.2mm, typically 100-125% of layer_height) */
  initialLayerHeight: number;
  /** Number of perimeter walls (2-10, default: 3) */
  wallLoops: number;
  /** Number of solid top layers (3-10, default: 4) */
  topShellLayers: number;
  /** Number of solid bottom layers (2-8, default: 3) */
  bottomShellLayers: number;

  // === TIER 1 INFILL SETTINGS ===
  /** Internal infill percentage (0-100%, default: 20%) */
  infillDensity: number;
  /** Infill pattern type (default: grid) */
  infillPattern: 'grid' | 'gyroid' | 'honeycomb' | 'triangle' | 'cubic' | 'line' | 'concentric' | '3dhoneycomb' | 'hilbertcurve' | 'archimedeanchords' | 'octagramspiral';

  // === TIER 1 SUPPORT SETTINGS ===
  /** Enable support structures (default: false) */
  enableSupport: boolean;
  /** Support structure type (default: normal) - only applies if enableSupport is true */
  supportType: 'normal' | 'tree';
  /** Minimum angle requiring support in degrees (0-90°, default: 30°) */
  supportThresholdAngle: number;

  // === TIER 1 SPEED SETTINGS ===
  /** Speed for outer perimeters in mm/s (50-300, default: 200) */
  outerWallSpeed: number;
  /** Speed for inner perimeters in mm/s (100-350, default: 300) */
  innerWallSpeed: number;
  /** Speed for infill printing in mm/s (150-450, default: 270) */
  sparseInfillSpeed: number;
  /** Speed for first layer in mm/s (20-100, default: 50) */
  initialLayerSpeed: number;

  // === TIER 1 TEMPERATURE SETTINGS ===
  /** Nozzle temperature during print in °C (170-300, default: 220 for PLA) */
  nozzleTemperature: number;

  // Legacy optional parameters (backward compatibility with Story 1.5)
  printSpeed?: number;
  bedTemperature?: number;
  wallThickness?: number;
  topBottomThickness?: number;
}

export interface SlicingResult {
  success: boolean;
  gcodeFile?: string;
  error?: string;
  errorCode?: string;
  duration?: number;
}

/**
 * Create settings JSON file for Bambu CLI - Story 2.1
 * Uses template-based generation from settings-generator service
 *
 * @deprecated This function is kept for backward compatibility but delegates to settings-generator
 */
async function createSettingsFile(
  options: BambuCliOptions,
  settingsPath: string,
  configName: string,
  configId: string
): Promise<void> {
  const config: SettingsConfig = {
    configName,
    configId
  };

  await generateSettingsFile(options, config, settingsPath);
}

/**
 * Invoke Bambu Slicer CLI to slice a 3D model
 *
 * SECURITY: Uses spawn() with argument array (NOT shell execution)
 * PATTERN: Following architecture.md CLI Invocation Pattern (lines 220-301)
 * TIMEOUT: 5 minutes max per ADR-005
 */
export async function invokeBambuSlicer(
  options: BambuCliOptions,
  configId: string
): Promise<SlicingResult> {
  const startTime = Date.now();

  // 1. Sanitize file paths - NEVER trust user input
  const sanitizedInput = path.resolve(options.inputFile);
  const sanitizedOutput = path.resolve(options.outputFile);

  logger.info('cli', 'Starting slicing operation', {
    configId,
    inputFile: sanitizedInput,
    outputFile: sanitizedOutput
  });

  // 2. Create settings JSON file (Story 2.1: Template-based generation)
  const settingsDir = path.dirname(sanitizedOutput);
  const settingsFile = path.join(settingsDir, `settings-${configId}.json`);

  try {
    // Generate config name from configId or use default
    const configName = `Config ${configId.substring(0, 8)}`;
    await createSettingsFile(options, settingsFile, configName, configId);
  } catch (error: any) {
    logger.error('cli', 'Failed to create settings file', { configId, error: error.message });
    return {
      success: false,
      error: 'Failed to create settings file',
      errorCode: 'SETTINGS_GENERATION_ERROR'
    };
  }

  // 3. Get machine and filament preset paths
  const presetsBasePath = 'C:\\Users\\dpmal\\AppData\\Roaming\\BambuStudio\\system\\BBL';

  // Map printer models to machine presets
  const machinePresets: Record<string, string> = {
    'X1_Carbon': path.join(presetsBasePath, 'machine', 'Bambu Lab X1 Carbon 0.4 nozzle.json'),
    'P1P': path.join(presetsBasePath, 'machine', 'Bambu Lab P1P 0.4 nozzle.json'),
    'P1S': path.join(presetsBasePath, 'machine', 'Bambu Lab P1S 0.4 nozzle.json'),
    'A1_Mini': path.join(presetsBasePath, 'machine', 'Bambu Lab A1 mini 0.4 nozzle.json')
  };

  // Map printer models to filament presets (using PLA Basic as default)
  const filamentPresets: Record<string, string> = {
    'X1_Carbon': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL X1C.json'),
    'P1P': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL P1P.json'),
    'P1S': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL P1S.json'),
    'A1_Mini': path.join(presetsBasePath, 'filament', 'Bambu PLA Basic @BBL A1M.json')
  };

  const machinePreset = machinePresets[options.printerModel];
  const filamentPreset = filamentPresets[options.printerModel];

  // Combine process settings with machine settings (semicolon-separated)
  const settingsFiles = `${settingsFile};${machinePreset}`;

  // 4. Build CLI arguments as array (prevents shell injection)
  // Story 1.3 Finding: Use --slice 0, --outputdir, --load-settings, --load-filaments
  const args = [
    '--slice', '0',                    // Slice without GUI
    '--outputdir', path.dirname(sanitizedOutput),
    '--load-settings', settingsFiles,  // Process + Machine settings
    '--load-filaments', filamentPreset, // Filament settings
    sanitizedInput                     // Input file as final argument
  ];

  // Log the exact command for debugging
  logger.info('cli', 'Bambu Studio command', {
    configId,
    executable: BAMBU_CLI_PATH,
    args: args.join(' '),
    processSettings: settingsFile,
    machinePreset,
    filamentPreset,
    inputFile: sanitizedInput,
    outputDir: path.dirname(sanitizedOutput)
  });

  // 4. Spawn process with security settings
  return new Promise((resolve) => {
    const cli = spawn(BAMBU_CLI_PATH, args, {
      timeout: CLI_TIMEOUT,           // 5 minutes max (ADR-005)
      shell: false,                   // SECURITY: Never use shell mode
      cwd: process.cwd(),
      windowsHide: true               // Hide GUI on Windows
    });

    let stdout = '';
    let stderr = '';
    let timeoutId: NodeJS.Timeout;

    // 5. Set up timeout handling
    timeoutId = setTimeout(() => {
      logger.warn('cli', 'Slicing timeout approaching', { configId, elapsed: CLI_TIMEOUT });
      cli.kill('SIGTERM');
    }, CLI_TIMEOUT);

    // 6. Capture output
    cli.stdout.on('data', (data) => {
      const chunk = data.toString();
      stdout += chunk;

      // Optional: Parse progress from output
      const progressMatch = chunk.match(/Slicing layer (\d+)\/(\d+)/);
      if (progressMatch) {
        const current = parseInt(progressMatch[1]);
        const total = parseInt(progressMatch[2]);
        logger.info('cli', 'Slicing progress', { configId, current, total, percent: Math.round((current / total) * 100) });
      }
    });

    cli.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // 7. Handle completion
    cli.on('close', async (code) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      // Cleanup settings file
      // TEMP: Keep settings file for debugging
      // try {
      //   await fs.unlink(settingsFile);
      // } catch (error) {
      //   // Ignore cleanup errors
      // }

      if (code === 0) {
        // Bambu Studio always saves files as plate_1.gcode, we need to rename it
        const bambuOutputFile = path.join(path.dirname(sanitizedOutput), 'plate_1.gcode');

        try {
          // Check if Bambu Studio created the default output file
          await fs.access(bambuOutputFile);

          // Rename to our expected filename
          await fs.rename(bambuOutputFile, sanitizedOutput);

          logger.info('cli', 'Slicing completed successfully', {
            configId,
            duration,
            outputFile: sanitizedOutput,
            renamedFrom: 'plate_1.gcode'
          });

          resolve({
            success: true,
            gcodeFile: sanitizedOutput,
            duration
          });
        } catch (renameError: any) {
          // If plate_1.gcode doesn't exist or rename fails, check if our expected file exists
          try {
            await fs.access(sanitizedOutput);
            // File exists with expected name, consider it success
            logger.info('cli', 'Slicing completed successfully', {
              configId,
              duration,
              outputFile: sanitizedOutput
            });

            resolve({
              success: true,
              gcodeFile: sanitizedOutput,
              duration
            });
          } catch {
            // Neither file exists, this is an error
            logger.error('cli', 'Output file not found after slicing', {
              configId,
              expectedFile: sanitizedOutput,
              bambuFile: bambuOutputFile,
              error: renameError.message
            });

            resolve({
              success: false,
              error: 'Slicing completed but output file not found',
              errorCode: 'OUTPUT_FILE_NOT_FOUND',
              duration
            });
          }
        }
      } else if (code === null) {
        // Process was killed (timeout)
        logger.error('cli', 'Slicing timeout', { configId, duration: CLI_TIMEOUT });
        resolve({
          success: false,
          error: `Slicing took too long (${CLI_TIMEOUT / 1000}s timeout)`,
          errorCode: 'CLI_TIMEOUT',
          duration
        });
      } else {
        // Non-zero exit code
        logger.error('cli', 'Slicing failed', {
          configId,
          exitCode: code,
          stderr: stderr.substring(0, 500), // First 500 chars
          duration
        });

        resolve({
          success: false,
          error: `CLI exited with code ${code}: ${stderr.substring(0, 200)}`,
          errorCode: 'CLI_FAILED',
          duration
        });
      }
    });

    // 8. Handle spawn errors
    cli.on('error', (err: NodeJS.ErrnoException) => {
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      logger.error('cli', 'Failed to spawn CLI', {
        configId,
        error: err.message,
        code: err.code
      });

      let errorMessage = 'Failed to invoke Bambu Slicer';
      let errorCode = 'UNKNOWN_ERROR';

      if (err.code === 'ENOENT') {
        errorMessage = 'Bambu Slicer not found. Please ensure Bambu Studio is installed.';
        errorCode = 'CLI_NOT_FOUND';
      } else if (err.code === 'EACCES') {
        errorMessage = 'Permission denied. Cannot execute Bambu Slicer.';
        errorCode = 'CLI_PERMISSION_DENIED';
      }

      resolve({
        success: false,
        error: errorMessage,
        errorCode,
        duration
      });
    });
  });
}

/**
 * Verify Bambu CLI is available and accessible
 * Called during server startup to fail fast if CLI not installed
 */
export async function verifyBambuCli(): Promise<{ available: boolean; error?: string }> {
  try {
    await fs.access(BAMBU_CLI_PATH);
    logger.info('cli', 'Bambu CLI verified', { path: BAMBU_CLI_PATH });
    return { available: true };
  } catch (error: any) {
    logger.error('cli', 'Bambu CLI not found', { path: BAMBU_CLI_PATH, error: error.message });
    return {
      available: false,
      error: `Bambu CLI not found at ${BAMBU_CLI_PATH}. Please install Bambu Studio or set BAMBU_CLI_PATH environment variable.`
    };
  }
}
