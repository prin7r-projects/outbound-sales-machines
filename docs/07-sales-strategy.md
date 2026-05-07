# 07 — Sales Strategy

> Motion, pricing tiers, objection handling. The pricing copy in `apps/landing/app/page.tsx` is sourced from this doc.

## Motion: hybrid (PLG + sales-led)

| Tier | Motion | Buyer | Sales touch |
|------|--------|-------|-------------|
| Self-serve | Pure PLG — landing → NOWPayments → control panel | Theo (founder) | Zero. Email-only support 24h SLA. |
| Managed | Sales-led — landing → 45-min onboarding call → NOWPayments | Mira (RevOps lead) | Lead operator runs onboarding call; lead operator is the actual person who runs the customer's machine. No SE / AE handoff. |
| Enterprise | Sales-led — landing → email → 90-min discovery → custom proposal | Mira's CRO + procurement | Founder + lead operator on call. Wire/ACH alternative if stablecoin is blocked by procurement. |

**Why hybrid, not pure PLG.** The deliverability layer is genuinely an ops product, not a software product. A first-time outbound buyer who self-serves at $4,900/mo will fail without onboarding. We refuse to optimize for self-serve checkout if it produces a worse outcome.

**Why hybrid, not pure sales-led.** Theo persona explicitly distrusts sales calls — he wants to test the product without "talking to ops." Self-serve at $490/mo gives him a real first send within 14 days and lets him upgrade to Managed once he's ready.

## Pricing tiers

### Self-serve — $490 / month / seat

- 1 seat, 3 mailboxes, 1 LinkedIn account
- Up to 3,000 enriched contacts / month
- Sequence builder + reply triage UI
- Self-managed deliverability dashboard
- Email + chat support, 24h SLA

**CTA copy on landing.** "Pay $490 in stablecoin"

**Cancellation.** Anytime. Refund pro-rated within first 30 days; no refund after.

**Upgrade path.** Self-serve → Managed at any time. Domain pool, mailbox warmup, and ICP definitions migrate without reset.

### Managed — $4,900 / month + $80 / qualified meeting

- 5 seats, 25 mailboxes, 5 LinkedIn accounts
- Up to 30,000 enriched contacts / month
- Dedicated SDR pod (1 lead operator + 2 ops associates)
- Bring-your-own ICP or we build from scratch
- Weekly cohort report + monthly retro
- Performance fee: $80 per qualified meeting (defined: calendar invite accepted by prospect + prospect title within ICP definition + meeting actually happens — no-shows refund the fee)

**CTA copy on landing.** "Book a managed run"

**Cancellation.** Monthly. We honor a 14-day clean-out period for domain pool unwinding so the customer doesn't strand a half-warmed pool.

**Why $80 per qualified meeting.** Cohort data from the managed pilot suggests $80 = ~50% of the gross margin on a qualified meeting at our cost structure. Customers see it as fair (they pay for results, not promises) and we see it as a real performance metric, not a wedge.

### Enterprise — from $24,990 / quarter

- Custom seat / mailbox / contact volume
- Dedicated infra (private domains, isolated IPs)
- Custom ICP enrichment pipeline
- Priority human SDR pod (24/5)
- SOC 2 + DPA + custom retention
- Quarterly business review + roadmap input

**CTA copy on landing.** "Talk to ops" → mailto

**Why quarterly billing.** Procurement-gated buyers simplify accounting at quarterly cadence; it also gives us a cleaner cohort to measure retention.

## Objection handling

| Objection | Response |
|-----------|----------|
| "We tried Smartlead/Instantly and got blacklisted on 3 SPF pools." | "That's exactly why our pricing model is structured around the deliverability layer. We pay the warmup cost, not you. Audit ledger here. Ask for a 30-day refund if placement drops below 95%." |
| "Apollo is cheaper." | "Apollo is a data layer. Cadence is a managed run on top of a data layer. If you're not using a managed pod, Apollo is what we'd recommend you self-serve. We can integrate with Apollo as the data layer if you want — see the Self-serve tier." |
| "We can't pay in stablecoin." | "Enterprise tier wires/ACH. Self-serve and Managed don't, by design — we don't want to be a card-fraud target. Crypto on-ramp is supported for the same dollar." |
| "What if our domain reputation tanks?" | "Pause the pool. We rotate. The circuit breaker trips at 2.0% bounce or 0.1% spam complaints. We've never had a customer leave the platform with a worse reputation than they arrived with — we'd refund the month before we let that happen." |
| "Is this just an agency in a wrapper?" | "It's an agency *and* a product. The lead operator who runs your machine uses the same control panel you'd use Self-serve. The product is the audit trail. Ask for a 15-minute screen-share of a real run." |
| "Can we white-label this for our customers?" | "No. The brand is the operators-built-it brand; we'd dilute it. We refer agencies to Smartlead's reseller program." |
| "What about GDPR / CASL / CCPA?" | "Outbound legality is the customer's responsibility. We provide the infrastructure to comply (suppression lists, opt-out flows, data retention controls) but we don't determine eligibility on the customer's behalf. DPA available at Enterprise tier." |
| "Do you do voice-only or LinkedIn-only?" | "No. The economics break — the deliverability layer is what makes the price work. If you want a single channel, use Smartlead (email) or HeyReach (LinkedIn) directly." |
| "Do you have a free trial?" | "No. We have a 30-day pre-paid Self-serve plan with a refund if placement drops below threshold. A 'free trial' on outbound infrastructure is a guaranteed deliverability disaster." |

## Discount policy

**Standard.** No discounts.

**Volume.** 10% off Managed if customer commits to 6 months pre-paid in stablecoin. 15% off if 12 months.

**Founder discount.** Theo persona at <$500k ARR can request a one-month half-price Self-serve trial. Manual approval, max 3 per quarter.

**No annual lock-in coupons.** We don't trade discounts for contracts. The customer should be able to leave anytime.

## Sales tooling

- **CRM.** HubSpot Free for now (zero seat-cost). Migrate to Salesforce only when Enterprise pipeline > 10 active deals.
- **Calendar.** Cal.com (operator-team, dedicated link per lead operator).
- **Quote-to-cash.** NOWPayments hosted invoice for Self-serve / Managed; PandaDoc + wire for Enterprise.
- **Forecasting.** Cohort-based, manual, weekly. No "AI sales forecasting" until ARR > $5M.

## Targets — first 90 days

| Metric | Day 30 | Day 60 | Day 90 |
|--------|--------|--------|--------|
| Self-serve customers | 3 | 8 | 15 |
| Managed customers | 1 | 3 | 6 |
| Enterprise customers | 0 | 0 | 1 |
| MRR | $5,890 | $19,820 | $36,650 |
| Performance-fee revenue | $0 | $640 | $2,400 |
| Refund rate | <10% | <10% | <8% |
