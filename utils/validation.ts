/**
 * Validation utilities for slicer configuration parameters
 * Based on Story 1.4 schema/config-parameters.schema.json
 */

// Validation constants
export const LAYER_HEIGHT_MIN = 0.05
export const LAYER_HEIGHT_MAX = 0.4
export const LAYER_HEIGHT_STEP = 0.01

export const INFILL_MIN = 0
export const INFILL_MAX = 100

export const SUPPORT_TYPES = ['none', 'normal', 'tree'] as const
export type SupportType = typeof SUPPORT_TYPES[number]

export const PRINTER_MODELS = ['X1_Carbon', 'P1P', 'P1S', 'A1_Mini'] as const
export type PrinterModel = typeof PRINTER_MODELS[number]

export const PRINT_SPEED_MIN = 50
export const PRINT_SPEED_MAX = 500

export const NOZZLE_TEMP_MIN = 180
export const NOZZLE_TEMP_MAX = 300

export const BED_TEMP_MIN = 0
export const BED_TEMP_MAX = 120

export const WALL_THICKNESS_MIN = 0.4
export const WALL_THICKNESS_MAX = 10.0

export const TOP_BOTTOM_THICKNESS_MIN = 0.2
export const TOP_BOTTOM_THICKNESS_MAX = 5.0

// Validation functions

export function validateConfigurationName(value: string): string | null {
  if (!value || value.trim().length === 0) {
    return 'Configuration name is required'
  }

  if (value.length > 100) {
    return 'Configuration name must be 100 characters or less'
  }

  return null
}

export function validateLayerHeight(value: number): string | null {
  if (value === null || value === undefined) {
    return 'Layer height is required'
  }

  if (isNaN(value)) {
    return 'Layer height must be a number'
  }

  if (value < LAYER_HEIGHT_MIN || value > LAYER_HEIGHT_MAX) {
    return `Layer height must be between ${LAYER_HEIGHT_MIN}mm and ${LAYER_HEIGHT_MAX}mm`
  }

  // Check if value is a multiple of step
  const remainder = (value - LAYER_HEIGHT_MIN) % LAYER_HEIGHT_STEP
  if (Math.abs(remainder) > 0.001) { // Small tolerance for floating point
    return `Layer height must be in ${LAYER_HEIGHT_STEP}mm increments`
  }

  return null
}

export function validateInfillDensity(value: number): string | null {
  if (value === null || value === undefined) {
    return 'Infill density is required'
  }

  if (isNaN(value)) {
    return 'Infill density must be a number'
  }

  if (!Number.isInteger(value)) {
    return 'Infill density must be a whole number'
  }

  if (value < INFILL_MIN || value > INFILL_MAX) {
    return `Infill density must be between ${INFILL_MIN}% and ${INFILL_MAX}%`
  }

  return null
}

export function validateSupportType(value: string): string | null {
  if (!value) {
    return 'Support type is required'
  }

  if (!SUPPORT_TYPES.includes(value as SupportType)) {
    return `Support type must be one of: ${SUPPORT_TYPES.join(', ')}`
  }

  return null
}

export function validatePrinterModel(value: string): string | null {
  if (!value) {
    return 'Printer model is required'
  }

  if (!PRINTER_MODELS.includes(value as PrinterModel)) {
    return `Printer model must be one of: ${PRINTER_MODELS.join(', ')}`
  }

  return null
}

// Optional parameter validation

export function validatePrintSpeed(value: number | undefined): string | null {
  if (value === undefined || value === null) {
    return null // Optional field
  }

  if (isNaN(value)) {
    return 'Print speed must be a number'
  }

  if (value < PRINT_SPEED_MIN || value > PRINT_SPEED_MAX) {
    return `Print speed must be between ${PRINT_SPEED_MIN} and ${PRINT_SPEED_MAX} mm/s`
  }

  return null
}

export function validateNozzleTemperature(value: number | undefined): string | null {
  if (value === undefined || value === null) {
    return null // Optional field
  }

  if (isNaN(value)) {
    return 'Nozzle temperature must be a number'
  }

  if (!Number.isInteger(value)) {
    return 'Nozzle temperature must be a whole number'
  }

  if (value < NOZZLE_TEMP_MIN || value > NOZZLE_TEMP_MAX) {
    return `Nozzle temperature must be between ${NOZZLE_TEMP_MIN}°C and ${NOZZLE_TEMP_MAX}°C`
  }

  return null
}

export function validateBedTemperature(value: number | undefined): string | null {
  if (value === undefined || value === null) {
    return null // Optional field
  }

  if (isNaN(value)) {
    return 'Bed temperature must be a number'
  }

  if (!Number.isInteger(value)) {
    return 'Bed temperature must be a whole number'
  }

  if (value < BED_TEMP_MIN || value > BED_TEMP_MAX) {
    return `Bed temperature must be between ${BED_TEMP_MIN}°C and ${BED_TEMP_MAX}°C`
  }

  return null
}

export function validateWallThickness(value: number | undefined): string | null {
  if (value === undefined || value === null) {
    return null // Optional field
  }

  if (isNaN(value)) {
    return 'Wall thickness must be a number'
  }

  if (value < WALL_THICKNESS_MIN || value > WALL_THICKNESS_MAX) {
    return `Wall thickness must be between ${WALL_THICKNESS_MIN}mm and ${WALL_THICKNESS_MAX}mm`
  }

  return null
}

export function validateTopBottomThickness(value: number | undefined): string | null {
  if (value === undefined || value === null) {
    return null // Optional field
  }

  if (isNaN(value)) {
    return 'Top/bottom thickness must be a number'
  }

  if (value < TOP_BOTTOM_THICKNESS_MIN || value > TOP_BOTTOM_THICKNESS_MAX) {
    return `Top/bottom thickness must be between ${TOP_BOTTOM_THICKNESS_MIN}mm and ${TOP_BOTTOM_THICKNESS_MAX}mm`
  }

  return null
}

// Complete configuration validation
export interface ConfigurationInput {
  config_name: string
  layer_height: number
  infill_density: number
  support_type: string
  printer_model: string
  print_speed?: number
  nozzle_temperature?: number
  bed_temperature?: number
  wall_thickness?: number
  top_bottom_thickness?: number
}

export interface ValidationErrors {
  config_name?: string
  layer_height?: string
  infill_density?: string
  support_type?: string
  printer_model?: string
  print_speed?: string
  nozzle_temperature?: string
  bed_temperature?: string
  wall_thickness?: string
  top_bottom_thickness?: string
}

export function validateConfiguration(input: ConfigurationInput): ValidationErrors {
  const errors: ValidationErrors = {}

  const nameError = validateConfigurationName(input.config_name)
  if (nameError) errors.config_name = nameError

  const layerHeightError = validateLayerHeight(input.layer_height)
  if (layerHeightError) errors.layer_height = layerHeightError

  const infillError = validateInfillDensity(input.infill_density)
  if (infillError) errors.infill_density = infillError

  const supportError = validateSupportType(input.support_type)
  if (supportError) errors.support_type = supportError

  const printerError = validatePrinterModel(input.printer_model)
  if (printerError) errors.printer_model = printerError

  const printSpeedError = validatePrintSpeed(input.print_speed)
  if (printSpeedError) errors.print_speed = printSpeedError

  const nozzleTempError = validateNozzleTemperature(input.nozzle_temperature)
  if (nozzleTempError) errors.nozzle_temperature = nozzleTempError

  const bedTempError = validateBedTemperature(input.bed_temperature)
  if (bedTempError) errors.bed_temperature = bedTempError

  const wallThicknessError = validateWallThickness(input.wall_thickness)
  if (wallThicknessError) errors.wall_thickness = wallThicknessError

  const topBottomThicknessError = validateTopBottomThickness(input.top_bottom_thickness)
  if (topBottomThicknessError) errors.top_bottom_thickness = topBottomThicknessError

  return errors
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0
}
