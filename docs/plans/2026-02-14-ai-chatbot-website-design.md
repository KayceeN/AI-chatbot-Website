# AI Chatbot Website — Design Document

**Date:** 2026-02-14
**Status:** Approved

## Overview

A full-stack SaaS website that showcases and provides AI-powered services: an interactive chatbot, workflow automation, analytics dashboards, and AI-powered support. Built as a monolithic Next.js application backed by Supabase and OpenAI GPT.

## Architecture

**Approach:** Monolithic Next.js App (App Router) with Supabase for auth/database and OpenAI for AI features.

**Rationale:** Single deployment, shared components, fast iteration. Clean organization via route groups without infrastructure overhead. Services can be extracted later if scaling demands it.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Full-stack React framework |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| UI Components | shadcn/ui | Accessible, customizable primitives |
| Auth & DB | Supabase | Auth, PostgreSQL, real-time, RLS |
| AI | OpenAI GPT (via Vercel AI SDK) | Chatbot + workflow AI processing |
| Charts | Recharts | Analytics visualizations |
| Forms | React Hook Form + Zod | Form handling + validation |
| Container | Docker + docker-compose | Development environment |
| Deployment | Vercel (suggested) | Hosting |

## Project Structure

```
ai-chatbot-website/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx           # Landing/home page
│   │   ├── pricing/
│   │   ├── features/
│   │   ├── about/
│   │   └── contact/
│   ├── (auth)/               # Auth pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   ├── (dashboard)/          # Protected product area
│   │   ├── layout.tsx         # Dashboard shell (sidebar, nav)
│   │   ├── page.tsx           # Dashboard home / overview
│   │   ├── chat/              # AI chatbot interface
│   │   ├── workflows/         # Workflow automation
│   │   ├── analytics/         # Analytics dashboard
│   │   └── settings/          # User/account settings
│   ├── api/                   # API routes
│   │   ├── chat/              # OpenAI streaming chat endpoint
│   │   ├── workflows/         # Workflow CRUD + execution
│   │   └── analytics/         # Analytics data endpoints
│   ├── layout.tsx             # Root layout
│   └── globals.css
├── components/                # Shared UI components
│   ├── ui/                    # shadcn/ui primitives
│   ├── marketing/             # Marketing-specific components
│   └── dashboard/             # Dashboard-specific components
├── lib/                       # Utilities
│   ├── supabase/              # Supabase client setup
│   ├── openai/                # OpenAI client setup
│   └── utils.ts
├── types/                     # TypeScript types
├── supabase/                  # Supabase migrations & config
│   └── migrations/
├── public/                    # Static assets
├── Dockerfile
├── docker-compose.yml
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Database Schema

### profiles
Extends Supabase auth.users with application-specific data.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | FK to auth.users |
| full_name | text | |
| avatar_url | text | |
| plan | text | free/pro/enterprise |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### conversations
Chat conversation containers.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to profiles |
| title | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### messages
Individual messages within conversations.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| conversation_id | uuid | FK to conversations |
| role | text | 'user' or 'assistant' |
| content | text | |
| tokens_used | integer | |
| created_at | timestamptz | |

### workflows
Workflow definitions created by users.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to profiles |
| name | text | |
| description | text | |
| steps | jsonb | Array of step objects |
| trigger_type | text | manual/scheduled/webhook |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### workflow_runs
Execution history for workflows.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| workflow_id | uuid | FK to workflows |
| status | text | pending/running/success/failed |
| input | jsonb | |
| output | jsonb | |
| started_at | timestamptz | |
| completed_at | timestamptz | |
| error | text | |

### analytics_events
Event log powering the analytics dashboard.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to profiles |
| event_type | text | |
| event_data | jsonb | |
| created_at | timestamptz | |

All tables have Row Level Security (RLS) enabled — users can only access their own data.

## Core Features

### AI Chatbot
- Streaming responses via Vercel AI SDK + OpenAI GPT
- Full conversation history persisted in Supabase
- Real-time sync via Supabase subscriptions (multi-tab)
- Conversation management (create, rename, delete)

### Workflow Automation
- Form-based workflow builder
- Steps stored as JSONB (types: ai_summarize, send_email, extract_data, content_generation)
- Triggers: manual, scheduled (cron), webhook
- Sequential step execution with logging to workflow_runs
- MVP types: text summarization, data extraction, content generation, email drafting

### Analytics Dashboard
- Events logged on key actions (chat messages, workflows run)
- Metrics: total chats, messages over time, workflow success/failure rates, usage trends
- Aggregation via Supabase SQL functions
- Charts rendered with Recharts

### Auth Flow
- Supabase Auth: email + password, Google OAuth
- Middleware protects (dashboard) routes
- Profile auto-created on signup via Supabase trigger

## Error Handling

- API routes return `{ error: string, code: string }` on failure
- OpenAI errors (rate limits, timeouts) surfaced to user with retry guidance
- Workflow failures logged to workflow_runs with error details
- Client-side: toast notifications, loading states for async operations

## Security

- All API routes validate auth session
- Supabase RLS for data isolation
- OpenAI API key server-side only (environment variable)
- Rate limiting on chat and workflow endpoints
- Input sanitization before sending to OpenAI
- CSRF protection via Next.js built-in mechanisms

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
OPENAI_API_KEY=<your-openai-key>
```

## Visual Design

To be determined — visual design will be created separately with Codex and applied afterward.
