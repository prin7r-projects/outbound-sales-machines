# 13 · Implementation plan

> **Hand-off ready.** Read `01`, `02`, `11`, `12` first. Phase 0 (landing + crypto checkout) is
> COMPLETE. Phases 1–6 ship the runtime.
>
> **Repo:** https://github.com/prin7r-projects/outbound-sales-machines
> **Live:** https://outbound-sales-machines.prin7r.com (landing live as Saltrun, dark canvas)
> **Deploy:** storage-contabo `/opt/prin7r-deploys/outbound-sales-machines`
> **Secrets:** NOWPAYMENTS_API_KEY, NOWPAYMENTS_IPN_SECRET, POSTMARK_SERVER_TOKEN,
> SMARTLEAD_API_KEY, HEYREACH_API_KEY, SYNTHFLOW_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
> CLOUDFLARE_API_TOKEN, ANTHROPIC_API_KEY, ZAI_API_KEY, DATABASE_URL, REDIS_URL, SLACK_WEBHOOK_URL.
> **Tone:** Saltrun. Industrial. Disciplined. Instrumented. Dark canvas (#0E1014). See
> `01-brand-identity.md` §Voice.

## Phase 0 — Wave 2 landing + checkout (DONE)

- ✅ Saltrun rebrand landed; dark canvas; revenue-grade-automation reference; NOWPayments invoice
  flow; screenshots in `/docs/screenshots/`.

## Phase 1 — Wasp scaffold + tenants + domains

- **Goal.** Stand up `apps/app` with multi-tenant model + DNS verification per domain.
- **Tasks.**
  1. Wasp scaffold; magic-link auth; tenants/users/roles.
  2. `/domains` page: customer adds domain; Cloudflare DNS verifier checks SPF/DKIM/DMARC; emits
     "warmup ready" event.
  3. Postgres row-level security on `tenant_id`.
- **Deps.** Phase 0; Cloudflare API token.
- **Effort.** 180 tool-uses, 9h.
- **DoD.**
  - Mira can sign up, attach a domain, see SPF/DKIM/DMARC verified within 30s.

## Phase 2 — Email lane + warmup ledger

- **Goal.** Email lane runs against Smartlead; warmup ledger tracks per-domain ramp.
- **Tasks.**
  1. Smartlead adapter: send, track delivery + bounces + opens.
  2. Warmup ledger: 40-day ramp curve; daily-cap enforcement; alerts on stall.
  3. Sequence engine v0: schedules sends per step; respects warmup caps.
- **Deps.** Phase 1; Smartlead account.
- **Effort.** 200 tool-uses, 10h.
- **DoD.**
  - Mira launches a 100-contact sequence with email-only steps; warmup advances; deliveries land.

## Phase 3 — LinkedIn lane + Voice lane

- **Goal.** Multi-channel: add LI (HeyReach) + voice (Synthflow + Twilio).
- **Tasks.**
  1. HeyReach adapter; per-LI-account daily caps.
  2. Synthflow + Twilio adapter; voice scripts per step; local-hour gate.
  3. Sequence builder UI: 6-step authoring across 3 channels.
- **Deps.** Phase 2.
- **Effort.** 200 tool-uses, 10h.
- **DoD.**
  - 6-step sequence runs across email + LI + voice; per-channel sends succeed.
  - Voice lane never fires outside 09:00–17:30 local.

## Phase 4 — Reply triage + LLM classifier + CRM round-trip

- **Goal.** Replies routed via LLM-classifier into hot/warm/cold/auto/oof; CRM upserts.
- **Tasks.**
  1. Inbound webhook from Smartlead (replies) + LI (replies).
  2. Classifier: Claude 4.7 + JSON-schema-validated output; GLM fallback.
  3. CRM upsert (Salesforce + HubSpot) with `meeting_requested`, `bucket`, `last_reply_at`.
  4. Slack ping on `hot`.
- **Deps.** Phase 2.
- **Effort.** 180 tool-uses, 9h.
- **DoD.**
  - Scenario B end-to-end: hot reply → Slack within 5 min + CRM row created.

## Phase 5 — Deliverability watcher + circuit-breakers + pod queue

- **Goal.** Auto-pause unhealthy lanes; managed-tier pod queue.
- **Tasks.**
  1. Deliverability watcher: bounce/complaint thresholds → circuit-breaker.
  2. Per-domain pause; per-channel kill-switch.
  3. Pod assignment: managed-tier customers auto-assigned to a pod operator.
  4. Pod queue UI for operator: domains in warmup intervention, sequences needing tuning.
- **Deps.** Phases 2–4.
- **Effort.** 150 tool-uses, 7h.
- **DoD.**
  - Scenario C end-to-end: bounce rate hits 3.2% → email lane paused within 60s.
  - Pod operator sees the queue ordered by sequence priority.

## Phase 6 — Throughput dashboard + tier billing + production polish

- **Goal.** Daily throughput email; tier flip; perf budgets.
- **Tasks.**
  1. Throughput dashboard + 06:00 daily summary email per tenant.
  2. Tier billing: Self-Serve $499/mo, Managed $2,990/mo via NOWPayments rebill.
  3. Lighthouse pass on `/`.
  4. Loki + Grafana; alerts wired.
- **Deps.** Phases 1–5.
- **Effort.** 150 tool-uses, 7h.
- **DoD.**
  - Mira's 06:00 email has reply rate, deliverability, sequence completion, qualified meetings.
  - Tier flip Scenario E end-to-end; no service interruption.

## Cross-cutting concerns

- **Accessibility:** WCAG AA on dashboard.
- **i18n:** EN-only Wave 2/3.
- **Mobile:** dashboard mobile-readable but desktop-first.
- **Telemetry:** Phase 1 logs; Phase 6 metrics + alerts.

## Risk register

| Risk | Owner | Mitigation |
|---|---|---|
| LinkedIn account restriction | Eng | Conservative daily caps; per-account circuit-breaker; Wave 4 LI multi-account pool. |
| Email vendor API breaks | Eng | Adapter pattern; Smartlead → Instantly fallback; CI tests against vendor sandboxes. |
| LLM-classifier drift | Eng + Ops | Per-tenant accuracy tracking; quarterly prompt re-tune; human spot-check. |
| Domain reputation tanking after onboarding | Ops | Mandatory 40-day warmup before send; warmup-ledger gate. |
| Multi-tenant data leak | Eng | RLS in Postgres; query-level checks; quarterly RLS audit. |

## Resume instructions

1. `git clone https://github.com/prin7r-projects/outbound-sales-machines && cd outbound-sales-machines`
2. Read `01`, `02`, `11`, `12`.
3. Pick the next phase whose DoD is unmet.
