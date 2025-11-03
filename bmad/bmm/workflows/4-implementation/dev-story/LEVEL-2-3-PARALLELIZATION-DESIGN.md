# Level 2 & 3 Parallelization Design
## Dev-Story Workflow Optimization
## Date: 2025-10-28

---

## Table of Contents

1. [Level 2: Cross-Phase Overlapping](#level-2-cross-phase-overlapping)
2. [Level 3: Test Parallelization](#level-3-test-parallelization)
3. [Combined Implementation](#combined-implementation)
4. [Implementation Guide](#implementation-guide)

---

# Level 2: Cross-Phase Overlapping

## Concept

**Current:** Phases execute sequentially with hard boundaries
**Level 2:** Adjacent phases overlap when dependencies allow

---

## Opportunity 1: Phase 1 → Phase 2 Overlap

### Current Sequential Flow (Level 1)

```
Phase 1 (Bob): ┌────────────────────┐
               │ 1.1 Create Story   │ 5 min
               │ 1.2 Gen Context    │ 5 min
               │ 1.3 Validate       │ 3 min
               │ 1.4 Handoff        │ 1 min
               └────────────────────┘
                        ↓ WAIT
Phase 2 (Amelia):      ┌────────────────────┐
                       │ 2.1 Load Story     │ 3 min
                       │ 2.2 Analyze Code   │ 10 min
                       │ 2.3 Plan           │ 4 min
                       └────────────────────┘

Total: 31 minutes
```

### Level 2 Overlapped Flow

```
Phase 1 (Bob):   ┌────────────────────┐
                 │ 1.1 Create Story   │ 5 min
                 │ 1.2 Gen Context    │ 5 min
                 └────────────────────┘
                          ↓ Story created (context still generating)

Phase 2 (Amelia):        ┌────────────────────┐
                         │ 2.2 Analyze Code   │ 10 min (PARALLEL)
                         └────────────────────┘
                                  ↓
Phase 1 (Bob):           ┌──────┐
                         │ 1.3  │ 3 min
                         │ 1.4  │ 1 min
                         └──────┘
                                  ↓
Phase 2 (Amelia):                ┌───────┐
                                 │ 2.1   │ 3 min (load context)
                                 │ 2.3   │ 4 min (plan)
                                 └───────┘

Total: 23 minutes ✅ Saved: 8 minutes
```

### How It Works

**Key Insight:** Codebase analysis doesn't need the story context - it analyzes the existing repo structure.

**Execution:**
1. Bob completes story creation (step 1.1) → **5 min**
2. **OVERLAP START:** Bob generates context (step 1.2) **∥** Amelia analyzes codebase (step 2.2) → **10 min** (wait for longest)
3. Bob validates and hands off (steps 1.3-1.4) → **4 min**
4. Amelia loads context and plans (steps 2.1, 2.3) → **7 min**

**Total: 26 min (saved 5 min)**

### Implementation Changes

**workflow.yaml:**

```yaml
phases:
  - phase: 1
    name: "Story Creation & Context Generation"
    agent: "sm"
    overlap_with: "phase-2"
    overlap_conditions:
      - step: "1.2"  # Context generation
        allows_parallel:
          - phase: 2
            step: "2.2"  # Codebase analysis
            reason: "Codebase analysis doesn't need story context"

  - phase: 2
    name: "Story Loading & Implementation Planning"
    agent: "dev"
    can_start_early: true
    early_start_conditions:
      - requires_from_phase_1: ["story_path"]  # Needs story file, not context
      - can_run_parallel: ["2.2"]  # Codebase analysis step
```

**instructions.md:**

```xml
<phase n="1" agent="sm" lead="Bob">

  <step n="1.1" goal="Create user story">
    <!-- ... existing actions ... -->
    <action>Save story file to {{story_path}}</action>
    <signal-next-phase phase="2" step="2.2" data="story_path">
      Story file ready. Phase 2 can begin codebase analysis in parallel.
    </signal-next-phase>
  </step>

  <step n="1.2" goal="Generate story context" parallel-with="phase-2-step-2.2">
    <!-- This runs in parallel with Phase 2 step 2.2 -->
    <action>Generate context (XML/JSON)</action>
    <check>If Phase 2 step 2.2 running → continue in parallel</check>
  </step>

</phase>

<phase n="2" agent="dev" lead="Amelia">

  <step n="2.2" goal="Analyze codebase" can-start-early="true">
    <trigger>When Phase 1 step 1.1 signals (story file exists)</trigger>
    <action>INVOKE bmm-codebase-analyzer</action>
    <note>Runs in parallel with Phase 1 step 1.2 (context generation)</note>
  </step>

  <step n="2.1" goal="Load story and context" depends-on="phase-1-complete">
    <!-- This waits for Phase 1 to fully complete -->
    <action>Load story file and context from Phase 1</action>
  </step>

</phase>
```

---

## Opportunity 2: Phase 3 → Phase 4 Overlap

### Current Sequential Flow (Level 1)

```
Phase 3 (Amelia): ┌──────────────────────────────────┐
                  │ 3.1 Implement Tasks (125 min)   │
                  │ 3.2 Update Story (5 min)        │
                  │ 3.3 Validate (10 min)           │
                  │ 3.4 Handoff (2 min)             │
                  └──────────────────────────────────┘
                                   ↓ WAIT
Phase 4 (Murat):                  ┌────────────────────┐
                                  │ 4.1 Design Tests   │ 15 min
                                  │ 4.2 Implement      │ 55 min
                                  │ 4.3 Execute        │ 20 min
                                  │ 4.4 Quality Gates  │ 8 min
                                  └────────────────────┘

Total: 240 minutes
```

### Level 2 Overlapped Flow

```
Phase 3 (Amelia): ┌──────────────────────────────────┐
                  │ 3.1 Implement Tasks              │
                  │  ├─ Task 1-6 (100 min)           │
                  │  └─ Task 7-8 (25 min) ──┐        │
                  │                          ↓        │
                  │ 3.2 Update (5 min)      [Handoff partial]
                  └─────────────────────────┘
                            ↓
Phase 4 (Murat):           ┌──────────────────┐
                           │ 4.1 Design Tests │ 15 min (PARALLEL with 3.1)
                           │ 4.2 Write Tests  │ 55 min (starts early)
                           └──────────────────┘
                                    ↓
Phase 3 (Amelia):                  ┌──────┐
                                   │ 3.3  │ 10 min (validation)
                                   │ 3.4  │ 2 min (final handoff)
                                   └──────┘
                                           ↓
Phase 4 (Murat):                          ┌────┐
                                          │4.3 │ 20 min (execute tests)
                                          │4.4 │ 8 min (quality)
                                          └────┘

Total: 225 minutes ✅ Saved: 15 minutes
```

### How It Works

**Key Insight:** Test design can start as soon as some tasks are complete. Tests can be written while implementation continues.

**Execution:**
1. Amelia implements tasks 1-6 → **100 min**
2. **OVERLAP START:** Amelia implements tasks 7-8 (25 min) **∥** Murat designs test strategy (15 min) → **25 min**
3. **OVERLAP CONTINUES:** Amelia validates (10 min) **∥** Murat writes tests (first 10 min) → **10 min**
4. Amelia hands off final code → **2 min**
5. Murat finishes test implementation → **45 min**
6. Murat executes and validates → **28 min**

**Total: 210 min (saved 30 min)**

### Implementation Changes

**workflow.yaml:**

```yaml
phases:
  - phase: 3
    name: "Implementation Execution"
    agent: "dev"
    overlap_with: "phase-4"
    overlap_conditions:
      - step: "3.1"
        progress_threshold: 0.75  # 75% of tasks complete
        allows_parallel:
          - phase: 4
            step: "4.1"  # Test strategy design
            reason: "Test design can begin with partial implementation"
      - step: "3.2"
        allows_parallel:
          - phase: 4
            step: "4.2"  # Test implementation
            reason: "Tests can be written for completed code"

  - phase: 4
    name: "Testing & Validation"
    agent: "tea"
    can_start_early: true
    early_start_conditions:
      - requires_from_phase_3:
          - acceptance_criteria  # Available immediately
          - partial_implementation  # First 75% of tasks
      - can_run_parallel: ["4.1", "4.2"]  # Design and initial test writing
```

**instructions.md:**

```xml
<phase n="3" agent="dev" lead="Amelia">

  <step n="3.1" goal="Implement tasks iteratively">
    <action>Implement tasks 1 through N</action>
    <check>At 75% completion → Signal Phase 4 can begin</check>
    <signal-next-phase phase="4" step="4.1" when="progress >= 0.75">
      First 6 of 8 tasks complete. Test strategy can begin.
      Passing: acceptance_criteria, partial_implementation_summary, completed_files
    </signal-next-phase>
  </step>

</phase>

<phase n="4" agent="tea" lead="Murat">

  <step n="4.1" goal="Design test strategy" can-start-early="true">
    <trigger>When Phase 3 reaches 75% completion</trigger>
    <action>Review acceptance criteria (available)</action>
    <action>Review partial implementation (first 75% of tasks)</action>
    <action>Design comprehensive test strategy</action>
    <note>Runs in parallel with Phase 3 remaining implementation</note>
  </step>

  <step n="4.2" goal="Implement tests" can-start-early="true">
    <trigger>When test strategy ready AND Phase 3 step 3.2 begins</trigger>
    <action>Begin writing tests for completed code</action>
    <note>Can start writing tests while Amelia validates remaining code</note>
    <check>Wait for Phase 3 complete before testing incomplete code</check>
  </step>

</phase>
```

---

## Opportunity 3: Phase 4 → Phase 5 Overlap

### Current Sequential Flow (Level 1)

```
Phase 4 (Murat):  ┌────────────────────┐
                  │ 4.1-4.3 (90 min)   │
                  │ 4.4 Quality (8 min)│
                  │ 4.5 Handoff (2 min)│
                  └────────────────────┘
                           ↓ WAIT
Phase 5 (Amelia):         ┌────────────┐
                          │ 5.1 Review │ 9 min
                          │ 5.2-5.4    │ 10 min
                          └────────────┘

Total: 119 minutes
```

### Level 2 Overlapped Flow

```
Phase 4 (Murat):  ┌────────────────────┐
                  │ 4.1-4.3 (90 min)   │
                  │ 4.4 Quality ───┐   │ 8 min
                  └────────────────┼───┘
                                   ↓ Tests passing, docs ready
Phase 5 (Amelia):                 ┌──────────┐
                                  │ 5.1      │ 9 min (PARALLEL)
                                  └──────────┘
                                        ↓
Phase 4 (Murat):                       ┌───┐
                                       │4.5│ 2 min
                                       └───┘
                                             ↓
Phase 5 (Amelia):                           ┌─────┐
                                            │5.2-4│ 10 min
                                            └─────┘

Total: 111 minutes ✅ Saved: 8 minutes
```

### How It Works

**Key Insight:** Documentation review can start as soon as tests are passing, before full quality gates complete.

**Implementation:** Similar pattern to above with early signaling.

---

## Level 2 Summary

| Overlap Opportunity | Time Saved | Implementation Complexity |
|---------------------|------------|---------------------------|
| Phase 1 → 2 Overlap | 5-8 min | Low |
| Phase 3 → 4 Overlap | 10-15 min | Medium |
| Phase 4 → 5 Overlap | 5-8 min | Low |
| **Total Level 2** | **20-31 min** | **Low-Medium** |

**Combined with Level 1:** 55-66 min saved (20-25% total reduction)

---

# Level 3: Test Parallelization

## Concept

**Current:** Tests written and executed sequentially
**Level 3:** Different test types written/executed in parallel

---

## Opportunity 1: Parallel Test Writing (Phase 4, Step 4.2)

### Current Sequential Flow (Level 1)

```
Step 4.2 (Murat): ┌──────────────────────────────┐
                  │ Write Unit Tests (30 min)    │
                  │ Write Integration Tests (20) │
                  │ Write E2E Tests (10 min)     │
                  └──────────────────────────────┘

Total: 60 minutes
```

### Level 3 Parallel Flow

```
Step 4.2 (Murat):
┌─────────────────┐
│ Unit Tests      │ 30 min ─┐
└─────────────────┘         │
                            ├─→ Wait for longest (30 min)
┌─────────────────┐         │
│ Integration     │ 20 min ─┤
└─────────────────┘         │
                            │
┌─────────────────┐         │
│ E2E Tests       │ 10 min ─┘
└─────────────────┘

Total: 30 minutes ✅ Saved: 30 minutes (50% reduction!)
```

### How It Works

**Key Insight:** Different test types are independent and can be written simultaneously.

**Implementation with Task Tool:**

```xml
<step n="4.2" goal="Implement tests in parallel">

  <action>INVOKE 3 Task agents IN PARALLEL:

    TASK 1 (Unit Tests):
    - Description: "Write unit tests for all new/modified business logic"
    - Subagent: None (direct implementation)
    - Files: tests/unit/simplyprint/*.test.ts
    - Estimated time: 30 min

    TASK 2 (Integration Tests):
    - Description: "Write integration tests for component interactions"
    - Subagent: None (direct implementation)
    - Files: tests/integration/simplyprint-api.test.ts
    - Estimated time: 20 min

    TASK 3 (E2E Tests - if applicable):
    - Description: "Write E2E tests for critical user flows"
    - Subagent: None (direct implementation)
    - Files: tests/e2e/simplyprint-flow.spec.ts
    - Estimated time: 10 min

  </action>

  <action>Wait for all 3 tasks to complete (longest = 30 min)</action>
  <action>Aggregate all test files created</action>

</step>
```

### Code Changes

**workflow.yaml:**

```yaml
phases:
  - phase: 4
    steps:
      - step: "4.2"
        name: "Implement tests"
        parallel_execution: true
        parallel_tasks:
          - task_id: "unit-tests"
            description: "Write unit tests"
            agent: "task"
            files_pattern: "tests/unit/**/*.test.ts"
            estimated_time: 30
          - task_id: "integration-tests"
            description: "Write integration tests"
            agent: "task"
            files_pattern: "tests/integration/**/*.test.ts"
            estimated_time: 20
          - task_id: "e2e-tests"
            description: "Write E2E tests (if applicable)"
            agent: "task"
            files_pattern: "tests/e2e/**/*.spec.ts"
            estimated_time: 10
```

**instructions.md:**

```xml
<step n="4.2" goal="Implement comprehensive tests IN PARALLEL">

  <parallel-execution>

    <task id="unit-tests" agent="task-1">
      <action>Create unit tests for all new/modified business logic</action>
      <scope>
        - src/services/simplyprint/client.ts → tests/unit/simplyprint/client.test.ts
        - src/services/simplyprint/types.ts → tests/unit/simplyprint/types.test.ts
        - src/services/simplyprint/config.ts → tests/unit/simplyprint/config.test.ts
        - src/services/simplyprint/errors.ts → tests/unit/simplyprint/errors.test.ts
      </scope>
      <coverage-target>85%</coverage-target>
    </task>

    <task id="integration-tests" agent="task-2">
      <action>Create integration tests for component interactions</action>
      <scope>
        - Full API integration tests
        - Authentication flow tests
        - Printer operations end-to-end
        - Job submission workflow
      </scope>
      <note>Uses real API test account</note>
    </task>

    <task id="e2e-tests" agent="task-3">
      <action>Create E2E tests for critical user flows (if applicable)</action>
      <scope>
        - User flows that touch UI (if story includes UI changes)
        - Skip if API-only story
      </scope>
      <check>If no UI changes → skip this task</check>
    </task>

  </parallel-execution>

  <action>Synchronize: Wait for all parallel tasks to complete</action>
  <action>Aggregate test files from all tasks</action>
  <action>Document total tests created: {{unit_count}} + {{integration_count}} + {{e2e_count}}</action>

</step>
```

---

## Opportunity 2: Parallel Test Execution (Phase 4, Step 4.3)

### Current Sequential Flow (Level 1)

```
Step 4.3 (Murat): ┌──────────────────────────────┐
                  │ Run Unit Tests (8 min)       │
                  │ Run Integration Tests (7 min)│
                  │ Run E2E Tests (5 min)        │
                  └──────────────────────────────┘

Total: 20 minutes
```

### Level 3 Parallel Flow

```
Step 4.3 (Murat):
┌─────────────────┐
│ Unit Tests      │ 8 min ─┐
└─────────────────┘        │
                           ├─→ Wait for longest (8 min)
┌─────────────────┐        │
│ Integration     │ 7 min ─┤
└─────────────────┘        │
                           │
┌─────────────────┐        │
│ E2E Tests       │ 5 min ─┘
└─────────────────┘

Total: 8 minutes ✅ Saved: 12 minutes (60% reduction!)
```

### How It Works

**Key Insight:** Different test suites can run in separate processes/terminals.

**Implementation with Bash:**

```bash
# Run all test types in parallel
npm run test:unit &
PID_UNIT=$!

npm run test:integration &
PID_INTEGRATION=$!

npm run test:e2e &
PID_E2E=$!

# Wait for all to complete
wait $PID_UNIT
RESULT_UNIT=$?

wait $PID_INTEGRATION
RESULT_INTEGRATION=$?

wait $PID_E2E
RESULT_E2E=$?

# Check all passed
if [ $RESULT_UNIT -eq 0 ] && [ $RESULT_INTEGRATION -eq 0 ] && [ $RESULT_E2E -eq 0 ]; then
  echo "All tests passed ✅"
else
  echo "Some tests failed ❌"
  exit 1
fi
```

**Better: Use npm-run-all or concurrently:**

```json
// package.json
{
  "scripts": {
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:all:parallel": "concurrently \"npm:test:unit\" \"npm:test:integration\" \"npm:test:e2e\"",
    "test:all:sequential": "npm run test:unit && npm run test:integration && npm run test:e2e"
  }
}
```

**instructions.md:**

```xml
<step n="4.3" goal="Execute tests in parallel">

  <action>Determine test command (prefer parallel execution if available)</action>

  <parallel-execution strategy="concurrent-processes">
    <action>Run unit tests: npm run test:unit (or vitest run tests/unit)</action>
    <action>Run integration tests: npm run test:integration</action>
    <action>Run E2E tests: npm run test:e2e (if applicable)</action>
  </parallel-execution>

  <alternative>
    <action>If npm scripts support parallel execution: npm run test:all:parallel</action>
  </alternative>

  <action>Collect results from all test suites</action>
  <check>If ANY suite fails → STOP and report failures</check>

</step>
```

---

## Level 3 Summary

| Parallel Opportunity | Time Saved | Implementation Complexity |
|----------------------|------------|---------------------------|
| Parallel Test Writing | 30 min | Medium (requires Task tool coordination) |
| Parallel Test Execution | 12 min | Low (npm scripts) |
| **Total Level 3** | **42 min** | **Low-Medium** |

**Combined with Levels 1-2:** 97-108 min saved (36-40% total reduction)

---

# Combined Implementation

## Complete Optimized Workflow Timeline

### Baseline (No Parallelization)

```
Phase 1 (Bob):    ████████████████████ 30 min
Phase 2 (Amelia): ████████████████ 20 min
Phase 3 (Amelia): ████████████████████████████████████████████████████████████ 180 min
Phase 4 (Murat):  ████████████████████████████████████ 120 min
Phase 5 (Amelia): ██████████ 30 min

Total: 380 minutes (6.3 hours)
```

### Level 1 Only (Current)

```
Phase 1: ████████████ 18 min (-33%)
Phase 2: ████████████████ 17 min
Phase 3: ████████████████████████████████████████████████████ 142 min (-12.5%)
Phase 4: ██████████████████████████████ 95 min (-11%)
Phase 5: ██████████ 19 min (-20%)

Total: 291 minutes (4.85 hours) ✅ Saved 89 min (23%)
```

### Levels 1 + 2 + 3 (Full Optimization)

```
Phase 1+2 (Overlap): ████████ 18 min (Phase 1: 14 min ∥ Phase 2 early start: 10 min → 4 min sequential)
Phase 2 (Complete):  ████ 7 min (remaining)
Phase 3:             ████████████████████████████████████████ 132 min (10 min saved via early Phase 4 start)
Phase 4 (Overlap):   ████████████ 43 min (Test writing: 30 min ∥ Phase 3 final: 10 min → Test execution: 8 min → Quality: 8 min)
Phase 5 (Overlap):   ████ 11 min (Review: 9 min starts early ∥ Phase 4 final: 2 min → 5.2-5.4: 10 min)

Total: 221 minutes (3.7 hours) ✅ Saved 159 min (42%)
```

**Visual Comparison:**

```
Baseline:      ████████████████████████████████████████████████████████████████ 380 min
Level 1:       ███████████████████████████████████████████████ 291 min (-23%)
Levels 1+2+3:  █████████████████████████████████ 221 min (-42%)
               └──────────────────────────────────────────────────────────────┘
               Savings: 159 minutes per story
```

---

## Full Workflow with All Optimizations

### Phases with Parallelization Strategies

| Phase | Sequential | L1 Only | L1+L2+L3 | Strategies Applied |
|-------|-----------|---------|----------|-------------------|
| 1 | 30 min | 18 min | 14 min | L1: Parallel subagents; L2: Overlap with Phase 2 |
| 2 | 20 min | 17 min | 11 min | L2: Early start during Phase 1 |
| 3 | 180 min | 142 min | 132 min | L1: Parallel validation; L2: Overlap with Phase 4 |
| 4 | 120 min | 95 min | 43 min | L1: Parallel quality checks; L2: Early start; L3: Parallel tests |
| 5 | 30 min | 19 min | 11 min | L1: Parallel review; L2: Early start during Phase 4 |
| **Total** | **380 min** | **291 min** | **211 min** | **42% reduction** |

---

# Implementation Guide

## Step 1: Implement Level 3 First (Highest ROI)

**Why:** Easiest to implement, biggest additional impact

### 1.1 Parallel Test Execution (Easy - 1 hour)

**Add to package.json:**

```json
{
  "devDependencies": {
    "concurrently": "^8.0.0"
  },
  "scripts": {
    "test:unit": "vitest run tests/unit",
    "test:integration": "vitest run tests/integration",
    "test:e2e": "playwright test",
    "test:parallel": "concurrently -k -s first \"npm:test:unit\" \"npm:test:integration\" \"npm:test:e2e\""
  }
}
```

**Update instructions.md step 4.3:**

```xml
<step n="4.3" goal="Execute tests in parallel">
  <action>Run all test suites concurrently: npm run test:parallel</action>
  <alternative>If test:parallel not available, run sequentially</alternative>
</step>
```

**Expected savings: 10-12 min per story**

### 1.2 Parallel Test Writing (Medium - 4 hours)

**Update workflow.yaml:**

```yaml
phases:
  - phase: 4
    steps:
      - step: "4.2"
        parallel_tasks:
          - unit-tests
          - integration-tests
          - e2e-tests
```

**Update instructions.md step 4.2:**

```xml
<step n="4.2" goal="Implement tests">
  <parallel-execution>
    <task>Unit tests (Task tool agent 1)</task>
    <task>Integration tests (Task tool agent 2)</task>
    <task>E2E tests (Task tool agent 3)</task>
  </parallel-execution>
</step>
```

**Challenge:** Requires coordinating multiple Task tool invocations
**Expected savings: 25-30 min per story**

**Total Level 3 savings: 35-42 min**

---

## Step 2: Implement Level 2 (Medium Complexity)

**Estimated effort: 1-2 days**

### 2.1 Add Overlap Support to workflow.yaml

```yaml
# Add overlap configuration
execution_features:
  within_phase_parallel: true      # Level 1 (already done)
  cross_phase_overlap: true        # Level 2 (new)
  test_parallelization: true       # Level 3 (from Step 1)

phases:
  - phase: 1
    overlap_strategy:
      - at_step: "1.1"
        signal_phase: 2
        signal_step: "2.2"
        signal_data: ["story_path"]

  - phase: 2
    can_start_early: true
    early_triggers:
      - from_phase: 1
        from_step: "1.1"
        start_step: "2.2"
```

### 2.2 Add Signaling to instructions.md

```xml
<step n="1.1">
  <action>Create story markdown</action>
  <signal phase="2" step="2.2">
    Story file ready at {{story_path}}. Phase 2 can begin codebase analysis.
  </signal>
</step>
```

### 2.3 Add Synchronization Points

```xml
<step n="2.1" depends-on="phase-1-complete">
  <wait-for phase="1" step="1.4">Phase 1 must complete before loading context</wait-for>
  <action>Load story and context</action>
</step>
```

**Total Level 2 savings: 20-30 min**

---

## Step 3: Validate and Monitor

### 3.1 Test Each Level Independently

1. **Test Level 3 only:** Compare with Level 1 baseline
2. **Test Level 2 only:** Compare with Level 1 baseline
3. **Test Levels 2+3 combined:** Validate no conflicts

### 3.2 Monitor Metrics

```yaml
# Add to workflow execution tracking
story_metrics:
  version: "6.2.0-full-parallel"
  optimizations_enabled:
    - within_phase_parallel  # L1
    - cross_phase_overlap    # L2
    - test_parallelization   # L3
  time_breakdown:
    phase_1_sequential: 4
    phase_1_parallel: 10
    phase_2_early_start: 10
    phase_2_sequential: 7
    # ... etc
  actual_vs_estimated:
    estimated_total: 221
    actual_total: 235  # Example
    variance: +14
```

### 3.3 Adjust Estimates

After 5-10 story executions, update time estimates in workflow.yaml based on actual measurements.

---

## Risks and Mitigations

### Level 2 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Context confusion (agent gets data from wrong phase) | High | Strict data dependency tracking |
| Race conditions (Phase N writes while Phase N+1 reads) | High | Only overlap when no shared mutable state |
| Handoff data missing when needed | Medium | Explicit wait points for required data |

### Level 3 Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Task agents create conflicting code | High | Clear file boundaries for each task |
| Parallel tests conflict (same DB, ports, etc.) | Medium | Isolated test environments per suite |
| Harder to debug test failures | Low | Separate logs for each test suite |

---

## Success Criteria

### Level 3 Success

- ✅ All test types run in parallel without conflicts
- ✅ Total test time reduced by 30-40%
- ✅ All tests still passing
- ✅ No reduction in coverage

### Level 2 Success

- ✅ Phases overlap without data corruption
- ✅ No agent context confusion
- ✅ Time savings match estimates (±10%)
- ✅ All handoffs still work correctly

### Combined Success

- ✅ 40%+ total time reduction from baseline
- ✅ No quality degradation
- ✅ All acceptance criteria still met
- ✅ Workflow remains maintainable

---

## Next Steps

1. **Immediate:** Implement Level 3.1 (parallel test execution) - 1 hour, 10 min savings
2. **Short-term:** Implement Level 3.2 (parallel test writing) - 4 hours, 30 min savings
3. **Medium-term:** Implement Level 2 (cross-phase overlap) - 2 days, 25 min savings
4. **Validate:** Test with real stories and measure actual savings
5. **Iterate:** Adjust based on metrics and feedback

---

**Expected Final Result:**
- **Time per story: 211-230 min** (3.5-3.8 hours)
- **Reduction from baseline: 40-42%**
- **Additional stories per month: +15-20**
- **Implementation effort: 3-4 days total**

---

**Document Version: 1.0**
**Date: 2025-10-28**
