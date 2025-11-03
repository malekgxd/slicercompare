import type { SupportType, PrinterModel, ConfigurationParameters } from '../types/database';

// Validation constants
export const LAYER_HEIGHT_MIN = 0.05;
export const LAYER_HEIGHT_MAX = 0.4;
export const LAYER_HEIGHT_STEP = 0.01;

export const INFILL_MIN = 0;
export const INFILL_MAX = 100;

export const PRINT_SPEED_MIN = 50;
export const PRINT_SPEED_MAX = 500;

export const NOZZLE_TEMP_MIN = 180;
export const NOZZLE_TEMP_MAX = 300;

export const BED_TEMP_MIN = 0;
export const BED_TEMP_MAX = 120;

export const WALL_THICKNESS_MIN = 0.4;
export const WALL_THICKNESS_MAX = 10.0;

export const TOP_BOTTOM_THICKNESS_MIN = 0.2;
export const TOP_BOTTOM_THICKNESS_MAX = 5.0;

export const SUPPORT_TYPES: SupportType[] = ['none', 'normal', 'tree'];
export const PRINTER_MODELS: PrinterModel[] = ['X1_Carbon', 'P1P', 'P1S', 'A1_Mini'];

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

// Required parameter validations
export function validateLayerHeight(value: number): ValidationError | null {
  if (value < LAYER_HEIGHT_MIN || value > LAYER_HEIGHT_MAX) {
    return {
      field: 'layer_height',
      message: `Layer height must be between ${LAYER_HEIGHT_MIN}mm and ${LAYER_HEIGHT_MAX}mm`
    };
  }
  return null;
}

export function validateInfillDensity(value: number): ValidationError | null {
  if (!Number.isInteger(value) || value < INFILL_MIN || value > INFILL_MAX) {
    return {
      field: 'infill_density',
      message: `Infill density must be an integer between ${INFILL_MIN}% and ${INFILL_MAX}%`
    };
  }
  return null;
}

export function validateSupportType(value: string): ValidationError | null {
  if (!SUPPORT_TYPES.includes(value as SupportType)) {
    return {
      field: 'support_type',
      message: `Support type must be one of: ${SUPPORT_TYPES.join(', ')}`
    };
  }
  return null;
}

export function validatePrinterModel(value: string): ValidationError | null {
  if (!PRINTER_MODELS.includes(value as PrinterModel)) {
    return {
      field: 'printer_model',
      message: `Printer model must be one of: ${PRINTER_MODELS.join(', ')}`
    };
  }
  return null;
}

export function validateConfigName(value: string): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return {
      field: 'config_name',
      message: 'Configuration name is required'
    };
  }
  if (value.length > 100) {
    return {
      field: 'config_name',
      message: 'Configuration name must be 100 characters or less'
    };
  }
  return null;
}

// Optional parameter validations
export function validatePrintSpeed(value: number | undefined): ValidationError | null {
  if (value === undefined) return null;
  if (value < PRINT_SPEED_MIN || value > PRINT_SPEED_MAX) {
    return {
      field: 'print_speed',
      message: `Print speed must be between ${PRINT_SPEED_MIN} and ${PRINT_SPEED_MAX} mm/s`
    };
  }
  return null;
}

export function validateNozzleTemperature(value: number | undefined): ValidationError | null {
  if (value === undefined) return null;
  if (value < NOZZLE_TEMP_MIN || value > NOZZLE_TEMP_MAX) {
    return {
      field: 'nozzle_temperature',
      message: `Nozzle temperature must be between ${NOZZLE_TEMP_MIN}°C and ${NOZZLE_TEMP_MAX}°C`
    };
  }
  return null;
}

export function validateBedTemperature(value: number | undefined): ValidationError | null {
  if (value === undefined) return null;
  if (value < BED_TEMP_MIN || value > BED_TEMP_MAX) {
    return {
      field: 'bed_temperature',
      message: `Bed temperature must be between ${BED_TEMP_MIN}°C and ${BED_TEMP_MAX}°C`
    };
  }
  return null;
}

export function validateWallThickness(value: number | undefined): ValidationError | null {
  if (value === undefined) return null;
  if (value < WALL_THICKNESS_MIN || value > WALL_THICKNESS_MAX) {
    return {
      field: 'wall_thickness',
      message: `Wall thickness must be between ${WALL_THICKNESS_MIN}mm and ${WALL_THICKNESS_MAX}mm`
    };
  }
  return null;
}

export function validateTopBottomThickness(value: number | undefined): ValidationError | null {
  if (value === undefined) return null;
  if (value < TOP_BOTTOM_THICKNESS_MIN || value > TOP_BOTTOM_THICKNESS_MAX) {
    return {
      field: 'top_bottom_thickness',
      message: `Top/bottom thickness must be between ${TOP_BOTTOM_THICKNESS_MIN}mm and ${TOP_BOTTOM_THICKNESS_MAX}mm`
    };
  }
  return null;
}

// Composite validation
export function validateConfiguration(
  name: string,
  parameters: ConfigurationParameters
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate name
  const nameError = validateConfigName(name);
  if (nameError) errors.push(nameError);

  // Validate required parameters
  const layerHeightError = validateLayerHeight(parameters.layer_height);
  if (layerHeightError) errors.push(layerHeightError);

  const infillError = validateInfillDensity(parameters.infill_density);
  if (infillError) errors.push(infillError);

  const supportError = validateSupportType(parameters.support_type);
  if (supportError) errors.push(supportError);

  const printerError = validatePrinterModel(parameters.printer_model);
  if (printerError) errors.push(printerError);

  // Validate optional parameters if present
  const printSpeedError = validatePrintSpeed(parameters.print_speed);
  if (printSpeedError) errors.push(printSpeedError);

  const nozzleTempError = validateNozzleTemperature(parameters.nozzle_temperature);
  if (nozzleTempError) errors.push(nozzleTempError);

  const bedTempError = validateBedTemperature(parameters.bed_temperature);
  if (bedTempError) errors.push(bedTempError);

  const wallThicknessError = validateWallThickness(parameters.wall_thickness);
  if (wallThicknessError) errors.push(wallThicknessError);

  const topBottomThicknessError = validateTopBottomThickness(parameters.top_bottom_thickness);
  if (topBottomThicknessError) errors.push(topBottomThicknessError);

  return errors;
}

// Helper to check if there are validation errors
export function hasValidationErrors(errors: ValidationError[]): boolean {
  return errors.length > 0;
}
