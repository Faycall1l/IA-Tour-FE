# ATHAR Frontend

Frontend monorepo for **ATHAR — the agentic travel guide for Algeria**.

Two apps live here, one git remote (`IA-Tour-FE`):

- `dashboard/` — **Next.js** web dashboard for agencies, guides, hotels and admins
- `mobile/` — **Flutter** mobile app for travelers (discover, plan, navigate, stay)

## Structure

```
Athar frontend/
├── dashboard/   # Next.js dashboard (provider/admin roles)
└── mobile/      # Flutter mobile app (traveler-facing)
```

## Backend

The REST API + AI agents live in the sibling repo `../Athar`
(remote: `IA-Tour-Algerie.git`). Both repos are independent; this repo only
consumes the API at `ATHAR_API_BASE_URL`.
