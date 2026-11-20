# TossWin — frontend-only PWA (mock data)

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · Lucide · Zustand · Sonner · next-themes

No backend, no API calls. All data lives in `lib/mock-data.ts` and an in-memory Zustand store (`lib/store.ts`), so actions work within a session (placing bets, deposits, withdrawal lock, admin approve/reject, set result, cancel with refunds) and reset on reload.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

PWA (service worker + install prompt) only activates in production:

```bash
npm run build && npm start
```

## Routes

User: `/welcome`, `/login`, `/verify`, `/set-password`, `/` (home), `/match/[id]`, `/bets`, `/wallet`, `/wallet/deposit`, `/wallet/withdraw`, `/wallet/transactions`, `/profile`
Admin: `/admin`, `/admin/matches`, `/admin/deposits`, `/admin/withdrawals`, `/admin/users`, `/admin/qr` (link in Profile → "Open admin panel")

## Demo notes

- OTP: any 6 digits. Login mobile: any valid 10-digit number starting 6–9.
- Withdraw lock: submit one withdrawal, form locks; in Admin → Withdrawals mark paid/reject to unlock (reject refunds the balance).
- Set result: Admin → Matches → "Set result" on a live match settles your pending bet on MI vs CSK and updates wallet + history.
- Limits: min deposit ₹200, min withdrawal ₹500, stake ₹100–₹10,000 (`LIMITS` in mock-data).
- Theme: dark default, toggle in Profile.
- Components in `components/ui` are shadcn-style (cva + tailwind-merge) written by hand, so no CLI step is needed. You can swap in the real shadcn/ui components later.
- Admin has no auth in this demo.

## Before real use

Real-money gaming is regulated or restricted in many jurisdictions. Get legal advice on licensing and payments before launch.
