/**
 * Batch Processing Performance Test
 *
 * Tests concurrent batch slicing with 2, 3, and 5 configurations
 * to validate the p-limit concurrency model and measure actual throughput.
 *
 * Usage: tsx tests/batch-performance-test.ts
 *
 * Prerequisites:
 * - Bambu Studio installed
 * - Test files available
 */

import pLimit from 'p-limit';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BAMBU_CLI_PATH = process.env.BAMBU_CLI_PATH || 'C:\\Program Files\\Bambu Studio\\bambu-studio.exe';
const CONCURRENCY_LIMIT = 3; // ADR-005

interface BatchTestResult {
  configCount: number;
  totalDuration: number;
  individualDurations: number[];
  throughput: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

async function sliceSingle(
  inputFile: string,
  outputDir: string,
  configId: string
): Promise<number> {
  const startTime = Date.now();

  // Create settings
  const settingsFile = path.join(outputDir, `settings-${configId}.json`);
  const settings = {
    layer_height: 0.2,
    fill_density: '15%',
    support_type: '0',
    printer_model: 'X1_Carbon'
  };

  await fs.writeFile(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');

  return new Promise((resolve, reject) => {
    const args = [
      '--slice', '0',
      '--outputdir', outputDir,
      '--load-settings', settingsFile,
      inputFile
    ];

    const cli = spawn(BAMBU_CLI_PATH, args, {
      timeout: 60000,
      shell: false,
      windowsHide: true
    });

    cli.on('close', async (code) => {
      const duration = Date.now() - startTime;

      // Cleanup
      try {
        await fs.unlink(settingsFile);
      } catch (error) {
        // Ignore
      }

      if (code === 0) {
        resolve(duration);
      } else {
        reject(new Error(`CLI failed with code ${code}`));
      }
    });

    cli.on('error', (err) => {
      reject(err);
    });
  });
}

async function testBatchSlicing(
  configCount: number,
  inputFile: string,
  outputDir: string
): Promise<BatchTestResult> {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Batch Test: ${configCount} Configurations`);
  console.log('='.repeat(50));

  const batchStartTime = Date.now();
  const limit = pLimit(CONCURRENCY_LIMIT);
  const durations: number[] = [];

  // Capture memory before
  const memoryBefore = process.memoryUsage();
  console.log(`\nMemory before:`);
  console.log(`  RSS: ${(memoryBefore.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap: ${(memoryBefore.heapUsed / 1024 / 1024).toFixed(2)} MB`);

  // Create tasks
  const tasks = [];
  for (let i = 0; i < configCount; i++) {
    tasks.push(
      limit(async () => {
        const configId = `config-${i + 1}`;
        console.log(`  [${new Date().toISOString()}] Starting ${configId}...`);
        try {
          const duration = await sliceSingle(inputFile, outputDir, configId);
          durations.push(duration);
          console.log(`  [${new Date().toISOString()}] ✓ ${configId} completed: ${duration}ms`);
          return duration;
        } catch (error: any) {
          console.log(`  [${new Date().toISOString()}] ✗ ${configId} failed: ${error.message}`);
          throw error;
        }
      })
    );
  }

  // Wait for all to complete
  await Promise.all(tasks);

  const totalDuration = Date.now() - batchStartTime;
  const memoryAfter = process.memoryUsage();

  console.log(`\nMemory after:`);
  console.log(`  RSS: ${(memoryAfter.rss / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Heap: ${(memoryAfter.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Delta RSS: ${((memoryAfter.rss - memoryBefore.rss) / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Delta Heap: ${((memoryAfter.heapUsed - memoryBefore.heapUsed) / 1024 / 1024).toFixed(2)} MB`);

  const throughput = configCount / (totalDuration / 1000);

  console.log(`\nResults:`);
  console.log(`  Total duration: ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
  console.log(`  Throughput: ${throughput.toFixed(2)} configs/sec`);
  console.log(`  Individual durations: ${durations.map(d => `${d}ms`).join(', ')}`);
  console.log(`  Min: ${Math.min(...durations)}ms`);
  console.log(`  Max: ${Math.max(...durations)}ms`);
  console.log(`  Avg: ${(durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(0)}ms`);

  return {
    configCount,
    totalDuration,
    individualDurations: durations,
    throughput,
    memoryUsage: memoryAfter
  };
}

async function runBatchPerformanceTests(): Promise<void> {
  console.log('========================================');
  console.log('Batch Processing Performance Test');
  console.log('========================================');
  console.log(`Concurrency limit: ${CONCURRENCY_LIMIT} (ADR-005)\n`);

  // Check CLI
  try {
    await fs.access(BAMBU_CLI_PATH);
    console.log(`✓ Bambu CLI found: ${BAMBU_CLI_PATH}\n`);
  } catch (error) {
    console.error(`✗ Bambu CLI not found: ${BAMBU_CLI_PATH}`);
    console.error('  Cannot run batch tests without Bambu Studio installed.\n');
    process.exit(1);
  }

  // Setup
  const inputFile = path.join(__dirname, 'fixtures', 'test-cube-10mm.stl');
  const outputDir = path.join(process.cwd(), 'temp', 'batch-test-output');
  await fs.mkdir(outputDir, { recursive: true });

  const results: BatchTestResult[] = [];

  try {
    // Test 1: 2 configurations
    const result2 = await testBatchSlicing(2, inputFile, outputDir);
    results.push(result2);

    // Short delay between tests
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: 3 configurations
    const result3 = await testBatchSlicing(3, inputFile, outputDir);
    results.push(result3);

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: 5 configurations
    const result5 = await testBatchSlicing(5, inputFile, outputDir);
    results.push(result5);

  } catch (error: any) {
    console.error(`\nBatch test failed: ${error.message}`);
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('Summary');
  console.log('='.repeat(50));

  console.log('\n┌────────────┬──────────────┬────────────────┐');
  console.log('│ Configs    │ Duration     │ Throughput     │');
  console.log('├────────────┼──────────────┼────────────────┤');
  for (const result of results) {
    const configs = result.configCount.toString().padEnd(10);
    const duration = `${(result.totalDuration / 1000).toFixed(2)}s`.padEnd(12);
    const throughput = `${result.throughput.toFixed(2)} c/s`.padEnd(14);
    console.log(`│ ${configs} │ ${duration} │ ${throughput} │`);
  }
  console.log('└────────────┴──────────────┴────────────────┘\n');

  // Validation against baseline
  console.log('Baseline Validation:');
  console.log('  Expected (2 configs): ~1.5s (2 parallel)');
  console.log('  Expected (3 configs): ~1.5s (3 parallel)');
  console.log('  Expected (5 configs): ~3.0s (3+2 serial batches)\n');

  const result2 = results.find(r => r.configCount === 2);
  const result3 = results.find(r => r.configCount === 3);
  const result5 = results.find(r => r.configCount === 5);

  if (result2) {
    const delta = (result2.totalDuration / 1000) - 1.5;
    console.log(`  2 configs: ${(result2.totalDuration / 1000).toFixed(2)}s (${delta > 0 ? '+' : ''}${delta.toFixed(2)}s vs baseline)`);
  }
  if (result3) {
    const delta = (result3.totalDuration / 1000) - 1.5;
    console.log(`  3 configs: ${(result3.totalDuration / 1000).toFixed(2)}s (${delta > 0 ? '+' : ''}${delta.toFixed(2)}s vs baseline)`);
  }
  if (result5) {
    const delta = (result5.totalDuration / 1000) - 3.0;
    console.log(`  5 configs: ${(result5.totalDuration / 1000).toFixed(2)}s (${delta > 0 ? '+' : ''}${delta.toFixed(2)}s vs baseline)`);
  }

  console.log('\nKey Insights:');
  console.log('  - Concurrency limit prevents resource exhaustion');
  console.log('  - Parallel execution reduces total time vs sequential');
  console.log('  - Memory usage scales with concurrent processes');
  console.log('  - Throughput maximized at concurrency limit\n');

  console.log('Next Steps:');
  console.log('  1. Update PERFORMANCE_BASELINE.md with actual batch timings');
  console.log('  2. Test with larger files to validate scaling');
  console.log('  3. Consider increasing concurrency limit if resources allow');
  console.log('  4. Monitor CPU usage during peak concurrency\n');
}

// Run tests
runBatchPerformanceTests().catch(error => {
  console.error('Batch performance test failed:', error);
  process.exit(1);
});
