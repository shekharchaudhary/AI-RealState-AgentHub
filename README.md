# Nestora - AI-Powered Virtual Realtor Assistant

A modern web application that helps buyers and sellers with end-to-end real estate workflows using AI automation.

## Features (MVP)

- 🏠 **Smart Property Search** - Filter by price, beds, baths, and property type
- 📅 **Tour Scheduling** - Book property tours with automated coordination
- 📝 **Offer Assistance** - Draft and manage offers with AI guidance
- 📊 **Dashboard** - Track searches, tours, and offers in one place

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Runtime**: Node.js 20+

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your database URL and other credentials.

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio database GUI

## Project Structure

```
nestora/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── search/            # Property search
│   ├── dashboard/         # User dashboard
│   ├── signin/            # Authentication
│   └── api/               # API routes
├── lib/                   # Shared utilities
│   └── db.ts             # Prisma client
├── prisma/                # Database schema and seeds
│   ├── schema.prisma     # Data models
│   └── seed.ts           # Sample data
└── components/            # Reusable components (coming soon)
```

## Development Roadmap

See [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for detailed phase breakdown.

### Phase 1 ✅ (Current)
- Project setup with Next.js, TypeScript, Tailwind
- Prisma schema for core models
- Property search page with filters
- Sample data seeding

### Phase 2-6 (Upcoming)
- Agent implementations (Lead, Search, Tour, Valuation, etc.)
- Tour scheduling with calendar integration
- Offer drafting and DocuSign integration
- Escrow tracking and reminders
- Testing and production hardening

## Documentation

- [Architecture](./ARCHITECTURE.md) - System design and technical decisions
- [Development Plan](./DEVELOPMENT_PLAN.md) - Implementation roadmap
- [Technical Docs](./TECHNICAL_DOCUMENTATION.md) - API specs and deployment

## Legal Notice

Nestora provides **assistive automation** for real estate workflows. It is **not a licensed brokerage** and does not provide legal advice. Users should consult licensed professionals for legal decisions and contract execution.

## License

ISC

---

Built with ❤️ using Next.js and AI
