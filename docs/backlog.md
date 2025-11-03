# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story's `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| 2025-10-31 | 1.5 | 1 | TechDebt | High | TBD | Open | Update all completed task checkboxes in story file to [x] (101 tasks need review) - docs/stories/story-1-5-2025-10-31.md:30-143 |
| 2025-10-31 | 1.5 | 1 | TechDebt | High | TBD | Open | Add unit tests for validation functions (minimum 10 test cases) - tests/unit/validation.test.ts (CREATE) |
| 2025-10-31 | 1.5 | 1 | TechDebt | High | TBD | Open | Add component tests for ConfigurationFormModal (create/edit/duplicate modes) - tests/components/ConfigurationFormModal.test.tsx (CREATE) |
| 2025-10-31 | 1.5 | 1 | TechDebt | High | TBD | Open | Add integration test for CRUD workflow - tests/integration/configuration-crud.test.ts (CREATE) |
| 2025-10-31 | 1.5 | 1 | Enhancement | Medium | TBD | Open | Complete file selector integration OR formally scope-out with Product Owner - components/configuration/ConfigurationFormModal.tsx:82 |
| 2025-10-31 | 1.5 | 1 | Enhancement | Medium | TBD | Open | Add wall_thickness input to Advanced Settings - components/configuration/ConfigurationFormModal.tsx (add to advanced section) |
| 2025-10-31 | 1.5 | 1 | Enhancement | Medium | TBD | Open | Add top_bottom_thickness input to Advanced Settings - components/configuration/ConfigurationFormModal.tsx (add to advanced section) |
| 2025-10-31 | 1.5 | 1 | Enhancement | Low | TBD | Open | Implement React Error Boundary for SessionDetailPage - app/sessions/[id]/error.tsx (CREATE) |
| 2025-10-31 | 1.5 | 1 | Enhancement | Low | TBD | Open | Add retry button to error toast for network failures - components/ui/ErrorToast.tsx |
