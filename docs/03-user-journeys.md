# 03 — User Journeys

> Three journeys: discovery → first value → recurring use. Written from the operator's perspective; each step is a real fork the system handles.

## Journey 1 — Mira (Primary persona, RevOps lead, $4,900/mo Managed tier)

**Persona context.** RevOps lead at a Series B B2B SaaS, hit a 2-quarter dip in qualified meetings booked. Found Cadence via a LinkedIn post comparing managed-outbound shops. Asked her CRO for a 1-month pilot.

| Step | Stage | Surface | Action | Outcome |
|------|-------|---------|--------|---------|
| 01 | Discovery | LinkedIn post → landing | Lands on https://outbound-sales-machines.prin7r.com from a peer's recommendation; reads the throughput readout in the hero. | Mental commit: "98.7% inbox placement is the only number that matters." |
| 02 | Discovery | Landing — Sequence blueprint | Scrolls the schematic; sees the directed-graph treatment of email/LinkedIn/voice and the reply-gate stage. | Recognizes it as a real engineering layout, not a marketing diagram. Reads through the deliverability checklist. |
| 03 | Activation | Pricing → NOWPayments | Picks Managed at $4,900/mo, clicks "Book a managed run." Hosted invoice opens; she pays in USDC on Polygon (her ops budget already settles this way). | Invoice paid. Welcome email arrives in 2 minutes with a Cal.com link to her onboarding call. |
| 04 | Activation | 45-min onboarding call | Lead operator (the actual person who will run her machine) walks through ICP build. Mira hands over: target ICP-1 (VP Eng at 200-1000 person FinTech), 3 trigger events, anti-list of 14 incumbent vendor companies. | Operator confirms first-send target: 14 days from today. Three domain pools allocated and warmup started. |
| 05 | First value | Day 14 | First 250-contact send goes out across all three lanes simultaneously. | Mira gets a Slack-like daily digest at 09:00 local; sees first 3 replies queued in triage. |
| 06 | First value | Day 19 | First positive reply books a meeting; Cadence pauses other lanes for that contact and sends Mira a calendar invite. | Mira's CRO notices the meeting on her calendar. First conversation goes well. |
| 07 | Recurring use | Day 30 | Monthly retro call: cohort report shows 6.4% reply rate ICP-1, $4.20 cost per qualified reply, 11 meetings booked. Performance fee invoice ($880, 11×$80) issued separately via NOWPayments. | Mira renews. She also asks for a second ICP slice. |
| 08 | Recurring use | Day 60 | ICP-2 (VP Data at 500-2000 FinTech) added; Cadence allocates two more domain pools, warms them, ships first send 14 days later. | Throughput doubles within the month without a domain reputation hit. |

## Journey 2 — Theo (Secondary persona, founder/CEO, $490/mo Self-serve)

**Persona context.** Solo-founder of a 12-person early-stage B2B SaaS. Wants to test outbound without hiring. Lives on the LinkedIn / Slack DM / Notion stack.

| Step | Stage | Surface | Action | Outcome |
|------|-------|---------|--------|---------|
| 01 | Discovery | Operator newsletter → landing | Reads a writeup linking to the Cadence landing in a sales-ops newsletter ("Reply rate, not pipeline"). | Lands directly on the throughput readout. Reads the Channels matrix. |
| 02 | Discovery | Landing — covenant section | The "What we won't do" list addresses his exact fear (domain reputation tanking with vendor changes). | Closes 11 other tabs. Decides he wants Self-serve to learn before committing to Managed. |
| 03 | Activation | Pricing → NOWPayments | Picks Self-serve $490/mo; pays in USDT TRC-20. | Invoice paid, control-panel signup link emailed in 2 min. |
| 04 | Activation | Control panel — sequence builder | Builds his first sequence: ICP = "VP Sales at 30-150 person SaaS, ARR $5-50M". Drops in his own first-touch email template; the LLM rewrites it for variant testing. | First sequence saved; warmup status of his 3 mailboxes tracked in the deliverability dashboard. |
| 05 | First value | Day 7 | Warmup period mid-flight. Theo watches the placement metric climb 88% → 95.1% during week 1. | Confidence builds. He doesn't try to short-cut warmup. |
| 06 | First value | Day 22 | First positive reply. Theo replies manually from the triage UI. Books his first meeting. | First $30k ACV deal closes 6 weeks later. Theo writes a LinkedIn post about it without a referral link. |
| 07 | Recurring use | Day 60 | Theo upgrades to Managed because he has paying customers and no more time to run sequences himself. | Self-serve seat becomes shadow account; Managed pod takes over the same domain pool with no warmup reset. |

## Journey 3 — Sam (Anti-persona stress test, growth hacker, declined)

**Persona context.** Performance marketer who thinks Cadence is just another tool to spam-bomb 50k contacts/week.

| Step | Stage | Surface | Action | Outcome |
|------|-------|---------|--------|---------|
| 01 | Discovery | Twitter ad arbitrage post → landing | Lands on the page, scrolls fast, looks for a "max sends/day" stat. | Doesn't find it. Reads "98.7% inbox placement, audited weekly." Decides to skip the throughput stat. |
| 02 | Activation | Pricing → NOWPayments | Picks Self-serve, pays. Tries to import a 38,000-contact CSV on day 1. | Control-panel rate-limits to the warmup curve: 50 sends / day / mailbox during week 1. |
| 03 | Friction | Day 3 | Sam emails support asking to override the warmup limit. | Response: "We won't. The covenant is on the landing page. If you cancel within 14 days we'll refund." |
| 04 | Resolution | Day 5 | Sam cancels; refund issued. | Domain pool returns to the warmup curve clean; no reputation hit. |

> The anti-persona test is intentional. The brand voice and the rate-limiter together act as a self-selection filter. Cadence's economic model (CPQR) breaks if we let Sam onto the platform.

## What Wave 2 ships for these journeys

| Journey | Hero stage | Wave 2 status |
|---------|-----------|---------------|
| Mira (Managed) | Discovery + activation up through onboarding-call email | **Shipped** (landing + NOWPayments + email handoff) |
| Theo (Self-serve) | Discovery + payment | **Shipped (paid)**; control panel + sequence builder is next-wave scope |
| Sam (refund) | Refund flow exists in NOWPayments, suppression policy is documented | **Documented**, not yet automated end-to-end |
