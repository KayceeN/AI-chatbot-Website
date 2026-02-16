# Lessons Learned

## 2026-02-14: Project Setup Session

### Always verify .gitignore after Codex modifies it
Codex replaced the .gitignore and stripped .env protection. This violates SECURITY.md. After every Codex session, diff .gitignore and confirm .env files are excluded before committing.

### Design doc paths diverge from Codex output
Design doc assumed flat `app/` structure. Codex used `src/` prefix with `components/sections/` and `components/ui/` organization. Always verify actual file paths against plan docs before Phase 2 work begins.

### Codex adds dependencies without approval
Codex added framer-motion, vitest, playwright, etc. Per SECURITY.md, new dependencies require explicit approval. Review package.json diff after each Codex session and document additions.

### Present tradeoffs for technical decisions
User prefers seeing pros/cons (e.g., Supabase vs NextAuth) before choosing. For significant technical choices, always present a brief comparison with a recommendation rather than just listing options.

## 2026-02-16: Visual Parity Follow-up

### Remove third-party dock elements when asked to clone style, not embed source artifacts
The floating `Get Orb AI / Made in Framer` dock is a source-site artifact and should be removed immediately when requested, not just restyled.

### Treat "plain white background" as a global token change, not a section-only tweak
If the user asks to remove gray framing, update shared background tokens (`canvas`, body background layers, hero media shell) so the entire page resolves to white consistently.

## 2026-02-16: Hero Video Color-Match Debugging

### Fix off-white/blue background drift in the media itself, not only in CSS
When users report frame color shifts during motion, prioritize a frame-level video processing pass (background normalization) and then reduce overlays; CSS-only whitening is not enough for moving-frame artifacts.
