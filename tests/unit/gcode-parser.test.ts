import { describe, it, expect, beforeEach } from 'vitest';
import { parseGcode, parseGcodeWithFallback } from '../../src/server/services/gcode-parser';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('G-code Parser', () => {
  let tempDir: string;

  beforeEach(async () => {
    // Create temp directory for test files
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gcode-test-'));
  });

  describe('parseGcode', () => {
    it('should parse print time correctly from various formats', async () => {
      const testContent = `; Bambu Studio G-code
; model printing time: 9h 44m 9s; total estimated time: 9h 52m 11s
; total filament weight [g] : 184.94
; layer_count = 100
G28 ; home`;

      const testFile = path.join(tempDir, 'test.gcode');
      await fs.writeFile(testFile, testContent);

      const metrics = await parseGcode(testFile);

      expect(metrics.printTimeMinutes).toBe(584); // 9h 44m
      expect(metrics.filamentUsageGrams.total).toBe(184.94);
      expect(metrics.layerCount).toBe(100);
    });

    it('should parse time without hours correctly', async () => {
      const testContent = `; Bambu Studio G-code
; model printing time: 27m 33s
; total filament weight [g] : 50.5
G28 ; home`;

      const testFile = path.join(tempDir, 'test2.gcode');
      await fs.writeFile(testFile, testContent);

      const metrics = await parseGcode(testFile);

      expect(metrics.printTimeMinutes).toBe(27);
      expect(metrics.filamentUsageGrams.total).toBe(50.5);
    });

    it('should parse multi-color filament correctly', async () => {
      const testContent = `; Bambu Studio G-code
; model printing time: 2h 30m 0s
; total filament weight [g] : 154.57,62.08,95.33
G28 ; home`;

      const testFile = path.join(tempDir, 'test3.gcode');
      await fs.writeFile(testFile, testContent);

      const metrics = await parseGcode(testFile);

      expect(metrics.printTimeMinutes).toBe(150); // 2h 30m
      expect(metrics.filamentUsageGrams.total).toBeCloseTo(311.98, 1);
      expect(metrics.filamentUsageGrams.color1).toBe(154.57);
      expect(metrics.filamentUsageGrams.color2).toBe(62.08);
      expect(metrics.filamentUsageGrams.color3).toBe(95.33);
    });

    it('should throw error when print time is missing', async () => {
      const testContent = `; Bambu Studio G-code
; total filament weight [g] : 100
; no time information
G28 ; home`;

      const testFile = path.join(tempDir, 'test4.gcode');
      await fs.writeFile(testFile, testContent);

      await expect(parseGcode(testFile)).rejects.toThrow('Failed to parse print time');
    });

    it('should handle alternative time formats', async () => {
      const testContent = `; Bambu Studio G-code
; printing time: 45m 10s
; total filament weight [g] : 75.2
G28 ; home`;

      const testFile = path.join(tempDir, 'test5.gcode');
      await fs.writeFile(testFile, testContent);

      const metrics = await parseGcode(testFile);

      expect(metrics.printTimeMinutes).toBe(45);
      expect(metrics.filamentUsageGrams.total).toBe(75.2);
    });
  });

  describe('parseGcodeWithFallback', () => {
    it('should return fallback values on parsing error', async () => {
      const testContent = `; Bambu Studio G-code
; no time information
G28 ; home`;

      const testFile = path.join(tempDir, 'test6.gcode');
      await fs.writeFile(testFile, testContent);

      const result = await parseGcodeWithFallback(testFile);

      expect(result.error).toContain('Failed to parse print time');
      expect(result.metrics.printTimeMinutes).toBe(0);
      expect(result.metrics.filamentUsageGrams.total).toBe(0);
      expect(result.metrics.supportMaterialGrams).toBe(0);
    });

    it('should return metrics without error on successful parse', async () => {
      const testContent = `; Bambu Studio G-code
; model printing time: 1h 15m 30s
; total filament weight [g] : 45.5
G28 ; home`;

      const testFile = path.join(tempDir, 'test7.gcode');
      await fs.writeFile(testFile, testContent);

      const result = await parseGcodeWithFallback(testFile);

      expect(result.error).toBeUndefined();
      expect(result.metrics.printTimeMinutes).toBe(75); // 1h 15m
      expect(result.metrics.filamentUsageGrams.total).toBe(45.5);
    });
  });
});