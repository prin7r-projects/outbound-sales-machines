# 01 — Brand Identity

> Cadence is the outbound sales machine for operators who measure. Industrial, instrumented, blueprint-disciplined.

## Brand pyramid

| Layer | Value |
|------|-------|
| Essence | Throughput. |
| Personality | Industrial · Disciplined · Instrumented |
| Values | Reply rate before vanity. Domains are finite. Operators ship. |
| Attributes | Multi-channel · Deliverability-first · Persona-aware · Reply-triaged · Schematic |

## Positioning statement

> For RevOps and GTM operators running outbound at scale, Cadence is a managed outbound machine that wires email, LinkedIn, and voice into a single sequence with deliverability and reply triage built in — unlike Apollo / Outreach / Salesloft, because the deliverability layer and the human SDR pod are part of the product, not the customer's homework.

## Audience persona

**Primary — Mira, the RevOps lead.**
- Senior RevOps / outbound ops manager, 30-42, Series B+ B2B SaaS, NA / EU.
- Goal: hit 4 qualified meetings / SDR / week with a 28-32% sequence completion rate.
- Frustrations: domain reputation tanking after vendor changes, 12-tab Frankenstack across Apollo + Smartlead + Sales Navigator + Salesloft + Avoma + ZoomInfo + a custom voice script + a notes Notion + a Slack channel + a Gong queue + an inbox full of replies nobody read.
- Lives in: Slack, Salesforce / HubSpot, the deliverability dashboard of whoever they're using this quarter, LinkedIn Sales Navigator, ops tools roundup newsletters.

**Secondary — Theo, the founder/CEO.**
- Bootstrapped or seed/Series-A founder, 28-40. Selling $20-150k ACV B2B SaaS.
- Goal: kill the agency he hired, replace with one operator + the machine. Wants throughput he can read in one number.
- Frustrations: agencies that mysteriously can't show their domain warmup ledger; tools that promise 10x pipeline but bury the deliverability metric.
- Lives in: 6am email triage, Slack DMs with his fractional CRO, LinkedIn for personal branding, Notion for OKRs.

**Anti-personas.**
- "Growth hackers" looking to spam-bomb 50k contacts/week with no warmup discipline.
- Agencies that resell bulk outbound at margin with no domain hygiene.
- Buyers who measure success in "emails sent" rather than "qualified replies."

## Voice & tone

**Three do's.**
1. Treat the reader like an operator. Use the actual instrument names (SPF, DKIM, DMARC, IPN, ICP-1).
2. Lead with one number. Reply rate. Inbox placement. Cost per qualified reply. Never with "10x your pipeline."
3. Be willing to say "no" in the brand. The Operator's Covenant section on the landing is intentional.

**Three don'ts.**
1. No "AI-powered" filler. The customer knows it's AI; they don't need it in the H1.
2. No purple gradients, no glassmorphism, no testimonial carousel.
3. No fake urgency ("offer ends Friday"). The product sells itself on the throughput number.

**Sample sentence.**
> Most outbound stacks treat email, LinkedIn, and voice as three teams in three tools. Cadence treats them as one sequence with three executors.

## Visual system

### Color palette

| Role | Token | Hex | Used for |
|------|-------|-----|----------|
| Surface (default) | `graphite` | `#0E1014` | Page background — deep instrument-panel near-black |
| Surface (raised) | `steel` | `#19222B` | Cards, plates, instrument frames |
| Surface (recessed) | `plate` | `#0B0D11` | Schematic backgrounds, code panels |
| Surface (border) | `hairline` | `#3A4651` | All hairline borders, dotted connectors |
| Surface (deep border) | `rivet` | `#2A3540` | Card inner shadows, recessed plates |
| Text (primary) | `bone` | `#E7E2D7` | Body type, primary headings — warm-toned light, not cold white |
| Text (secondary) | `chalk` | `#C2BCAD` | Secondary body, muted prose |
| Text (tertiary) | `slate` | `#7E8590` | Captions, metadata, mono labels |
| Accent (primary) | `signal` | `#F26B1F` | Safety-orange — every CTA, every accent rule, every "live" indicator |
| Accent (secondary) | `amber` | `#F4B53F` | LinkedIn lane in the schematic, secondary highlights |
| Accent (tertiary) | `verdigris` | `#3B8E8E` | Voice lane in the schematic, restful contrast |
| Accent (alert) | `hot` | `#FF3B30` | Hard-no replies in triage, error states |

The palette is **graphite + safety-orange**. Steel-blue and rust were considered as alternates; the safety-orange variant won because it reads as actively dangerous (like a switchgear panel) while the steel-blue version reads passive. The brand should feel like real operators built it, not marketing.

### Typography pair

| Role | Family | Source | Used for |
|------|--------|--------|---------|
| Display | **Space Grotesk** (700) | Google Fonts | All headings, the throughput readout numerals, the schematic node titles |
| Body | **Inter** (400/500/600) | Google Fonts | Body prose, UI labels |
| Mono | **JetBrains Mono** (400/500/700) | Google Fonts | Every label / caption / instrument tag, all numerals on the schematic, every CTA button text |

Why this pairing: Space Grotesk has just enough mechanical character (the geometric `g`, the squared-off `s`) to feel CAD-adjacent without becoming cartoonish; Inter is the neutral high-legibility body that pairs with everything; JetBrains Mono is what an SRE actually has open in their editor — using it for *labels* (not just code) is the brand's tell that this product was built by people who measure.

### Logo concept

**Verbal description.** A six-point line graph rendered as a schematic — six dots connected by a sharp piecewise line that climbs, dips, climbs again. Reads as "throughput readout." Rendered in safety-orange (#F26B1F) on graphite. The wordmark "Cadence" sits to the right in Space Grotesk Bold, with "/ Outbound Machines" as the JetBrains Mono subtitle.

```
    •
   / \
  •   •
 /     \---•
•           \
             •
```

(See [`apps/landing/app/icon.svg`](../apps/landing/app/icon.svg) for the inline SVG.)

### Spacing scale

`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 80 / 120` — base unit 4px, slightly tighter than Tailwind defaults so the page feels like an instrument-panel layout rather than a SaaS dashboard.

### Radius

`0` for everything. Cards, buttons, inputs, plates — all square-edged. The only allowed radius is `2px` for inputs (on a future SaaS surface). Round corners would soften the brand the wrong way.

### Motion principles

- 380ms type-reveal on first paint of the hero. No re-trigger on scroll.
- 1.8s pulse-ring on the live indicator (only persistent animation on the page).
- 200ms ease on hover state transitions.
- `cubic-bezier(0.2, 0.6, 0.2, 1)` everywhere.
- No springs, no bounce, no parallax, no scroll-jacking.

## Forbidden

- Generic "10x your pipeline" copy.
- Testimonial carousels.
- "AI-powered" in the H1.
- Aggressive sales-bro red.
- Outbound-dashboard purple, mint-and-violet, glassmorphism, drop shadows beyond hairlines.
- Fake urgency, countdown timers, exit-intent popups.
- Hero stock photography (especially "diverse-team-pointing-at-laptop").
