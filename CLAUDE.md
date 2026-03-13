# ProfitPulse — Real-Time E-Commerce Profit Intelligence

## Project Overview
ProfitPulse is a Next.js 14+ App Router web application providing real-time e-commerce profit intelligence with a barcode scanning feature. It targets Amazon, Shopify, and eBay sellers who need true profit visibility per SKU after ALL hidden costs.

**Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Framer Motion
**Design:** Mobile-first responsive, financial dashboard aesthetic ("Robinhood meets Shopify analytics")

## Brand & Design System
- **Primary (Profit/Positive):** Emerald green `#10B981`
- **Loss/Negative:** Red `#EF4444`
- **Neutral/Warning:** Amber `#F59E0B`
- **Dark backgrounds:** Charcoal `#1E293B`
- **Cards:** White `#FFFFFF`
- **Logo:** "ProfitPulse" with heartbeat/pulse line icon
- Profit = green, Loss = red, Neutral = amber — EVERYWHERE

## Architecture
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page (/)
│   ├── layout.tsx          # Root layout
│   ├── dashboard/
│   │   ├── layout.tsx      # Dashboard layout with sidebar/bottom nav
│   │   ├── page.tsx        # Main profit dashboard
│   │   ├── skus/page.tsx   # SKU profit table
│   │   ├── scan/page.tsx   # Barcode scanner (viral feature)
│   │   ├── alerts/page.tsx # Margin alerts
│   │   └── hourly/page.tsx # Revenue per hour
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── landing/            # Landing page sections
│   ├── dashboard/          # Dashboard-specific components
│   └── shared/             # Shared components (logo, navigation)
├── lib/
│   ├── mock-data.ts        # All mock data (127 SKUs, scans, alerts)
│   ├── utils.ts            # Utility functions
│   └── types.ts            # TypeScript interfaces
└── styles/
    └── globals.css         # Global styles + Tailwind
```

## Mock Data Entity: "QuickFlip Commerce"
- 127 active SKUs: Amazon (84), Shopify (43)
- Categories: Electronics, Home & Kitchen, Toys, Health & Beauty
- 90 days of sales/fee/profit data per SKU
- 15 recent barcode scans with varying profitability
- Realistic Amazon FBA fee structures

## Pages
1. **Landing (/)** — Hero, problem viz, features, pricing (Starter $29, Growth $59, Pro $99), waitlist
2. **Dashboard (/dashboard)** — Stats cards, 30-day trend chart, platform breakdown, profit leaderboard, alert feed
3. **SKU Table (/dashboard/skus)** — Sortable/filterable table, 50+ SKUs, color-coded margins, expandable details
4. **Barcode Scanner (/dashboard/scan)** — THE VIRAL FEATURE. Camera viewfinder UI, scan animation, profit card with GO/NO-GO, scan history
5. **Alerts (/dashboard/alerts)** — Severity-based alerts, impact estimates, resolution actions, threshold settings
6. **Revenue/Hour (/dashboard/hourly)** — Time tracking per activity, true hourly rate, insights

## Navigation
- **Desktop:** Sidebar with all nav items
- **Mobile:** Bottom tab bar with Scanner prominently in center (larger icon)

## Development Guidelines
- Use `npx shadcn@latest add <component>` to add shadcn/ui components
- All data is mock — no real API calls in MVP
- Mobile-first: design for mobile, enhance for desktop
- Every monetary value: green if positive, red if negative, amber if marginal
- Framer Motion for all page transitions and card animations
- Recharts for all charts/graphs
- Keep components modular and reusable

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
