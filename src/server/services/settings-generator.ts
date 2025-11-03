/**
 * Bambu Settings File Generator
 * Story 2.1: Full Bambu Slicer Parameter Exposure
 *
 * Generates Bambu Studio process settings JSON files using template-based approach.
 * Based on BAMBU_PARAMETERS.md specifications and PRESET_SCHEMA.md.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '../utils/logger';
import type { BambuCliOptions } from './bambu-cli';

/**
 * Bambu Studio Process Settings JSON Structure
 * All parameter values MUST be string arrays per Bambu CLI requirements
 */
interface ProcessSettings {
  type: 'process';
  name: string;
  from: 'user' | 'system';
  inherits: string;
  setting_id: string;

  // === TIER 1 QUALITY SETTINGS ===
  layer_height: [string];
  initial_layer_height: [string];
  wall_loops: [string];
  top_shell_layers: [string];
  bottom_shell_layers: [string];

  // === TIER 1 INFILL SETTINGS ===
  sparse_infill_density: [string]; // Must include % symbol
  sparse_infill_pattern: [string];

  // === TIER 1 SUPPORT SETTINGS ===
  enable_support: [string]; // "0" or "1"
  support_type: [string]; // "normal" or "tree"
  support_threshold_angle: [string];

  // === TIER 1 SPEED SETTINGS ===
  outer_wall_speed: [string];
  inner_wall_speed: [string];
  sparse_infill_speed: [string];
  initial_layer_speed: [string];

  // === TIER 1 TEMPERATURE SETTINGS ===
  nozzle_temperature: [string];
  nozzle_temperature_initial_layer: [string]; // Same as nozzle_temperature for MVP

  // Required compatibility field
  compatible_printers: string[];
}

/**
 * Configuration name for settings file
 */
export interface SettingsConfig {
  configName: string;
  configId: string;
}

/**
 * Generate Process Settings JSON from BambuCliOptions
 *
 * @param options - CLI options with all Tier 1 parameters
 * @param config - Configuration metadata (name, ID)
 * @returns ProcessSettings object ready for JSON serialization
 */
export function generateProcessSettings(
  options: BambuCliOptions,
  config: SettingsConfig
): ProcessSettings {
  const timestamp = Date.now();

  // Debug logging to identify undefined values
  logger.info('settings-generator', 'Options received', {
    layerHeight: options.layerHeight,
    initialLayerHeight: options.initialLayerHeight,
    wallLoops: options.wallLoops,
    topShellLayers: options.topShellLayers,
    bottomShellLayers: options.bottomShellLayers,
    infillDensity: options.infillDensity,
    infillPattern: options.infillPattern,
    enableSupport: options.enableSupport,
    supportType: options.supportType,
    supportThresholdAngle: options.supportThresholdAngle,
    outerWallSpeed: options.outerWallSpeed,
    innerWallSpeed: options.innerWallSpeed,
    sparseInfillSpeed: options.sparseInfillSpeed,
    initialLayerSpeed: options.initialLayerSpeed,
    nozzleTemperature: options.nozzleTemperature,
    printerModel: options.printerModel
  });

  // Printer compatibility mapping
  const printerCompatibility: Record<string, string[]> = {
    X1_Carbon: [
      'Bambu Lab X1 Carbon 0.4 nozzle',
      'Bambu Lab X1 0.4 nozzle'
    ],
    P1P: [
      'Bambu Lab P1P 0.4 nozzle'
    ],
    P1S: [
      'Bambu Lab P1S 0.4 nozzle'
    ],
    A1_Mini: [
      'Bambu Lab A1 mini 0.4 nozzle'
    ]
  };

  const compatiblePrinters = printerCompatibility[options.printerModel] || [
    'Bambu Lab X1 Carbon 0.4 nozzle',
    'Bambu Lab P1S 0.4 nozzle',
    'Bambu Lab X1 0.4 nozzle'
  ];

  // Build settings object with all parameters as string arrays
  const settings: ProcessSettings = {
    // Required metadata
    type: 'process',
    name: config.configName,
    from: 'user',
    inherits: 'fdm_process_single_0.20', // Use standard base profile
    setting_id: `USER_${config.configId}_${timestamp}`,

    // === TIER 1 QUALITY SETTINGS ===
    layer_height: [options.layerHeight.toString()],
    initial_layer_height: [options.initialLayerHeight.toString()],
    wall_loops: [options.wallLoops.toString()],
    top_shell_layers: [options.topShellLayers.toString()],
    bottom_shell_layers: [options.bottomShellLayers.toString()],

    // === TIER 1 INFILL SETTINGS ===
    sparse_infill_density: [`${options.infillDensity}%`], // MUST include % symbol
    sparse_infill_pattern: [options.infillPattern],

    // === TIER 1 SUPPORT SETTINGS ===
    enable_support: [options.enableSupport ? '1' : '0'],
    support_type: [options.supportType],
    support_threshold_angle: [options.supportThresholdAngle.toString()],

    // === TIER 1 SPEED SETTINGS ===
    outer_wall_speed: [options.outerWallSpeed.toString()],
    inner_wall_speed: [options.innerWallSpeed.toString()],
    sparse_infill_speed: [options.sparseInfillSpeed.toString()],
    initial_layer_speed: [options.initialLayerSpeed.toString()],

    // === TIER 1 TEMPERATURE SETTINGS ===
    nozzle_temperature: [options.nozzleTemperature.toString()],
    nozzle_temperature_initial_layer: [options.nozzleTemperature.toString()], // Same for MVP

    // Required compatibility
    compatible_printers: compatiblePrinters
  };

  logger.info('settings-generator', 'Process settings generated', {
    configName: config.configName,
    configId: config.configId,
    parameterCount: Object.keys(settings).length - 4, // Exclude metadata fields
    printerModel: options.printerModel
  });

  return settings;
}

/**
 * Validate process settings structure
 *
 * @param settings - Settings object to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateProcessSettings(settings: ProcessSettings): string[] {
  const errors: string[] = [];

  // Required fields
  if (!settings.type || settings.type !== 'process') {
    errors.push('type must be "process"');
  }
  if (!settings.name || settings.name.trim() === '') {
    errors.push('name is required and cannot be empty');
  }
  if (!settings.from || !['user', 'system'].includes(settings.from)) {
    errors.push('from must be "user" or "system"');
  }
  if (!settings.compatible_printers || settings.compatible_printers.length === 0) {
    errors.push('compatible_printers must have at least one entry');
  }

  // Parameter validation (ranges per BAMBU_PARAMETERS.md)
  const layerHeight = parseFloat(settings.layer_height[0]);
  if (layerHeight < 0.08 || layerHeight > 0.36) {
    errors.push('layer_height must be between 0.08 and 0.36mm');
  }

  const initialLayerHeight = parseFloat(settings.initial_layer_height[0]);
  if (initialLayerHeight < 0.1 || initialLayerHeight > 0.4) {
    errors.push('initial_layer_height must be between 0.1 and 0.4mm');
  }

  // Dependency validation
  const enableSupport = settings.enable_support[0] === '1';
  if (!enableSupport && settings.support_type[0] !== 'normal') {
    // Warning: support_type is irrelevant when supports disabled, but not an error
  }

  // Infill density must include % symbol
  if (!settings.sparse_infill_density[0].includes('%')) {
    errors.push('sparse_infill_density must include % symbol (e.g., "20%")');
  }

  return errors;
}

/**
 * Write settings to JSON file
 *
 * @param settings - Process settings object
 * @param outputPath - Absolute path to output file
 */
export async function writeSettingsFile(
  settings: ProcessSettings,
  outputPath: string
): Promise<void> {
  // Ensure directory exists
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });

  // Write JSON with pretty formatting
  await fs.writeFile(outputPath, JSON.stringify(settings, null, 2), 'utf-8');

  logger.info('settings-generator', 'Settings file written', {
    path: outputPath,
    size: JSON.stringify(settings).length
  });
}

/**
 * Generate and write settings file in one operation
 *
 * @param options - CLI options with all Tier 1 parameters
 * @param config - Configuration metadata
 * @param outputPath - Path to write settings file
 * @returns Path to created settings file
 * @throws Error if validation fails or file write fails
 */
export async function createSettingsFile(
  options: BambuCliOptions,
  config: SettingsConfig,
  outputPath: string
): Promise<string> {
  // Generate settings
  const settings = generateProcessSettings(options, config);

  // Validate
  const errors = validateProcessSettings(settings);
  if (errors.length > 0) {
    const errorMessage = `Settings validation failed: ${errors.join(', ')}`;
    logger.error('settings-generator', errorMessage, { errors });
    throw new Error(errorMessage);
  }

  // Write to file
  await writeSettingsFile(settings, outputPath);

  return outputPath;
}
