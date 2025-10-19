# Virtual Realtor Agent (VRA) — Technical Documentation

## Overview
VRA is an AI‑powered web app that automates major realtor workflows for buyers and sellers. The MVP targets **buyer journey**: discover → tour → offer → escrow tracking.


## Features
- **Conversational Intake** (chat + forms) to capture preferences
- **Smart Search**: filter + semantic ranking, commute/schools/amenities scoring
- **Tour Scheduling**: calendar invites, SMS/email reminders, virtual tour links
- **Offer Assistance**: comps summary, offer templates, DocuSign routing
- **Escrow Timeline**: milestone checklist with notifications
- **Unified Messaging**: email/SMS/in‑app in one thread

## Architecture & Orchestration
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind
- **Backend:** API Routes + BullMQ workers (Node 20, TypeScript)
- **Data:** PostgreSQL (Prisma), Redis, pgvector
- **Agents:** Lead, Search, Tour, Valuation, Negotiator, Docs, Escrow
- **Integrations:** Google Maps, DocuSign, Calendar, Twilio, (RESO/MLS partner later)
- **Observability:** Sentry, OTEL traces, Vercel Analytics

## API Endpoints (initial)
- `POST /api/leads` — create/update lead & preferences
- `POST /api/search` — query listings; supports semantic/rule filters
- `POST /api/tours` — request/confirm tour
- `POST /api/offers` — draft offer; returns envelope URL
- `GET /api/escrow/:offerId` — fetch timeline
- `POST /api/webhooks/docusign` — envelope status webhook

### Request/Response Sketch
```http
POST /api/search
{
  "budget": { "min": 800000, "max": 1200000 },
  "beds": 3, "baths": 2,
  "location": { "lat": 37.44, "lng": -122.14, "radiusKm": 10 },
  "prefs": { "yard": true, "schools": "8+", "commuteMins": 30 }
}
→ 200 OK
{ "results": [{ "id":"...", "address":"...", "match": 0.82 }], "tookMs": 430 }
```

## Data Design
See **ARCHITECTURE.md** Prisma sketch. Additional tables:
- **Vendor** (inspectors, lenders, title/escrow) with contact info and SLAs
- **AuditLog** (action, actor, payload hash, timestamp)

## Security & Privacy
- NextAuth session cookies (HTTP‑only, secure)
- PII encryption at rest; signed URLs for docs
- Webhook signature verification (DocuSign)
- Fair‑housing guardrails in prompts and UI copy
- Role‑based access (buyer/seller/admin)

## Deployment
- **Frontend:** Vercel (Preview/Prod)
- **Database:** Supabase or Railway Postgres
- **Cache/Queue:** Upstash/Redis
- **Workers:** Railway/Render containers
- **Secrets:** Vercel env vars; rotate quarterly

## Local Setup
```bash
pnpm i
cp .env.example .env
npx prisma migrate dev && npx prisma db seed
pnpm dev
```

## Future Enhancements
- **Seller Flow:** CMA for sellers, listing prep, photo shoot/vendor booking
- **Mortgage Integrations:** rate quotes and pre‑approval status (read‑only)
- **Real‑time Collaboration:** WebSockets for live offer edits
- **Mobile Apps:** React Native/iOS/Android using shared agents package
- **Geo‑specific Rules:** feature flags per region (MLS/RESO access)

## Legal Note
VRA provides **assistive automation** and document preparation; it is **not a brokerage** and does not provide legal advice. Users should consult licensed professionals for decisions and contract execution.
