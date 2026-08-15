# LMB Admin

React + TypeScript + Tailwind CSS (Vite) — dark/gold LMB theme.

## Docs

- **[ADMIN_PHASES.md](./ADMIN_PHASES.md)** — full phased build plan

## Run

```bash
cd admin
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)

## Phase status

| Phase | Status |
|-------|--------|
| 0 Plan | Done |
| 1 Shell & routes | Done |
| 2 Dashboard (mock) | Done |
| 3 Catalog | Done |
| 4 People (Users / Vendors) | Done |
| 5 Commerce ops (Orders / Bookings) | Done |
| 6 Money & logistics (Payments / Shipping) | Done |
| 7 Growth & content (Coupons / Banners / Reviews) | Done |
| 8 Platform (Settings / Support / Reports / Roles) | Done |
| 9 Polish & connect (Auth + UI states) | Done |

## Login (Phase 9)

Open [http://localhost:5173/login](http://localhost:5173/login)

- Email: `anika@lmb.demo` (or any active staff email)
- Password: `lmbadmin`

Session persists in `localStorage`. Sign out from the top bar.

Mock data stays local until you flip `API_MODE` in `src/lib/connect.ts`.
