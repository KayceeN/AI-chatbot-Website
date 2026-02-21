# Phase D: Dashboard Shell — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the authenticated dashboard shell with sidebar navigation, overview page with stat cards, settings page with profile form, and placeholder pages for future features.

**Architecture:** The dashboard layout uses a dark sidebar (bg-ink) with Lucide icon navigation and a main content area using the glass-card aesthetic (GlassCard, bg-canvas). The sidebar uses Motion's layoutId for a sliding active indicator. Mobile uses a slide-out drawer. All data is fetched server-side via Supabase.

**Tech Stack:** Next.js 15 (App Router), Supabase (server client), React Hook Form + Zod, shadcn/ui (Button, Input, Label), Motion (layoutId), Lucide React, GlassCard

---

### Task 1: Create StatCard Component

**Files:**
- Create: `src/components/dashboard/StatCard.tsx`
- Create: `tests/dashboard-stat-card.test.tsx`

**Step 1: Write the failing test**

Create `tests/dashboard-stat-card.test.tsx`:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { StatCard } from "@/components/dashboard/StatCard";

describe("StatCard", () => {
  test("renders label and value", () => {
    render(<StatCard label="Total Conversations" value={42} />);

    expect(screen.getByText("Total Conversations")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  test("renders zero value", () => {
    render(<StatCard label="Active Workflows" value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/dashboard-stat-card.test.tsx`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/components/dashboard/StatCard.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <GlassCard className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink/5">
        <Icon className="h-6 w-6 text-ink" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="text-2xl font-bold text-ink">{value}</p>
      </div>
    </GlassCard>
  );
}
```

**Step 4: Update test with icon prop**

The test needs to pass an icon. Update `tests/dashboard-stat-card.test.tsx` to mock an icon:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MessageSquare } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

describe("StatCard", () => {
  test("renders label and value", () => {
    render(<StatCard label="Total Conversations" value={42} icon={MessageSquare} />);

    expect(screen.getByText("Total Conversations")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  test("renders zero value", () => {
    render(<StatCard label="Active Workflows" value={0} icon={MessageSquare} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
```

**Step 5: Run tests to verify they pass**

Run: `npm run test -- tests/dashboard-stat-card.test.tsx`
Expected: 2 tests PASS

**Step 6: Commit**

```bash
git add src/components/dashboard/StatCard.tsx tests/dashboard-stat-card.test.tsx
git commit -m "feat(phase-d): add StatCard component with tests"
```

---

### Task 2: Create DashboardSidebar Component

**Files:**
- Create: `src/components/dashboard/DashboardSidebar.tsx`

The sidebar is a client component (needs `usePathname` for active state and Motion for layoutId). It renders nav items with Lucide icons and a logout action at the bottom.

**Step 1: Create the sidebar**

Create `src/components/dashboard/DashboardSidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  MessageSquare,
  Workflow,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Chat", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Workflows", href: "/dashboard/workflows", icon: Workflow },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex h-full flex-col bg-ink px-3 py-6">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-8 flex items-center gap-2 px-3"
        onClick={onNavigate}
      >
        <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
          <span className="absolute h-2.5 w-2.5 -translate-x-[5px] rotate-45 rounded-sm bg-ink" />
          <span className="absolute h-2.5 w-2.5 translate-x-[5px] rotate-45 rounded-sm bg-ink" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-white">
          <span>k</span>
          <span className="brand-letter-a">A</span>
          <span>yph</span>
          <span className="brand-letter-i">I</span>
        </span>
      </Link>

      {/* Nav items */}
      <ul className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-white/10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-white/60 hover:text-white/80"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white/80"
      >
        <LogOut className="h-5 w-5" />
        Log out
      </button>
    </nav>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/dashboard/DashboardSidebar.tsx
git commit -m "feat(phase-d): add DashboardSidebar with nav items and layoutId active indicator"
```

---

### Task 3: Create MobileSidebarDrawer Component

**Files:**
- Create: `src/components/dashboard/MobileSidebarDrawer.tsx`

A slide-out overlay drawer for mobile that wraps the sidebar content.

**Step 1: Create the drawer**

Create `src/components/dashboard/MobileSidebarDrawer.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import { DashboardSidebar } from "./DashboardSidebar";

interface MobileSidebarDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebarDrawer({ open, onClose }: MobileSidebarDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-64"
          >
            <DashboardSidebar onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/dashboard/MobileSidebarDrawer.tsx
git commit -m "feat(phase-d): add MobileSidebarDrawer with slide-out animation"
```

---

### Task 4: Create DashboardTopBar Component

**Files:**
- Create: `src/components/dashboard/DashboardTopBar.tsx`

Shows a hamburger button on mobile and the user's name/avatar on the right.

**Step 1: Create the top bar**

Create `src/components/dashboard/DashboardTopBar.tsx`:

```tsx
"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardTopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  userName: string;
}

export function DashboardTopBar({
  sidebarOpen,
  onToggleSidebar,
  userName,
}: DashboardTopBarProps) {
  return (
    <header className="flex items-center justify-between border-b border-white/75 bg-panel/90 px-6 py-4 backdrop-blur-[2px] lg:justify-end">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-ink">{userName}</span>
      </div>
    </header>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/dashboard/DashboardTopBar.tsx
git commit -m "feat(phase-d): add DashboardTopBar with hamburger and user info"
```

---

### Task 5: Create Dashboard Shell (Client Wrapper)

**Files:**
- Create: `src/components/dashboard/DashboardShell.tsx`

This client component orchestrates the sidebar, drawer, and top bar. The server layout passes the user name as a prop.

**Step 1: Create the shell**

Create `src/components/dashboard/DashboardShell.tsx`:

```tsx
"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopBar } from "./DashboardTopBar";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer";

interface DashboardShellProps {
  userName: string;
  children: React.ReactNode;
}

export function DashboardShell({ userName, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <DashboardSidebar />
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      <MobileSidebarDrawer
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <DashboardTopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          userName={userName}
        />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/dashboard/DashboardShell.tsx
git commit -m "feat(phase-d): add DashboardShell orchestrating sidebar, drawer, and top bar"
```

---

### Task 6: Replace Dashboard Layout

**Files:**
- Modify: `src/app/dashboard/layout.tsx`

Replace the Phase C placeholder layout with the full dashboard shell. Keep the `getUser()` auth gate.

**Step 1: Replace the layout**

Replace contents of `src/app/dashboard/layout.tsx`:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = user.user_metadata?.full_name ?? "User";

  return <DashboardShell userName={userName}>{children}</DashboardShell>;
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/dashboard/layout.tsx
git commit -m "feat(phase-d): replace dashboard layout with full shell"
```

---

### Task 7: Replace Dashboard Overview Page

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Delete: `src/app/dashboard/logout-button.tsx` (logout now in sidebar)

Replace the Phase C placeholder with the real overview page showing stat cards and quick actions.

**Step 1: Replace the overview page**

Replace contents of `src/app/dashboard/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  BookOpen,
  Workflow,
  CalendarDays,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/dashboard/StatCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name ?? "User";

  // Fetch stats (all return 0 gracefully when tables are empty)
  const [conversations, knowledgeBase, workflows, bookings] = await Promise.all(
    [
      supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .then((r) => r.count ?? 0),
      supabase
        .from("knowledge_base")
        .select("*", { count: "exact", head: true })
        .then((r) => r.count ?? 0),
      supabase
        .from("workflows")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .then((r) => r.count ?? 0),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("date", new Date().toISOString().split("T")[0])
        .then((r) => r.count ?? 0),
    ]
  );

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold text-ink">
        Welcome back, {fullName}
      </h1>
      <p className="mb-8 text-muted">{user.email}</p>

      {/* Stat cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Conversations"
          value={conversations}
          icon={MessageSquare}
        />
        <StatCard
          label="Knowledge Base Entries"
          value={knowledgeBase}
          icon={BookOpen}
        />
        <StatCard
          label="Active Workflows"
          value={workflows}
          icon={Workflow}
        />
        <StatCard
          label="Upcoming Bookings"
          value={bookings}
          icon={CalendarDays}
        />
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 text-lg font-semibold text-ink">Quick actions</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/chat">
          <GlassCard className="transition-shadow hover:shadow-plate">
            <MessageSquare className="mb-3 h-6 w-6 text-ink" />
            <h3 className="mb-1 font-semibold text-ink">Chatbot</h3>
            <p className="text-sm text-muted">
              Configure your AI chatbot and manage knowledge base
            </p>
          </GlassCard>
        </Link>
        <Link href="/dashboard/workflows">
          <GlassCard className="transition-shadow hover:shadow-plate">
            <Workflow className="mb-3 h-6 w-6 text-ink" />
            <h3 className="mb-1 font-semibold text-ink">Workflows</h3>
            <p className="text-sm text-muted">
              Build and manage automated workflows
            </p>
          </GlassCard>
        </Link>
        <Link href="/dashboard/settings">
          <GlassCard className="transition-shadow hover:shadow-plate">
            <Settings className="mb-3 h-6 w-6 text-ink" />
            <h3 className="mb-1 font-semibold text-ink">Settings</h3>
            <p className="text-sm text-muted">
              Update your profile and account preferences
            </p>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
}
```

**Step 2: Delete the old logout button**

Run: `rm src/app/dashboard/logout-button.tsx`

Logout is now handled by the sidebar. The old standalone button is no longer referenced.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/dashboard/page.tsx
git rm src/app/dashboard/logout-button.tsx
git commit -m "feat(phase-d): replace dashboard overview with stats and quick actions"
```

---

### Task 8: Create Validation Schema for Settings

**Files:**
- Create: `src/lib/validations/settings.ts`
- Create: `tests/validations-settings.test.ts`

**Step 1: Write the failing tests**

Create `tests/validations-settings.test.ts`:

```typescript
import { describe, expect, test } from "vitest";
import { profileSchema } from "@/lib/validations/settings";

describe("profileSchema", () => {
  test("accepts valid input", () => {
    const result = profileSchema.safeParse({
      fullName: "Jane Doe",
      avatarUrl: "",
    });
    expect(result.success).toBe(true);
  });

  test("accepts valid URL for avatar", () => {
    const result = profileSchema.safeParse({
      fullName: "Jane Doe",
      avatarUrl: "https://example.com/avatar.png",
    });
    expect(result.success).toBe(true);
  });

  test("rejects short name", () => {
    const result = profileSchema.safeParse({
      fullName: "J",
      avatarUrl: "",
    });
    expect(result.success).toBe(false);
  });

  test("rejects name over 100 chars", () => {
    const result = profileSchema.safeParse({
      fullName: "A".repeat(101),
      avatarUrl: "",
    });
    expect(result.success).toBe(false);
  });

  test("trims whitespace from name", () => {
    const result = profileSchema.safeParse({
      fullName: "  Jane Doe  ",
      avatarUrl: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Jane Doe");
    }
  });

  test("rejects invalid URL for avatar", () => {
    const result = profileSchema.safeParse({
      fullName: "Jane Doe",
      avatarUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/validations-settings.test.ts`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/lib/validations/settings.ts`:

```typescript
import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer"),
  avatarUrl: z
    .string()
    .url("Invalid URL")
    .or(z.literal(""))
    .default(""),
});

export type ProfileValues = z.infer<typeof profileSchema>;
```

**Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/validations-settings.test.ts`
Expected: All 6 tests PASS

**Step 5: Commit**

```bash
git add src/lib/validations/settings.ts tests/validations-settings.test.ts
git commit -m "feat(phase-d): add profile settings Zod schema with tests"
```

---

### Task 9: Create Settings Page

**Files:**
- Create: `src/app/dashboard/settings/page.tsx`
- Create: `src/app/dashboard/settings/settings-form.tsx`

The settings page is a server component that fetches the profile, then renders a client form component.

**Step 1: Create the settings form (client component)**

Create `src/app/dashboard/settings/settings-form.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import {
  profileSchema,
  type ProfileValues,
} from "@/lib/validations/settings";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
  userId: string;
  defaultValues: ProfileValues;
}

export function SettingsForm({ userId, defaultValues }: SettingsFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(values: ProfileValues) {
    setServerError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          avatar_url: values.avatarUrl,
        })
        .eq("id", userId);

      setIsLoading(false);

      if (error) {
        setServerError(error.message);
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {serverError && (
        <div
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
          role="alert"
        >
          {serverError}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      <FormField
        label="Full name"
        placeholder="Your name"
        error={errors.fullName?.message}
        registration={register("fullName")}
      />
      <FormField
        label="Avatar URL"
        type="url"
        placeholder="https://example.com/avatar.png"
        error={errors.avatarUrl?.message}
        registration={register("avatarUrl")}
      />

      <Button type="submit" className="mt-2 w-full sm:w-auto" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
```

**Step 2: Create the settings page (server component)**

Create `src/app/dashboard/settings/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Settings</h1>

      {/* Profile */}
      <GlassCard className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">Profile</h2>
        <p className="mb-4 text-sm text-muted">Email: {user.email}</p>
        <SettingsForm
          userId={user.id}
          defaultValues={{
            fullName: profile?.full_name ?? "",
            avatarUrl: profile?.avatar_url ?? "",
          }}
        />
      </GlassCard>

      {/* Account */}
      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-ink">Account</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">Current plan:</span>
          <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
            {profile?.plan ?? "free"}
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/dashboard/settings/page.tsx src/app/dashboard/settings/settings-form.tsx
git commit -m "feat(phase-d): add settings page with profile form"
```

---

### Task 10: Create Placeholder Pages

**Files:**
- Create: `src/app/dashboard/chat/page.tsx`
- Create: `src/app/dashboard/workflows/page.tsx`
- Create: `src/app/dashboard/analytics/page.tsx`

Three minimal placeholder pages.

**Step 1: Create chat placeholder**

Create `src/app/dashboard/chat/page.tsx`:

```tsx
import { MessageSquare } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ChatPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Chatbot Management</h1>
      <GlassCard className="text-center">
        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted" />
        <h2 className="mb-2 text-lg font-semibold text-ink">Coming in Phase E</h2>
        <p className="text-sm text-muted">
          Configure your AI chatbot, manage your knowledge base, and test
          responses.
        </p>
      </GlassCard>
    </div>
  );
}
```

**Step 2: Create workflows placeholder**

Create `src/app/dashboard/workflows/page.tsx`:

```tsx
import { Workflow } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function WorkflowsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Workflows</h1>
      <GlassCard className="text-center">
        <Workflow className="mx-auto mb-4 h-12 w-12 text-muted" />
        <h2 className="mb-2 text-lg font-semibold text-ink">Coming in Phase F</h2>
        <p className="text-sm text-muted">
          Build and manage automated workflows for your business processes.
        </p>
      </GlassCard>
    </div>
  );
}
```

**Step 3: Create analytics placeholder**

Create `src/app/dashboard/analytics/page.tsx`:

```tsx
import { BarChart3 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-ink">Analytics</h1>
      <GlassCard className="text-center">
        <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted" />
        <h2 className="mb-2 text-lg font-semibold text-ink">Coming in Phase G</h2>
        <p className="text-sm text-muted">
          Track conversations, bookings, and engagement metrics.
        </p>
      </GlassCard>
    </div>
  );
}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds. Routes should show:
- `/dashboard` (dynamic)
- `/dashboard/chat` (static)
- `/dashboard/workflows` (static)
- `/dashboard/analytics` (static)
- `/dashboard/settings` (dynamic)

**Step 5: Commit**

```bash
git add src/app/dashboard/chat/page.tsx src/app/dashboard/workflows/page.tsx src/app/dashboard/analytics/page.tsx
git commit -m "feat(phase-d): add placeholder pages for chat, workflows, and analytics"
```

---

### Task 11: Write Dashboard Unit Tests

**Files:**
- Create: `tests/dashboard-sidebar.test.tsx`

Test that the sidebar renders all nav items and the active state works.

**Step 1: Create the test file**

Create `tests/dashboard-sidebar.test.tsx`:

```tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Mock next/navigation
let mockPathname = "/dashboard";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock motion/react to avoid animation complexity in tests
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock Supabase client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signOut: vi.fn() },
  }),
}));

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

describe("DashboardSidebar", () => {
  test("renders all nav items", () => {
    render(<DashboardSidebar />);

    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Workflows")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders logout button", () => {
    render(<DashboardSidebar />);

    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("nav items have correct hrefs", () => {
    render(<DashboardSidebar />);

    expect(screen.getByText("Overview").closest("a")).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByText("Chat").closest("a")).toHaveAttribute(
      "href",
      "/dashboard/chat"
    );
    expect(screen.getByText("Settings").closest("a")).toHaveAttribute(
      "href",
      "/dashboard/settings"
    );
  });
});
```

**Step 2: Run tests**

Run: `npm run test -- tests/dashboard-sidebar.test.tsx`
Expected: All 3 tests PASS

**Step 3: Commit**

```bash
git add tests/dashboard-sidebar.test.tsx
git commit -m "test(phase-d): add dashboard sidebar unit tests"
```

---

### Task 12: Write Dashboard E2E Tests

**Files:**
- Create: `tests/e2e/dashboard.spec.ts`

E2E tests verify page rendering and navigation. Auth-dependent tests check redirect behavior.

**Step 1: Create the E2E test file**

Create `tests/e2e/dashboard.spec.ts`:

```typescript
import { expect, test } from "@playwright/test";

test("unauthenticated user is redirected from dashboard to login", async ({
  page,
}) => {
  await page.goto("/dashboard");
  await page.waitForURL("**/login**");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("chat placeholder page renders", async ({ page }) => {
  await page.goto("/dashboard/chat");
  // Will redirect to login since unauthenticated, but test the redirect works
  await page.waitForURL("**/login**");
});

test("workflows placeholder page renders", async ({ page }) => {
  await page.goto("/dashboard/workflows");
  await page.waitForURL("**/login**");
});

test("analytics placeholder page renders", async ({ page }) => {
  await page.goto("/dashboard/analytics");
  await page.waitForURL("**/login**");
});

test("settings page redirects unauthenticated to login", async ({ page }) => {
  await page.goto("/dashboard/settings");
  await page.waitForURL("**/login**");
});
```

**Step 2: Commit**

```bash
git add tests/e2e/dashboard.spec.ts
git commit -m "test(phase-d): add dashboard E2E tests"
```

---

### Task 13: Verify All Tests Pass

**Step 1: Run full unit test suite**

Run: `npm run test`
Expected: All tests pass (existing auth + landing + new dashboard tests)

**Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds with all dashboard routes

---

### Task 14: Update Documentation

**Files:**
- Modify: `ARCHITECTURE.md`

**Step 1: Update ARCHITECTURE.md**

Changes:
1. Update tech stack header from "Phase C" to "Phase D"
2. Update directory structure under `src/app/dashboard/` to include:
   ```
   ├── dashboard/
   │   ├── layout.tsx              # Dashboard shell (sidebar + top bar + auth gate)
   │   ├── page.tsx                # Overview (stats + quick actions)
   │   ├── logout-button.tsx       # REMOVED (logout in sidebar now)
   │   ├── chat/page.tsx           # Placeholder (Phase E)
   │   ├── workflows/page.tsx      # Placeholder (Phase F)
   │   ├── analytics/page.tsx      # Placeholder (Phase G)
   │   └── settings/
   │       ├── page.tsx            # Profile settings (server component)
   │       └── settings-form.tsx   # Settings form (client component)
   ```
3. Add under `src/components/dashboard/`:
   ```
   ├── dashboard/
   │   ├── DashboardShell.tsx      # Layout orchestrator (sidebar + top bar + content)
   │   ├── DashboardSidebar.tsx    # Nav with layoutId active indicator
   │   ├── DashboardTopBar.tsx     # Hamburger + user info
   │   ├── MobileSidebarDrawer.tsx # Slide-out mobile sidebar
   │   └── StatCard.tsx            # Stat display card
   ```
4. Add under `src/lib/validations/`:
   ```
   │   └── settings.ts             # Zod schema (profile form)
   ```
5. Update testing section to include dashboard tests

**Step 2: Commit**

```bash
git add ARCHITECTURE.md
git commit -m "docs(phase-d): update ARCHITECTURE.md for dashboard shell"
```

---

### Task 15: Final Verification

**Step 1: Run all checks**

Run: `npm run test && npm run typecheck && npm run build`
Expected: All pass

**Step 2: Review git log**

Run: `git log --oneline feat/phase-d-dashboard --not main`
Expected: ~14 commits covering all tasks
