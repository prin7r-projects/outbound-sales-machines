# 05 — Audience Profile

> Two named personas, ideal-customer profile (ICP), and explicit anti-personas.

## Persona A — Mira (Primary)

| Field | Value |
|------|-------|
| Title | Head of RevOps / Senior Outbound Ops Manager |
| Age | 30-42 |
| Company stage | Series B+ B2B SaaS, $30-200M ARR |
| Geo | NA + EU |
| Team | Reports to CRO; owns 5-15 SDRs |
| Comp | $160-220k OTE |
| Tech literacy | Reads SQL, can scope a Zapier flow, knows what DKIM is |
| Goal | 4 qualified meetings / SDR / week at 28-32% sequence completion |
| Frustrations | Domain reputation tanking after vendor changes; AI personalization that doesn't lift reply rates; agencies that won't share their warmup ledger; Frankenstack across 8 tools |
| Lives in | Slack, Salesforce, deliverability dashboards, Sales Navigator, ops newsletters (Pavilion, RevOps Co-op, RevGenius) |
| Buying triggers | New CRO arrives, last quarter's pipeline missed, deliverability incident, vendor RFP cycle |
| Decision criteria | Reply rate, domains burned, time-to-first-send, performance-fee structure |
| Budget authority | $5-30k/month tooling without VP sign-off; $50k+ requires VP |

## Persona B — Theo (Secondary)

| Field | Value |
|------|-------|
| Title | Founder / CEO |
| Age | 28-40 |
| Company stage | Bootstrapped or seed/Series-A B2B SaaS, $0.5-5M ARR |
| Geo | Anywhere (Cadence is async-friendly) |
| Team | 8-30 person company, 0-2 SDRs (or none — Theo runs outbound himself) |
| Comp | $80-180k self-paid + equity |
| Tech literacy | Built a side project in TypeScript at some point; understands warmup discipline conceptually |
| Goal | Replace the agency he's about to hire with one operator + the machine |
| Frustrations | Agencies that won't show the warmup ledger; tools that promise 10x pipeline but bury the placement metric; can't afford 6 vendor licenses on his stage |
| Lives in | LinkedIn (personal brand), Slack DMs with fractional CRO, Notion for OKRs, 6am email triage |
| Buying triggers | Just closed a round, CAC ratio degrading, can't cold-email anymore (his own domain reputation is dead) |
| Decision criteria | Time-to-first-deal, "is this magic or is this an agency"-test, can-I-cancel-anytime |
| Budget authority | Full discretion under $5k/mo; partner/board check above |

## ICP — Ideal Customer Profile

**Cadence is the right product when:**
- Company sells B2B SaaS at $20k-$300k ACV.
- Company has at least one in-house GTM operator (RevOps lead, founder, or fractional CRO) — i.e., someone who can read a cohort report.
- Outbound is a meaningful pipeline source (>15% of new ARR) — not the only one, not zero.
- Customer values deliverability over send volume.
- Customer can settle in stablecoin or via traditional invoice (Enterprise tier only).

**Cadence is wrong when:**
- Customer wants to send 50k+ emails/week with no warmup discipline.
- Customer's product is consumer or low-ACV (<$5k) — outbound economics don't work.
- Customer has no GTM operator and won't hire one — the machine still needs an owner.

## Anti-personas

### Anti-persona 1 — "The growth hacker"
- Wants to spam-bomb 50k contacts/week.
- Will try to override the warmup limiter on day 1.
- Cancels and complains when we won't.
- We refund and move on. (See Journey 3 in `docs/03-user-journeys.md`.)

### Anti-persona 2 — "The agency-resseller"
- Wants to white-label Cadence and resell to 15 of their own clients.
- Won't share end-customer ICP details, which breaks our 14-field enrichment.
- We don't sell to resellers. The Enterprise tier requires a single named end-customer.

### Anti-persona 3 — "The procurement-gated F500"
- Can't pay in stablecoin, requires net-90 invoice + DPA + SOC 2 Type II + a 6-week security review.
- Lovely customers in theory; not in Wave 2 scope. We refer them to incumbents and revisit at Series B revenue.

### Anti-persona 4 — "The 'just need data' buyer"
- Doesn't want sequencing; just wants the enriched contact list.
- We don't sell our enrichment as a standalone product.
- Refer them to Apollo / Clay / ZoomInfo.

## Distribution implications

| Persona | Where we find them | Where we don't |
|---------|---------------------|----------------|
| Mira | Pavilion (RevOps community), LinkedIn posts about deliverability, RevOps Co-op, podcast appearances on RevGenius / Outboundsquad / 30MPC | Twitter ads, "growth hacker" newsletters |
| Theo | YC alumni networks, LinkedIn posts about his product / company milestones, micro-podcasts about bootstrapped SaaS, IndieHackers | Generic founder newsletters, paid Google search |

This shapes the Wave 2 distribution priorities in `docs/06-sales-channels.md`.
