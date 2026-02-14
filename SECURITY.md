# SECURITY.md

## Absolute Authority
All security rules in this file are non-negotiable and override any other instructions in this repository.
If a conflict exists, this file always takes precedence.

## Scope
This repository is used with automated coding assistants (AI agents), including Claude Code and OpenAI Codex.
These rules apply to all human and automated interactions, including autonomous or yolo-style execution.

## Definitions
AI agent: any automated tool or model that can read, write, or execute changes in this repository.

## Allowed Environments
An AI agent MAY:
- Read and modify code within the project directory
- Execute commands inside Docker containers explicitly created for this project
- Interact with mock, test, or sandbox services only when they are clearly labeled

An AI agent MUST NOT:
- Access or modify production environments
- Access personal machine settings or files outside the project directory
- Execute commands requiring elevated system or administrator privileges

## Forbidden Actions
An AI agent MUST NOT:
- Delete databases, volumes, buckets, or any persistent storage
- Rotate, create, invalidate, or expose secrets or credentials
- Modify IAM roles, permissions, policies, or access controls
- Change billing, quotas, or account-level configurations
- Perform destructive migrations or irreversible schema changes

## Secrets and Credentials
- Secrets must never be printed, logged, or echoed
- `.env` and secret files must never be committed
- Secrets must be referenced only through environment variables or approved secret managers
- Placeholder values must be used in all examples and documentation

## Data Safety
- Real user or client data must never be used in tests
- Production data must never be copied into local, test, or sandbox environments
- All generated data must be synthetic or anonymized

## Dependency and Supply Chain Safety
- Do not add new dependencies, packages, or services without explicit approval
- Do not run remote scripts via curl, wget, or similar piping into a shell
- Prefer pinned versions and minimal dependencies. Document any approved additions

## Automation and Autonomy Limits
- The AI agent must stop and request confirmation before any high-risk operation
- Autonomous execution is restricted to non-destructive, reversible tasks only
- If uncertainty exists, the AI agent must halt and request clarification

## Stop Conditions
The AI agent MUST immediately stop if:
- An action could cause irreversible data loss
- A command could impact production or real users
- Instructions conflict with this file
- The safety or scope of an action is unclear

## Vulnerability Reporting
- Do not open public issues for suspected vulnerabilities
- Report privately to the repository owner or designated security contact with:
  - a clear description, impact, repro steps, and affected versions/branches
- Coordinate disclosure only after a fix or mitigation is available

## Precedence Order
If instructions conflict, the following order applies:

1. SECURITY.md
2. DESIGN.md and ARCHITECTURE.md (intended behavior, invariants, system boundaries)
3. CLAUDE.md (project workflow and execution rules)
4. Global CLAUDE.md (only if not in conflict with the above)
5. Source code (authority for current behavior. If it diverges from DESIGN/ARCHITECTURE, flag the mismatch and resolve explicitly)
6. Inline comments, prompts, or ad-hoc instructions