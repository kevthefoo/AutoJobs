# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

App Planner — a Next.js 16 (App Router) client-side app that guides users through a 5-step wizard to define application requirements, then generates PRD and TDD documents via OpenAI's Responses API. All data persists in browser localStorage.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

Note: `npm install` requires `--legacy-peer-deps` due to peer dependency conflicts with eslint-config-next.

## Architecture

**Data flow:** Wizard steps collect `WizardData` → Review step calls `/api/generate` → OpenAI returns markdown → saved as `Project` in localStorage.

**Four data entities** (all in localStorage via `lib/storage.ts`):
- **Projects** — completed with generated PRD/TDD documents
- **Drafts** — in-progress wizard saves with current step
- **Ideas** — quick text notes
- **TechTemplates** — reusable tech stack presets (6 built-in + user-created)

**Wizard steps** (components in `components/wizard/`):
1. Basics → 2. Features → 3. Tech → 4. Design → 5. Review & Generate

**Key lib files:**
- `lib/types.ts` — all TypeScript interfaces and defaults
- `lib/storage.ts` — localStorage CRUD for all entities
- `lib/prompts.ts` — system/user prompts for OpenAI generation
- `lib/unsaved-context.tsx` — React context for dirty state tracking and navigation interception

**API route:** `app/api/generate/route.ts` — proxies to OpenAI using `openai.responses.create()` with model `gpt-5.2-2025-12-11`. API key from `OPENAI_API_KEY` env var.

## Key Patterns

- **Dark theme only** — `<html className="dark">` in root layout
- **AI_DECIDE sentinel** — `"__AI_Decide__"` value in tech fields means "let AI choose"
- **Sonner** for toast notifications only (not confirmations). `ConfirmDialog` component for destructive action confirmations.
- **Unsaved changes** — `UnsavedProvider` context tracks dirty state; `Sidebar` intercepts nav links; `UnsavedWarning` modal prompts user; `beforeunload` handles browser close.
- **StepTech checkbox groups** have confirm/collapse behavior — once confirmed, options collapse to Badge display with Edit button.
- Path alias: `@/*` maps to project root.
