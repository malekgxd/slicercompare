import { describe, it, expect } from 'vitest'
import {
  validateConfigurationName,
  validateLayerHeight,
  validateInfillDensity,
  validateSupportType,
  validatePrinterModel,
  validatePrintSpeed,
  validateNozzleTemperature,
  validateBedTemperature,
  validateWallThickness,
  validateTopBottomThickness,
  validateConfiguration,
  hasValidationErrors,
  LAYER_HEIGHT_MIN,
  LAYER_HEIGHT_MAX,
  LAYER_HEIGHT_STEP,
  INFILL_MIN,
  INFILL_MAX,
  PRINT_SPEED_MIN,
  PRINT_SPEED_MAX,
  NOZZLE_TEMP_MIN,
  NOZZLE_TEMP_MAX,
  BED_TEMP_MIN,
  BED_TEMP_MAX,
  WALL_THICKNESS_MIN,
  WALL_THICKNESS_MAX,
  TOP_BOTTOM_THICKNESS_MIN,
  TOP_BOTTOM_THICKNESS_MAX,
} from '@/utils/validation'

describe('validateConfigurationName', () => {
  it('should accept valid configuration name', () => {
    expect(validateConfigurationName('My Configuration')).toBeNull()
    expect(validateConfigurationName('Test123')).toBeNull()
    expect(validateConfigurationName('A'.repeat(100))).toBeNull()
  })

  it('should reject empty configuration name', () => {
    expect(validateConfigurationName('')).toBe('Configuration name is required')
    expect(validateConfigurationName('   ')).toBe('Configuration name is required')
  })

  it('should reject configuration name over 100 characters', () => {
    const longName = 'A'.repeat(101)
    expect(validateConfigurationName(longName)).toBe(
      'Configuration name must be 100 characters or less'
    )
  })
})

describe('validateLayerHeight', () => {
  it('should accept valid layer height within range', () => {
    expect(validateLayerHeight(0.2)).toBeNull()
    expect(validateLayerHeight(0.1)).toBeNull()
    expect(validateLayerHeight(0.07)).toBeNull()
    expect(validateLayerHeight(0.13)).toBeNull()
    expect(validateLayerHeight(0.14)).toBeNull()
  })

  it('should reject layer height below minimum', () => {
    expect(validateLayerHeight(0.04)).toContain(
      `Layer height must be between ${LAYER_HEIGHT_MIN}mm and ${LAYER_HEIGHT_MAX}mm`
    )
  })

  it('should reject layer height above maximum', () => {
    expect(validateLayerHeight(0.5)).toContain(
      `Layer height must be between ${LAYER_HEIGHT_MIN}mm and ${LAYER_HEIGHT_MAX}mm`
    )
  })

  it('should reject non-numeric values', () => {
    expect(validateLayerHeight(NaN)).toBe('Layer height must be a number')
  })

  it('should reject null/undefined values', () => {
    expect(validateLayerHeight(null as any)).toBe('Layer height is required')
    expect(validateLayerHeight(undefined as any)).toBe('Layer height is required')
  })

  it('should reject values not in step increments', () => {
    expect(validateLayerHeight(0.123)).toContain(
      `Layer height must be in ${LAYER_HEIGHT_STEP}mm increments`
    )
  })

  it('should accept boundary values', () => {
    expect(validateLayerHeight(LAYER_HEIGHT_MIN)).toBeNull()
    expect(validateLayerHeight(LAYER_HEIGHT_MAX)).toBeNull()
  })
})

describe('validateInfillDensity', () => {
  it('should accept valid infill density', () => {
    expect(validateInfillDensity(20)).toBeNull()
    expect(validateInfillDensity(50)).toBeNull()
    expect(validateInfillDensity(100)).toBeNull()
    expect(validateInfillDensity(0)).toBeNull()
  })

  it('should reject non-integer values', () => {
    expect(validateInfillDensity(20.5)).toBe('Infill density must be a whole number')
  })

  it('should reject values below minimum', () => {
    expect(validateInfillDensity(-1)).toContain(
      `Infill density must be between ${INFILL_MIN}% and ${INFILL_MAX}%`
    )
  })

  it('should reject values above maximum', () => {
    expect(validateInfillDensity(101)).toContain(
      `Infill density must be between ${INFILL_MIN}% and ${INFILL_MAX}%`
    )
  })

  it('should reject NaN values', () => {
    expect(validateInfillDensity(NaN)).toBe('Infill density must be a number')
  })

  it('should reject null/undefined values', () => {
    expect(validateInfillDensity(null as any)).toBe('Infill density is required')
    expect(validateInfillDensity(undefined as any)).toBe('Infill density is required')
  })
})

describe('validateSupportType', () => {
  it('should accept valid support types', () => {
    expect(validateSupportType('none')).toBeNull()
    expect(validateSupportType('normal')).toBeNull()
    expect(validateSupportType('tree')).toBeNull()
  })

  it('should reject invalid support types', () => {
    expect(validateSupportType('invalid')).toContain(
      'Support type must be one of: none, normal, tree'
    )
  })

  it('should reject empty support type', () => {
    expect(validateSupportType('')).toBe('Support type is required')
  })

  it('should be case-sensitive', () => {
    expect(validateSupportType('None')).toContain(
      'Support type must be one of: none, normal, tree'
    )
  })
})

describe('validatePrinterModel', () => {
  it('should accept valid printer models', () => {
    expect(validatePrinterModel('X1_Carbon')).toBeNull()
    expect(validatePrinterModel('P1P')).toBeNull()
    expect(validatePrinterModel('P1S')).toBeNull()
    expect(validatePrinterModel('A1_Mini')).toBeNull()
  })

  it('should reject invalid printer models', () => {
    expect(validatePrinterModel('InvalidPrinter')).toContain(
      'Printer model must be one of:'
    )
  })

  it('should reject empty printer model', () => {
    expect(validatePrinterModel('')).toBe('Printer model is required')
  })
})

describe('validatePrintSpeed (optional parameter)', () => {
  it('should accept valid print speeds', () => {
    expect(validatePrintSpeed(100)).toBeNull()
    expect(validatePrintSpeed(PRINT_SPEED_MIN)).toBeNull()
    expect(validatePrintSpeed(PRINT_SPEED_MAX)).toBeNull()
  })

  it('should accept undefined (optional field)', () => {
    expect(validatePrintSpeed(undefined)).toBeNull()
    expect(validatePrintSpeed(null as any)).toBeNull()
  })

  it('should reject values below minimum', () => {
    expect(validatePrintSpeed(49)).toContain(
      `Print speed must be between ${PRINT_SPEED_MIN} and ${PRINT_SPEED_MAX} mm/s`
    )
  })

  it('should reject values above maximum', () => {
    expect(validatePrintSpeed(501)).toContain(
      `Print speed must be between ${PRINT_SPEED_MIN} and ${PRINT_SPEED_MAX} mm/s`
    )
  })

  it('should reject NaN values', () => {
    expect(validatePrintSpeed(NaN)).toBe('Print speed must be a number')
  })
})

describe('validateNozzleTemperature (optional parameter)', () => {
  it('should accept valid nozzle temperatures', () => {
    expect(validateNozzleTemperature(220)).toBeNull()
    expect(validateNozzleTemperature(NOZZLE_TEMP_MIN)).toBeNull()
    expect(validateNozzleTemperature(NOZZLE_TEMP_MAX)).toBeNull()
  })

  it('should accept undefined (optional field)', () => {
    expect(validateNozzleTemperature(undefined)).toBeNull()
    expect(validateNozzleTemperature(null as any)).toBeNull()
  })

  it('should reject non-integer values', () => {
    expect(validateNozzleTemperature(220.5)).toBe(
      'Nozzle temperature must be a whole number'
    )
  })

  it('should reject values below minimum', () => {
    expect(validateNozzleTemperature(179)).toContain(
      `Nozzle temperature must be between ${NOZZLE_TEMP_MIN}°C and ${NOZZLE_TEMP_MAX}°C`
    )
  })

  it('should reject values above maximum', () => {
    expect(validateNozzleTemperature(301)).toContain(
      `Nozzle temperature must be between ${NOZZLE_TEMP_MIN}°C and ${NOZZLE_TEMP_MAX}°C`
    )
  })

  it('should reject NaN values', () => {
    expect(validateNozzleTemperature(NaN)).toBe('Nozzle temperature must be a number')
  })
})

describe('validateBedTemperature (optional parameter)', () => {
  it('should accept valid bed temperatures', () => {
    expect(validateBedTemperature(60)).toBeNull()
    expect(validateBedTemperature(BED_TEMP_MIN)).toBeNull()
    expect(validateBedTemperature(BED_TEMP_MAX)).toBeNull()
  })

  it('should accept undefined (optional field)', () => {
    expect(validateBedTemperature(undefined)).toBeNull()
    expect(validateBedTemperature(null as any)).toBeNull()
  })

  it('should reject non-integer values', () => {
    expect(validateBedTemperature(60.5)).toBe(
      'Bed temperature must be a whole number'
    )
  })

  it('should reject values below minimum', () => {
    expect(validateBedTemperature(-1)).toContain(
      `Bed temperature must be between ${BED_TEMP_MIN}°C and ${BED_TEMP_MAX}°C`
    )
  })

  it('should reject values above maximum', () => {
    expect(validateBedTemperature(121)).toContain(
      `Bed temperature must be between ${BED_TEMP_MIN}°C and ${BED_TEMP_MAX}°C`
    )
  })

  it('should reject NaN values', () => {
    expect(validateBedTemperature(NaN)).toBe('Bed temperature must be a number')
  })
})

describe('validateWallThickness (optional parameter)', () => {
  it('should accept valid wall thickness', () => {
    expect(validateWallThickness(1.2)).toBeNull()
    expect(validateWallThickness(WALL_THICKNESS_MIN)).toBeNull()
    expect(validateWallThickness(WALL_THICKNESS_MAX)).toBeNull()
  })

  it('should accept undefined (optional field)', () => {
    expect(validateWallThickness(undefined)).toBeNull()
    expect(validateWallThickness(null as any)).toBeNull()
  })

  it('should reject values below minimum', () => {
    expect(validateWallThickness(0.3)).toContain(
      `Wall thickness must be between ${WALL_THICKNESS_MIN}mm and ${WALL_THICKNESS_MAX}mm`
    )
  })

  it('should reject values above maximum', () => {
    expect(validateWallThickness(10.1)).toContain(
      `Wall thickness must be between ${WALL_THICKNESS_MIN}mm and ${WALL_THICKNESS_MAX}mm`
    )
  })

  it('should reject NaN values', () => {
    expect(validateWallThickness(NaN)).toBe('Wall thickness must be a number')
  })
})

describe('validateTopBottomThickness (optional parameter)', () => {
  it('should accept valid top/bottom thickness', () => {
    expect(validateTopBottomThickness(0.8)).toBeNull()
    expect(validateTopBottomThickness(TOP_BOTTOM_THICKNESS_MIN)).toBeNull()
    expect(validateTopBottomThickness(TOP_BOTTOM_THICKNESS_MAX)).toBeNull()
  })

  it('should accept undefined (optional field)', () => {
    expect(validateTopBottomThickness(undefined)).toBeNull()
    expect(validateTopBottomThickness(null as any)).toBeNull()
  })

  it('should reject values below minimum', () => {
    expect(validateTopBottomThickness(0.1)).toContain(
      `Top/bottom thickness must be between ${TOP_BOTTOM_THICKNESS_MIN}mm and ${TOP_BOTTOM_THICKNESS_MAX}mm`
    )
  })

  it('should reject values above maximum', () => {
    expect(validateTopBottomThickness(5.1)).toContain(
      `Top/bottom thickness must be between ${TOP_BOTTOM_THICKNESS_MIN}mm and ${TOP_BOTTOM_THICKNESS_MAX}mm`
    )
  })

  it('should reject NaN values', () => {
    expect(validateTopBottomThickness(NaN)).toBe(
      'Top/bottom thickness must be a number'
    )
  })
})

describe('validateConfiguration', () => {
  it('should return empty object for valid configuration', () => {
    const validConfig = {
      config_name: 'Test Config',
      layer_height: 0.2,
      infill_density: 20,
      support_type: 'none',
      printer_model: 'X1_Carbon',
    }

    const errors = validateConfiguration(validConfig)
    expect(errors).toEqual({})
  })

  it('should return errors for all invalid required fields', () => {
    const invalidConfig = {
      config_name: '',
      layer_height: 999,
      infill_density: -1,
      support_type: 'invalid',
      printer_model: 'invalid',
    }

    const errors = validateConfiguration(invalidConfig)

    expect(errors.config_name).toBeTruthy()
    expect(errors.layer_height).toBeTruthy()
    expect(errors.infill_density).toBeTruthy()
    expect(errors.support_type).toBeTruthy()
    expect(errors.printer_model).toBeTruthy()
  })

  it('should validate optional parameters when provided', () => {
    const configWithInvalidOptionals = {
      config_name: 'Test',
      layer_height: 0.2,
      infill_density: 20,
      support_type: 'none',
      printer_model: 'X1_Carbon',
      print_speed: 999,
      nozzle_temperature: 999,
      bed_temperature: 999,
      wall_thickness: 999,
      top_bottom_thickness: 999,
    }

    const errors = validateConfiguration(configWithInvalidOptionals)

    expect(errors.print_speed).toBeTruthy()
    expect(errors.nozzle_temperature).toBeTruthy()
    expect(errors.bed_temperature).toBeTruthy()
    expect(errors.wall_thickness).toBeTruthy()
    expect(errors.top_bottom_thickness).toBeTruthy()
  })

  it('should not return errors for valid optional parameters', () => {
    const configWithValidOptionals = {
      config_name: 'Test',
      layer_height: 0.2,
      infill_density: 20,
      support_type: 'none',
      printer_model: 'X1_Carbon',
      print_speed: 100,
      nozzle_temperature: 220,
      bed_temperature: 60,
      wall_thickness: 1.2,
      top_bottom_thickness: 0.8,
    }

    const errors = validateConfiguration(configWithValidOptionals)
    expect(errors).toEqual({})
  })

  it('should not return errors for undefined optional parameters', () => {
    const configWithoutOptionals = {
      config_name: 'Test',
      layer_height: 0.2,
      infill_density: 20,
      support_type: 'none',
      printer_model: 'X1_Carbon',
    }

    const errors = validateConfiguration(configWithoutOptionals)
    expect(errors).toEqual({})
  })
})

describe('hasValidationErrors', () => {
  it('should return false for empty errors object', () => {
    expect(hasValidationErrors({})).toBe(false)
  })

  it('should return true when errors object has properties', () => {
    expect(hasValidationErrors({ config_name: 'error' })).toBe(true)
    expect(hasValidationErrors({ layer_height: 'error', infill_density: 'error' })).toBe(
      true
    )
  })
})
