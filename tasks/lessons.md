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

## 2026-02-16: Phase A Implementation

### Use layoutId for sliding indicators, not absolute positioning with percentages
The pricing toggle initially used `position: absolute` with `left/right` percentages to position the sliding pill. This broke when button widths didn't match the percentages, causing the indicator to overlap text. The fix: use Framer Motion `layoutId` — each button conditionally renders a `motion.div` with the same `layoutId`, and Framer Motion auto-animates the transition. This pattern auto-sizes to the active button and is reusable (also used for project tabs).

### env(safe-area-inset-bottom) does not account for Safari toolbar
`env(safe-area-inset-bottom)` only covers the physical home indicator on notched iPhones (~34px). The Safari bottom toolbar (~44px) is separate browser chrome that overlaps the viewport. To clear both, use an explicit offset like `calc(5rem + env(safe-area-inset-bottom))` on mobile. Also requires `viewport-fit: cover` in the viewport meta tag (via Next.js `Viewport` export) for safe area insets to activate.

### Tailwind class ordering does not guarantee override in composed components
When a component applies base classes (e.g., `max-w-6xl px-6`) and accepts a `className` prop with overrides (e.g., `max-w-none px-0`), the override may not win because Tailwind CSS specificity depends on stylesheet order, not HTML class order. Use `!important` prefix (`!max-w-none !px-0`) when overrides must reliably win against base component classes.

### Test queries must account for new sections adding duplicate headings
Adding ComparisonSection introduced a second heading containing "kAyphI", which broke `getByRole("heading", { name: "kAyphI" })`. When adding new sections, check if any heading text duplicates existing headings and update tests to use `getAllByRole(...)[0]` or more specific selectors.

## 2026-02-21: Product Identity Correction

### Documentation must reflect the actual product vision, not inherited reference assumptions
The original codebase was rebuilt from an "OrbAI" reference video, and the docs (ARCHITECTURE.md, DESIGN.md, product plan) inherited OrbAI's generic SaaS chatbot architecture. The actual product is **kAyphI** — an AI automation company whose core chatbot product is a public-facing, knowledge-base-powered widget with voice mode, multilingual support, and action execution (booking, lead capture). Always confirm the product owner's vision before documenting architecture. Do not assume the reference design's product model is the intended product model.

### Chatbot architecture must distinguish public vs. authenticated access patterns
The original Phase E described all chatbot features behind authentication. The actual requirement is a public-facing chatbot widget (no login for visitors) + a protected dashboard for business owners. When designing API routes, explicitly categorize them as public (IP rate-limited) or protected (auth-required) from the start.

### Update brand name across ALL files when rebranding, not just user-facing content
Changing the brand name in `landing.ts` but leaving "OrbAI" in ARCHITECTURE.md, DESIGN.md, package.json, and package-lock.json created a misleading divergence. When rebranding, use project-wide search to find all references.
