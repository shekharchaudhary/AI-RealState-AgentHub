# Architecture Documentation - Virtual Realtor Agent (VRA)

## Purpose of This File
Documents architectural decisions, patterns, and design principles for the **Virtual Realtor Agent (VRA)** web application.

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-13 | Initial architecture documentation created | Shekhar Chaudhary |

---


## System Overview
- **Architecture Pattern:** Monolithic **Next.js** application with API Routes (App Router) + background workers
- **Primary Framework:** Next.js 15 (App Router) with React 19
- **Language/Runtime:** TypeScript 5 / Node.js 20+
- **Database:** PostgreSQL (Prisma ORM), optional pgvector for embeddings
- **Cache/Queue:** Redis (caching, rate limits, job queue via BullMQ)
- **Vector Store:** pgvector (preferred) or Pinecone (alt) for semantic property/profile search
- **Deployment Model:** Full‑stack web application (Vercel + managed Postgres/Redis)

**Project Description:** VRA is a 24/7 AI assistant that performs end‑to‑end realtor workflows for buyers and sellers—lead capture, discovery, showings, valuation, offer drafting, negotiation support, escrow/closing tracking, and post‑sale concierge.

---

## Core Capabilities (MVP Scope)
1. **Buyer Discovery & Search**
   - Collect preferences (budget, commute, schools, lot size, style, investment goals)
   - Search MLS/portals (RESO Web API partner integrations, Zillow/Redfin read where allowed)
   - Neighborhood insights (crime, schools, walkability) and commute scoring
2. **Tour Scheduling**
   - Invite sellers/agents, coordinate windows, generate calendar invites and reminders
   - Support **virtual tours** (embedded video) + check‑in/out logging
3. **Offer Assist**
   - Price analysis (CMA‑style comps), estimate monthly payments/taxes/HOA
   - Draft offer letter + conditions/contingencies; route to **DocuSign** for e‑signature
4. **Escrow Tracker**
   - Milestones: EM deposit, inspection, appraisal, loan approval, contingencies removal, closing
   - Vendor orchestration (inspectors, appraisers, title/escrow) with reminders
5. **Messaging & Activity Log**
   - Unified thread (email/SMS/in‑app) with audit trail; exportable timeline

> **Out of scope (for now):** Representing users legally as a licensed broker; funds movement; listing entry into protected MLS without brokerage cooperation. Provide **assistive** automation and clear disclaimers.

---

## Multi‑Agent Design (Service Modules)
- **LeadAgent** – captures/qualifies buyers & sellers (form/voice/chat), enriches leads
- **SearchAgent** – runs multi‑criteria search + semantic match on listings
- **TourAgent** – coordinates availability, books showings, sends reminders
- **ValuationAgent** – pulls comps, runs price ranges, risk flags
- **NegotiatorAgent** – drafts offers, suggests terms, counter‑offer reasoning (assistive)
- **DocsAgent** – prepares checklists, generates docs, routes via DocuSign, stores PDFs
- **EscrowAgent** – milestone tracker with SLA timers and vendor handoffs
- **ConciergeAgent** – post‑close utilities, movers, maintenance schedule

Agents share state via Postgres + Redis and exchange tasks through BullMQ queues.

---

## High‑Level Architecture
```
Client (Next.js, React 19)
  ├─ Chat UI / Wizard (buyer/seller)
  ├─ Property Cards & Maps
  ├─ Calendar / Tour UI
  ├─ Offer Composer & Doc Signing
  └─ Escrow Timeline

Server (API Routes + Workers)
  ├─ /api/leads, /api/search, /api/tours, /api/offers, /api/escrow
  ├─ Agent orchestrator (task router, retries, audit)
  ├─ Integrations (RESO/MLS*, Zillow/Redfin read**, Google Maps, DocuSign, Twilio, Calendar)
  └─ Background jobs (index listings, send reminders, generate docs)

Data Layer
  ├─ PostgreSQL (users, listings, tours, offers, escrow, vendors, messages)
  ├─ pgvector (embeddings for profile↔listing match & comp similarity)
  └─ Redis (cache, rate limits, queues)
```
\* MLS/RESO access depends on brokerage/board partnerships.  
\** Respect ToS and licensing; use partner feeds where required.

---

## Proposed Repository Structure
```
vra/
├── apps/web/                         # Next.js app
│   ├── src/app/
│   │   ├── (marketing)/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── search/page.tsx
│   │   ├── tours/page.tsx
│   │   ├── offers/page.tsx
│   │   ├── escrow/page.tsx
│   │   └── api/
│   │       ├── leads/route.ts
│   │       ├── search/route.ts
│   │       ├── tours/route.ts
│   │       ├── offers/route.ts
│   │       ├── escrow/route.ts
│   │       └── webhooks/docusign/route.ts
│   ├── src/components/
│   │   ├── ChatAgent.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── MapPanel.tsx
│   │   ├── TourScheduler.tsx
│   │   ├── OfferComposer.tsx
│   │   └── EscrowTimeline.tsx
│   ├── prisma/schema.prisma
│   ├── lib/{auth,db,redis,maps,mls}.ts
│   └── package.json
├── packages/agents/                  # Agent logic (shareable)
│   ├── src/LeadAgent.ts
│   ├── src/SearchAgent.ts
│   ├── src/TourAgent.ts
│   ├── src/ValuationAgent.ts
│   ├── src/NegotiatorAgent.ts
│   ├── src/DocsAgent.ts
│   └── src/EscrowAgent.ts
├── workers/                          # BullMQ workers
│   ├── indexListings.ts
│   ├── sendReminders.ts
│   └── generateDocs.ts
├── docs/{ARCHITECTURE,DEVELOPMENT_PLAN,TECHNICAL_DOCUMENTATION}.md
└── .env.example
```

---

## Data Model (Prisma sketch)
```prisma
model User {
  id           String   @id @default(cuid())
  role         Role
  email        String   @unique
  name         String?
  phone        String?
  preferences  Json?    // buyer/seller prefs
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  leads        Lead[]
  offers       Offer[]
  tours        Tour[]
  messages     Message[]
}

enum Role { BUYER SELLER ADMIN }

model Listing {
  id           String   @id @default(cuid())
  mlsId        String?  @unique
  address      String
  lat          Float
  lng          Float
  price        Int
  beds         Int
  baths        Float
  sqft         Int?
  lotSqft      Int?
  hoaMonthly   Int?
  propertyType String
  yearBuilt    Int?
  photos       String[]
  features     String[]
  raw          Json
  embedding    Bytes?   // pgvector
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Lead {
  id        String   @id @default(cuid())
  userId    String
  kind      String   // buyer|seller
  budgetMin Int?
  budgetMax Int?
  locations String[]
  notes     String?
  status    String   // new, engaged, qualified, closed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}

model Tour {
  id         String   @id @default(cuid())
  userId     String
  listingId  String
  start      DateTime
  end        DateTime
  status     String   // requested, confirmed, completed, canceled
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id])
  listing    Listing  @relation(fields: [listingId], references: [id])
}

model Offer {
  id           String   @id @default(cuid())
  userId       String
  listingId    String
  price        Int
  downPayment  Int?
  contingencies String[]
  status       String   // draft, sent, countered, accepted, rejected, withdrawn
  pdfUrl       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id])
  listing      Listing  @relation(fields: [listingId], references: [id])
}

model Escrow {
  id           String   @id @default(cuid())
  offerId      String   @unique
  milestones   Json     // checklist with due dates
  closeDate    DateTime?
  status       String   // open, on_hold, closed
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  offer        Offer    @relation(fields: [offerId], references: [id])
}

model Message {
  id        String   @id @default(cuid())
  userId    String?
  threadId  String?
  via       String   // sms, email, app
  to        String
  from      String
  body      String
  createdAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id])
}
```

---

## Key Integrations
- **RESO Web API / MLS partner feeds** (where licensed)
- **Zillow / Redfin read** (public details; observe ToS/licensing)
- **Google Maps Platform** (Places, Distance Matrix, Geocoding)
- **DocuSign** (e‑signature of offers/agreements)
- **Calendar** (Google/Microsoft) for tour scheduling
- **Twilio** (SMS/voice) for notifications
- **OpenAI/Anthropic** (LLM reasoning, summarization, doc drafting)

---

## Security & Compliance
- **AuthN/AuthZ:** NextAuth (session cookies), role‑based guards
- **PII:** Encrypt at rest, minimize retention, signed URLs for documents
- **Fair Housing/RESPA/Advertising:** Strict prompts/filters; show unbiased insights (no steering)
- **Audit Log:** Immutable activity log for all automations
- **E‑Signature:** DocuSign with tamper‑evident PDFs and webhook verification
- **Rate Limits & Abuse Prevention:** Redis sliding‑window, bot detection

---

## Performance & Observability
- SSR for marketing pages; streaming for search
- Caching strategy: listing reads (Redis), geodata, comps
- Background indexing of new listings and embeddings
- **Monitoring:** Sentry (errors), OpenTelemetry traces, Vercel Analytics
- **SLAs:** P95 API < 800ms; search < 1.5s with cache warm

---

## Architecture Decision Records (ADRs)
1. **Monolith + Workers vs Microservices:** choose monolith for speed; workers for async tasks.
2. **pgvector in Postgres** over external vector DB to simplify ops; can swap to Pinecone later.
3. **DocuSign** as e‑signature provider for real‑estate‑grade workflows.
4. **BullMQ** for durable task orchestration.

---

## Future Evolution
- Extract Agents to services (NestJS/FastAPI) behind an internal message bus
- Real‑time collaboration (WebSockets) on offers and tours
- Mobile apps (React Native/iOS/Android) sharing agent package
