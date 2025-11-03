/**
 * Settings Generator Tests
 * Story 2.1: Full Bambu Slicer Parameter Exposure
 *
 * Tests for template-based JSON settings file generation
 */

import { describe, it, expect } from 'vitest';
import {
  generateProcessSettings,
  validateProcessSettings
} from './settings-generator';
import type { SettingsConfig } from './settings-generator';
import type { BambuCliOptions } from './bambu-cli';

describe('Settings Generator', () => {
  const mockOptions: BambuCliOptions = {
    inputFile: '/path/to/model.stl',
    outputFile: '/path/to/output.gcode',
    printerModel: 'X1_Carbon',

    // Quality
    layerHeight: 0.2,
    initialLayerHeight: 0.2,
    wallLoops: 3,
    topShellLayers: 4,
    bottomShellLayers: 3,

    // Infill
    infillDensity: 20,
    infillPattern: 'grid',

    // Support
    enableSupport: true,
    supportType: 'tree',
    supportThresholdAngle: 30,

    // Speed
    outerWallSpeed: 200,
    innerWallSpeed: 300,
    sparseInfillSpeed: 270,
    initialLayerSpeed: 50,

    // Temperature
    nozzleTemperature: 220
  };

  const mockConfig: SettingsConfig = {
    configName: 'Test Config',
    configId: 'test-123'
  };

  describe('generateProcessSettings', () => {
    it('should generate valid process settings structure', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);

      expect(settings.type).toBe('process');
      expect(settings.name).toBe('Test Config');
      expect(settings.from).toBe('user');
      expect(settings.inherits).toBe('fdm_process_single_0.20');
      expect(settings.setting_id).toContain('USER_test-123');
    });

    it('should convert all parameters to string arrays', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);

      expect(settings.layer_height).toEqual(['0.2']);
      expect(settings.wall_loops).toEqual(['3']);
      expect(settings.sparse_infill_density).toEqual(['20%']);
      expect(settings.enable_support).toEqual(['1']);
    });

    it('should handle support disabled correctly', () => {
      const optionsWithoutSupport: BambuCliOptions = {
        ...mockOptions,
        enableSupport: false
      };

      const settings = generateProcessSettings(optionsWithoutSupport, mockConfig);

      expect(settings.enable_support).toEqual(['0']);
    });

    it('should include printer compatibility', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);

      expect(settings.compatible_printers).toBeInstanceOf(Array);
      expect(settings.compatible_printers.length).toBeGreaterThan(0);
      expect(settings.compatible_printers[0]).toContain('Bambu Lab');
    });

    it('should format infill density with % symbol', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);

      expect(settings.sparse_infill_density[0]).toMatch(/%$/);
    });

    it('should set correct temperature values', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);

      expect(settings.nozzle_temperature).toEqual(['220']);
      expect(settings.nozzle_temperature_initial_layer).toEqual(['220']);
    });
  });

  describe('validateProcessSettings', () => {
    it('should validate correct settings without errors', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);
      const errors = validateProcessSettings(settings);

      expect(errors).toHaveLength(0);
    });

    it('should reject missing type field', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);
      (settings as any).type = undefined;

      const errors = validateProcessSettings(settings);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('type'))).toBe(true);
    });

    it('should reject empty name', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);
      settings.name = '';

      const errors = validateProcessSettings(settings);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('name'))).toBe(true);
    });

    it('should reject layer height out of range', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);
      settings.layer_height = ['0.5']; // Too high

      const errors = validateProcessSettings(settings);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('layer_height'))).toBe(true);
    });

    it('should reject infill density without % symbol', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);
      settings.sparse_infill_density = ['20']; // Missing %

      const errors = validateProcessSettings(settings);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('%'))).toBe(true);
    });

    it('should reject empty compatible_printers array', () => {
      const settings = generateProcessSettings(mockOptions, mockConfig);
      settings.compatible_printers = [];

      const errors = validateProcessSettings(settings);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('compatible_printers'))).toBe(true);
    });
  });

  describe('Parameter Edge Cases', () => {
    it('should handle minimum layer height', () => {
      const options: BambuCliOptions = {
        ...mockOptions,
        layerHeight: 0.08
      };

      const settings = generateProcessSettings(options, mockConfig);
      const errors = validateProcessSettings(settings);

      expect(errors).toHaveLength(0);
      expect(settings.layer_height).toEqual(['0.08']);
    });

    it('should handle maximum layer height', () => {
      const options: BambuCliOptions = {
        ...mockOptions,
        layerHeight: 0.36
      };

      const settings = generateProcessSettings(options, mockConfig);
      const errors = validateProcessSettings(settings);

      expect(errors).toHaveLength(0);
      expect(settings.layer_height).toEqual(['0.36']);
    });

    it('should handle 0% infill density', () => {
      const options: BambuCliOptions = {
        ...mockOptions,
        infillDensity: 0
      };

      const settings = generateProcessSettings(options, mockConfig);
      const errors = validateProcessSettings(settings);

      expect(errors).toHaveLength(0);
      expect(settings.sparse_infill_density).toEqual(['0%']);
    });

    it('should handle all infill patterns', () => {
      const patterns = ['grid', 'gyroid', 'honeycomb', 'triangle', 'cubic'];

      patterns.forEach(pattern => {
        const options: BambuCliOptions = {
          ...mockOptions,
          infillPattern: pattern as any
        };

        const settings = generateProcessSettings(options, mockConfig);
        expect(settings.sparse_infill_pattern).toEqual([pattern]);
      });
    });
  });
});
