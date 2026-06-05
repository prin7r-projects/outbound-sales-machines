# pri5485-landing-prelaunch-handoff

## Scope

In-landing pre-launch handoff surface for the GPT-5.5 2026-06-04 URL/app sweep
finding on `outbound-sales-machines.prin7r.com`. This patch is the
operator-deploy note for the code change that is already on `main`
(`dc43e57 fix(landing): add /prelaunch + extend rewrites to cover
/dashboard /checkout (PRI-5485)`).

This patch is **not** a `apply.sh`-style Docker/deploy rewrite — it is a
documentation patch. The code change itself is a normal in-app source change
(`apps/landing/app/prelaunch/page.tsx` + `apps/landing/next.config.mjs`),
which the existing deploy pipeline (`git pull && docker compose build
&& docker compose up -d` on `storage-contabo`) picks up automatically once
the operator runs the pull.

## What the code change does

1. **New page — `apps/landing/app/prelaunch/page.tsx`** (317 lines)
   Renders the deliberate pre-launch status page: three handoff paths
   (paid-tier CTA / email ops / back-to-landing), a LIVE vs GATED surface
   table, and a single mailto to `ops@prin7r.com`. Brand tokens only
   (graphite / steel / bone / slate / hairline / signal). No violet,
   no orange, no amber. `robots: noindex, follow` so the surface is
   not indexed. Identical layout language to the rest of the landing
   (system-ticker band, mono labels, frame corners).

2. **Extended rewrites — `apps/landing/next.config.mjs`**
   Adds `/dashboard → /prelaunch` and `/checkout → /prelaunch` to the
   existing `/app`, `/login`, `/signup → /prelaunch` rewrite list. The
   pricing section's checkout flow remains the live `POST
   /api/checkout/nowpayments → invoice_url` redirect; the public
   `/checkout` HTML path is the deliberate pre-launch handoff, not a
   hosted-invoice page (no public page ever existed for that).

## Why this is the right shape for the gap

The 2026-06-04 GPT-5.5 supervisor smoke showed:

- `/` 200 — landing is live.
- `/app`, `/dashboard`, `/checkout`, `/prelaunch`, `/login`, `/signup`, `/api` 404.
- `POST /api/checkout/nowpayments` 200 + live invoice URL — the actual
  payment flow is reachable from the pricing CTAs.

The DoD for this issue allows "**public CTA reaches the valuable app
content or a deliberate waitlist/payment fallback**" — and the
pre-launch page is exactly the latter. The `apps/app/` Wasp fork target
is still a stub; `patches/pri4468-gate-app-admin-customer/` has gated
its host from `docker-compose.yml`. Promoting `/app` to a real
multi-tenant dashboard requires (a) the Wasp app to be production-ready
and (b) the deploy host to gain a second Traefik service — both of
which are out of scope for this issue. The pre-launch handoff is the
explicitly authorized shape.

## Build verification (local, no deploy required)

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

The new `/prelaunch` page is statically generated (1st-load JS 109 kB,
172 B page-specific). The API routes remain `ƒ` (server-rendered on
demand). No regression to the existing landing.

## CI verification (post-push)

`landing-build` workflow on `prin7r-projects/outbound-sales-machines`
run `26985194559` — `conclusion: success` on commit `dc43e57`. The
workflow validates `pnpm install --frozen-lockfile && pnpm build`
against `apps/landing/`.

## Public DNS smoke (before the deploy)

The current live build is the `2fcd40b` container (no prelaunch
rewrites, no `/prelaunch` page). Public DNS smoke at the time of this
patch:

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
Next.js for a POST-only route. The actual payment flow:

```
$ curl -s -X POST https://outbound-sales-machines.prin7r.com/api/checkout/nowpayments \
    -H 'content-type: application/json' -H 'origin: https://outbound-sales-machines.prin7r.com' \
    -d '{"plan":"self_serve"}' -w '\nHTTP %{http_code}\n'
{"mode":"live","plan":"self_serve","price_usd":490,"invoice_id":"...","invoice_url":"https://nowpayments.io/payment/?iid=..."}
HTTP 200
```

Live NOWPayments invoice creation is wired and working.

## Operator unblock — required step

The commit is on `origin/main` (`dc43e57`), CI passed, local build
passed. The container running on `storage-contabo` (root@161.97.99.120)
is still the pre-`dc43e57` build and will not pick up the change
until the operator redeploys. Per `README.md` → "Production deploy":

```bash
ssh storage-contabo
cd /opt/prin7r-deploys/outbound-sales-machines
git pull                    # picks up dc43e57
docker compose build        # rebuilds the standalone image
docker compose up -d        # restarts the saltrun-landing container
curl -sI https://outbound-sales-machines.prin7r.com/app   # expect 200
curl -sI https://outbound-sales-machines.prin7r.com/dashboard   # expect 200
curl -sI https://outbound-sales-machines.prin7r.com/checkout    # expect 200
curl -sI https://outbound-sales-machines.prin7r.com/prelaunch   # expect 200
```

After the redeploy, public DNS smoke should match the local build:

```
$ for p in / /app /dashboard /checkout /prelaunch /login /signup; do
    printf '%-15s ' "$p"
    curl -sI --max-time 8 "https://outbound-sales-machines.prin7r.com$p" | head -1
  done
/               HTTP/2 200
/app            HTTP/2 200
/dashboard      HTTP/2 200
/checkout       HTTP/2 200
/prelaunch      HTTP/2 200
/login          HTTP/2 200
/signup         HTTP/2 200
```

The deployed container will also pick up the security headers (HSTS,
CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) that
`apps/landing/next.config.mjs` declares in the same commit, since the
`2fcd40b` container's `next.config.mjs` did not have them.

## Why the deploy could not be triggered from this heartbeat

The Droid M3 agent at `/paperclip/instances/default/workspaces/
outbound-sales-machines` does not have an authorized SSH key for
`storage-contabo` (`/paperclip/.ssh/prin7r_vps_ed25519` is offered
but the server rejects it — `Permission denied (publickey,password)`).
The deploy is therefore a manual operator step, exactly as `README.md`
documents. The code change is in the repo and will be picked up the
next time the operator pulls.

## Why this is not a `apply.sh` patch

`patches/<id>/apply.sh` is the convention in this repo for Docker /
`docker-compose.yml` rewrites (per `AGENTS.md` — "Do not directly edit
Dockerfile or docker-compose. Any Docker/deploy change must be
delivered only as `patches/<patch-id>/README.md` plus `apply.*`").
This change touches only `apps/landing/app/prelaunch/page.tsx` and
`apps/landing/next.config.mjs` — in-app source files, not
Docker/deploy. They are committed through the normal git path; no
`apply.sh` is needed.

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-06-04 | Documentation patch for the in-app pre-launch handoff. Code is on `origin/main` (commit `dc43e57`); operator redeploy on `storage-contabo` will pick it up. Tracks PRI-5485. | Droid M3 Engineer |
