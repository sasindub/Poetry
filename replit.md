# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### poetry-platform (React + Vite web app)
- **Purpose**: Abu Dhabi Heritage Authority — National Poets Evaluation Service
- **Path**: `artifacts/poetry-platform/`
- **Preview path**: `/`
- **Features**:
  - Public landing page with hero, stats, poem categories, jury showcase
  - Poem submission form with Arabic/English bilingual support + RTL
  - Admin portal login with 3 demo role credentials
  - Full dashboard: Stats, Submissions list, Submission detail + evaluations, Users, Jury panel, Evaluations, Competitions, Settings
  - Deep navy + gold palette, Framer Motion scroll animations
  - Language toggle (EN/AR) stored in localStorage
- **Demo credentials**: admin@aha.ae/admin123, reviewer@aha.ae/reviewer123, jury@aha.ae/jury123
- **Colors**: #0A1628 (navy), #C8A96E (gold), #1A7A6B (teal)
- **Fonts**: Playfair Display (display), Inter (body), Amiri + Tajawal (Arabic)

### api-server (Express 5 + Drizzle ORM)
- **Path**: `artifacts/api-server/`
- **Port**: 8080
- **DB**: PostgreSQL with Drizzle schema (users, competitions, submissions, evaluations, activities)
- **Seeded with**: 6 users, 3 competitions, 15 Arabic poem submissions, 6 evaluations

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
