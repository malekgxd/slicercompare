---
title: 'Dev Story Multi-Agent Completion Checklist'
validation-target: 'Story markdown ({{story_path}})'
required-inputs:
  - 'Epic file or PRD'
  - 'Story markdown file with Tasks/Subtasks, Acceptance Criteria'
  - 'Story Context (XML/JSON)'
optional-inputs:
  - 'Technical Specification'
  - 'Architecture Documentation'
  - 'Test results output'
  - 'CI logs (if applicable)'
validation-rules:
  - 'Only permitted sections in story were modified: Tasks/Subtasks checkboxes, Dev Agent Record (Debug Log, Completion Notes), File List, Change Log, and Status'
  - 'All phases must complete with proper agent handoffs'
  - 'All subagents must be invoked as specified in workflow.yaml'
---

# Dev Story Multi-Agent Completion Checklist

## Phase 1: Story Creation & Context Generation (SM - Bob)

### Story Creation
- [ ] Epic/PRD loaded and analyzed
- [ ] Subagent bmm-requirements-analyst invoked for requirement analysis
- [ ] Subagent bmm-epic-optimizer invoked for epic alignment
- [ ] Story markdown created with all required sections:
  - [ ] Story title and description
  - [ ] Acceptance Criteria
  - [ ] Tasks/Subtasks (decomposed and clear)
  - [ ] Dev Notes section
  - [ ] Dev Agent Record section

### Context Generation
- [ ] Story context workflow executed successfully
- [ ] Context file created (XML and/or JSON)
- [ ] Context Reference added to story Dev Agent Record
- [ ] Context includes: artifacts, interfaces, constraints, tests

### Validation & Handoff
- [ ] Subagent bmm-document-reviewer invoked for completeness check
- [ ] Story validated for clarity and completeness
- [ ] Story Status set to "Approved"
- [ ] Approval note added to Dev Agent Record (date, approver, epic reference)
- [ ] Handoff to Dev (Amelia) completed with all required data

---

## Phase 2: Story Loading & Implementation Planning (Dev - Amelia)

### Story Loading
- [ ] Handoff data received from SM (Bob)
- [ ] Story file loaded completely
- [ ] Story Status verified as "Approved"
- [ ] All story sections parsed correctly
- [ ] Story Context loaded and pinned as authoritative

### Codebase Analysis
- [ ] Subagent bmm-codebase-analyzer invoked
- [ ] Repository structure analyzed
- [ ] Existing patterns identified
- [ ] Code conventions documented
- [ ] Relevant modules identified
- [ ] Integration points mapped

### Implementation Planning
- [ ] All acceptance criteria reviewed
- [ ] All tasks and subtasks reviewed
- [ ] Implementation approach planned
- [ ] Edge cases identified
- [ ] Error handling requirements documented
- [ ] Implementation plan documented in Dev Agent Record → Debug Log
- [ ] Handoff to Phase 3 completed

---

## Phase 3: Implementation Execution (Dev - Amelia)

### Implementation
- [ ] All tasks implemented completely (including subtasks)
- [ ] Architectural patterns followed
- [ ] Edge cases handled
- [ ] Error conditions handled
- [ ] All tasks marked with [x] checkboxes

### Story Updates
- [ ] File List updated with all new/modified/deleted files (relative paths)
- [ ] Completion notes added to Dev Agent Record
- [ ] Change Log updated with change descriptions
- [ ] Story file saved

### Pattern Validation
- [ ] Subagent bmm-pattern-detector invoked
- [ ] Subagent bmm-dependency-mapper invoked
- [ ] Code validated against architectural patterns
- [ ] Dependencies mapped
- [ ] Pattern violations addressed (if any)
- [ ] Validation results documented in Dev Agent Record
- [ ] Handoff to Tea (Murat) completed

---

## Phase 4: Testing & Validation (Tea - Murat)

### Test Strategy
- [ ] Handoff data received from Dev (Amelia)
- [ ] Story acceptance criteria reviewed
- [ ] Implemented changes reviewed
- [ ] Test strategy designed:
  - [ ] Unit tests planned
  - [ ] Integration tests planned
  - [ ] E2E tests planned (if applicable)
  - [ ] Edge case tests planned
  - [ ] Error handling tests planned
- [ ] Coverage targets defined

### Test Implementation
- [ ] Unit tests created for all new/modified business logic
- [ ] Integration tests created for component interactions
- [ ] E2E tests created for critical user flows (if UI changes)
- [ ] Edge case tests implemented
- [ ] Error handling tests implemented
- [ ] Test files documented

### Test Execution & Coverage
- [ ] Test command determined
- [ ] All existing tests executed (regression check)
- [ ] All new tests executed
- [ ] Subagent bmm-test-coverage-analyzer invoked
- [ ] Coverage report reviewed
- [ ] Coverage gaps addressed
- [ ] No regression failures
- [ ] All new tests passing

### Quality Gates
- [ ] Linting checks executed and passing
- [ ] Static analysis executed and passing
- [ ] Subagent bmm-tech-debt-auditor invoked
- [ ] All story acceptance criteria validated (functional + NFRs)
- [ ] Quality gate results documented
- [ ] Handoff to Dev (Amelia) for review completed

---

## Phase 5: Story Review & Completion (Dev - Amelia)

### Documentation Review
- [ ] Handoff data received from Tea (Murat)
- [ ] Subagent bmm-document-reviewer invoked
- [ ] File List complete and accurate
- [ ] Change Log has clear entries for all changes
- [ ] Dev Agent Record has Debug Log and Completion Notes
- [ ] Test documentation from Tea reviewed

### Acceptance Criteria Validation
- [ ] Subagent bmm-requirements-analyst invoked during review
- [ ] All tasks and subtasks verified as [x] checked
- [ ] Each acceptance criterion validated against implementation
- [ ] Each acceptance criterion validated against test results
- [ ] Quantitative thresholds met (coverage, performance, etc.)

### Final Validation
- [ ] Full regression test suite executed
- [ ] No regressions introduced
- [ ] All quality checks still passing

### Story Completion
- [ ] Story Status updated to "Ready for Review"
- [ ] Final completion notes added to Dev Agent Record:
  - [ ] Implementation approach summarized
  - [ ] Key decisions documented
  - [ ] Test coverage achieved documented
  - [ ] Follow-up items identified (if any)
  - [ ] Technical debt identified (if any)
- [ ] Story file saved
- [ ] Completion summary prepared

---

## Multi-Agent Orchestration Validation

### Agent Handoffs
- [ ] Phase 1 → Phase 2 handoff executed properly (SM to Dev)
- [ ] Phase 2 → Phase 3 handoff executed properly (Dev internal)
- [ ] Phase 3 → Phase 4 handoff executed properly (Dev to Tea)
- [ ] Phase 4 → Phase 5 handoff executed properly (Tea to Dev)

### Subagent Invocations
- [ ] All required subagents invoked at correct phases
- [ ] Subagent outputs reviewed and acted upon
- [ ] Subagent findings documented appropriately

### Data Continuity
- [ ] All handoff data properly passed between phases
- [ ] Context maintained throughout workflow
- [ ] No information loss at handoff points

---

## Final Story State

- [ ] Story Status: "Ready for Review"
- [ ] All tasks completed: {{completed_task_count}}/{{total_task_count}}
- [ ] Files modified: {{file_count}}
- [ ] Tests added: {{test_count}}
- [ ] Test coverage: {{coverage_percent}}%
- [ ] All acceptance criteria: MET ✓
- [ ] Only permitted sections modified
- [ ] Ready for senior developer review
