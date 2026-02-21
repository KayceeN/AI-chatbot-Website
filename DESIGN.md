# DESIGN.md — Visual Design System

This document defines the visual design system for kAyphI. It is split into **Current State** (what the Codex build implements today) and **Target State** (what the reference video and full product require). This avoids codifying known defects as intended behavior.

For architectural details, see [ARCHITECTURE.md](ARCHITECTURE.md).
For the full gap analysis, see [docs/plans/2026-02-14-visual-audit.md](docs/plans/2026-02-14-visual-audit.md).

---

## Current State

Everything below describes the actual Codex build as of 2026-02-14.

### Brand

- **Name:** kAyphI
- **Tagline:** "AI Automation for Businesses"
- **Tone:** Professional, high-key monochrome, clean
- **Logo:** Custom `LogoMark` component — two rotated white squares inside a black circle, plus "kAyphI" text (`src/components/ui/LogoMark.tsx`)

### Color Palette

Defined in `tailwind.config.ts` under `theme.extend.colors` and as CSS custom properties in `src/styles/globals.css`:

| Token | Hex | Usage |
|-------|-----|-------|
| `canvas` | `#ececed` | Page background |
| `panel` | `#f4f4f5` | Card backgrounds, badge backgrounds |
| `ink` | `#151517` | Primary text (Tailwind), headings, body |
| `--ink` (CSS) | `#121316` | CSS custom property variant |
| `muted` | `#5c5f66` | Secondary text, subtitles |
| `--muted` (CSS) | `#565a60` | CSS custom property variant |
| `white` | `#ffffff` | Buttons (secondary variant), card borders |
| `black` | `#000000` | Buttons (primary variant), popular badge |

**Note:** Slight discrepancy between Tailwind tokens (`ink: #151517`, `muted: #5c5f66`) and CSS custom properties (`--ink: #121316`, `--muted: #565a60`). The Tailwind values are used by components; CSS properties are used by `globals.css` rules.

### Typography

- **Font family:** Manrope (Google Font), loaded via `next/font/google` in `src/app/layout.tsx`
- **CSS variable:** `--font-manrope`
- **Headings:** `font-semibold tracking-tight` (Tailwind classes)
- **Body text:** `text-lg text-muted`
- **Small text / labels:** `text-sm font-semibold`
- **Scale (approximate):**
  - Hero title: `text-7xl sm:text-9xl`
  - Section headings: `text-4xl sm:text-6xl`
  - Card titles: `text-3xl`
  - Pricing amount: `text-5xl`
  - Body: `text-lg`
  - Labels/badges: `text-xs uppercase tracking-[0.08em]`

### Spacing

- Tailwind defaults used throughout
- **Section padding:** `py-20` (80px vertical)
- **Content max-width:** `max-w-6xl` (1152px)
- **Section horizontal padding:** `px-6 sm:px-8`
- **Card internal padding:** `p-6`
- **Card grid gap:** `gap-5`
- **Heading bottom margin:** `mb-10`
- **Component stack gap:** `gap-4`

### Shadow Tokens

Defined in `tailwind.config.ts` under `theme.extend.boxShadow`:

| Token | Value | Usage |
|-------|-------|-------|
| `soft` | `0 10px 26px rgba(17,17,18,0.11)` | Glass cards |
| `plate` | `0 3px 10px rgba(17,17,18,0.12)` | Badges, chips, toggle buttons |
| `button` | `0 10px 18px rgba(9,9,10,0.28)` | Primary CTA buttons, floating dock |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `panel` | `1.5rem` (24px) | Glass cards (via `rounded-panel`) |
| `xl` | Tailwind default (12px) | Buttons |
| `2xl` | Tailwind default (16px) | Image placeholder areas |
| `full` | `9999px` | Badges, chips, pricing toggle |

### Component Patterns

All reusable primitives live in `src/components/ui/`:

| Component | File | Purpose |
|-----------|------|---------|
| `GlassCard` | `GlassCard.tsx` | Frosted card: `rounded-panel border border-white/75 bg-panel/90 p-6 shadow-soft backdrop-blur-[2px]` |
| `BadgePill` | `BadgePill.tsx` | Section label: rounded-full, border, shadow-plate, uppercase, with lucide-react icon |
| `ActionButton` | `ActionButton.tsx` | CTA button with ArrowUpRight icon: primary (black bg) or secondary (panel bg), both with shadow + hover translate |
| `SectionShell` | `SectionShell.tsx` | Section wrapper: max-w-6xl, horizontal padding, vertical padding |
| `SectionHeading` | `SectionHeading.tsx` | Badge + h2 + subtitle, center or left aligned |
| `Reveal` | `Reveal.tsx` | Scroll-triggered animation wrapper using Framer Motion `whileInView` |
| `LogoMark` | `LogoMark.tsx` | Brand logo component |

### Motion System

Defined in `src/lib/motion.ts`. Uses Framer Motion.

**Presets (`MotionPreset` type):**

| Preset | Hidden state | Visible state |
|--------|-------------|---------------|
| `fadeUp` | `opacity: 0, y: 28` | `opacity: 1, y: 0` |
| `fadeIn` | `opacity: 0` | `opacity: 1` |
| `scaleIn` | `opacity: 0, scale: 0.94` | `opacity: 1, scale: 1` |
| `slideLeft` | `opacity: 0, x: 24` | `opacity: 1, x: 0` |
| `slideRight` | `opacity: 0, x: -24` | `opacity: 1, x: 0` |

**Timing:**
- Default duration: `0.72s`
- Default ease: `[0.2, 0.65, 0.3, 0.95]` (custom cubic bezier)
- Container stagger: `staggerChildren: 0.1`, `delayChildren: 0.08`
- Floating loop: `y: [-5, 6, -5]` over 8s with infinite repeat

**Entry animation:** TopNav uses `initial={{ y: -40, opacity: 0 }}` with custom animate.

### Background

Defined in `src/styles/globals.css`:

```css
body {
  background-image:
    radial-gradient(circle at 14% 12%, rgba(255,255,255,0.82) 0%, transparent 34%),
    radial-gradient(circle at 88% 82%, rgba(255,255,255,0.8) 0%, transparent 32%),
    linear-gradient(180deg, rgba(255,255,255,0.52), rgba(236,236,237,1));
}
```

Three layered gradients creating a subtle light-spot effect on the canvas background.

### Orb Rings (Hero/Footer)

CSS pseudo-elements in `src/styles/globals.css`:

- Two concentric circles via `::before` and `::after`
- `border: 2px solid rgba(255,255,255,0.65)`
- Outer shadow + inner glow
- Inner ring inset by 14% with reduced opacity
- Positioned absolutely, centered horizontally

### Form Fields

`.field` class in `src/styles/globals.css`:
- `border: 1px solid rgba(255,255,255,0.88)`
- `background: rgba(255,255,255,0.7)`
- `border-radius: 0.9rem`
- Focus: darker border + subtle ring shadow

### Resolved Gaps (Phase A, PR #3)

- Comparison and Team sections built
- FAQ has smooth height animation (AnimatePresence)
- Nav hides on scroll down, reveals on scroll up
- All icons replaced with lucide-react SVGs (badges, FAQ chevrons, contact, pricing checks, CTA arrows, footer social, star ratings)
- Customer star ratings and avatar placeholders added
- Footer social icons (Twitter, Instagram, LinkedIn) and copyright added
- Pricing toggle has layoutId sliding indicator
- Benefits has marquee ticker animation
- Process section restructured with decorative step numbers
- Project tabs have layoutId active indicator

### Hero Mobile Optimization (PR #5)

- Hero video spans full viewport width on all breakpoints (no side padding)
- Zero gap between sticky header and hero section
- "kAyphI" title hidden on mobile (logo in nav is sufficient), visible from `md` breakpoint up
- Badge ("AI Automation for Businesses") sits at top of hero on mobile
- CTA button positioned at bottom with `calc(5rem + env(safe-area-inset-bottom))` to clear Safari toolbar
- Mobile overlay reduced from heavy white gradient (0.97 opacity) to subtle (matching desktop)
- `viewport-fit: cover` enabled in root layout for safe area inset support
- Desktop layout retains title, badge, and CTA positioning from Phase A

### Remaining Gaps

- All image areas still use gradient placeholder `<div>` elements
- Services interactive mockup illustrations not yet built (CSS/SVG approximations)
- 3D orb remains CSS rings (enhancement to realistic sphere pending)

---

## Target State

Everything below describes what the completed product should look like.

### Visual Parity with Reference

All 24 gaps identified in the visual audit must be resolved:
- Comparison and Team sections added
- All gradient placeholders replaced with real images (Unsplash/AI-generated substitutes acceptable)
- 3D orb enhanced from CSS rings to a more realistic sphere (CSS/canvas)
- FAQ accordion with smooth height animation
- Scroll-based nav hide/show
- All icons replaced with Lucide React SVGs

### Extended Color Palette

Dashboard and product pages require additional colors beyond the marketing monochrome:

| Purpose | Suggested tokens |
|---------|-----------------|
| Success | Green for workflow success, positive stats |
| Warning | Amber for rate limits, approaching quotas |
| Error | Red for failures, validation errors |
| Info | Blue for informational states |
| Chart colors | Series of 4–6 distinguishable colors for Recharts |
| Accent | Dashboard accent for active nav, selected items |

Exact hex values to be determined during Phase D implementation. Will be added to `tailwind.config.ts`.

### New Component Patterns

| Source | Components | Purpose |
|--------|-----------|---------|
| shadcn/ui | Button, Input, Textarea, Select, Dialog, Dropdown, Toast, Tabs, Avatar, Badge, Card, Sidebar | Accessible primitives for product UI |
| React Hook Form + Zod | Form, FormField, FormItem, FormLabel, FormMessage | Validated form composition |
| Recharts | LineChart, BarChart, AreaChart | Analytics visualizations |
| Custom | ChatWidget, ChatBubble, ChatMessage, ChatInput, BookingCalendar, WorkflowStep, StatCard, DashboardSidebar | Product-specific components |

### Chatbot Widget Components (Public-Facing)

| Component | Purpose |
|-----------|---------|
| `ChatWidget` | Floating chat bubble + expandable panel on marketing site (no auth required) |
| `ChatBubble` | Individual message bubble (user/assistant) with avatar and typing indicator |
| `ChatInput` | Text input with send button, auto-resize, disabled state while streaming |
| `BookingCalendar` | Inline calendar for appointment scheduling, triggered when visitor requests booking |
| `VoiceButton` | Microphone toggle for voice input (records → transcribes → sends as text) |
| `AudioPlayer` | Inline audio playback for assistant voice responses (OpenAI TTS) |
| `LanguageSelector` | Optional dropdown for visitor to choose preferred language |

### New Layout Patterns

| Layout | Route group | Description |
|--------|-------------|-------------|
| Marketing | `(marketing)` | Current single-page layout (TopNav + sections + FooterSection) |
| Auth | `(auth)` | Centered card layout, no nav/footer |
| Dashboard | `(dashboard)` | Sidebar + top bar + content area, responsive collapse |

### Icon System

Replace all text/emoji icons with **Lucide React** (`lucide-react` package, pre-approved):
- CTA arrows: `ArrowUpRight`
- FAQ chevrons: `ChevronDown` / `ChevronUp`
- Section badges: contextual icons per section (e.g., `Star`, `Settings`, `Users`)
- Contact: `Mail`, `Phone`
- Social: `Twitter` (X), `Instagram`, `Link`
- Dashboard nav: `MessageSquare`, `Workflow`, `BarChart3`, `Settings`, `LogOut`

### Critical Files

| File | Contains |
|------|----------|
| `tailwind.config.ts` | Color tokens, shadow tokens, border radius |
| `src/styles/globals.css` | CSS custom properties, orb-rings, field class, body background |
| `src/lib/motion.ts` | Animation presets, timing, stagger config |
| `src/components/ui/*` | All primitive component patterns |
