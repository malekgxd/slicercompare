/**
 * CLI Performance Test Script
 *
 * Measures actual Bambu Studio CLI performance with real slicing operations.
 * Run this when Bambu Studio is installed to validate baseline estimates.
 *
 * Usage: tsx tests/cli-performance-test.ts
 *
 * Prerequisites:
 * - Bambu Studio installed
 * - BAMBU_CLI_PATH set in .env (or default path accessible)
 * - Test files available in tests/fixtures/
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment
const BAMBU_CLI_PATH = process.env.BAMBU_CLI_PATH || 'C:\\Program Files\\Bambu Studio\\bambu-studio.exe';

interface CLITestResult {
  testName: string;
  success: boolean;
  duration: number;
  fileSize: number;
  error?: string;
}

async function testCLIAvailability(): Promise<boolean> {
  try {
    await fs.access(BAMBU_CLI_PATH);
    console.log(`✓ Bambu CLI found at: ${BAMBU_CLI_PATH}`);
    return true;
  } catch (error) {
    console.error(`✗ Bambu CLI not found at: ${BAMBU_CLI_PATH}`);
    console.error('  Please install Bambu Studio or set BAMBU_CLI_PATH environment variable.');
    return false;
  }
}

async function sliceFile(
  inputFile: string,
  outputDir: string,
  testName: string
): Promise<CLITestResult> {
  const startTime = Date.now();
  const stats = await fs.stat(inputFile);

  console.log(`\nTest: ${testName}`);
  console.log(`  Input: ${path.basename(inputFile)} (${stats.size} bytes)`);

  // Create settings file
  const settingsFile = path.join(outputDir, `settings-${testName}.json`);
  const settings = {
    layer_height: 0.2,
    fill_density: '15%',
    support_type: '0',
    printer_model: 'X1_Carbon'
  };

  await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');

  return new Promise((resolve) => {
    const args = [
      '--slice', '0',
      '--outputdir', outputDir,
      '--load-settings', settingsFile,
      inputFile
    ];

    const cli = spawn(BAMBU_CLI_PATH, args, {
      timeout: 60000, // 1 minute max
      shell: false,
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';

    cli.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    cli.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    cli.on('close', async (code) => {
      const duration = Date.now() - startTime;

      // Cleanup settings file
      try {
        await fs.unlink(settingsFile);
      } catch (error) {
        // Ignore
      }

      if (code === 0) {
        console.log(`  ✓ Success: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
        resolve({
          testName,
          success: true,
          duration,
          fileSize: stats.size
        });
      } else {
        console.log(`  ✗ Failed: Exit code ${code}`);
        if (stderr) {
          console.log(`  Error: ${stderr.substring(0, 200)}`);
        }
        resolve({
          testName,
          success: false,
          duration,
          fileSize: stats.size,
          error: stderr.substring(0, 200)
        });
      }
    });

    cli.on('error', (err: NodeJS.ErrnoException) => {
      const duration = Date.now() - startTime;
      console.log(`  ✗ Failed: ${err.message}`);
      resolve({
        testName,
        success: false,
        duration,
        fileSize: stats.size,
        error: err.message
      });
    });
  });
}

async function runCLIPerformanceTests(): Promise<void> {
  console.log('========================================');
  console.log('CLI Performance Test');
  console.log('========================================\n');

  // Check CLI availability
  const cliAvailable = await testCLIAvailability();
  if (!cliAvailable) {
    console.log('\n⚠️  Cannot run CLI tests without Bambu Studio installed.');
    console.log('    The baseline report uses estimated values from Story 1.3 validation.\n');
    process.exit(1);
  }

  // Setup output directory
  const outputDir = path.join(process.cwd(), 'temp', 'cli-test-output');
  await fs.mkdir(outputDir, { recursive: true });
  console.log(`\nOutput directory: ${outputDir}\n`);

  const results: CLITestResult[] = [];

  // Test 1: Small file (test-cube-10mm.stl)
  const testFile1 = path.join(__dirname, 'fixtures', 'test-cube-10mm.stl');
  try {
    const result1 = await sliceFile(testFile1, outputDir, 'small-cube');
    results.push(result1);
  } catch (error: any) {
    console.error(`Test failed: ${error.message}`);
  }

  // Test 2: Triangle file
  const testFile2 = path.join(__dirname, 'fixtures', 'test-triangle.stl');
  try {
    await fs.access(testFile2);
    const result2 = await sliceFile(testFile2, outputDir, 'triangle');
    results.push(result2);
  } catch (error) {
    console.log('\n⚠️  test-triangle.stl not found, skipping');
  }

  // Test 3: Medium file (if available)
  const testFile3 = path.join(__dirname, '..', 'temp', 'test-cube-20mm.stl');
  try {
    await fs.access(testFile3);
    const result3 = await sliceFile(testFile3, outputDir, 'medium-cube');
    results.push(result3);
  } catch (error) {
    console.log('\n⚠️  test-cube-20mm.stl not found, skipping');
  }

  // Generate report
  console.log('\n========================================');
  console.log('Test Results Summary');
  console.log('========================================\n');

  const successfulTests = results.filter(r => r.success);
  const failedTests = results.filter(r => !r.success);

  console.log(`Total tests: ${results.length}`);
  console.log(`Successful: ${successfulTests.length}`);
  console.log(`Failed: ${failedTests.length}\n`);

  if (successfulTests.length > 0) {
    console.log('Successful Tests:');
    console.log('┌─────────────────┬──────────────┬────────────┐');
    console.log('│ Test Name       │ Duration     │ File Size  │');
    console.log('├─────────────────┼──────────────┼────────────┤');
    for (const result of successfulTests) {
      const name = result.testName.padEnd(15);
      const duration = `${result.duration}ms`.padEnd(12);
      const fileSize = `${result.fileSize}B`.padEnd(10);
      console.log(`│ ${name} │ ${duration} │ ${fileSize} │`);
    }
    console.log('└─────────────────┴──────────────┴────────────┘\n');

    // Calculate averages
    const avgDuration = successfulTests.reduce((sum, r) => sum + r.duration, 0) / successfulTests.length;
    console.log(`Average duration: ${avgDuration.toFixed(0)}ms (${(avgDuration / 1000).toFixed(2)}s)\n`);

    // Compare with baseline
    const baselineEstimate = 1500; // From Story 1.3
    const difference = avgDuration - baselineEstimate;
    const percentDiff = ((difference / baselineEstimate) * 100).toFixed(1);

    console.log('Baseline Comparison:');
    console.log(`  Baseline estimate: ${baselineEstimate}ms`);
    console.log(`  Actual average: ${avgDuration.toFixed(0)}ms`);
    console.log(`  Difference: ${difference > 0 ? '+' : ''}${difference.toFixed(0)}ms (${percentDiff}%)\n`);

    if (Math.abs(difference) < 500) {
      console.log('  ✓ Results align with baseline estimate');
    } else if (avgDuration < baselineEstimate) {
      console.log('  ✓ Performance better than baseline!');
    } else {
      console.log('  ⚠️  Performance slower than baseline estimate');
    }
  }

  if (failedTests.length > 0) {
    console.log('\nFailed Tests:');
    for (const result of failedTests) {
      console.log(`  ✗ ${result.testName}: ${result.error}`);
    }
  }

  console.log('\n========================================');
  console.log('Next Steps');
  console.log('========================================\n');
  console.log('1. Update PERFORMANCE_BASELINE.md with actual CLI timings');
  console.log('2. Run batch tests (2, 3, 5 configurations)');
  console.log('3. Test with larger/more complex STL files');
  console.log('4. Profile memory/CPU usage during slicing\n');
}

// Run tests
runCLIPerformanceTests().catch(error => {
  console.error('CLI performance test failed:', error);
  process.exit(1);
});
