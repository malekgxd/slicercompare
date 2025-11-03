/**
 * Parameter Validation Utilities
 * Story 2.1: Full Bambu Slicer Parameter Exposure
 *
 * Client-side validation rules for all Tier 1 Bambu Slicer parameters.
 * Based on BAMBU_PARAMETERS.md specifications.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Tier 1 Parameter Validation Rules
 * Based on BAMBU_PARAMETERS.md Tier 1 specifications
 */
export const VALIDATION_RULES = {
  // === QUALITY SETTINGS ===
  layerHeight: {
    min: 0.08,
    max: 0.36,
    step: 0.01,
    default: 0.2,
    unit: 'mm',
    validate: (value: number): ValidationResult => {
      if (value < 0.08 || value > 0.36) {
        return {
          valid: false,
          error: 'Layer height must be between 0.08mm and 0.36mm'
        };
      }
      return { valid: true };
    }
  },

  initialLayerHeight: {
    min: 0.1,
    max: 0.4,
    step: 0.01,
    default: 0.2,
    unit: 'mm',
    validate: (value: number, layerHeight?: number): ValidationResult => {
      if (value < 0.1 || value > 0.4) {
        return {
          valid: false,
          error: 'Initial layer height must be between 0.1mm and 0.4mm'
        };
      }
      if (layerHeight && value < layerHeight) {
        return {
          valid: false,
          error: 'Initial layer height should be at least equal to layer height (typically 100-125%)'
        };
      }
      return { valid: true };
    }
  },

  wallLoops: {
    min: 2,
    max: 10,
    default: 3,
    validate: (value: number): ValidationResult => {
      if (!Number.isInteger(value)) {
        return {
          valid: false,
          error: 'Wall loops must be a whole number'
        };
      }
      if (value < 2 || value > 10) {
        return {
          valid: false,
          error: 'Wall loops must be between 2 and 10'
        };
      }
      return { valid: true };
    }
  },

  topShellLayers: {
    min: 3,
    max: 10,
    default: 4,
    validate: (value: number): ValidationResult => {
      if (!Number.isInteger(value)) {
        return {
          valid: false,
          error: 'Top shell layers must be a whole number'
        };
      }
      if (value < 3 || value > 10) {
        return {
          valid: false,
          error: 'Top shell layers must be between 3 and 10'
        };
      }
      return { valid: true };
    }
  },

  bottomShellLayers: {
    min: 2,
    max: 8,
    default: 3,
    validate: (value: number): ValidationResult => {
      if (!Number.isInteger(value)) {
        return {
          valid: false,
          error: 'Bottom shell layers must be a whole number'
        };
      }
      if (value < 2 || value > 8) {
        return {
          valid: false,
          error: 'Bottom shell layers must be between 2 and 8'
        };
      }
      return { valid: true };
    }
  },

  // === INFILL SETTINGS ===
  infillDensity: {
    min: 0,
    max: 100,
    step: 5,
    default: 20,
    unit: '%',
    validate: (value: number): ValidationResult => {
      if (value < 0 || value > 100) {
        return {
          valid: false,
          error: 'Infill density must be between 0% and 100%'
        };
      }
      if (value % 5 !== 0) {
        return {
          valid: false,
          error: 'Infill density must be in 5% increments'
        };
      }
      return { valid: true };
    }
  },

  // === SUPPORT SETTINGS ===
  supportThresholdAngle: {
    min: 0,
    max: 90,
    default: 30,
    unit: '°',
    validate: (value: number): ValidationResult => {
      if (value < 0 || value > 90) {
        return {
          valid: false,
          error: 'Support threshold angle must be between 0° and 90°'
        };
      }
      return { valid: true };
    }
  },

  // === SPEED SETTINGS ===
  outerWallSpeed: {
    min: 50,
    max: 300,
    default: 200,
    unit: 'mm/s',
    validate: (value: number): ValidationResult => {
      if (value < 50 || value > 300) {
        return {
          valid: false,
          error: 'Outer wall speed must be between 50 and 300 mm/s'
        };
      }
      return { valid: true };
    }
  },

  innerWallSpeed: {
    min: 100,
    max: 350,
    default: 300,
    unit: 'mm/s',
    validate: (value: number): ValidationResult => {
      if (value < 100 || value > 350) {
        return {
          valid: false,
          error: 'Inner wall speed must be between 100 and 350 mm/s'
        };
      }
      return { valid: true };
    }
  },

  sparseInfillSpeed: {
    min: 150,
    max: 450,
    default: 270,
    unit: 'mm/s',
    validate: (value: number): ValidationResult => {
      if (value < 150 || value > 450) {
        return {
          valid: false,
          error: 'Infill speed must be between 150 and 450 mm/s'
        };
      }
      return { valid: true };
    }
  },

  initialLayerSpeed: {
    min: 20,
    max: 100,
    default: 50,
    unit: 'mm/s',
    validate: (value: number): ValidationResult => {
      if (value < 20 || value > 100) {
        return {
          valid: false,
          error: 'Initial layer speed must be between 20 and 100 mm/s'
        };
      }
      return { valid: true };
    }
  },

  // === TEMPERATURE SETTINGS ===
  nozzleTemperature: {
    min: 170,
    max: 300,
    default: 220, // PLA default
    unit: '°C',
    validate: (value: number, filamentType?: string): ValidationResult => {
      if (value < 170 || value > 300) {
        return {
          valid: false,
          error: 'Nozzle temperature must be between 170°C and 300°C'
        };
      }

      // Material-specific warnings (not errors)
      const materialRanges: Record<string, { min: number; max: number }> = {
        PLA: { min: 190, max: 220 },
        PETG: { min: 230, max: 250 },
        ABS: { min: 240, max: 260 }
      };

      if (filamentType && materialRanges[filamentType]) {
        const range = materialRanges[filamentType];
        if (value < range.min || value > range.max) {
          // Return warning, not error
          return {
            valid: true,
            error: `Temperature ${value}°C is outside typical ${filamentType} range (${range.min}-${range.max}°C). Proceed with caution.`
          };
        }
      }

      return { valid: true };
    }
  }
};

/**
 * Default parameter values for Tier 1 parameters
 */
export const DEFAULT_PARAMETERS = {
  // Quality
  layerHeight: 0.2,
  initialLayerHeight: 0.2,
  wallLoops: 3,
  topShellLayers: 4,
  bottomShellLayers: 3,

  // Infill
  infillDensity: 20,
  infillPattern: 'grid' as const,

  // Support
  enableSupport: false,
  supportType: 'normal' as const,
  supportThresholdAngle: 30,

  // Speed
  outerWallSpeed: 200,
  innerWallSpeed: 300,
  sparseInfillSpeed: 270,
  initialLayerSpeed: 50,

  // Temperature
  nozzleTemperature: 220
};

/**
 * Validate all parameters in a configuration
 *
 * @param config - Configuration object with all parameters
 * @returns Object with validation results for each parameter
 */
export function validateAllParameters(config: Record<string, any>): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  // Quality validations
  results.layerHeight = VALIDATION_RULES.layerHeight.validate(config.layerHeight);
  results.initialLayerHeight = VALIDATION_RULES.initialLayerHeight.validate(
    config.initialLayerHeight,
    config.layerHeight
  );
  results.wallLoops = VALIDATION_RULES.wallLoops.validate(config.wallLoops);
  results.topShellLayers = VALIDATION_RULES.topShellLayers.validate(config.topShellLayers);
  results.bottomShellLayers = VALIDATION_RULES.bottomShellLayers.validate(config.bottomShellLayers);

  // Infill validations
  results.infillDensity = VALIDATION_RULES.infillDensity.validate(config.infillDensity);

  // Support validations
  results.supportThresholdAngle = VALIDATION_RULES.supportThresholdAngle.validate(
    config.supportThresholdAngle
  );

  // Speed validations
  results.outerWallSpeed = VALIDATION_RULES.outerWallSpeed.validate(config.outerWallSpeed);
  results.innerWallSpeed = VALIDATION_RULES.innerWallSpeed.validate(config.innerWallSpeed);
  results.sparseInfillSpeed = VALIDATION_RULES.sparseInfillSpeed.validate(config.sparseInfillSpeed);
  results.initialLayerSpeed = VALIDATION_RULES.initialLayerSpeed.validate(config.initialLayerSpeed);

  // Temperature validations
  results.nozzleTemperature = VALIDATION_RULES.nozzleTemperature.validate(
    config.nozzleTemperature,
    config.filamentType
  );

  return results;
}

/**
 * Check if all validations passed
 *
 * @param results - Validation results from validateAllParameters
 * @returns True if all parameters are valid
 */
export function allValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(result => result.valid);
}

/**
 * Get list of all validation errors
 *
 * @param results - Validation results from validateAllParameters
 * @returns Array of error messages
 */
export function getErrors(results: Record<string, ValidationResult>): string[] {
  return Object.values(results)
    .filter(result => !result.valid && result.error)
    .map(result => result.error!);
}

/**
 * Get list of all warnings (valid but with messages)
 *
 * @param results - Validation results from validateAllParameters
 * @returns Array of warning messages
 */
export function getWarnings(results: Record<string, ValidationResult>): string[] {
  return Object.values(results)
    .filter(result => result.valid && result.error)
    .map(result => result.error!);
}
