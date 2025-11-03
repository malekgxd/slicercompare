# Develop Story - Multi-Agent Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.md</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Execute ALL steps in exact order; do NOT skip steps</critical>
<critical>Respect agent handoff protocol: complete your phase then explicitly hand off to next agent</critical>
<critical>Use subagents as specified in workflow.yaml for each phase</critical>

<workflow>

  <!-- ============================================ -->
  <!-- PHASE 1: Story Creation & Context Generation -->
  <!-- AGENT: SM (Bob)                              -->
  <!-- ============================================ -->

  <phase n="1" agent="sm" lead="Bob">

    <step n="1.1" goal="Create user story from epic/PRD">
      <action>Load epic file or PRD from {{epic_file}} input parameter</action>
      <action>If tech_spec provided, load it; if architecture_docs provided, load them</action>
      <action>INVOKE subagents IN PARALLEL (analysis group):
        - bmm-requirements-analyst: analyze and refine requirements
        - bmm-epic-optimizer: ensure story aligns with epic scope
      </action>
      <action>Create story markdown file using template from {project-root}/bmad/bmm/workflows/4-implementation/create-story/template.md</action>
      <action>Include: Story title, description, Acceptance Criteria, Tasks/Subtasks, Dev Notes sections</action>
      <action>Save to {{story_dir}} with naming convention: story-{epic-id}-{story-number}-{date}.md</action>
      
      <!-- LEVEL 2 OPTIMIZATION: Signal Phase 2 to begin early -->
      <signal-next-phase if="{{cross_phase_overlap}}" phase="2" step="2.2">
        Story file created at {{story_path}}. 
        Phase 2 can begin codebase analysis in parallel with context generation.
        Data available: story_path
      </signal-next-phase>
      
      <check>If epic file not found or invalid → HALT: "Cannot create story without valid epic/PRD"</check>
      <check>If requirements are ambiguous → ASK user to clarify before proceeding</check>
    </step>

    <step n="1.2" goal="Generate story context (XML/JSON)">

      <!-- PHASE 1 NEW: Context caching for epic-level reuse -->
      <context-caching if="{{context_caching}}">
        <description>Reuse cached epic-level context for stories in same epic</description>
        <check-cache>
          <action>Extract epic ID from story file (e.g., "epic-1" from story-1-1-*.md)</action>
          <action>Check for cached epic context at: {output_folder}/contexts/epic-{epic_id}-context.xml</action>
          <if-exists>
            <action>Load cached epic context (architecture, patterns, constraints, interfaces)</action>
            <action>Only generate story-specific context (acceptance criteria, tasks, file list)</action>
            <action>Merge cached epic context + story-specific context (2 min vs 5 min)</action>
            <benefit>Saves 3 min for 2nd+ story in same epic</benefit>
          </if-exists>
          <if-not-exists>
            <action>Generate full context (first story in epic)</action>
            <action>Cache epic-level portions for future stories in same epic</action>
            <action>Save to: {output_folder}/contexts/epic-{epic_id}-context.xml</action>
          </if-not-exists>
        </check-cache>
        <note>Cache is epic-scoped, valid for all stories with same epic ID</note>
      </context-caching>

      <!-- LEVEL 1.5 OPTIMIZATION: Smart context generation -->
      <smart-generation if="{{smart_context_generation}}">
        <description>Generate XML and JSON contexts in parallel, JSON optional if XML succeeds</description>
        <parallel-generation>
          <action>Run story-context workflow with format="xml" (primary, 3 min)</action>
          <action>Run story-context workflow with format="json" (backup, 2 min) IN PARALLEL</action>
          <action>Wait for both (longest = 3 min instead of sequential 5 min)</action>
        </parallel-generation>
        <conditional-json>
          <if-condition>XML generation succeeds AND is complete</if-condition>
          <action>Skip JSON generation or cancel if in progress</action>
          <benefit>Saves 2 min if XML sufficient</benefit>
        </conditional-json>
        <note>Saves 2 min total: parallel generation OR conditional skip</note>
      </smart-generation>

      <standard-generation if="!{{smart_context_generation}} AND !{{context_caching}}">
        <action>Run {project-root}/bmad/bmm/workflows/4-implementation/story-context/workflow.yaml</action>
        <action>Pass story_path from step 1.1 to story-context workflow</action>
        <action>Story-context workflow will generate comprehensive context including: artifacts, interfaces, constraints, tests</action>
      </standard-generation>

      <action>Verify context file created successfully (XML preferred, JSON as backup)</action>
      <action>Add Context Reference path to story file under "Dev Agent Record" section</action>
      <check>If context generation fails → HALT: "Story context is required for implementation"</check>
    </step>

    <step n="1.3" goal="Validate story completeness">
      <action>INVOKE subagent: bmm-document-reviewer to review story for completeness</action>
      <action>Verify story contains: clear acceptance criteria, decomposed tasks, context reference</action>
      <action>Check that story aligns with epic scope and architecture constraints</action>
      <check>If story incomplete or unclear → Return to step 1.1 to refine</check>
    </step>

    <step n="1.4" goal="Set status and handoff to Dev">
      <action>Update story Status field to "Approved"</action>
      <action>Add approval note in Dev Agent Record including: date, approver (Bob), epic reference</action>
      <action>Save story file</action>
      <action>Prepare handoff data: story_path, story_context_path, acceptance_criteria, tasks_list, epic_context, approval_status</action>
      <handoff to="phase-2" agent="dev" lead="Amelia">
        Story created and approved. Handing off to Amelia (Dev) for implementation.
        - Story: {{story_path}}
        - Context: {{story_context_path}}
        - Status: Approved
        - Tasks: {{task_count}} tasks ready for implementation
      </handoff>
    </step>

  </phase>

  <!-- ============================================ -->
  <!-- PHASE 2: Story Loading & Implementation Planning -->
  <!-- AGENT: Dev (Amelia)                           -->
  <!-- ============================================ -->

  <phase n="2" agent="dev" lead="Amelia">

    <step n="2.1" goal="Load story and context from SM" depends-on="phase-1-complete">
      
      <!-- LEVEL 2 OPTIMIZATION: Must wait for Phase 1 to complete if step 2.2 started early -->
      <synchronize if="{{cross_phase_overlap}}">
        <wait-for phase="1" status="complete">
          If step 2.2 started early, Phase 1 context generation completes in parallel.
          Now wait for Phase 1 to fully complete before loading context.
        </wait-for>
      </synchronize>
      
      <action>Receive handoff data from Phase 1 (Bob)</action>
      <action>Load COMPLETE story file from {{story_path}}</action>
      <action>Verify Status == "Approved" (HALT if not approved)</action>
      <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Notes, Dev Agent Record, Context Reference</action>
      <action>Load Story Context from Context Reference path (prefer XML, fallback to JSON)</action>
      <action>PIN loaded context as AUTHORITATIVE for implementation session</action>
      <check>If story not approved → HALT: "Story must have Status=Approved before implementation"</check>
      <check>If context file missing or invalid → HALT: "Story Context required for implementation"</check>
    </step>

    <step n="2.2" goal="Analyze codebase for implementation" can-start-early="true">
      
      <!-- LEVEL 2 OPTIMIZATION: Can start when Phase 1 step 1.1 signals -->
      <early-start-trigger if="{{cross_phase_overlap}}">
        <from-phase>1</from-phase>
        <from-step>1.1</from-step>
        <requires>story_path</requires>
        <note>Codebase analysis doesn't need story context, can run parallel to Phase 1 step 1.2</note>
      </early-start-trigger>
      
      <action>INVOKE subagent: bmm-codebase-analyzer to analyze repository structure</action>
      <action>Subagent analyzes: existing patterns, architectural style, code conventions, relevant modules</action>
      <action>Review story acceptance criteria (available from story file)</action>
      <action>Identify integration points and dependencies for this story</action>
      <note>This step runs in parallel with Phase 1 step 1.2 (context generation) when Level 2 enabled</note>
    </step>

    <step n="2.3" goal="Plan implementation approach">
      <action>Review ALL acceptance criteria and tasks from story</action>
      <action>Using codebase analysis and story context, plan implementation steps</action>
      <action>Identify edge cases and error handling requirements</action>
      <action>Document implementation plan in Dev Agent Record → Debug Log</action>
      <action>Prepare handoff data: implementation_plan, codebase_analysis</action>
      <check>If implementation approach unclear or requires architectural decisions → ASK user for guidance</check>
      <handoff to="phase-3" agent="dev" lead="Amelia">
        Implementation planning complete. Beginning code execution.
        - Plan documented in Debug Log
        - Codebase analyzed and patterns identified
        - Ready to implement {{task_count}} tasks
      </handoff>
    </step>

  </phase>

  <!-- ============================================ -->
  <!-- PHASE 3: Implementation Execution            -->
  <!-- AGENT: Dev (Amelia)                          -->
  <!-- ============================================ -->

  <phase n="3" agent="dev" lead="Amelia">

    <step n="3.1" goal="Implement tasks iteratively">
      <action>Select first incomplete task from Tasks/Subtasks list</action>
      <action>Implement task COMPLETELY including all subtasks</action>
      <action>Follow architectural patterns from codebase analysis</action>
      <action>Handle edge cases and error conditions as planned</action>

      <!-- PHASE 1 NEW: Incremental validation after each task -->
      <incremental-validation if="{{incremental_validation}}">
        <description>Quick validation after each task completion catches issues early</description>
        <after-each-task>
          <action>Quick syntax check: Run linter on modified files (30 sec)</action>
          <action>Quick pattern check: Verify task follows architectural patterns (30 sec)</action>
          <action>Quick integration check: Verify task doesn't break existing code (30 sec)</action>
          <total-time>~1 min per task (vs 10 min final validation for all tasks)</total-time>
          <benefit>Issues caught immediately, easier to fix while context fresh</benefit>
        </after-each-task>
        <note>This replaces heavy final validation with lightweight incremental checks</note>
      </incremental-validation>

      <action>Mark task checkbox [x] ONLY when fully implemented AND validated (if incremental enabled)</action>
      <action>Update Dev Agent Record → Debug Log with implementation notes</action>
      <action>Repeat for each incomplete task until all tasks implemented</action>
      
      <!-- LEVEL 2 OPTIMIZATION: Signal Phase 4 when 75% complete -->
      <progress-check if="{{cross_phase_overlap}}" threshold="0.75">
        <when-reached>
          <signal-next-phase phase="4" step="4.1">
            Implementation 75% complete ({{completed_tasks}}/{{total_tasks}} tasks done).
            Phase 4 can begin test strategy design.
            Data available: acceptance_criteria, partial_implementation, completed_files
          </signal-next-phase>
        </when-reached>
      </progress-check>
      
      <check>If unapproved dependencies needed → ASK user for approval before adding</check>
      <check>If 3 consecutive implementation failures → HALT and request guidance</check>
      <check>If required configuration missing → HALT: "Cannot proceed without necessary configuration"</check>
    </step>

    <step n="3.2" goal="Update story file with progress">
      <action>Update File List section with all new/modified/deleted files (relative paths)</action>
      <action>Add completion notes to Dev Agent Record for significant changes</action>
      <action>Append entries to Change Log describing changes</action>
      <action>Save story file</action>
    </step>

    <step n="3.3" goal="Validate implementation against patterns">

      <!-- PHASE 1 NEW: Lighter final validation if incremental validation enabled -->
      <light-validation if="{{incremental_validation}}">
        <description>Final validation is lighter since each task already validated</description>
        <action>Quick integration review: Verify all tasks work together (2 min)</action>
        <action>INVOKE subagents IN PARALLEL (validation group):
          - bmm-pattern-detector: quick final pattern check (already checked per-task)
          - bmm-dependency-mapper: map cross-task dependencies only
        </action>
        <action>Review subagent findings (should be minimal issues)</action>
        <total-time>~3 min (vs 10 min without incremental validation)</total-time>
        <note>Saves 5-7 min: (8 tasks × 1 min each) + 3 min final = 11 min total vs 10 min final</note>
      </light-validation>

      <full-validation if="!{{incremental_validation}}">
        <action>INVOKE subagents IN PARALLEL (validation group):
          - bmm-pattern-detector: validate code follows architectural patterns
          - bmm-dependency-mapper: map dependencies and integration points
        </action>
        <action>Review subagent findings and address any pattern violations</action>
        <action>Document pattern validation results in Dev Agent Record</action>
        <total-time>~10 min</total-time>
      </full-validation>

      <check>If pattern violations detected → Fix before proceeding to testing phase</check>
    </step>

    <step n="3.4" goal="Handoff to Tea for testing">
      <action>Prepare handoff data: implemented_files, changes_summary, patterns_validated, dependencies_mapped, story_updates</action>
      <action>Ensure all implementation complete and validated before handoff</action>
      <handoff to="phase-4" agent="tea" lead="Murat">
        Implementation complete. Handing off to Murat (Tea) for testing.
        - All {{task_count}} tasks implemented
        - {{file_count}} files modified/created
        - Patterns validated, dependencies mapped
        - Ready for test strategy and implementation
      </handoff>
    </step>

  </phase>

  <!-- ============================================ -->
  <!-- PHASE 4: Testing & Validation                -->
  <!-- AGENT: Tea (Murat)                           -->
  <!-- ============================================ -->

  <phase n="4" agent="tea" lead="Murat">

    <step n="4.1" goal="Design comprehensive test strategy" can-start-early="true">
      
      <!-- LEVEL 2 OPTIMIZATION: Can start when Phase 3 reaches 75% completion -->
      <early-start-trigger if="{{cross_phase_overlap}}">
        <from-phase>3</from-phase>
        <from-step>3.1</from-step>
        <trigger-condition>progress >= 0.75</trigger-condition>
        <requires>acceptance_criteria, partial_implementation (first 75% of tasks)</requires>
        <note>Test strategy can be designed based on completed code while remaining tasks finish</note>
      </early-start-trigger>
      
      <action>Receive handoff data from Phase 3 (Amelia) - full or partial depending on trigger</action>
      <action>Review story acceptance criteria (always available)</action>
      <action>Review implemented changes (partial if early start, full after Phase 3 complete)</action>
      <action>Design test strategy covering:
        - Unit tests for business logic and core functionality
        - Integration tests for component interactions
        - E2E tests for critical user flows (if applicable)
        - Edge cases and error handling scenarios
      </action>
      <action>Document test strategy including coverage targets</action>
    </step>

    <step n="4.2" goal="Implement comprehensive tests IN PARALLEL">
      
      <parallel-execution strategy="concurrent-task-agents">
        
        <task id="unit-tests" agent="task-agent-1" priority="high">
          <description>Write comprehensive unit tests for all new/modified business logic</description>
          <scope>
            - Test all new functions, methods, and classes
            - Mock external dependencies (APIs, databases, services)
            - Cover happy paths, edge cases, and error conditions
            - Target: 85%+ coverage of business logic
          </scope>
          <output-pattern>tests/unit/**/*.test.ts(x)</output-pattern>
          <dependencies>
            - Story acceptance criteria
            - Implementation files from Phase 3
            - Existing test patterns
          </dependencies>
          <estimated-time>30 minutes</estimated-time>
        </task>

        <task id="integration-tests" agent="task-agent-2" priority="high">
          <description>Write integration tests for component interactions and API calls</description>
          <scope>
            - Test component integration (multiple components working together)
            - Test API client calls (real HTTP requests to test environment)
            - Test state management integration
            - Test database operations (if applicable)
            - Cover authentication flows, data flow between components
          </scope>
          <output-pattern>tests/integration/**/*.test.ts(x)</output-pattern>
          <dependencies>
            - Story acceptance criteria
            - Implementation files from Phase 3
            - Test API credentials/endpoints
          </dependencies>
          <estimated-time>20 minutes</estimated-time>
        </task>

        <task id="e2e-tests" agent="task-agent-3" priority="medium" conditional="true">
          <description>Write E2E tests for critical user flows (UI stories only)</description>
          <scope>
            - Test complete user journeys from UI to backend
            - Test critical happy paths (primary use cases)
            - Use Playwright or Cypress for browser automation
            - Skip if story has no UI changes
          </scope>
          <output-pattern>tests/e2e/**/*.spec.ts(x)</output-pattern>
          <dependencies>
            - Story acceptance criteria
            - UI implementation from Phase 3
            - E2E test framework setup
          </dependencies>
          <conditional-check>
            If story.hasUIChanges === false → Skip this task
          </conditional-check>
          <estimated-time>10 minutes</estimated-time>
        </task>

      </parallel-execution>

      <action>INVOKE Task tool 3 times IN PARALLEL (if {{parallel_test_writing}} == true):
        
        TASK 1 (Unit Tests):
        prompt: "Write comprehensive unit tests for the implemented code.
        
        Context:
        - Story: {{story_path}}
        - Implementation files: {{implemented_files}}
        - Existing test patterns: Analyze tests/unit/ for patterns
        
        Requirements:
        - Create unit tests in tests/unit/ directory
        - Test all new functions, methods, classes
        - Mock external dependencies (APIs, databases)
        - Cover happy paths, edge cases, errors
        - Target 85%+ coverage
        - Follow existing test structure and naming conventions
        
        Output:
        - List all test files created
        - Total test count
        - Estimated coverage"
        
        TASK 2 (Integration Tests):
        prompt: "Write integration tests for component interactions and API calls.
        
        Context:
        - Story: {{story_path}}
        - Implementation files: {{implemented_files}}
        - API endpoints: {{api_endpoints}}
        
        Requirements:
        - Create integration tests in tests/integration/ directory
        - Test component integration
        - Test real API calls (use test environment)
        - Test state management flows
        - Test authentication if applicable
        - Follow existing integration test patterns
        
        Output:
        - List all test files created
        - Total test count"
        
        TASK 3 (E2E Tests - Conditional):
        prompt: "Write E2E tests for critical user flows (ONLY if UI changes exist).
        
        Context:
        - Story: {{story_path}}
        - UI changes: {{ui_changes}}
        
        Requirements:
        - If NO UI changes → Skip and report 'No E2E tests needed'
        - If UI changes exist:
          - Create E2E tests in tests/e2e/ directory
          - Test complete user journeys
          - Use Playwright/Cypress
          - Test critical happy paths only
        
        Output:
        - List all test files created (or 'Skipped: No UI changes')
        - Total test count"
        
      </action>

      <action>Wait for all parallel tasks to complete (longest = ~30 min)</action>

      <!-- LEVEL 3.4 OPTIMIZATION: Progressive test execution -->
      <progressive-execution if="{{progressive_test_execution}}">
        <description>Execute each test file as soon as it's written, providing faster feedback</description>
        <monitor-each-task>
          <when-condition>Test file created by any task agent</when-condition>
          <action>Immediately execute that specific test file (e.g., npm test -- client.test.ts)</action>
          <action>Report pass/fail status to monitoring agent</action>
          <benefit>Catch test failures early while other tests still being written</benefit>
        </monitor-each-task>
        <note>This runs in background parallel to test writing, saves ~6 min in step 4.3</note>
      </progressive-execution>

      <action>Aggregate results from all 3 tasks:
        - Collect all test files created (unit + integration + e2e)
        - Sum total test count
        - Document test coverage by type
      </action>

      <alternative>
        If {{parallel_test_writing}} == false OR parallel execution fails:
        - Write unit tests sequentially (30 min)
        - Write integration tests sequentially (20 min)
        - Write E2E tests sequentially (10 min)
        - Total: 60 min (vs 30 min parallel)
      </alternative>

    </step>

    <step n="4.3" goal="Execute tests and analyze coverage">

      <!-- LEVEL 3.4 OPTIMIZATION: Most tests already executed progressively -->
      <fast-path if="{{progressive_test_execution}}">
        <description>Tests were already executed during step 4.2 as they were written</description>
        <action>Run quick final validation: npm test (confirms all tests still pass together)</action>
        <action>This should be very fast (~2 min) since tests already passed individually</action>
        <note>Saves ~6 min compared to running all tests for first time</note>
      </fast-path>

      <standard-path if="!{{progressive_test_execution}}">
        <action>Determine test command:
          - PREFERRED: npm run test:parallel (runs unit, integration, E2E concurrently)
          - FALLBACK: npm test (runs all tests sequentially)
          - OVERRIDE: {{run_tests_command}} if provided
        </action>
        <action>Execute tests in parallel using npm run test:parallel:
          - Unit tests (tests/unit/**)
          - Integration tests (tests/integration/**)
          - E2E tests (tests/e2e/**)
          - All run simultaneously, wait for longest
        </action>
        <alternative>
          If parallel execution fails or not supported, run sequentially with npm run test:all
        </alternative>
      </standard-path>
      <action>INVOKE subagents IN PARALLEL (quality group):
        - bmm-test-coverage-analyzer: analyze coverage and identify gaps
        - bmm-tech-debt-auditor: identify test-related technical debt (can run concurrently)
      </action>
      <action>Review coverage report and address any critical gaps</action>
      
      <!-- LEVEL 2 OPTIMIZATION: Signal Phase 5 when all tests passing -->
      <success-check if="{{cross_phase_overlap}}">
        <when-condition>all_tests_passing AND coverage_adequate</when-condition>
        <signal-next-phase phase="5" step="5.1">
          All tests passing! Phase 5 can begin documentation review.
          Data available: test_results, test_files, coverage_report
          Note: Quality gates (4.4) will complete in parallel
        </signal-next-phase>
      </success-check>
      
      <check>If regression tests fail → STOP and notify Dev to fix before continuing</check>
      <check>If new tests fail → STOP and notify Dev to fix implementation</check>
      <check>If coverage below acceptance criteria thresholds → Add tests to meet requirements</check>
    </step>

    <step n="4.4" goal="Validate quality gates">
      <action>Run linting and code quality checks (if configured)</action>
      <action>Run static analysis tools (if configured)</action>
      <action>Review tech debt audit results from step 4.3 (already completed in parallel)</action>
      <action>Validate ALL story acceptance criteria met (functional + NFRs if specified)</action>
      <action>Document quality gate results</action>
      <check>If lint/quality checks fail → Address issues before proceeding</check>
      <check>If acceptance criteria NOT met → Return to Dev for fixes</check>
    </step>

    <step n="4.5" goal="Handoff to Dev for story review">
      <action>Prepare handoff data: test_strategy, test_files, test_results, coverage_report, quality_gate_status, lint_results</action>
      <action>Ensure all tests passing and quality gates met</action>
      <handoff to="phase-5" agent="dev" lead="Amelia">
        Testing complete. Handing off to Amelia (Dev) for story review.
        - Test strategy implemented and executed
        - {{test_count}} tests created ({{unit_count}} unit, {{integration_count}} integration, {{e2e_count}} E2E)
        - All tests passing
        - Coverage: {{coverage_percent}}%
        - Quality gates: {{gate_status}}
      </handoff>
    </step>

  </phase>

  <!-- ============================================ -->
  <!-- PHASE 5: Story Review & Completion           -->
  <!-- AGENT: Dev (Amelia)                          -->
  <!-- ============================================ -->

  <phase n="5" agent="dev" lead="Amelia">

    <step n="5.1" goal="Review story documentation" can-start-early="true">
      
      <!-- LEVEL 2 OPTIMIZATION: Can start when Phase 4 tests pass -->
      <early-start-trigger if="{{cross_phase_overlap}}">
        <from-phase>4</from-phase>
        <from-step>4.3</from-step>
        <trigger-condition>all_tests_passing</trigger-condition>
        <requires>test_results, test_files</requires>
        <note>Documentation review can start while Phase 4 quality gates (step 4.4) complete</note>
      </early-start-trigger>
      
      <action>Receive handoff data from Phase 4 (Murat) - full or partial depending on trigger</action>
      <action>INVOKE subagents IN PARALLEL (review group):
        - bmm-document-reviewer: review story completeness
        - bmm-requirements-analyst: prepare for acceptance criteria validation
      </action>
      <action>Verify File List includes ALL modified/created files</action>
      <action>Verify Change Log has clear entries for all changes</action>
      <action>Verify Dev Agent Record has appropriate Debug Log and Completion Notes</action>
      <action>Review test documentation from Tea</action>
      <check>If documentation incomplete → Update before proceeding</check>
    </step>

    <step n="5.2" goal="Validate all acceptance criteria met">
      <action>Review requirements analysis from step 5.1 (already completed in parallel)</action>
      <action>Re-scan story file and verify ALL tasks and subtasks marked [x]</action>
      <action>Validate each acceptance criterion against implementation and test results</action>
      <action>Check quantitative thresholds (if any) are met (test coverage, performance, etc.)</action>
      <check>If ANY acceptance criterion not met → STOP and return to implementation or testing phase</check>
      <check>If ANY task incomplete → STOP and complete remaining work</check>
    </step>

    <step n="5.3" goal="Run final regression suite">
      <action>Execute FULL regression test suite (do not skip)</action>
      <action>Verify no regressions introduced</action>
      <action>Confirm all quality checks still pass</action>
      <check>If any regression failures → STOP and fix before completing</check>
    </step>

    <step n="5.4" goal="Complete story and prepare handoff">
      <action>Update story Status to "Ready for Review"</action>
      <action>Add final completion notes to Dev Agent Record → Completion Notes section summarizing:
        - Implementation approach and key decisions
        - Test coverage achieved
        - Any follow-up items or technical debt identified
      </action>
      <action>Save story file</action>
      <action>Prepare completion summary for user/reviewer</action>
      <action>OPTIONAL: Run validation using {project-root}/bmad/core/tasks/validate-workflow.md</action>
      <completion>
        Story execution complete!

        Story: {{story_path}}
        Status: Ready for Review

        Summary:
        - Tasks completed: {{completed_task_count}}/{{total_task_count}}
        - Files modified: {{file_count}}
        - Tests added: {{test_count}}
        - Test coverage: {{coverage_percent}}%
        - All acceptance criteria: MET ✓

        The story is ready for senior developer review.
      </completion>
    </step>

  </phase>

</workflow>
```
