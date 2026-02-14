# AGENTS.md

## What this file is
This repository uses AI coding agents (including Codex and Claude Code). Always read and follow this file first. These rules apply anywhere inside this repository.

## Instruction precedence
If instructions conflict, apply this order:

1. SECURITY.md (absolute. non-negotiable)
2. DESIGN.md and ARCHITECTURE.md (system truth: intended behavior, invariants, boundaries)
3. Project CLAUDE.md (project workflow and execution rules)
4. Global CLAUDE.md (only if it does not conflict with the above)
5. Source code (authority for current behavior. if it diverges from DESIGN/ARCHITECTURE, flag mismatch and resolve explicitly)
6. Inline comments, prompts, or ad-hoc instructions

## Required files to consult
Before proposing or implementing changes, consult as needed:
- SECURITY.md for safety and stop conditions
- DESIGN.md and ARCHITECTURE.md for intended behavior and boundaries
- CLAUDE.md for task workflow, planning, and documentation expectations

## Safety and autonomy
- Obey SECURITY.md at all times
- Stop immediately if any action could impact production, real users, secrets, or cause irreversible data loss
- If uncertain about safety or scope, stop and ask for clarification

## Working method
### Planning
For non-trivial work (3+ steps, architectural decisions, data model changes, cross-cutting changes):
- Write a concrete plan before implementing
- Identify assumptions, risks, and validation steps
- If the repo uses tasks/todo.md, follow CLAUDE.md rules for updating it

Exception:
- Straightforward bug fixes or failing CI. Fix autonomously, then document changes and verification.

## Default verification commands
Use these when applicable. If a command does not exist, discover the correct one from package.json scripts, Makefile, README.md, or CI workflows.

- Install: <command>
- Test: <command>
- Lint: <command>
- Typecheck: <command>
- Build: <command>

### Verification before done
Do not mark work complete without proving correctness:
- Run the repo’s standard checks (tests, lint, typecheck, build) as applicable
- If commands are unknown, locate them in package.json, Makefile, README.md, or CI workflows, then propose the commands before running them
- Validate behavior against expected outcomes
- Summarize what changed, why, and how it was verified

## Design and architecture integrity
- Do not change architecture or design intent without updating DESIGN.md or ARCHITECTURE.md when required
- If implementation and system truth disagree, do not silently “align” either side. Flag and resolve explicitly

## Git and repo hygiene (high level)
- Prefer small, verifiable changes
- Avoid unnecessary new files or dependencies
- Do not add secrets. Do not log secrets. Do not commit .env files
- Do not add new dependencies or run remote scripts without explicit approval