# 08 — Marketing Strategy

> Positioning, messaging hierarchy, content pillars. The hero copy in `apps/landing/app/page.tsx` is sourced from this doc.

## Positioning

**Statement.**
> For RevOps and GTM operators running outbound at scale, Cadence is a managed outbound machine that wires email, LinkedIn, and voice into a single sequence with deliverability and reply triage built in — unlike Apollo / Outreach / Salesloft, because the deliverability layer and the human SDR pod are part of the product, not the customer's homework.

**Category.** Multi-channel outbound, but reframed as "outbound infrastructure" — so the buyer's mental model is closer to "Cloudflare for outbound" than "an Apollo competitor."

**Why "infrastructure"?** Apollo / Outreach are tools that ship customers a sequence builder and call deliverability the customer's problem. Cadence treats deliverability as the product. The brand frame ("a throughput problem", "98.7% inbox placement, audited weekly", "domains are a finite resource") is the infrastructure framing.

## Messaging hierarchy

### H1 (the one number)
"Outbound is a throughput problem."

### H2 (what we do)
"The multi-channel outbound machine for operators who measure. Email, LinkedIn, and voice — one sequence, one accountability metric: reply rate by ICP segment."

### Headline support — the four numbers (instrument-panel hero readout)
- **6.4%** reply rate / ICP-1 (median across 27 managed accounts)
- **98.7%** inbox placement (post-warmup, 30-day)
- **14.2k** sends / week / seat (email + LinkedIn + voice combined)
- **$4.20** cost per qualified reply (incl. data, tooling, ops)

These four numbers are the brand. They appear on the landing, in every ops post on LinkedIn, in every podcast appearance.

### CTA hierarchy
1. **Primary** — "Start a run" → pricing → NOWPayments
2. **Secondary** — "See the blueprint" → schematic
3. **Tertiary** — "Email ops directly" → mailto

## Content pillars

### Pillar 1 — Deliverability mechanics
Posts, podcasts, and case studies about the SPF/DKIM/DMARC discipline, warmup curve, circuit-breaker pattern. Audience: Mira. Frequency: 1 post/week.

Examples:
- "Why we audit inbox placement weekly even when nothing's changed."
- "The 21-day warmup curve isn't religious — here's the bounce rate it actually buys you."
- "Three deliverability incidents in 2025 that nobody named publicly. Here's what we learned."

### Pillar 2 — Reply rate cohort breakdowns
Anonymized cohort numbers from the managed pod. Audience: both. Frequency: 1 post/2 weeks.

Examples:
- "27-account managed cohort, 90 days. Reply rates by ICP segment."
- "Seat-level reply variance — why one operator gets 8% and another 4%."
- "What happens to reply rate when you add a fourth channel? Spoiler: it drops."

### Pillar 3 — Anti-feature manifesto
Posts about what we won't do and why. Audience: both, especially anti-personas (filters them out). Frequency: 1 post/month.

Examples:
- "Why we don't sell Cadence to growth hackers."
- "We don't have a free trial. Here's why."
- "We turned down a $48k/year contract this week. Here's what happened."

### Pillar 4 — Operator interviews
Long-form interviews with RevOps leads about their actual outbound stack. Audience: Mira. Frequency: 1 every 6 weeks.

Examples:
- "How RevOps at [Series C SaaS] runs a 12-SDR outbound team."
- "From Apollo to Smartlead to Cadence: a deliverability post-mortem."

## Content distribution

| Format | Channel | Pillar fit |
|--------|---------|-----------|
| LinkedIn posts (operator voice) | LinkedIn organic | 1, 2, 3 |
| Podcast appearances (founder voice) | Outboundsquad / 30MPC / RevOps Co-op / RevGenius | 1, 2 |
| Long-form essays | Cadence blog (under `apps/landing/blog/`, future wave) | 1, 2, 4 |
| YouTube screencasts (operator voice, 5-12 min) | YouTube + LinkedIn | 1, 2 |
| Newsletters (third-party features) | Lenny's Newsletter, RevOps Co-op weekly, Pavilion News | 2, 4 |

## Visual identity application

Every piece of marketing carries:
- The signal-orange (#F26B1F) accent
- The throughput readout numerals in JetBrains Mono
- A hairline rule under the H1
- The 6-point line-graph logo
- No stock photography of laptops, hands at keyboards, or "diverse-team-pointing-at-laptop"

Posts about the system show the actual schematic (the directed-graph blueprint visual from the landing).

## Press strategy

| Tier | Outlet | Pitch angle |
|------|--------|-------------|
| Tier 1 | Lenny's Newsletter | "The shape of an outbound stack that actually scales." |
| Tier 1 | TechCrunch | not pitched until Series A — wrong stage |
| Tier 2 | First Round Review | "What we learned shipping outbound for 27 companies in 90 days." |
| Tier 2 | The Information | not pitched — Wave 2 isn't a story for them yet |
| Tier 3 | RevGenius / Pavilion newsletters | "27-account cohort numbers." |
| Tier 3 | Outboundsquad podcast | "Reply rate, not pipeline." |

## Defining success

| Metric | Day 90 |
|--------|--------|
| LinkedIn followers (founder + brand combined) | 4,500+ |
| Inbound site traffic (organic) | 2,800 sessions/month |
| Inbound demo requests | 18-25 |
| Self-reported source = "LinkedIn / community / podcast" | >70% of paid customers |
| Earned podcast appearances | 4-6 |

## What we will NOT do

- Sponsored "best of" listicles.
- Affiliate / pay-for-play features.
- "How AI is transforming outbound" think-pieces — we don't say "AI" in the H1 and we won't write think-pieces about it.
- Cohort numbers that aren't real. Every published number is from the managed cohort or labeled "projection."
- Promotional discount codes / countdown timers.
