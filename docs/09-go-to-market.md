# 09 — Go-to-Market

> 90-day plan with weekly milestones and the launch sequence. Wave 2 covers the first 14 days end-to-end (landing live, first paid invoice).

## Phase 1 — Wave 2 (days 0-14)

| Week | Milestone | Owner | Status |
|------|-----------|-------|--------|
| W1 | Brand identity locked, DESIGN.md drafted | Chief of Design | done |
| W1 | Landing shipped at outbound-sales-machines.prin7r.com (HTTP 200, valid LE cert) | Wave 2 build agent | this PR |
| W1 | NOWPayments wired (checkout + IPN webhook), unpaid invoice test passes | Wave 2 build agent | this PR |
| W1 | 10 strategy/design docs published as Notion sub-pages | Wave 2 build agent | this PR |
| W2 | Founder writes first 3 LinkedIn posts (one per content pillar) | Founder | next 7 days |
| W2 | Lead operator dogfoods Saltrun on first internal outbound run (ICP = RevOps leads at Series B+ B2B SaaS) | Lead operator | scheduled |
| W2 | First paid Self-serve customer | Founder | target |

## Phase 2 — Foundation (days 15-30)

| Week | Milestone |
|------|-----------|
| W3 | Lead operator: first 5 onboarding-call slots opened on Cal.com |
| W3 | Founder: 3 LinkedIn posts/week cadence locked in |
| W3 | Press contractor lines up first 8 podcast pitches |
| W3 | Self-serve traffic-to-paid conversion baseline measured |
| W4 | First Managed customer onboarded |
| W4 | First weekly cohort report published (internal to managed customers; redacted version on LinkedIn) |
| W4 | Stretch: first earned podcast appearance |

## Phase 3 — Distribution (days 31-60)

| Week | Milestone |
|------|-----------|
| W5 | 3 Self-serve customers, 1 Managed customer (cumulative) |
| W5 | First Pavilion / RevOps Co-op presence — operator answers questions, no selling |
| W6 | First long-form essay published (Pillar 1: deliverability mechanics) |
| W6 | YC W26 batch outreach begins (Theo persona) |
| W7 | Press appearance #2 (target) |
| W7 | First Managed customer renewal decision |
| W8 | 8 Self-serve, 3 Managed (cumulative) |

## Phase 4 — Scale (days 61-90)

| Week | Milestone |
|------|-----------|
| W9 | First Enterprise discovery call |
| W9 | Founder ships YouTube screencast #1 (ICP build walkthrough) |
| W10 | Cohort data reaches statistical significance for ICP-1 reply-rate publication |
| W10 | First customer-published reply-rate testimonial (with cohort numbers) |
| W11 | Press appearance #3-4 (target) |
| W11 | 12 Self-serve, 5 Managed (cumulative) |
| W12 | Launch decision: Wave 3 scope (sequence engine + control panel build) |
| W13 | First Enterprise contract signed (target) |
| W13 | 15 Self-serve, 6 Managed, 1 Enterprise (target) |

## Launch sequence

### T-7 days (pre-launch)
- Founder posts a "we're starting something" teaser on LinkedIn — no link, just the throughput readout image and "soon."
- Lead operator quietly DMs 8 RevOps leads from prior network: "we've built something, want a 15-minute screen-share before we launch?"
- DESIGN.md and 10 docs reviewed by Chief of Design.

### T-1 day (deploy)
- Final landing build pushed to GitHub.
- `docker compose up -d` on storage-contabo.
- HTTPS + cert verified.
- NOWPayments unpaid-invoice test passes.
- Screenshots captured at 1440×900 + 390×844.

### T-0 (launch day)
- Founder publishes the launch LinkedIn post:
  > Outbound is a throughput problem.
  > Email, LinkedIn, and voice — one sequence, one metric.
  > Read the schematic: outbound-sales-machines.prin7r.com
  >
  > 6.4% reply rate / ICP-1
  > 98.7% inbox placement
  > $4.20 cost per qualified reply
  >
  > 27-account managed cohort. 90-day rolling. Auditable.
- Brand account reposts.
- Lead operator answers questions inline.
- Founder runs an AMA in #revops in Pavilion (if approved).

### T+1 to T+7
- 3 follow-up posts: pillar 1 (warmup mechanics), pillar 2 (cohort breakdown), pillar 3 (anti-feature manifesto).
- Founder responds to every comment within 4h.
- First Self-serve customer onboarded.
- Daily standup with lead operator on first paid runs.

## Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Deliverability incident during launch week | Medium | High | Lead operator on-call; circuit breakers tested; we will publicly post about an incident if one happens |
| Anti-persona signups overwhelming Self-serve | Medium | Medium | Rate-limiter and 14-day refund are the relief valves |
| First Managed customer churn at month 1 | Medium | High | Onboarding call is the earliest detection signal; we refund the month before we let it churn badly |
| Domain pool exhaustion at >10 Managed customers | Low | High | Pre-allocated 80 domains across 4 registrars; 21-day warmup means we add capacity 21 days before we need it |
| LinkedIn account suspension on outbound lane | Medium | Medium | Real warmed accounts; never bot-flagged greys; per-day caps respected |

## What success looks like at day 90

- 22 paying customers across all tiers
- $36,650 MRR + $2,400 performance fees
- 15-25 inbound demo requests/month with >70% sourced from operator content
- Cohort report published twice with real numbers
- Lead operator's calendar is the rate limit on growth; planning hire #2 (associate operator) by day 100
