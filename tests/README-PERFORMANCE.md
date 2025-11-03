# Performance Testing Suite

This directory contains performance measurement and baseline testing tools for SlicerCompare.

## Purpose

Establish performance baselines before Epic 2 optimization work and provide tools to measure improvements.

**Target:** 3-5 configuration comparison in under 5 minutes (300 seconds)

## Test Scripts

### 1. `performance-baseline.ts` - Complete Baseline Measurement

Comprehensive baseline measurement with simulated and calculated values.

**Usage:**
```bash
npm run test:performance-baseline
# OR
npx tsx tests/performance-baseline.ts
```

**What it measures:**
- Individual component timing (upload, session creation, parsing, storage)
- Batch processing calculations (2, 3, 5 configurations)
- End-to-end workflow estimation
- File size impact estimation
- Target achievement analysis

**Output:**
- Console output with phase-by-phase results
- Generated report: `docs/PERFORMANCE_BASELINE.md`

**Prerequisites:**
- None (runs with simulated values)
- Uses validated CLI timing from Story 1.3

**Run time:** ~1 second

---

### 2. `cli-performance-test.ts` - Actual CLI Timing

Measures real Bambu Studio CLI slicing performance.

**Usage:**
```bash
npm run test:cli-performance
# OR
npx tsx tests/cli-performance-test.ts
```

**What it measures:**
- Actual CLI execution time for different test files
- File size impact on slicing time
- Baseline validation (compares to Story 1.3 estimates)

**Output:**
- Per-file timing results
- Average slicing duration
- Baseline comparison analysis

**Prerequisites:**
- ✓ Bambu Studio installed
- ✓ BAMBU_CLI_PATH configured in .env (or default path accessible)
- ✓ Test files available in tests/fixtures/

**Run time:** ~2-5 seconds (depends on file count)

---

### 3. `batch-performance-test.ts` - Batch Processing

Tests concurrent batch slicing with p-limit concurrency control.

**Usage:**
```bash
npm run test:batch-performance
# OR
npx tsx tests/batch-performance-test.ts
```

**What it measures:**
- Actual batch processing time for 2, 3, and 5 configurations
- Concurrency model validation (ADR-005: 3 parallel processes)
- Memory usage before/after each batch
- Throughput (configs per second)
- Individual vs. total duration

**Output:**
- Per-configuration timing
- Batch duration and throughput
- Memory usage delta
- Baseline validation

**Prerequisites:**
- ✓ Bambu Studio installed
- ✓ BAMBU_CLI_PATH configured
- ✓ Test files available

**Run time:** ~10-15 seconds (runs 3 tests with delays)

---

## Running the Full Suite

To run all performance tests in sequence:

```bash
# 1. Baseline (always works)
npx tsx tests/performance-baseline.ts

# 2. CLI tests (requires Bambu Studio)
npx tsx tests/cli-performance-test.ts

# 3. Batch tests (requires Bambu Studio)
npx tsx tests/batch-performance-test.ts
```

Or add to package.json:
```json
{
  "scripts": {
    "test:perf": "tsx tests/performance-baseline.ts",
    "test:cli": "tsx tests/cli-performance-test.ts",
    "test:batch": "tsx tests/batch-performance-test.ts",
    "test:perf:all": "tsx tests/performance-baseline.ts && tsx tests/cli-performance-test.ts && tsx tests/batch-performance-test.ts"
  }
}
```

---

## Test Files

### Available Test Files

Located in `tests/fixtures/`:

1. **test-cube-10mm.stl** (~1.5KB)
   - Simple 10mm cube
   - Fast slicing (~1-2 seconds)
   - Used for baseline validation

2. **test-triangle.stl** (if available)
   - Simple triangle geometry
   - Fast slicing

3. **test-cube-20mm.stl** (in temp/, if available)
   - Larger cube
   - Medium complexity

### Adding New Test Files

To test with larger/more complex files:

1. Add STL files to `tests/fixtures/`
2. Update test scripts to include new files
3. Document expected slicing times

Recommended test file sizes:
- Small: 1-10KB (simple geometries)
- Medium: 100KB-1MB (typical models)
- Large: 1-10MB (complex models)
- Very Large: 10MB+ (production models)

---

## Interpreting Results

### Component Timing

| Component | Expected Time | Bottleneck? |
|-----------|---------------|-------------|
| File Upload | 100-200ms | No |
| Session Creation | 50-100ms | No |
| CLI Slicing | 1000-2000ms | **YES** (59.5% of workflow) |
| G-code Parsing | <10ms | No |
| Results Storage | 50-100ms | No |

**Key Insight:** CLI execution is the primary bottleneck

### Batch Processing

Expected behavior with concurrency limit of 3:

- **2 configs:** Both run in parallel → ~1.5s total
- **3 configs:** All three run in parallel → ~1.5s total
- **5 configs:** Two batches (3+2) → ~3.0s total
- **10 configs:** Four batches (3+3+3+1) → ~6.0s total

Linear scaling beyond concurrency limit is expected and acceptable.

### Memory Usage

Expected memory profile:
- **Node.js process:** 50-100MB baseline
- **Per CLI process:** ~50-100MB during slicing
- **Peak (3 concurrent):** 200-400MB total

If memory usage exceeds 500MB, investigate:
- Memory leaks in Node.js process
- CLI process not terminating properly
- Large G-code files not being garbage collected

### Target Achievement

**Epic 2 Story 2.5 Target:** 5 configurations in under 300 seconds

Current baseline (with 1.5s per slice):
- 5 configs: ~3-4 seconds **✓ PASS** (under target by 296 seconds)

The large margin indicates:
- Target is achievable even with larger files
- Focus can shift to UX optimization (progressive results)
- Scaling beyond 5 configurations is feasible

---

## Troubleshooting

### "Bambu CLI not found"

**Solution:**
```bash
# Option 1: Set environment variable
export BAMBU_CLI_PATH="C:\Program Files\Bambu Studio\bambu-studio.exe"

# Option 2: Add to .env file
BAMBU_CLI_PATH=C:\Program Files\Bambu Studio\bambu-studio.exe
```

### CLI tests fail but manual slicing works

**Possible causes:**
1. Incorrect CLI arguments (check Story 1.3 validation)
2. Settings file format issue
3. File path spaces/special characters

**Debug:**
```typescript
// Add verbose logging in cli-performance-test.ts
console.log('CLI args:', args);
console.log('Settings:', settings);
```

### Batch tests slower than expected

**Possible causes:**
1. CPU throttling (check system resources)
2. Disk I/O bottleneck (G-code writes)
3. Concurrency limit too conservative

**Investigation:**
- Monitor Task Manager during batch execution
- Check CPU usage (should be near 100% during slicing)
- Monitor disk I/O (should be low)

### Memory usage higher than expected

**Possible causes:**
1. G-code files not being garbage collected
2. CLI processes not terminating
3. Memory leak in batch orchestration

**Investigation:**
```typescript
// Add memory monitoring
setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`RSS: ${mem.rss / 1024 / 1024}MB, Heap: ${mem.heapUsed / 1024 / 1024}MB`);
}, 1000);
```

---

## Next Steps After Baseline

### 1. Validate with Actual Infrastructure

- [ ] Start backend server (npm run server)
- [ ] Configure Supabase credentials
- [ ] Run end-to-end API tests
- [ ] Measure actual database latency

### 2. File Size Testing

- [ ] Obtain realistic STL files (100KB, 1MB, 5MB)
- [ ] Measure slicing time for each
- [ ] Update baseline with actual timings
- [ ] Document file size scaling

### 3. Resource Profiling

- [ ] Run batch test with Task Manager open
- [ ] Document peak memory usage
- [ ] Document CPU utilization
- [ ] Check for resource bottlenecks

### 4. Epic 2 Optimization Tracking

Use baseline metrics to measure improvements:

- [ ] Track optimization impact vs baseline
- [ ] Measure progressive results performance
- [ ] Validate 5-config target achievement
- [ ] Document optimization ROI

---

## Baseline Report

The generated baseline report (`docs/PERFORMANCE_BASELINE.md`) includes:

1. **Executive Summary** - Key findings and target achievement
2. **Component Timing** - Individual operation measurements
3. **Batch Processing** - Concurrent slicing performance
4. **End-to-End Workflow** - Complete workflow timing
5. **File Size Impact** - Scaling analysis
6. **Resource Usage** - Memory/CPU profiling notes
7. **Target Achievement** - Epic 2 goal validation
8. **Testing Methodology** - Accuracy and confidence levels

Use this report to:
- Communicate performance status to stakeholders
- Track optimization progress in Epic 2
- Identify bottlenecks and optimization opportunities
- Validate architectural decisions (ADR-005 concurrency limit)

---

## Related Documentation

- `docs/PERFORMANCE_BASELINE.md` - Generated baseline report
- `docs/architecture.md` - System architecture (lines 307-375: Concurrent Processing Pattern)
- `docs/decisions/ADR-005.md` - Concurrency limit decision
- Story 1.3 - CLI spike and validation (1-2 second timing)
- Story 1.6 - Batch slicing implementation
- Story 1.7 - G-code parsing

---

**Generated:** 2025-11-01
**Maintainer:** Amelia (Developer Agent)
**Purpose:** Epic 2 Story 2.5 - Performance Baseline
