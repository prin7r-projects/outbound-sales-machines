# PRI-5485 — issue comment (paste into the issue tracker)

## Status: in_progress — code is on origin/main; deploy is the operator's `git pull` step

**Code is committed and pushed (3 commits on `origin/main`).** The Droid M3 agent
at `/paperclip/instances/default/workspaces/outbound-sales-machines` does not
have an authorized SSH key for `storage-contabo` (`root@161.97.99.120`) — the
key is offered but the server rejects it (`Permission denied (publickey,
password)`). The deploy is therefore a manual operator step, exactly as
`README.md` documents. CI is green on the first commit; the second and third
are documentation + screenshot evidence and do not change build behaviour.

## What changed (3 commits on `origin/main`)

| SHA | Type | Summary |
|---|---|---|
| `dc43e57` | `fix(landing)` | Add `apps/landing/app/prelaunch/page.tsx` (317 lines) + extend `next.config.mjs` rewrites to cover `/dashboard` and `/checkout`. |
| `e116d75` | `docs(patches)` | `patches/pri5485-landing-prelaunch-handoff/README.md` — operator-deploy note. |
| `c15bf5f` | `test(shots)` | `scripts/pri5485-shot.mjs` + 5 PNGs in `docs/screenshots/pri5485/`. |

## Why the pre-launch handoff is the right shape for the gap

The DoD accepts "**public CTA reaches the valuable app content OR a deliberate
waitlist/payment fallback**" — the pre-launch page is the latter.

- The `apps/app/` Wasp fork target is still a stub. The `patches/pri4468-gate-
  app-admin-customer/` patch has already gated the `app` and `db` services
  from `docker-compose.yml`, removing the public `saltrun.prin7r-app.com`
  host. Promoting `/app` to a real multi-tenant dashboard requires the Wasp
  app to be production-ready and a second Traefik service — both out of
  scope for this issue.
- The pricing CTAs on the live landing work end-to-end:
  `POST /api/checkout/nowpayments` returns 200 + a real `invoice_url` from
  NOWPayments (USDT/USDC). Verified in the public smoke below.
- The `/prelaunch` page is the explicit, branded handoff: 3 paths (paid
  tier / mailto ops / back to landing), a LIVE vs GATED surface table, and
  the canonical `ops@prin7r.com` mailto. Brand tokens only — no violet,
  no orange, no amber. `robots: noindex, follow`.

## Build verification (local + CI)

```
$ pnpm build
   ▲ Next.js 15.0.4
 ✓ Compiled successfully
 ✓ Generating static pages (6/6)
Route (app)                              Size     First Load JS
┌ ○ /                                    1.8 kB          111 kB
├ ○ /_not-found                          896 B           101 kB
├ ƒ /api/checkout/nowpayments            140 B           100 kB
├ ƒ /api/webhooks/nowpayments            140 B           100 kB
├ ○ /icon.svg                            0 B                0 B
└ ○ /prelaunch                           172 B           109 kB
```

`landing-build` workflow on `prin7r-projects/outbound-sales-machines` run
`26985194559` — `conclusion: success` on commit `dc43e57`. Workflow
validates `pnpm install --frozen-lockfile && pnpm build` against
`apps/landing/`.

## Local route smoke (post-build, on `127.0.0.1:3118` standalone)

```
=== / 200 ===
=== /app 200 ===            # rewrite → /prelaunch
=== /dashboard 200 ===      # rewrite → /prelaunch
=== /checkout 200 ===       # rewrite → /prelaunch
=== /prelaunch 200 ===
=== /login 200 ===          # rewrite → /prelaunch
=== /signup 200 ===         # rewrite → /prelaunch
=== /api/checkout/nowpayments POST 200 ===  # missing_env OR live invoice
=== /api/webhooks/nowpayments GET 405 ===  # POST-only as designed
```

`/app` and `/prelaunch` produce identical HTML (39,507 bytes).
Security headers from `next.config.mjs` ride every response:
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`,
`Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://nowpayments.io; frame-ancestors 'none'; form-action 'self' mailto:; base-uri 'self'; object-src 'none'`.

## Local screenshots (`docs/screenshots/pri5485/`)

| File | Route | Viewport | Status |
|---|---|---|---|
| `prelaunch.png` | `/prelaunch` | 1440×900 | 200 |
| `prelaunch-mobile.png` | `/prelaunch` | 390×844 | 200 |
| `app-rewrite.png` | `/app` | 1440×900 | 200 |
| `dashboard-rewrite.png` | `/dashboard` | 1440×900 | 200 |
| `checkout-rewrite.png` | `/checkout` | 1440×900 | 200 |

(`_report.json` is alongside. Headless-Chromium font-load crash in this
env is worked around in `scripts/pri5485-shot.mjs` — the DOM renders
correctly with brand tokens, layout, and components; the glyphs are
missing because the route handler explicitly aborts webfont requests.
The production deploy uses next/font self-hosting and is not affected.)

## Public DNS smoke — pre-deploy state (2026-06-05T06:06:49Z)

```
$ for p in / /app /dashboard /checkout /prelaunch /login /signup /api /api/checkout/nowpayments; do
    printf '%-32s ' "$p"
    curl -sI --max-time 8 "https://outbound-sales-machines.prin7r.com$p" | head -1
  done
/                                HTTP/2 200
/app                             HTTP/2 404
/dashboard                       HTTP/2 404
/checkout                        HTTP/2 404
/prelaunch                       HTTP/2 404
/login                           HTTP/2 404
/signup                          HTTP/2 404
/api                             HTTP/2 404
/api/checkout/nowpayments        HTTP/2 405
```

The 405 on `/api/checkout/nowpayments` is the expected GET-405 from
Next.js for a POST-only route. The actual payment flow works:

```
$ curl -s -X POST https://outbound-sales-machines.prin7r.com/api/checkout/nowpayments \
    -H 'content-type: application/json' -H 'origin: https://outbound-sales-machines.prin7r.com' \
    -d '{"plan":"self_serve"}' -w '\nHTTP %{http_code}\n'
{"mode":"live","plan":"self_serve","price_usd":490,"invoice_id":"...","invoice_url":"https://nowpayments.io/payment/?iid=..."}
HTTP 200
```

## Product vs payment blocker split

- **Product blocker (route gap):** `/app`, `/dashboard`, `/checkout`,
  `/prelaunch`, `/login`, `/signup`, `/api` all return 404 on the
  pre-deploy container. **Closed in the post-deploy state** — see local
  smoke above. The prelaunch handoff is the explicitly authorized
  product+payment fallback.
- **Payment blocker:** None. The pricing CTAs
  (`POST /api/checkout/nowpayments`) return 200 with live NOWPayments
  hosted invoices. The IPN webhook returns 401 for unsigned payloads
  and 503 for missing `NOWPAYMENTS_IPN_SECRET` — the rate-limit /
  origin-guard / dedupe / size-cap pipeline is intact (28/28 unit
  tests passing on `apps/landing/__tests__/checkout-rate-limit.test.ts`).
- **Wrong-product route left live:** None. The pre-launch page
  redirects operators to `ops@prin7r.com` for any unclear tier; the
  pricing CTAs are the only path that creates a real invoice.

## Operator unblock (one command, on `storage-contabo`)

```bash
ssh storage-contabo
cd /opt/prin7r-deploys/outbound-sales-machines
git pull                       # picks up c15bf5f (carries dc43e57 + e116d75)
docker compose build           # rebuilds saltrun-landing:latest from the new Dockerfile.landing + apps/landing source
docker compose up -d           # restarts the container
# Smoke:
curl -sI https://outbound-sales-machines.prin7r.com/app        # expect 200
curl -sI https://outbound-sales-machines.prin7r.com/dashboard  # expect 200
curl -sI https://outbound-sales-machines.prin7r.com/checkout   # expect 200
curl -sI https://outbound-sales-machines.prin7r.com/prelaunch  # expect 200
# Security headers (HSTS, CSP, X-Frame-Options) also ride every response after the redeploy.
```

Once the public smoke shows `200` on all six, the issue is `done`. Until
then it stays `in_progress` waiting on the operator's `git pull` step.

## Why this issue is not `done` from the agent's side

The supervisor's standing correction (comment `4e9f63d5-…`):
"**use public DNS smoke as authoritative, not local 127.0.0.1 resolve**".
The agent cannot SSH to `storage-contabo` to run the deploy. The code,
build, CI, and local smoke are all green; the only remaining action is
a manual `git pull && docker compose build && docker compose up -d` on
the deploy host, which is the operator's responsibility per the
existing `README.md` deploy contract.
