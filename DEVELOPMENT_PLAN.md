# Development Plan - Virtual Realtor Agent (VRA)

## Version History
| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-13 | Initial plan for VRA MVP | Shekhar Chaudhary |

## Current Status
- **Active Phase:** Phase 1 (MVP Foundations)
- **Branch:** main
- **Next Deadline:** 2025-11-03 (3 weeks)

## Goals for MVP
Deliver a usable **buyer‑side assistant**: capture preferences → search & rank homes → schedule tours → draft offer → escrow checklist.


## Phases

### Phase 1 — Foundations (Week 1)
**Objective:** Project setup, auth, schema, search UI.
**Tasks**
- [ ] Next.js 15 + TS + Tailwind scaffolding
- [ ] NextAuth (email/password; providers later)
- [ ] Prisma schema (Users, Listings, Leads, Tours, Offers, Escrow, Messages)
- [ ] Lib clients (db, redis, maps)
- [ ] Search page: filters (price, beds, baths, radius) + map panel
- [ ] Seed script with sample listings (JSON)
**Success Criteria**
- Sign in/out works; seeded search returns cards in <1.5s
- Lint/build pipelines clean

### Phase 2 — Agents & Search (Week 2)
**Objective:** Implement **LeadAgent** and **SearchAgent** with embeddings.
**Tasks**
- [ ] Embedding indexer (pgvector)
- [ ] Semantic match (profile↔listing)
- [ ] Lead intake wizard + preference storage
- [ ] Neighborhood/commute scoring (Maps Distance Matrix)
- [ ] Background job to refresh scores nightly
**Success Criteria**
- Top‑N results align with preferences in a sample script (>70% qualitative fit)

### Phase 3 — Tours (Week 2–3)
**Objective:** Scheduling + reminders.
**Tasks**
- [ ] TourScheduler UI + availability picker
- [ ] Calendar integration (Google) + ICS emails
- [ ] SMS reminders via Twilio
**Success Criteria**
- Creating a tour sends calendar invite and SMS within 60s

### Phase 4 — Offer Assist (Week 3)
**Objective:** CMA‑style summary + offer draft.
**Tasks**
- [ ] ValuationAgent with comps (local seed; later: RESO partner)
- [ ] OfferComposer with contingencies templates
- [ ] DocuSign draft & webhook
**Success Criteria**
- One‑click “Draft Offer” produces a PDF and DocuSign envelope link

### Phase 5 — Escrow Tracker (Week 4)
**Objective:** Milestones + vendor tasks.
**Tasks**
- [ ] EscrowAgent with default checklist
- [ ] Reminder jobs (BullMQ) + timeline UI
**Success Criteria**
- Timeline shows upcoming deadlines; reminders fire on schedule

### Phase 6 — Testing & Hardening (Week 4)
**Objective:** Quality baseline.
**Tasks**
- [ ] Jest + React Testing Library; Playwright E2E (signin→search→tour)
- [ ] Sentry, basic OTEL traces
- [ ] Rate‑limit public endpoints; input validation (zod)
**Success Criteria**
- 60% coverage; green E2E on critical flow

> **Mobile Apps**: planned post‑MVP. Shared agent package enables reuse.

## Deliverables Checklist
- [ ] ARCHITECTURE.md updated with any ADRs
- [ ] TECHNICAL_DOCUMENTATION.md first cut
- [ ] .env.example with required keys
- [ ] Seed and migration scripts
- [ ] CI workflow (build/lint; tests later)

## Environments & Keys
```
DATABASE_URL=
REDIS_URL=
NEXTAUTH_SECRET=
GOOGLE_MAPS_API_KEY=
DOCUSIGN_INTEGRATOR_KEY=
TWILIO_SID=
TWILIO_AUTH_TOKEN=
OPENAI_API_KEY=
```

## Commands
```bash
# Dev
npm run dev
npm run build && npm run lint

# Prisma
npx prisma migrate dev
npx prisma db seed
npx prisma studio

# Workers
node workers/indexListings.ts
node workers/sendReminders.ts
```

## Risks & Mitigations
- **Licensing/MLS access** → start with public/partner feeds; toggle features by region.
- **Legal advice risk** → present as assistive; disclaimers; link to human pros.
- **Cost of LLM** → cache prompts; batch; small models for rerank; eval gates.
- **Data quality** → allow manual overrides; feedback loop improves ranking.

## Success Metrics
- Search latency P95 < 1.5s
- Tour booking success > 90%
- Offer draft in < 30s after user click
- Weekly active users (WAU) growth and retention on saved searches
