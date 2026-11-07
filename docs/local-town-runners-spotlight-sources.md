# Local Town Runners spotlight sources

Case study: `/apps/local-town-runners`. Homepage and Apps page reuse `components/LocalTownRunnersSpotlight.tsx`.

Editorial origin and planned directions: user-provided AIBRY Labs spotlight brief, citing the October 11 Garage Admin planning record. Garage MCP was unavailable; that memory record was not independently retrieved.

Development source inspected: https://github.com/bryan060807/local-town-runners at commit `269eddd25dcd95b316f49c20b18e26739ad7eaec`.

- `README.md`, `package.json`, `vercel.json`: framework, Supabase dependencies, deployment configuration, current demo boundaries.
- `src/lib/demo-provision.ts`, `src/lib/demo-catalog.ts`, `src/lib/server/demo-orders.ts`: fictional demo and order workflows.
- `src/lib/server/onboarding.ts`, `src/lib/onboarding/pdf.ts`: consent, application and PDF workflows.
- `src/lib/payment-validation.ts`, `src/lib/webhook-processing.ts`: pending/completed capture distinction, validation and webhook processing.
- `docs/demo-acceptance-2026-10-26.md`: historical development evidence, not tests rerun for this website change.

Screenshot copied unchanged from `docs/screenshots/explore-reputation-2026-10-27/LIVE-PRODUCTION-desktop-explore-vendors-and-featured.png`. Reviewed visually: fictional vendor catalog, no customer records or credentials. The project license is retained beside the copied asset. This is an actual repository screenshot, not a newly captured hosted deployment.

No live payments, payouts, accounts, agreements, vendor onboarding or delivery were exercised. The copy does not certify hosted deployment status, claim operational efficiencies, or assert a commercial launch. Pilot, matching validation and regional expansion remain planned directions. No fabricated photographs or product screens were added.
