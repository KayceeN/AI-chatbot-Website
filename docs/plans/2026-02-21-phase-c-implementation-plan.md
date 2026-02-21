# Phase C: Auth System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build email/password authentication with protected dashboard routes using Supabase Auth, React Hook Form, and Zod validation.

**Architecture:** Supabase Auth handles session management. Middleware refreshes sessions and provides convenience redirects. The real security gate is `getUser()` in each protected layout/API route. Auth pages use React Hook Form with Zod schemas. shadcn/ui provides form primitives (Input, Button, Label).

**Tech Stack:** Next.js 15 (App Router), Supabase Auth (`@supabase/ssr`), React Hook Form, Zod, shadcn/ui, Tailwind CSS

**Codex Review:** Reviewed 2026-02-21. 1 CRITICAL (routing conflict), 2 HIGH (redirect validation, error handling) addressed. 1 HIGH (user-event dep) dismissed — standard test utility. 1 MEDIUM (validation bounds) addressed. See revisions below.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install React Hook Form and resolver**

Run: `npm install react-hook-form @hookform/resolvers`
Expected: Clean install, no peer warnings

**Step 2: Install shadcn/ui components**

Run: `npx shadcn@latest add input button label`
Expected: Creates three files:
- `src/components/ui/input.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/label.tsx`

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add package.json package-lock.json src/components/ui/input.tsx src/components/ui/button.tsx src/components/ui/label.tsx
git commit -m "feat(phase-c): install react-hook-form and shadcn form components"
```

---

### Task 2: Create Zod Validation Schemas

**Files:**
- Create: `src/lib/validations/auth.ts`
- Create: `tests/validations-auth.test.ts`

**Step 1: Write the failing tests**

Create `tests/validations-auth.test.ts`:

```typescript
import { describe, expect, test } from "vitest";
import { loginSchema, signupSchema, safeRedirect } from "@/lib/validations/auth";

describe("loginSchema", () => {
  test("accepts valid input", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  test("rejects short password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  test("rejects empty fields", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  test("accepts valid input", () => {
    const result = signupSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  test("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });

  test("rejects short name", () => {
    const result = signupSchema.safeParse({
      fullName: "J",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  test("trims whitespace from name", () => {
    const result = signupSchema.safeParse({
      fullName: "  Jane Doe  ",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Jane Doe");
    }
  });

  test("rejects name exceeding 100 characters", () => {
    const result = signupSchema.safeParse({
      fullName: "A".repeat(101),
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("safeRedirect", () => {
  test("returns valid relative path", () => {
    expect(safeRedirect("/dashboard/chat")).toBe("/dashboard/chat");
  });

  test("returns fallback for null", () => {
    expect(safeRedirect(null)).toBe("/dashboard");
  });

  test("returns fallback for protocol-relative URL", () => {
    expect(safeRedirect("//evil.com")).toBe("/dashboard");
  });

  test("returns fallback for absolute URL", () => {
    expect(safeRedirect("https://evil.com")).toBe("/dashboard");
  });

  test("returns fallback for empty string", () => {
    expect(safeRedirect("")).toBe("/dashboard");
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/validations-auth.test.ts`
Expected: FAIL — module `@/lib/validations/auth` not found

**Step 3: Write the implementation**

Create `src/lib/validations/auth.ts`:

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be 100 characters or fewer"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupValues = z.infer<typeof signupSchema>;

/** Validate a redirect target — must be a relative path, not protocol-relative. */
export function safeRedirect(next: string | null, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}
```

**Step 4: Run tests to verify they pass**

Run: `npm run test -- tests/validations-auth.test.ts`
Expected: All 14 tests PASS

**Step 5: Commit**

```bash
git add src/lib/validations/auth.ts tests/validations-auth.test.ts
git commit -m "feat(phase-c): add Zod auth validation schemas with tests"
```

---

### Task 3: Create Middleware

**Files:**
- Create: `src/middleware.ts`

The middleware creates its own Supabase client using request/response cookies (different from the server client in `src/lib/supabase/server.ts` which uses `next/headers`). This is the Supabase-recommended pattern for Next.js middleware.

**Step 1: Create the middleware**

Create `src/middleware.ts`:

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — this keeps the auth cookie alive
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Unauthenticated users trying to access dashboard → redirect to login
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users on auth pages → redirect to dashboard
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(phase-c): add auth middleware with session refresh and route protection"
```

---

### Task 4: Create Auth Layout

**Files:**
- Create: `src/app/(auth)/layout.tsx`

The auth layout provides a centered, dark-background container for login/signup pages. No TopNav — clean focused experience. Logo links back to `/`.

**Step 1: Create the layout**

Create `src/app/(auth)/layout.tsx`:

```tsx
import Link from "next/link";
import { LogoMark } from "@/components/ui/LogoMark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-12">
      <Link href="/" className="mb-8">
        <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-white">
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <span className="absolute h-2.5 w-2.5 -translate-x-[5px] rotate-45 rounded-sm bg-ink" />
            <span className="absolute h-2.5 w-2.5 translate-x-[5px] rotate-45 rounded-sm bg-ink" />
          </span>
          <span className="text-[2rem] leading-none sm:text-[2.1rem]">
            <span>k</span>
            <span className="brand-letter-a">A</span>
            <span>yph</span>
            <span className="brand-letter-i">I</span>
          </span>
        </span>
      </Link>
      {children}
    </div>
  );
}
```

Note: We inline the logo with inverted colors (white on dark) rather than importing `LogoMark` which is styled for light backgrounds (`text-ink`, `bg-ink`). The auth layout uses a dark background so the logo needs inverted colors.

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add "src/app/(auth)/layout.tsx"
git commit -m "feat(phase-c): add auth layout with centered dark background"
```

---

### Task 5: Create Form Components

**Files:**
- Create: `src/components/forms/FormField.tsx`

A reusable form field that renders a labeled input with error message display. Works with React Hook Form's `register` function.

**Step 1: Create FormField**

Create `src/components/forms/FormField.tsx`:

```tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export function FormField({
  label,
  type = "text",
  placeholder,
  error,
  registration,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={registration.name} className="text-sm font-semibold text-ink">
        {label}
      </Label>
      <Input
        id={registration.name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${registration.name}-error` : undefined}
        {...registration}
      />
      {error && (
        <p id={`${registration.name}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/forms/FormField.tsx
git commit -m "feat(phase-c): add reusable FormField component for RHF"
```

---

### Task 6: Create Login Page

**Files:**
- Create: `src/app/(auth)/login/page.tsx`

The login page is a server component that renders the `LoginForm` client component. The form uses React Hook Form with Zod validation and calls Supabase `signInWithPassword`. On success, redirects to `/dashboard` (or the `?next=` URL if present).

**Step 1: Create the login page**

Create `src/app/(auth)/login/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginValues, safeRedirect } from "@/lib/validations/auth";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setServerError(error.message);
        setIsLoading(false);
        return;
      }

      const next = safeRedirect(searchParams.get("next"));
      router.push(next);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-panel border border-white/10 bg-white p-8 shadow-soft">
      <h1 className="mb-6 text-2xl font-bold text-ink">Log in</h1>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          registration={register("email")}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          registration={register("password")}
        />

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full"
        onClick={() => setServerError("Google sign-in coming soon")}
      >
        Sign in with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-ink underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add "src/app/(auth)/login/page.tsx"
git commit -m "feat(phase-c): add login page with email/password form"
```

---

### Task 7: Create Signup Page

**Files:**
- Create: `src/app/(auth)/signup/page.tsx`

The signup page uses `signUp()` with the user's full name stored in `user_metadata`. On success, shows a "check your email" confirmation message. The profile row is auto-created by the database trigger in migration 001.

**Step 1: Create the signup page**

Create `src/app/(auth)/signup/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupValues } from "@/lib/validations/auth";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(values: SignupValues) {
    setServerError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      setIsLoading(false);

      if (error) {
        setServerError(error.message);
        return;
      }

      setIsSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm rounded-panel border border-white/10 bg-white p-8 shadow-soft text-center">
        <h1 className="mb-4 text-2xl font-bold text-ink">Check your email</h1>
        <p className="text-sm text-muted">
          We sent a confirmation link to your email address. Click the link to activate your account.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-ink underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-panel border border-white/10 bg-white p-8 shadow-soft">
      <h1 className="mb-6 text-2xl font-bold text-ink">Create an account</h1>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          label="Full name"
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          registration={register("fullName")}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          registration={register("email")}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          registration={register("password")}
        />
        <FormField
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full"
        onClick={() => setServerError("Google sign-up coming soon")}
      >
        Sign up with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add "src/app/(auth)/signup/page.tsx"
git commit -m "feat(phase-c): add signup page with email confirmation flow"
```

---

### Task 8: Create OAuth Callback Route

**Files:**
- Create: `src/app/(auth)/callback/route.ts`

This route handler exchanges the `?code=` param for a Supabase session. Supabase redirects here after email confirmation and OAuth flows. Uses the server client with cookies.

**Step 1: Create the callback route**

Create `src/app/(auth)/callback/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirect } from "@/lib/validations/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirect(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add "src/app/(auth)/callback/route.ts"
git commit -m "feat(phase-c): add OAuth/email callback route handler"
```

---

### Task 9: Create Protected Dashboard Layout

**Files:**
- Create: `src/app/dashboard/layout.tsx`
- Delete: `src/app/(dashboard)/` (empty directory from Phase B scaffolding)

**Important:** The `(dashboard)` route group was created as an empty placeholder in Phase B, but route groups strip the group name from URLs. A `page.tsx` inside `(dashboard)/` would resolve to `/` — conflicting with `(marketing)/page.tsx`. Instead, we use `src/app/dashboard/` (an actual path segment) so pages resolve to `/dashboard/*`.

**Step 0: Remove the empty (dashboard) route group**

Run: `rm -rf "src/app/(dashboard)"`

**Step 1: Create the dashboard layout**

Create `src/app/dashboard/layout.tsx`:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-panel px-6 py-4">
        <p className="text-sm text-muted">kAyphI Dashboard</p>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
```

**Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/app/dashboard/layout.tsx
git commit -m "feat(phase-c): add protected dashboard layout with getUser() gate"
```

---

### Task 10: Create Dashboard Placeholder Page

**Files:**
- Create: `src/app/dashboard/page.tsx`

Temporary placeholder that confirms the auth flow works end-to-end. Shows the logged-in user's name and email, plus a logout button. Phase D replaces this with the real dashboard.

**Step 1: Create the dashboard page**

Create `src/app/dashboard/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = user.user_metadata?.full_name ?? "User";

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-ink">
        Welcome, {fullName}
      </h1>
      <p className="mb-8 text-muted">{user.email}</p>
      <LogoutButton />
    </div>
  );
}
```

**Step 2: Create the logout button (client component)**

Create `src/app/dashboard/logout-button.tsx`:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Log out
    </Button>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/dashboard/page.tsx src/app/dashboard/logout-button.tsx
git commit -m "feat(phase-c): add dashboard placeholder with logout"
```

---

### Task 11: Write Auth Form Unit Tests

**Files:**
- Create: `tests/auth-forms.test.tsx`

Test that login and signup forms render correctly, display validation errors, and show server errors. Supabase is mocked to avoid real API calls.

**Step 1: Create the test file**

Create `tests/auth-forms.test.tsx`:

```tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase client
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
    },
  }),
}));

import LoginPage from "@/app/(auth)/login/page";
import SignupPage from "@/app/(auth)/signup/page";

describe("LoginPage", () => {
  test("renders email and password fields", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  test("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  test("shows server error on failed login", async () => {
    mockSignIn.mockResolvedValueOnce({
      error: { message: "Invalid login credentials" },
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid login credentials")).toBeInTheDocument();
    });
  });

  test("redirects on successful login", async () => {
    mockSignIn.mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("has link to signup page", () => {
    render(<LoginPage />);

    const signupLink = screen.getByRole("link", { name: "Sign up" });
    expect(signupLink).toHaveAttribute("href", "/signup");
  });
});

describe("SignupPage", () => {
  test("renders all signup fields", () => {
    render(<SignupPage />);

    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  });

  test("shows password mismatch error", async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "different");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });

  test("shows confirmation message on success", async () => {
    mockSignUp.mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<SignupPage />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
    });
  });

  test("has link to login page", () => {
    render(<SignupPage />);

    const loginLink = screen.getByRole("link", { name: "Log in" });
    expect(loginLink).toHaveAttribute("href", "/login");
  });
});
```

**Step 2: Install @testing-library/user-event (dev dependency)**

Run: `npm install -D @testing-library/user-event`

**Step 3: Run the tests**

Run: `npm run test -- tests/auth-forms.test.tsx`
Expected: All tests pass (the auth pages and form components exist from previous tasks)

**Step 4: Commit**

```bash
git add tests/auth-forms.test.tsx package.json package-lock.json
git commit -m "test(phase-c): add login and signup form unit tests"
```

---

### Task 12: Write Auth E2E Tests

**Files:**
- Create: `tests/e2e/auth.spec.ts`

E2E tests verify the auth flow in a real browser. Since we can't create real Supabase users in tests, these tests focus on page rendering, validation, and navigation. Full signup-to-dashboard flow requires manual testing.

**Step 1: Create the E2E test file**

Create `tests/e2e/auth.spec.ts`:

```typescript
import { expect, test } from "@playwright/test";

test("login page renders form", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
});

test("signup page renders form", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByLabel("Confirm password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
});

test("login shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Email is required")).toBeVisible();
  await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
});

test("signup shows validation errors on empty submit", async ({ page }) => {
  await page.goto("/signup");

  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Name must be at least 2 characters")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
});

test("unauthenticated user is redirected from dashboard to login", async ({ page }) => {
  await page.goto("/dashboard");

  await page.waitForURL("**/login**");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("login page has link to signup and vice versa", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("link", { name: "Sign up" }).click();

  await page.waitForURL("**/signup");
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();

  await page.getByRole("link", { name: "Log in" }).click();
  await page.waitForURL("**/login");
  await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
});

test("auth page logo links back to home", async ({ page }) => {
  await page.goto("/login");

  const logoLink = page.locator("a[href='/']").first();
  await expect(logoLink).toBeVisible();
});

test("google sign-in button shows coming soon message", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: "Sign in with Google" }).click();
  await expect(page.getByText("Google sign-in coming soon")).toBeVisible();
});
```

**Step 2: Run E2E tests**

Run: `npm run test:e2e -- tests/e2e/auth.spec.ts`
Expected: All tests pass

**Step 3: Commit**

```bash
git add tests/e2e/auth.spec.ts
git commit -m "test(phase-c): add auth E2E tests"
```

---

### Task 13: Verify All Existing Tests Still Pass

**Step 1: Run full unit test suite**

Run: `npm run test`
Expected: All tests pass (including existing landing page tests and new auth tests)

**Step 2: Run full E2E suite**

Run: `npm run test:e2e`
Expected: All tests pass (existing landing tests + new auth tests)

**Step 3: Run lint and typecheck**

Run: `npm run lint && npm run typecheck`
Expected: No errors

**Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 14: Update Documentation

**Files:**
- Modify: `ARCHITECTURE.md` — update Current directory structure, move auth architecture from "Planned" to "Current", update tech stack
- Modify: `tasks/todo.md` — check off Phase C items

**Step 1: Update ARCHITECTURE.md**

Changes to make:
1. In **Tech Stack > Current** table, add row: `| Forms | React Hook Form + @hookform/resolvers | Latest | Auth forms, dashboard forms |`
2. In **Directory Structure > Current**, add under `src/app/`:
   ```
   ├── (auth)/
   │   ├── layout.tsx              # Auth layout (centered, dark bg)
   │   ├── login/page.tsx          # Login form (email/password)
   │   ├── signup/page.tsx         # Signup form (email/password + name)
   │   └── callback/route.ts      # OAuth/email confirmation callback
   ```
3. Remove `(dashboard)/` from directory structure. Add under `src/app/`:
   ```
   ├── dashboard/
   │   ├── layout.tsx              # Protected layout (getUser() gate)
   │   ├── page.tsx                # Dashboard placeholder
   │   └── logout-button.tsx       # Client-side logout
   ```
   Note: Dashboard uses an actual path segment (`dashboard/`), not a route group. This avoids the conflict where `(dashboard)/page.tsx` would resolve to `/` (same as `(marketing)/page.tsx`). Future dashboard sub-routes go here: `dashboard/chat/page.tsx` → `/dashboard/chat`, etc.
5. Add under `src/components/`:
   ```
   ├── forms/
   │   └── FormField.tsx           # Labeled input with RHF + error display
   ```
6. Add under `src/lib/`:
   ```
   ├── validations/
   │   └── auth.ts                 # Zod schemas (login, signup, safeRedirect)
   ```
7. Add at root:
   ```
   ├── src/middleware.ts            # Session refresh + route protection
   ```
8. Change "Authentication Architecture (Planned)" heading to "Authentication Architecture"
9. Move React Hook Form from "Planned" to "Current" in tech stack
10. Update routing table: `(dashboard)` group → `dashboard/` path segment; routes are `/dashboard`, `/dashboard/chat`, etc.

**Step 2: Update tasks/todo.md**

Check off Phase C items and add a review section.

**Step 3: Commit**

```bash
git add ARCHITECTURE.md tasks/todo.md
git commit -m "docs(phase-c): update architecture docs with auth system"
```

---

### Task 15: Final Verification and Feature Commit

**Step 1: Verify all checks pass**

Run: `npm run lint && npm run typecheck && npm run test && npm run build`
Expected: All pass

**Step 2: Run E2E one more time**

Run: `npm run test:e2e`
Expected: All pass

---

## File Summary

| File | Action | Task |
|------|--------|------|
| `package.json` | Modify | 1, 11 |
| `src/components/ui/input.tsx` | Create (shadcn) | 1 |
| `src/components/ui/button.tsx` | Create (shadcn) | 1 |
| `src/components/ui/label.tsx` | Create (shadcn) | 1 |
| `src/lib/validations/auth.ts` | Create | 2 |
| `tests/validations-auth.test.ts` | Create | 2 |
| `src/middleware.ts` | Create | 3 |
| `src/app/(auth)/layout.tsx` | Create | 4 |
| `src/components/forms/FormField.tsx` | Create | 5 |
| `src/app/(auth)/login/page.tsx` | Create | 6 |
| `src/app/(auth)/signup/page.tsx` | Create | 7 |
| `src/app/(auth)/callback/route.ts` | Create | 8 |
| `src/app/(dashboard)/` | Delete (empty dir) | 9 |
| `src/app/dashboard/layout.tsx` | Create | 9 |
| `src/app/dashboard/page.tsx` | Create | 10 |
| `src/app/dashboard/logout-button.tsx` | Create | 10 |
| `tests/auth-forms.test.tsx` | Create | 11 |
| `tests/e2e/auth.spec.ts` | Create | 12 |
| `ARCHITECTURE.md` | Modify | 14 |
| `tasks/todo.md` | Modify | 14 |
