import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { promises as fs } from 'fs';

const execAsync = promisify(exec);

/**
 * PROOF OF CONCEPT - Story 1.3
 * Bambu Slicer CLI Integration Spike
 *
 * WARNING: This is experimental code for validation only.
 * DO NOT USE IN PRODUCTION without proper error handling,
 * security review, and integration with existing services.
 *
 * Findings from this spike will inform Story 1.6 implementation.
 */

export interface PocTestResult {
  testName: string;
  success: boolean;
  duration: number;
  findings: string[];
  errors: string[];
  metadata?: Record<string, any>;
}

class BambuCliPoc {
  // Bambu Studio CLI path (discovered during spike)
  private readonly CLI_PATH = 'C:\\Program Files\\Bambu Studio\\bambu-studio.exe';
  private readonly CLI_VERSION = 'BambuStudio-02.03.01.51';

  /**
   * Test 1: Verify Bambu CLI is accessible and get version
   */
  async testCliAvailability(): Promise<PocTestResult> {
    const startTime = Date.now();
    const result: PocTestResult = {
      testName: 'CLI Availability and Version Detection',
      success: false,
      duration: 0,
      findings: [],
      errors: [],
      metadata: {}
    };

    try {
      // Check if file exists
      await fs.access(this.CLI_PATH);
      result.findings.push(`✓ CLI found at: ${this.CLI_PATH}`);

      // Get version and help
      const { stdout, stderr } = await execAsync(`"${this.CLI_PATH}" --help`, {
        timeout: 10000
      });

      const versionMatch = stdout.match(/BambuStudio-(\S+):/);
      if (versionMatch) {
        result.metadata!.version = versionMatch[1];
        result.findings.push(`✓ Version detected: ${versionMatch[1]}`);
      }

      // Parse available options
      const optionLines = stdout.split('\n').filter(line => line.trim().startsWith('--'));
      result.metadata!.availableOptions = optionLines.length;
      result.findings.push(`✓ Available CLI options: ${optionLines.length}`);

      // Check for critical options
      const hasSlice = stdout.includes('--slice');
      const hasExport = stdout.includes('--export-3mf');
      const hasLoadSettings = stdout.includes('--load-settings');
      const hasOutputDir = stdout.includes('--outputdir');

      result.findings.push(`✓ --slice option: ${hasSlice ? 'AVAILABLE' : 'MISSING'}`);
      result.findings.push(`✓ --export-3mf option: ${hasExport ? 'AVAILABLE' : 'MISSING'}`);
      result.findings.push(`✓ --load-settings option: ${hasLoadSettings ? 'AVAILABLE' : 'MISSING'}`);
      result.findings.push(`✓ --outputdir option: ${hasOutputDir ? 'AVAILABLE' : 'MISSING'}`);

      result.metadata!.criticalOptions = {
        slice: hasSlice,
        export3mf: hasExport,
        loadSettings: hasLoadSettings,
        outputDir: hasOutputDir
      };

      if (stderr) {
        result.findings.push(`Note: stderr output present (${stderr.length} chars)`);
      }

      result.success = true;
    } catch (error: any) {
      result.errors.push(`✗ ${error.message}`);

      if (error.code === 'ENOENT') {
        result.errors.push('✗ CLI not found - Bambu Studio may not be installed');
        result.findings.push('Alternative: Check OrcaSlicer at C:\\Program Files\\OrcaSlicer\\orca-slicer.exe');
      }
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Test 2: Execute a basic slice command (requires sample STL file)
   */
  async testSliceExecution(
    stlPath: string,
    outputDir: string,
    settingsFile?: string
  ): Promise<PocTestResult> {
    const startTime = Date.now();
    const result: PocTestResult = {
      testName: 'Basic Slice Execution',
      success: false,
      duration: 0,
      findings: [],
      errors: [],
      metadata: {}
    };

    try {
      // Ensure output directory exists
      await fs.mkdir(outputDir, { recursive: true });
      result.findings.push(`✓ Output directory created: ${outputDir}`);

      // Verify input file exists
      const stats = await fs.stat(stlPath);
      result.findings.push(`✓ Input file size: ${(stats.size / 1024).toFixed(2)} KB`);
      result.metadata!.inputFileSize = stats.size;

      // Construct slice command
      // NOTE: Based on --help, syntax is:
      // bambu-studio [OPTIONS] file.stl
      // Options: --slice 0 (all plates), --outputdir, --load-settings
      let command = `"${this.CLI_PATH}"`;
      command += ` --slice 0`;  // Slice all plates
      command += ` --outputdir "${outputDir}"`;

      if (settingsFile) {
        command += ` --load-settings "${settingsFile}"`;
        result.findings.push(`✓ Using settings file: ${settingsFile}`);
      }

      command += ` "${stlPath}"`;

      result.findings.push(`Command: ${command}`);
      result.metadata!.command = command;

      // Execute with timeout (slicing can take time)
      const { stdout, stderr } = await execAsync(command, {
        timeout: 120000, // 2 minute timeout for slicing
        maxBuffer: 1024 * 1024 // 1MB buffer for output
      });

      result.findings.push(`✓ Command completed successfully`);

      if (stdout) {
        const stdoutLines = stdout.split('\n').length;
        result.findings.push(`Stdout lines: ${stdoutLines}`);
        result.metadata!.stdout = stdout.substring(0, 500); // First 500 chars
      }

      if (stderr) {
        const stderrLines = stderr.split('\n').length;
        result.findings.push(`Stderr lines: ${stderrLines}`);
        result.metadata!.stderr = stderr.substring(0, 500);
      }

      // Check for output files
      const outputFiles = await fs.readdir(outputDir);
      result.findings.push(`✓ Output files created: ${outputFiles.length}`);
      result.metadata!.outputFiles = outputFiles;

      // Look for .gcode or .3mf files
      const gcodeFiles = outputFiles.filter(f => f.endsWith('.gcode'));
      const threemfFiles = outputFiles.filter(f => f.endsWith('.3mf'));

      if (gcodeFiles.length > 0) {
        result.findings.push(`✓ G-code files: ${gcodeFiles.join(', ')}`);

        // Get size of first gcode file
        const gcodeStats = await fs.stat(path.join(outputDir, gcodeFiles[0]));
        result.findings.push(`✓ G-code file size: ${(gcodeStats.size / 1024).toFixed(2)} KB`);
        result.metadata!.gcodeFile = gcodeFiles[0];
        result.metadata!.gcodeFileSize = gcodeStats.size;
        result.success = true;
      }

      if (threemfFiles.length > 0) {
        result.findings.push(`✓ 3MF files: ${threemfFiles.join(', ')}`);
      }

      if (gcodeFiles.length === 0 && threemfFiles.length === 0) {
        result.errors.push('✗ No G-code or 3MF files generated');
        result.findings.push('This may indicate slicing failed or incorrect output location');
      }

    } catch (error: any) {
      result.errors.push(`✗ Slice execution failed: ${error.message}`);

      if (error.code === 'ETIMEDOUT') {
        result.errors.push('✗ Command timed out after 2 minutes');
      }

      if (error.killed) {
        result.errors.push('✗ Process was killed');
      }
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Test 3: Parse G-code output and extract metadata
   */
  async testGcodeOutput(gcodePath: string): Promise<PocTestResult> {
    const startTime = Date.now();
    const result: PocTestResult = {
      testName: 'G-code Output Parsing',
      success: false,
      duration: 0,
      findings: [],
      errors: [],
      metadata: {}
    };

    try {
      const content = await fs.readFile(gcodePath, 'utf-8');
      const lines = content.split('\n');

      result.findings.push(`✓ Total lines: ${lines.length}`);
      result.metadata!.totalLines = lines.length;

      // Analyze metadata comments (lines starting with ;)
      const metadataLines = lines
        .filter(line => line.trim().startsWith(';'))
        .slice(0, 100); // First 100 comment lines

      result.findings.push(`✓ Metadata comment lines: ${metadataLines.length}`);

      // Look for key metadata patterns
      const patterns = {
        printTime: /; estimated printing time.*=.*(\d+h\s*\d+m|\d+m\s*\d+s)/i,
        filament: /; filament.*=.*([\d.]+)mm/i,
        layerHeight: /; layer_height.*=.*([\d.]+)/i,
        infill: /; infill.*=.*(\d+)%/i,
        support: /; support_material.*=.*(true|false|1|0)/i,
      };

      const extractedMetadata: Record<string, string> = {};

      for (const line of metadataLines) {
        // Check each pattern
        if (patterns.printTime.test(line)) {
          const match = line.match(patterns.printTime);
          if (match) {
            extractedMetadata.printTime = match[1];
            result.findings.push(`✓ Found print time: ${match[1]}`);
          }
        }

        if (patterns.filament.test(line)) {
          const match = line.match(patterns.filament);
          if (match) {
            extractedMetadata.filamentLength = match[1] + 'mm';
            result.findings.push(`✓ Found filament length: ${match[1]}mm`);
          }
        }

        if (patterns.layerHeight.test(line)) {
          const match = line.match(patterns.layerHeight);
          if (match) {
            extractedMetadata.layerHeight = match[1];
            result.findings.push(`✓ Found layer height: ${match[1]}`);
          }
        }

        if (patterns.infill.test(line)) {
          const match = line.match(patterns.infill);
          if (match) {
            extractedMetadata.infillDensity = match[1] + '%';
            result.findings.push(`✓ Found infill density: ${match[1]}%`);
          }
        }

        if (patterns.support.test(line)) {
          const match = line.match(patterns.support);
          if (match) {
            extractedMetadata.supportMaterial = match[1];
            result.findings.push(`✓ Found support material: ${match[1]}`);
          }
        }
      }

      result.metadata!.extractedMetadata = extractedMetadata;

      // Show sample metadata lines
      result.findings.push('\nSample metadata lines:');
      metadataLines.slice(0, 10).forEach(line => {
        result.findings.push(`  ${line.substring(0, 100)}`);
      });

      // Count actual G-code commands (non-comment lines)
      const gcodeCommands = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.startsWith(';');
      });

      result.findings.push(`\n✓ G-code command lines: ${gcodeCommands.length}`);
      result.metadata!.gcodeCommandCount = gcodeCommands.length;

      result.success = Object.keys(extractedMetadata).length > 0;

      if (!result.success) {
        result.findings.push('\n⚠ Warning: No metadata extracted. G-code format may differ from expected.');
      }

    } catch (error: any) {
      result.errors.push(`✗ Failed to parse G-code: ${error.message}`);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Test 4: Test parameter passing via JSON settings file
   */
  async testParameterPassing(
    settingsPath: string
  ): Promise<PocTestResult> {
    const startTime = Date.now();
    const result: PocTestResult = {
      testName: 'Parameter Passing via Settings File',
      success: false,
      duration: 0,
      findings: [],
      errors: [],
      metadata: {}
    };

    try {
      // Read and validate settings file
      const settingsContent = await fs.readFile(settingsPath, 'utf-8');
      const settings = JSON.parse(settingsContent);

      result.findings.push(`✓ Settings file loaded: ${settingsPath}`);
      result.findings.push(`✓ Settings keys: ${Object.keys(settings).length}`);
      result.metadata!.settingsKeys = Object.keys(settings);

      // Document key parameters if present
      const keyParams = ['layer_height', 'infill_density', 'support_material', 'printer_model'];
      keyParams.forEach(param => {
        if (settings[param] !== undefined) {
          result.findings.push(`✓ ${param}: ${settings[param]}`);
        } else {
          result.findings.push(`⚠ ${param}: not found in settings`);
        }
      });

      result.success = true;

      result.findings.push('\nNote: Actual parameter effect validation requires test slicing');
      result.findings.push('Run testSliceExecution() with this settings file to verify parameters apply');

    } catch (error: any) {
      result.errors.push(`✗ Failed to load settings file: ${error.message}`);

      if (error.code === 'ENOENT') {
        result.findings.push('Settings file format needs to be discovered');
        result.findings.push('Check Bambu Studio config directory for examples');
      }
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Test 5: Error handling scenarios
   */
  async testErrorScenarios(): Promise<PocTestResult> {
    const startTime = Date.now();
    const result: PocTestResult = {
      testName: 'Error Scenario Testing',
      success: true, // Success means we documented errors, not that they didn't occur
      duration: 0,
      findings: [],
      errors: [],
      metadata: {}
    };

    const scenarios: Array<{ name: string; test: () => Promise<void> }> = [];

    // Scenario 1: Non-existent STL file
    scenarios.push({
      name: 'Non-existent STL file',
      test: async () => {
        try {
          const tempDir = path.join(process.cwd(), 'temp-poc-test');
          await execAsync(`"${this.CLI_PATH}" --slice 0 --outputdir "${tempDir}" "nonexistent.stl"`, {
            timeout: 10000
          });
          result.findings.push('✗ Scenario 1: No error thrown for non-existent file');
        } catch (error: any) {
          result.findings.push(`✓ Scenario 1: Error caught - ${error.message.substring(0, 100)}`);
        }
      }
    });

    // Scenario 2: Invalid output directory (read-only)
    scenarios.push({
      name: 'Invalid output directory',
      test: async () => {
        try {
          // Try to use root drive as output (typically read-only)
          const sampleFile = path.join(process.cwd(), 'sample.stl');
          await execAsync(`"${this.CLI_PATH}" --slice 0 --outputdir "C:\\" "${sampleFile}"`, {
            timeout: 10000
          });
          result.findings.push('⚠ Scenario 2: No error for invalid output directory');
        } catch (error: any) {
          result.findings.push(`✓ Scenario 2: Error caught - ${error.message.substring(0, 100)}`);
        }
      }
    });

    // Run all scenarios
    for (const scenario of scenarios) {
      try {
        await scenario.test();
      } catch (error: any) {
        result.findings.push(`✗ Scenario "${scenario.name}" test execution failed: ${error.message}`);
      }
    }

    result.findings.push('\nError handling conclusions:');
    result.findings.push('- CLI errors are caught by child_process try/catch');
    result.findings.push('- Exit codes and stderr should be checked for error details');
    result.findings.push('- User-friendly error messages need to be mapped from CLI errors');

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Run all POC tests in sequence
   */
  async runAllTests(options?: {
    sampleStlPath?: string;
    outputDir?: string;
    settingsFile?: string;
  }): Promise<PocTestResult[]> {
    const results: PocTestResult[] = [];

    console.log('='.repeat(60));
    console.log('BAMBU CLI POC - Running All Tests');
    console.log('Story 1.3: Bambu Slicer CLI Integration Spike');
    console.log('='.repeat(60));

    // Test 1: CLI Availability
    console.log('\n[1/5] Testing CLI Availability...');
    const test1 = await this.testCliAvailability();
    results.push(test1);
    console.log(`Result: ${test1.success ? '✓ PASS' : '✗ FAIL'} (${test1.duration}ms)`);

    // Test 2 & 3: Only if sample STL provided
    if (options?.sampleStlPath && options?.outputDir) {
      console.log('\n[2/5] Testing Slice Execution...');
      const test2 = await this.testSliceExecution(
        options.sampleStlPath,
        options.outputDir,
        options.settingsFile
      );
      results.push(test2);
      console.log(`Result: ${test2.success ? '✓ PASS' : '✗ FAIL'} (${test2.duration}ms)`);

      // Test 3: Parse output if slice succeeded
      if (test2.success && test2.metadata?.gcodeFile) {
        console.log('\n[3/5] Testing G-code Parsing...');
        const gcodeFile = path.join(options.outputDir, test2.metadata.gcodeFile);
        const test3 = await this.testGcodeOutput(gcodeFile);
        results.push(test3);
        console.log(`Result: ${test3.success ? '✓ PASS' : '✗ FAIL'} (${test3.duration}ms)`);
      } else {
        console.log('\n[3/5] Skipping G-code parsing (no output file)');
      }
    } else {
      console.log('\n[2-3/5] Skipping slice and parsing tests (no sample STL provided)');
    }

    // Test 4: Parameter passing (if settings file provided)
    if (options?.settingsFile) {
      console.log('\n[4/5] Testing Parameter Passing...');
      const test4 = await this.testParameterPassing(options.settingsFile);
      results.push(test4);
      console.log(`Result: ${test4.success ? '✓ PASS' : '✗ FAIL'} (${test4.duration}ms)`);
    } else {
      console.log('\n[4/5] Skipping parameter passing test (no settings file)');
    }

    // Test 5: Error scenarios
    console.log('\n[5/5] Testing Error Scenarios...');
    const test5 = await this.testErrorScenarios();
    results.push(test5);
    console.log(`Result: ${test5.success ? '✓ PASS' : '✗ FAIL'} (${test5.duration}ms)`);

    console.log('\n' + '='.repeat(60));
    console.log('POC Testing Complete');
    console.log(`Total tests run: ${results.length}`);
    console.log(`Passed: ${results.filter(r => r.success).length}`);
    console.log(`Failed: ${results.filter(r => !r.success).length}`);
    console.log('='.repeat(60));

    return results;
  }

  /**
   * Generate markdown report from test results
   */
  generateReport(results: PocTestResult[]): string {
    const timestamp = new Date().toISOString();
    let report = '';

    report += '# Story 1.3: Bambu Slicer CLI Integration Spike\n\n';
    report += '## Executive Summary\n\n';
    report += `**Date:** ${timestamp}\n`;
    report += `**Bambu Studio Version:** ${this.CLI_VERSION}\n`;
    report += `**CLI Path:** \`${this.CLI_PATH}\`\n`;
    report += `**Tests Executed:** ${results.length}\n`;
    report += `**Tests Passed:** ${results.filter(r => r.success).length}\n`;
    report += `**Tests Failed:** ${results.filter(r => !r.success).length}\n\n`;

    report += '## Test Results\n\n';

    results.forEach((result, index) => {
      report += `### Test ${index + 1}: ${result.testName}\n\n`;
      report += `**Status:** ${result.success ? '✅ PASS' : '❌ FAIL'}\n`;
      report += `**Duration:** ${result.duration}ms\n\n`;

      if (result.findings.length > 0) {
        report += '**Findings:**\n\n';
        result.findings.forEach(finding => {
          report += `- ${finding}\n`;
        });
        report += '\n';
      }

      if (result.errors.length > 0) {
        report += '**Errors:**\n\n';
        result.errors.forEach(error => {
          report += `- ${error}\n`;
        });
        report += '\n';
      }

      if (result.metadata && Object.keys(result.metadata).length > 0) {
        report += '<details>\n<summary>Technical Details</summary>\n\n';
        report += '```json\n';
        report += JSON.stringify(result.metadata, null, 2);
        report += '\n```\n';
        report += '</details>\n\n';
      }

      report += '---\n\n';
    });

    return report;
  }
}

export default new BambuCliPoc();
