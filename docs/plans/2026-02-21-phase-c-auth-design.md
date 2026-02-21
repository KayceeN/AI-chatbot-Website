# Phase C: Auth System — Design

**Date:** 2026-02-21
**Status:** Approved
**Prerequisites:** Phase B complete (PR #11), Supabase project linked with all 8 migrations applied

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth provider | Supabase Auth (email/password) | Already integrated from Phase B; no additional deps |
| Google OAuth | Build UI button now, configure provider later | Unblocks the auth flow without requiring Google Cloud setup |
| Form library | React Hook Form + @hookform/resolvers + Zod | Pre-approved in ARCHITECTURE.md; install now |
| Middleware approach | Convenience redirect only | Middleware refreshes sessions and redirects; per-route `getUser()` is the security gate |
| Auth layout | Centered card on dark background | Consistent with the site's glass-card aesthetic |
| Email confirmation | Enabled (Supabase default) | Users confirm email before first login |

---

## 1. New Dependencies

Install in Phase C:
- `react-hook-form` — form state management
- `@hookform/resolvers` — Zod resolver for RHF

Already installed (Phase B): `@supabase/supabase-js`, `@supabase/ssr`, `zod`

---

## 2. Auth Pages

### Login (`src/app/(auth)/login/page.tsx`)

Server component that renders the login form.

**Fields:** email, password
**Actions:**
- Submit → `supabase.auth.signInWithPassword()`
- "Sign in with Google" button (present but shows toast "Google sign-in coming soon" until OAuth is configured)
- "Don't have an account? Sign up" link → `/signup`
- "Forgot password?" link (deferred — no reset flow in Phase C)

**Validation (Zod):**
- Email: valid format, required
- Password: min 8 chars, required

**Error handling:** Display Supabase error messages inline (invalid credentials, email not confirmed, etc.)

**Post-login redirect:** `/dashboard` (or the URL the user was trying to access, stored in query param `?next=`)

### Signup (`src/app/(auth)/signup/page.tsx`)

Server component that renders the signup form.

**Fields:** full name, email, password, confirm password
**Actions:**
- Submit → `supabase.auth.signUp()` with `data: { full_name }`
- "Sign up with Google" button (same deferred behavior as login)
- "Already have an account? Log in" link → `/login`

**Validation (Zod):**
- Full name: min 2 chars, required
- Email: valid format, required
- Password: min 8 chars, required
- Confirm password: must match password

**Post-signup:** Show confirmation message ("Check your email to confirm your account"). The trigger in migration 001 auto-creates the profile row.

### OAuth Callback (`src/app/(auth)/callback/route.ts`)

Route handler that exchanges the auth code for a session.

**Flow:**
1. Receive `?code=` query param from Supabase OAuth redirect
2. Exchange code for session via `supabase.auth.exchangeCodeForSession(code)`
3. Redirect to `/dashboard` on success, `/login?error=auth` on failure

This route also handles email confirmation links (Supabase sends users here after clicking the confirmation email link, with a `?code=` param).

---

## 3. Auth Form Components

### Shared form infrastructure (`src/components/forms/`)

- `AuthForm.tsx` — shared wrapper: glass card with logo, title, form children, footer links
- `FormField.tsx` — labeled input with error message display (RHF `useController` + shadcn Input)
- Login and signup forms are client components using `useForm` from RHF

### shadcn/ui components to install

- `input` — text/email/password fields
- `button` — submit buttons, OAuth buttons
- `label` — form labels
- `card` — auth form container (or use existing GlassCard)

---

## 4. Middleware (`src/middleware.ts`)

**Purpose:** Session refresh + convenience redirects. Not a security boundary.

**Logic:**
```
Every request:
  1. Create Supabase server client
  2. Call getUser() to refresh the session cookie

If route matches /dashboard/*:
  - No valid session → redirect to /login?next={original_path}

If route matches /login or /signup:
  - Valid session exists → redirect to /dashboard
```

**Matcher config:** Only run on `(auth)` and `(dashboard)` routes. Exclude static files, API routes, and `_next`.

---

## 5. Dashboard Layout Protection (`src/app/(dashboard)/layout.tsx`)

The actual security gate for dashboard routes.

**Logic:**
1. Call `getUser()` server-side
2. If no valid user → `redirect("/login")`
3. If valid user → render children with user context

This is the **invariant** from ARCHITECTURE.md: "All dashboard/admin API routes verify auth via `getUser()`."

---

## 6. Dashboard Placeholder (`src/app/(dashboard)/page.tsx`)

Minimal placeholder page that confirms auth works:
- Shows "Welcome, {user.full_name}" heading
- Shows user email
- Logout button → `supabase.auth.signOut()` → redirect to `/`

This is temporary scaffolding — Phase D replaces it with the real dashboard.

---

## 7. Auth Layout (`src/app/(auth)/layout.tsx`)

Minimal layout for auth pages:
- Dark background matching the site aesthetic
- Centered content (vertically and horizontally)
- No TopNav (clean, focused auth experience)
- Logo at top linking back to `/`

---

## 8. Testing

### Unit tests
- Login form: renders fields, validates input, shows errors
- Signup form: renders fields, password match validation, shows errors
- Middleware: redirects unauthenticated from dashboard, redirects authenticated from auth pages

### E2E tests
- Full signup → email confirmation → login → dashboard flow
- Login with invalid credentials shows error
- Authenticated user redirected from /login to /dashboard
- Logout returns to landing page

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/app/(auth)/layout.tsx` | Create | Auth page layout (centered, dark bg) |
| `src/app/(auth)/login/page.tsx` | Create | Login page |
| `src/app/(auth)/signup/page.tsx` | Create | Signup page |
| `src/app/(auth)/callback/route.ts` | Create | OAuth/email callback handler |
| `src/app/(dashboard)/layout.tsx` | Create | Protected layout with getUser() gate |
| `src/app/(dashboard)/page.tsx` | Create | Dashboard placeholder |
| `src/components/forms/AuthForm.tsx` | Create | Shared auth form wrapper |
| `src/components/forms/FormField.tsx` | Create | Reusable form field with RHF |
| `src/middleware.ts` | Create | Session refresh + route protection |
| `src/lib/validations/auth.ts` | Create | Zod schemas for login/signup |
