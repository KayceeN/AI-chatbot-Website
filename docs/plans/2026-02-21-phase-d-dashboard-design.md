# Phase D: Dashboard Shell — Design

**Date:** 2026-02-21
**Status:** Approved
**Prerequisites:** Phase C complete (PR #12), Supabase project with all 8 migrations applied

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Layout model | Sidebar (dark) + content area (glass-card aesthetic) | Scales to many nav items; consistent with SaaS conventions |
| Visual style | Match marketing site (glass cards, bg-canvas, shadow-soft) | User preference for brand consistency |
| Sidebar active indicator | Motion `layoutId` sliding background | Matches existing pattern (pricing toggle, project tabs) |
| Mobile sidebar | Slide-out drawer with hamburger toggle | Standard responsive pattern |
| Unbuilt pages | Placeholder pages at each route | Users can navigate freely; no sidebar edits needed later |
| Stats data source | Server-side Supabase count queries | No client-side fetching for initial load |
| Avatar upload | Deferred (text URL input for now) | File upload adds complexity; not needed yet |
| Password change | Deferred (toast "coming soon") | Requires Supabase password reset flow setup |

---

## 1. Dashboard Layout (`src/app/dashboard/layout.tsx`)

Replace the Phase C placeholder layout with a full dashboard shell.

**Structure:**
- **Sidebar** (left) — dark `bg-ink`, fixed on desktop (w-64), slide-out drawer on mobile
- **Main area** (right) — `bg-canvas` with top bar + scrollable content
- **Top bar** — page title area, user info, mobile hamburger button

**Sidebar nav items:**

| Label | Route | Icon (Lucide) | Phase |
|-------|-------|---------------|-------|
| Overview | `/dashboard` | `LayoutDashboard` | D (built) |
| Chat | `/dashboard/chat` | `MessageSquare` | E (placeholder) |
| Workflows | `/dashboard/workflows` | `Workflow` | F (placeholder) |
| Analytics | `/dashboard/analytics` | `BarChart3` | G (placeholder) |
| Settings | `/dashboard/settings` | `Settings` | D (built) |

**Bottom section:** Logout button with `LogOut` icon.

**Active state:** The active nav item has a glass-effect background (`bg-white/10 rounded-lg`) with a Motion `layoutId` sliding indicator for smooth transitions between routes.

**Mobile behavior:**
- Sidebar hidden by default, toggled via hamburger button in top bar
- Overlay backdrop when open
- Closes on nav item click or backdrop tap

**Auth gate:** Preserved from Phase C — `getUser()` server-side check with redirect to `/login` if unauthenticated.

---

## 2. Dashboard Overview Page (`src/app/dashboard/page.tsx`)

Replace the Phase C placeholder with a real overview.

**Content:**
- Welcome heading: "Welcome back, {full_name}" + user email
- **Stat cards** (4 glass cards in a 2x2 grid on desktop, stacked on mobile):
  - Total Conversations — `SELECT count(*) FROM conversations WHERE user_id = ?`
  - Knowledge Base Entries — `SELECT count(*) FROM knowledge_base WHERE user_id = ?`
  - Active Workflows — `SELECT count(*) FROM workflows WHERE user_id = ? AND status = 'active'`
  - Upcoming Bookings — `SELECT count(*) FROM bookings WHERE user_id = ? AND date >= CURRENT_DATE`
- **Quick actions** (3 glass cards linking to Chat, Workflows, Settings with brief descriptions)

All data fetched server-side in the page component. Empty state shows "0" for all stats.

---

## 3. Settings Page (`src/app/dashboard/settings/page.tsx`)

**Profile section** (glass card):
- Full name input (pre-filled from `profiles.full_name`)
- Avatar URL input (text, pre-filled from `profiles.avatar_url`)
- Email (read-only display)
- Save button → `UPDATE profiles SET full_name = ?, avatar_url = ? WHERE user_id = ?`

**Validation (Zod):**
- Full name: min 2 chars, max 100 chars, trimmed
- Avatar URL: valid URL format or empty string

**Account section** (glass card):
- Current plan display (badge showing "Free", "Pro", or "Enterprise")
- "Change password" button → toast "Password reset coming soon"

---

## 4. Placeholder Pages

Three minimal pages at:
- `/dashboard/chat` — "Chatbot Management" title, "Configure your AI chatbot, manage knowledge base, and test responses. Coming in Phase E."
- `/dashboard/workflows` — "Workflows" title, "Build and manage automated workflows. Coming in Phase F."
- `/dashboard/analytics` — "Analytics" title, "Track conversations, bookings, and engagement metrics. Coming in Phase G."

Each is a glass card with title, description text, and a muted phase indicator.

---

## 5. Components

### New components

| Component | Location | Purpose |
|-----------|----------|---------|
| `DashboardSidebar` | `src/components/dashboard/DashboardSidebar.tsx` | Sidebar with nav items, active indicator, logout |
| `DashboardTopBar` | `src/components/dashboard/DashboardTopBar.tsx` | Mobile hamburger, page context area |
| `StatCard` | `src/components/dashboard/StatCard.tsx` | Glass card with icon, label, and count value |
| `MobileSidebarDrawer` | `src/components/dashboard/MobileSidebarDrawer.tsx` | Slide-out overlay for mobile sidebar |

### Reused components
- `GlassCard` — stat cards, form containers, placeholder pages
- `Button` (shadcn) — save, logout, action buttons
- `Input`, `Label` (shadcn) — settings form
- `FormField` — settings form inputs with validation

---

## 6. Validation Schemas

Add to `src/lib/validations/settings.ts`:
- `profileSchema` — full name (min 2, max 100, trimmed), avatar URL (valid URL or empty)

---

## 7. Testing

### Unit tests
- Sidebar renders all nav items with correct hrefs
- StatCard renders label and count
- Settings form pre-fills values and validates on submit
- Settings form shows error for invalid input

### E2E tests
- Dashboard overview loads with stat cards
- Sidebar navigation works between pages
- Settings form saves profile changes
- Mobile sidebar opens/closes
- Placeholder pages render correct content

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/app/dashboard/layout.tsx` | Replace | Full dashboard shell with sidebar + top bar |
| `src/app/dashboard/page.tsx` | Replace | Overview with stats and quick actions |
| `src/app/dashboard/settings/page.tsx` | Create | Profile settings form |
| `src/app/dashboard/chat/page.tsx` | Create | Placeholder |
| `src/app/dashboard/workflows/page.tsx` | Create | Placeholder |
| `src/app/dashboard/analytics/page.tsx` | Create | Placeholder |
| `src/components/dashboard/DashboardSidebar.tsx` | Create | Sidebar navigation |
| `src/components/dashboard/DashboardTopBar.tsx` | Create | Top bar with hamburger |
| `src/components/dashboard/StatCard.tsx` | Create | Stat display card |
| `src/components/dashboard/MobileSidebarDrawer.tsx` | Create | Mobile sidebar overlay |
| `src/lib/validations/settings.ts` | Create | Profile Zod schema |
| `src/app/dashboard/logout-button.tsx` | Keep | Already exists from Phase C |
