# 06 — Sales Channels

> Channel mix and why each fits the audience profile in `docs/05-audience-profile.md`.

## Channel mix (90-day post-launch)

| Channel | Persona | Mix % | Owner | Status W2 |
|---------|---------|-------|-------|-----------|
| Founder/operator content (LinkedIn) | Mira + Theo | 30% | Founder + lead operator | shipped — see `docs/09-go-to-market.md` |
| Earned podcast / press (RevOps shows) | Mira | 20% | Founder + PR contractor | scheduled |
| Direct outbound to RevOps leads (using our own product) | Mira | 20% | Lead operator — dogfood lane | live |
| Community presence (Pavilion, RevOps Co-op, 30MPC) | Mira | 10% | Lead operator | live |
| YC / IndieHackers founder networks | Theo | 10% | Founder | live |
| Paid search (deliverability + outbound terms) | Mira | 5% | Marketing contractor | future wave |
| Referral / partnerships (Smartlead, HeyReach, Synthflow) | Mira + Theo | 5% | Founder | scheduled |

## Why each channel fits

### LinkedIn operator content (30%)
**Why it fits.** Both personas live in LinkedIn for personal brand or peer learning. RevOps leaders explicitly use LinkedIn for vendor evaluation — they read posts about deliverability incidents, run their own polls about reply rates, and trust other operators more than vendor pages.

**Format.** Founder ships 3 posts/week. Two are about real ops mechanics (deliverability incidents, warmup discipline, reply-rate cohort breakdowns), one is a customer-style "here's what we learned this week" with anonymized cohort numbers.

**No paid promotion** — LinkedIn organic only. The product's brand is "operators built it"; paid posts undercut that.

### Earned podcast / press (20%)
**Why it fits.** Mira reads ops newsletters and listens to one of three podcasts on commute (Outboundsquad, 30MPC, RevOps Co-op). One earned mention on any of these is worth ~3 weeks of organic LinkedIn.

**Format.** Founder pitches as a guest with a tight angle: "98.7% inbox placement, here's the audit ledger." No product pitch in the title. Show notes link to the landing.

**Process.** PR contractor lines up 8-12 pitches in the first 90 days; founder converts 2-3 to recordings.

### Direct outbound (using our own product) (20%)
**Why it fits.** Dogfooding the product on Cadence's own outbound is brand-credible and produces real reply-rate numbers we can publish.

**Format.** ICP-1 = "Head of RevOps at Series B+ B2B SaaS, NA + EU, last vendor change ≥6 months ago." First-touch refers to the prospect's own company's recent funding / hiring / product launch and ties to the deliverability pain. Three lanes (email + LinkedIn + voice).

**Constraint.** We do NOT outbound to companies whose CRO/RevOps lead is a personal friend, a current customer's competitor, or a peer the founder is in a private community with. Trust capital is finite.

### Community presence (10%)
**Why it fits.** Pavilion (Patrick Trammell's, formerly Sales Assembly) is the densest concentration of RevOps leaders in the world. RevOps Co-op and 30MPC's community are free / low-cost variants.

**Format.** Lead operator participates with answers, not asks. When asked "what tool would you use for X" they describe Cadence by what it does, not by name. The brand is "the operator who answered the warmup question well, btw they run a thing."

**Constraint.** No DMs to community members about the product unless they DM us first. The community trust is the asset.

### YC / IndieHackers (10%)
**Why it fits.** Theo persona lives here. YC alumni Slack and IndieHackers forums regularly compare outbound tools. Cadence's pricing structure (paid in stablecoin, no annual lock-in) is a unique fit for stage-pre-Series-A founders.

**Format.** Founder writes 1 post/month on IndieHackers about a specific outbound mechanic ("we ran 1,200 LinkedIn voice notes — here's what worked"). YC alumni Slack is direct DM only when invited.

### Paid search (5%, future)
**Why it fits.** Mira searches "outbound deliverability dashboard" and "smartlead alternative reply rate." High-intent search. Low volume, high CPC.

**Why we delay.** Paid search needs the landing to be conversion-tested at organic traffic first. Wave 2 isn't there yet. Starts in Wave 3 once the cohort numbers are proven at scale.

### Referral / partnerships (5%)
**Why it fits.** Smartlead and Instantly are infrastructure layers — they don't compete with Cadence (we sit on top of them). HeyReach is the LinkedIn lane. Synthflow is the voice lane. Each has a customer who would be a great Cadence customer but won't get there alone.

**Format.** Cross-link with explicit "we are not the same product" framing. No revenue share for Wave 2 — we revisit once the partnership volume is meaningful.

## What we will NOT use

- **Mass cold email blasts** for Cadence's own outbound. Hypocritical and brand-damaging.
- **Sponsored vendor "best of" listicles**. Pay-to-play eats the operator-built brand.
- **Twitter ads / Reddit ads / paid social**. Wrong audience, wrong intent.
- **"Free trial" offer language** — Self-serve is a 30-day pre-paid run, not a trial.
- **Affiliate / referral commissions** that reward lead volume over fit.

## Channel attribution & measurement

| Metric | Channel-level | Aggregate |
|--------|----------------|-----------|
| New paid customers | Self-reported source field at signup ("How did you hear?") + UTM tag fallback | tracked weekly |
| Demo-to-customer conversion | Per-channel | tracked monthly |
| Cost per acquired customer (CAC) | Approximate per channel — we don't optimize for it < 6 months in | tracked quarterly |
| Customer lifetime value (LTV) | Cohort-based, by source | tracked quarterly |

Self-reported source is more accurate than UTM tags for this audience. Mira and Theo both ignore tracked links in newsletters / LinkedIn posts.
