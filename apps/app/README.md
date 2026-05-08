# apps/app — Saltrun SaaS surface (planned, stub-only in Wave 2)

> The customer-facing control panel that operators (Mira persona) and self-serve customers (Theo persona) use to build sequences, view the reply-triage queue, configure billing, and read the deliverability dashboard.

## Status

**Wave 2 — stub only.** This folder exists so the repo structure matches the playbook v2 monorepo layout. The actual SaaS app is the **next-wave** scope.

## Plan

The SaaS surface will be a fork of [`wasp-lang/open-saas`](https://github.com/wasp-lang/open-saas). Open-SaaS gives us:
- Wasp framework (declarative config; React + Node + Prisma underneath)
- Built-in auth (email + Google + GitHub)
- Stripe billing integration (we will replace with NOWPayments)
- Admin dashboard scaffold
- Email sending (we will replace with Resend or our own SES pool)
- Analytics scaffold (we will replace or remove — we don't ship analytics in marketing pages)

### Fork procedure (executed in next wave)

```bash
# In the next-wave build:
cd apps/
gh repo fork wasp-lang/open-saas --clone --remote=upstream
mv open-saas app    # already present as stub; remove .gitkeep / README first
cd app/
# Configure DESIGN tokens to match DESIGN.md §4 (color tokens) and §5 (typography)
# Replace Stripe → NOWPayments using payments-prototypes/ patterns
# Wire auth to require email-verified before sequence build
# Add the four product surfaces:
#   - Sequence builder    (directed-graph editor; uses the schematic from landing as reference)
#   - Reply triage queue  (the "Section 05" UI from the landing, productized)
#   - Deliverability dash (the "Section 04" placement chart, productized + drillable per pool)
#   - Billing             (NOWPayments invoice history + performance-fee invoices)
```

### Why we forked, not from-scratched

- Wasp's auth + role-based access scaffold saves 2-3 weeks of plumbing for a feature we don't differentiate on.
- Open-SaaS's prisma schema is close to what we need (User + Subscription + Tenant + ApiKey).
- Replacing Stripe → NOWPayments is a clean swap (one integration boundary).
- We benefit from upstream security patches via `git pull upstream main`.

### What we will replace immediately

| Open-SaaS default | Saltrun replacement | Reason |
|-------------------|----------------------|--------|
| Stripe billing | NOWPayments invoice + IPN | Card payments are not in the merchant-profile scope; stablecoin matches the existing landing flow. |
| Stripe webhook | NOWPayments IPN webhook | already implemented in `apps/landing/app/api/webhooks/nowpayments/route.ts` — port unchanged. |
| Open-SaaS landing | Replaced with the existing `apps/landing/` (already shipped Wave 2) | We don't redo Saltrun's brand identity. |
| Open-SaaS analytics scaffold | Removed | Marketing analytics is the customer's choice; we don't ship a Plausible/PostHog default. |
| Built-in admin dashboard | Re-themed to match `DESIGN.md` tokens | Same square-edged plates, same JetBrains Mono labels, same signal-orange CTAs. |

### What we will keep

- Wasp's auth + user+session scaffolding
- Prisma schema base (extend with `Tenant`, `Sequence`, `RunStep`, `ReplyEvent`, `DomainPool`, `Mailbox`, `LinkedInAccount`, `VoiceLine`)
- The general project shape (entities + actions + queries + jobs)

## Why this folder is a stub

Wave 2 brief is "ship the marketing landing + payments wiring + 10 docs." The full SaaS app is intentionally deferred:
- Wave 2 ships customer-acquisition surface; Wave 3 will ship the customer-using surface.
- The landing's NOWPayments handoff currently emails an onboarding link manually; the SaaS app makes that automatic.
- Forking open-saas + customizing tokens + replacing Stripe is a 2-3 week build, not a 1-week build.

## Next-wave entrypoint

When the next-wave agent picks this up, they should:
1. Read `DESIGN.md` (the 15-section style guide).
2. Read `docs/02-architecture.md` (system shape).
3. Read `apps/landing/lib/nowpayments.ts` (already-working invoice + IPN code; port verbatim).
4. Read `apps/landing/app/api/checkout/nowpayments/route.ts` and the webhook route.
5. Then run the fork procedure above.

The DESIGN.md tokens are the contract. The SaaS app should feel like the same product — the schematic from the landing IS the sequence-builder UI, just made interactive.
