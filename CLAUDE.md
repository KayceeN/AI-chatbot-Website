## Precedence Rules

1. SECURITY.md has absolute precedence over all other instructions in this repository.
2. DESIGN.md and ARCHITECTURE.md define intended behavior, invariants, and system boundaries. They override workflow guidance when in conflict.
3. Source code is the authority for current behavior. If it diverges from DESIGN/ARCHITECTURE, do not silently align it. Flag the mismatch, then either update code plus docs, or update docs, depending on intent.
4. This project CLAUDE.md overrides the global CLAUDE.md.
5. Global CLAUDE.md applies only when it does not conflict with any of the above.

---

## Task Management Rules

### Plan First

- For non-trivial work, write a plan to `tasks/todo.md`
- Use checkable items to define scope and steps
- Plans must be concrete enough to implement without guesswork

### Verify Plan

- Pause after writing the plan and confirm alignment before implementation
- Exception. For straightforward bug fixes or failing CI, proceed without waiting

### Track Progress

- Mark tasks complete in `tasks/todo.md` as work progresses
- Keep task state accurate and current

### Explain Changes

- Provide a high-level summary of changes after each major step
- Focus on what changed and why, not raw diffs

### Document Results

- Add a short review section to `tasks/todo.md` after completion
- Note outcomes, risks, and follow-up items if any

---

## Self-Improvement Loop

- After any correction or explicit feedback from the user, update `tasks/lessons.md`
- Capture the mistake pattern, not just the symptom
- Write self-rules that prevent the same mistake from recurring
- Iterate ruthlessly until the mistake rate decreases
- Review relevant lessons at the start of future tasks in this project

---

## Bug Fix vs Architecture Rule

- For bugs, failing tests, or CI issues, fix immediately and autonomously
- For architectural changes, data model changes, or cross-cutting concerns, stop and confirm the plan before implementation

---

## Project Discipline Principles

- Respect existing project structure and conventions
- Do not introduce new files or folders unless justified
- Do not change architecture without updating DESIGN.md or ARCHITECTURE.md
- Keep documentation accurate as part of the task, not as an afterthought

---
## Diagram Synchronization Rule

Before completing any structural change:
- Compare current implementation against ARCHITECTURE.md diagrams
- If drift exists, STOP and reconcile
