# Dev Story - Multi-Agent Workflow

## Purpose

Execute a complete user story from creation through implementation, testing, and review using a **multi-agent orchestration pattern** with specialized BMad agents and Claude Code subagents.

## Multi-Agent Architecture

This workflow orchestrates three primary agents with specialized subagents:

### **Primary Agents**

1. **Bob (SM - Scrum Master)** - Story preparation specialist
2. **Amelia (Dev - Developer)** - Implementation expert
3. **Murat (Tea - Test Architect)** - Testing and quality specialist

### **Claude Code Subagents**

Each phase leverages specialized subagents:

- **bmm-requirements-analyst** - Requirements analysis and refinement
- **bmm-epic-optimizer** - Epic scope alignment
- **bmm-document-reviewer** - Documentation completeness
- **bmm-codebase-analyzer** - Repository analysis
- **bmm-pattern-detector** - Architectural pattern validation
- **bmm-dependency-mapper** - Dependency mapping
- **bmm-test-coverage-analyzer** - Test coverage analysis
- **bmm-tech-debt-auditor** - Technical debt identification

## Workflow Phases

### Phase 1: Story Creation & Context Generation
**Agent: Bob (SM)**

Bob creates the foundation:
1. Loads epic/PRD and analyzes requirements (with bmm-requirements-analyst)
2. Creates story markdown with acceptance criteria and tasks
3. Generates comprehensive story context (XML/JSON) via story-context workflow
4. Validates story completeness (with bmm-document-reviewer)
5. Sets Status = "Approved"
6. **Hands off to Amelia (Dev)**

**Outputs:**
- Story markdown file in `{story_dir}`
- Story context (XML/JSON)
- Status: Approved

---

### Phase 2: Story Loading & Implementation Planning
**Agent: Amelia (Dev)**

Amelia prepares for implementation:
1. Loads approved story and context from Bob
2. Analyzes codebase structure (with bmm-codebase-analyzer)
3. Reviews acceptance criteria and tasks
4. Plans implementation approach
5. Documents plan in Dev Agent Record → Debug Log
6. **Proceeds to Phase 3 (internal handoff)**

**Outputs:**
- Implementation plan
- Codebase analysis results

---

### Phase 3: Implementation Execution
**Agent: Amelia (Dev)**

Amelia implements the solution:
1. Implements all tasks and subtasks iteratively
2. Follows architectural patterns and coding standards
3. Handles edge cases and errors
4. Updates story progress (checkboxes, notes, file list)
5. Validates patterns (with bmm-pattern-detector)
6. Maps dependencies (with bmm-dependency-mapper)
7. **Hands off to Murat (Tea)**

**Outputs:**
- Implemented code
- Updated story file
- Pattern validation results
- Dependency map

---

### Phase 4: Testing & Validation
**Agent: Murat (Tea)**

Murat ensures quality:
1. Designs comprehensive test strategy
2. Implements tests (unit, integration, E2E)
3. Executes all tests (new + regression)
4. Analyzes coverage (with bmm-test-coverage-analyzer)
5. Validates quality gates
6. Audits technical debt (with bmm-tech-debt-auditor)
7. **Hands off back to Amelia (Dev)**

**Outputs:**
- Test files
- Test results
- Coverage report
- Quality gate status

---

### Phase 5: Story Review & Completion
**Agent: Amelia (Dev)**

Amelia performs final validation:
1. Reviews documentation (with bmm-document-reviewer)
2. Validates acceptance criteria (with bmm-requirements-analyst)
3. Verifies all tasks complete
4. Runs final regression suite
5. Sets Status = "Ready for Review"
6. Adds completion notes

**Outputs:**
- Story Status: Ready for Review
- Completion summary
- Ready for senior developer review

## How to Invoke

### Via Agent Command (Recommended)

```bash
# Using Dev (Amelia) agent
@dev *develop
```

Or via Scrum Master (Bob) to start from Phase 1:
```bash
@sm *create-story
```

### Via Workflow Path

```bash
workflow {project-root}/bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml
```

## Inputs

### Required
- `epic_file` - Path to epic file or PRD containing requirements

### Optional
- `tech_spec` - Path to technical specification
- `architecture_docs` - Path to architecture documentation
- `story_path` - Explicit path to story (if starting from Phase 2+)
- `run_tests_command` - Override test command (default: auto-detect)

## Configuration

Ensure your BMM config defines:

```yaml
# bmad/bmm/config.yaml
project_name: your-project
output_folder: ./docs
user_name: Your Name
communication_language: English
dev_story_location: ./docs/stories
```

## Agent Handoff Protocol

The workflow uses **explicit handoff** between agents:

1. **Phase Complete** - Agent completes all steps in their phase
2. **Prepare Handoff Data** - Agent packages relevant artifacts and context
3. **Explicit Handoff** - Agent announces handoff with summary
4. **Receive & Acknowledge** - Next agent acknowledges receipt and validates data
5. **Continue Execution** - Next agent proceeds with their phase

Example handoff:

```
[Amelia → Murat]
Implementation complete. Handing off to Murat (Tea) for testing.
- All 5 tasks implemented
- 12 files modified/created
- Patterns validated, dependencies mapped
- Ready for test strategy and implementation
```

## Subagent Invocation Pattern

Subagents are invoked at specific points in each phase:

### Pre-Phase Subagents
Run **before** main phase work begins (e.g., bmm-codebase-analyzer before implementation)

### During-Phase Subagents
Run **during** phase execution (e.g., bmm-requirements-analyst during story creation)

### Post-Phase Subagents
Run **after** main phase work completes (e.g., bmm-pattern-detector after implementation)

Each subagent provides specialized analysis that informs the agent's work.

## Story File Modifications

**Only these sections may be modified:**
- Tasks/Subtasks checkboxes `[ ]` → `[x]`
- Dev Agent Record (Debug Log, Completion Notes)
- File List
- Change Log
- Status

**Do NOT modify:**
- Story description
- Acceptance Criteria
- Any other sections

## Workflow Validation

Use the included checklist to validate workflow completion:

```bash
workflow {project-root}/bmad/core/tasks/validate-workflow.md
```

The checklist validates:
- All phases completed
- All agent handoffs executed
- All subagents invoked
- All acceptance criteria met
- Story ready for review

## Related Workflows

### Prerequisite Workflows (Run by Bob)
- **create-story** - Create story markdown from epic
- **story-context** - Generate story context (XML/JSON)

### Follow-up Workflows
- **review-story** - Senior developer review
- **retrospective** - Post-epic retrospective

## Files in This Workflow

- **workflow.yaml** - Configuration, agents, phases, subagents
- **instructions.md** - Step-by-step execution logic with XML structure
- **checklist.md** - Comprehensive validation checklist
- **README.md** - This file

## Key Features

✅ **Multi-Agent Orchestration** - Three specialized agents with clear responsibilities
✅ **Subagent Integration** - Claude Code subagents for specialized analysis
✅ **Explicit Handoffs** - Clear agent transitions with data continuity
✅ **Comprehensive Testing** - Test Architect ensures quality at every level
✅ **Pattern Validation** - Architectural compliance enforced
✅ **Full Traceability** - Requirements → Implementation → Tests → Review
✅ **Context Preservation** - Story context maintained throughout workflow
✅ **Quality Gates** - Multiple validation checkpoints

## Execution Hints

- **Non-Interactive** - Runs to completion without pausing (except on HALT conditions)
- **Autonomous** - Proceeds without user input unless blocked
- **Iterative** - Processes tasks one by one
- **Orchestrated** - Uses explicit agent handoff protocol
- **Parallel Analysis** - Subagents can run in parallel where applicable

## Example Execution Flow

```
User invokes: @dev *develop

Phase 1: Bob (SM)
  ├─ Load epic/PRD
  ├─ Invoke bmm-requirements-analyst
  ├─ Invoke bmm-epic-optimizer
  ├─ Create story markdown
  ├─ Generate story context
  ├─ Invoke bmm-document-reviewer
  ├─ Set Status = Approved
  └─ Handoff → Amelia

Phase 2: Amelia (Dev)
  ├─ Load story & context
  ├─ Invoke bmm-codebase-analyzer
  ├─ Plan implementation
  └─ Internal handoff → Phase 3

Phase 3: Amelia (Dev)
  ├─ Implement all tasks
  ├─ Update story file
  ├─ Invoke bmm-pattern-detector
  ├─ Invoke bmm-dependency-mapper
  └─ Handoff → Murat

Phase 4: Murat (Tea)
  ├─ Design test strategy
  ├─ Implement tests
  ├─ Execute tests
  ├─ Invoke bmm-test-coverage-analyzer
  ├─ Validate quality gates
  ├─ Invoke bmm-tech-debt-auditor
  └─ Handoff → Amelia

Phase 5: Amelia (Dev)
  ├─ Invoke bmm-document-reviewer
  ├─ Invoke bmm-requirements-analyst
  ├─ Validate all ACs met
  ├─ Run final regression
  ├─ Set Status = Ready for Review
  └─ Complete ✓

Output: Story ready for senior developer review
```

## Benefits of Multi-Agent Pattern

1. **Separation of Concerns** - Each agent focuses on their expertise
2. **Quality Assurance** - Dedicated Test Architect ensures comprehensive testing
3. **Pattern Compliance** - Specialized subagents enforce standards
4. **Reduced Hallucinations** - Context preserved and validated at each handoff
5. **Traceability** - Clear audit trail from requirements to completion
6. **Scalability** - Easy to add new agents or subagents
7. **Maintainability** - Each agent's responsibilities are clear and focused

## Troubleshooting

### Story Not Approved
**Symptom:** Phase 2 halts with "Story must be Approved"
**Solution:** Ensure Bob completed Phase 1 and set Status = "Approved"

### Context File Missing
**Symptom:** Phase 2 halts with "Story Context required"
**Solution:** Verify story-context workflow completed successfully in Phase 1

### Tests Failing
**Symptom:** Phase 4 stops with test failures
**Solution:** Murat hands back to Amelia for fixes, then resumes testing

### Pattern Violations
**Symptom:** Phase 3 detects pattern violations
**Solution:** Amelia fixes violations before proceeding to testing

### Missing Acceptance Criteria
**Symptom:** Phase 5 cannot validate ACs
**Solution:** Return to Phase 1 (Bob) to clarify requirements

## Version History

- **v6.4.0-cross-phase-overlap** - Added cross-phase overlapping (Level 2 optimization)
- **v6.3.0-parallel-test-writing** - Added parallel test writing (Level 3.2 optimization)
- **v6.2.0-parallel-tests** - Added parallel test execution (Level 3.1 optimization)
- **v6.1.0-multi-agent** - Multi-agent orchestration with subagents
- **v6.0.0** - Original single-agent implementation

---

**Powered by BMAD Core v6 - Multi-Agent Software Development**
