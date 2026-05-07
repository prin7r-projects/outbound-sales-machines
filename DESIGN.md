# DESIGN.md — Cadence

> Canonical design + style guide for `outbound-sales-machines` (brand: **Cadence**).
> Owned by Chief of Design. Kept in sync with `apps/landing/` — any landing-page change updates this file in the same commit.

The visual identity is sourced from [`docs/01-brand-identity.md`](docs/01-brand-identity.md). This document is the implementation-facing translation of that identity into tokens, components, layout rules, and verification artifacts.

---

## 1. Product and audience

**Product** — Cadence is a multi-channel outbound sales machine. Email, LinkedIn, and voice run as one sequence, with deliverability infrastructure and reply triage built into the product. Sold in three tiers: Self-serve PLG ($490/mo/seat), Managed (sales-led, $4,900/mo + $80/qualified meeting), Enterprise (procurement-gated, from $24,990/quarter). The product is the audit trail — the deliverability ledger and reply rate per ICP segment.

**Audience** —
- **Mira, the RevOps lead**: 30-42, Series B+ B2B SaaS, owns 5-15 SDRs. Reads SQL, knows what DKIM is. Frustrated by domain reputation tanking after vendor changes and the 12-tab Frankenstack. Buying triggers: new CRO, deliverability incident, vendor RFP cycle.
- **Theo, the founder/CEO**: 28-40, bootstrapped or seed/Series-A B2B SaaS at $0.5-5M ARR. Wants to replace the agency he's about to hire with one operator + the machine. Distrusts sales calls.
- **Anti-personas**: growth hackers wanting to spam-bomb 50k contacts/week; agency-resellers; procurement-gated F500 buyers; "just need data" buyers.

The landing is written for Mira and Theo. Voice is throughput-obsessed, instrumented, anti-fluff — operator-built, not marketing.

## 2. Visual positioning

A throughput readout dressed as an industrial control panel.

- **Anchor reference points** — Klaviyo's confident brand (operator-credible), Bombora's tooling-first dryness, Mercury / Ramp's operator-not-founder voice, real industrial blueprints, the Linotype safety-orange / black palette of switchgear panels, the deliberate JetBrains-Mono-as-label tell that says "an SRE made this."
- **Avoided reference points** — outbound-dashboard purple, aggressive sales-bro red, Apollo-style mint-and-violet, glassmorphism, generic "10x your pipeline" copy, fake testimonial carousels, gradient hero backgrounds.
- **Felt sense** — opening a service-ledger binder on a mechanical workbench. Deep graphite background, a single safety-orange rule, JetBrains Mono labels on every instrument tag, the throughput readout as the hero. No glow effects, no gradients beyond the 4% grid tone.
- **Anti-features in the visual identity** — gradients beyond the subtle grid, neon, glassmorphism, drop shadows beyond hairlines, stock photography of "diverse-team-pointing-at-laptop," emojis in product copy, "AI-powered" in the H1.

## 3. ShadCN baseline and local component policy

**Baseline.** This repo follows the Prin7r Component Library Baseline (ShadCN-first). Default base for any future SaaS surface in `apps/app/` is shadcn/ui — install via `pnpm dlx shadcn@latest add <component>`, vendor the source into the project so we own and review every primitive.

**Current state — Wave 2 batch landing.** `apps/landing/` is intentionally hand-coded (no shadcn imports yet) because the industrial-blueprint aesthetic is carried by typography, hairlines, square-edged plates, and a tightly-disciplined two-color accent system (signal-orange + amber + verdigris) — every shadcn variant we would import would need to be re-skinned to remove its default rounded corners and soft shadows. The hand-rolled components below (`btn`, `plate`, `node`, `pulse-dot`, `frame-corners`) are all flat, square-edged, and one rule width.

**Documented exception.** Until `apps/app/` ships, the landing does NOT import from `@/components/ui` — there is no `components/ui` directory. Reviewers should expect the next pass (sequence builder, reply triage UI, deliverability dashboard) to introduce shadcn primitives (Button, Input, Dialog, Card, Tabs, Sheet, Toast) re-themed to the tokens in section 4.

**Forbidden.** Paid/pro libraries without CEO approval. Component libraries that conflict with ShadCN conventions. Marketing-page kits that drag in animation libraries beyond what's already in `globals.css`.

## 4. Color tokens

Single source of truth: `apps/landing/tailwind.config.ts` and `apps/landing/app/globals.css`. Twelve-token industrial palette; intentionally not a SaaS-dashboard palette.

| Role | Token | Hex | Used for |
|------|-------|-----|---------|
| Surface (default) | `graphite` | `#0E1014` | Page background — deep instrument-panel near-black |
| Surface (raised) | `steel` | `#19222B` | Cards, plates, instrument frames |
| Surface (recessed) | `plate` | `#0B0D11` | Schematic backgrounds, code panels |
| Border (default) | `hairline` | `#3A4651` | Hairline borders, dotted connectors |
| Border (deep) | `rivet` | `#2A3540` | Card inner shadows, recessed plates |
| Text (primary) | `bone` | `#E7E2D7` | Body type, primary headings (warm-toned light) |
| Text (secondary) | `chalk` | `#C2BCAD` | Secondary body, muted prose |
| Text (tertiary) | `slate` | `#7E8590` | Captions, metadata, mono labels |
| Accent (primary) | `signal` | `#F26B1F` | Safety-orange — every CTA, every accent rule, "live" indicator |
| Accent (secondary) | `amber` | `#F4B53F` | LinkedIn lane in the schematic, secondary highlights |
| Accent (tertiary) | `verdigris` | `#3B8E8E` | Voice lane in the schematic, restful contrast |
| Accent (alert) | `hot` | `#FF3B30` | Hard-no replies in triage, error states |

**Contrast.** Foreground/background pairs meet WCAG AA: bone-on-graphite ~14.6:1, chalk-on-graphite ~10.1:1, slate-on-graphite ~5.0:1, signal-on-graphite ~5.6:1 (used at ≥14px), bone-on-steel ~10.4:1.

**Forbidden combinations.** `slate` on `plate` (too low contrast at small sizes), `signal` text on `amber` background, `hot` on `verdigris` (color-blind unfriendly).

## 5. Typography

Three families. No fourth font.

| Role | Family | Weights | Used at | Reason |
|------|--------|---------|---------|--------|
| Display | **Space Grotesk** | 400, 500, 700 | Hero 48-100px, sections 36-52px, throughput readouts 30-48px | Geometric sans with mechanical character (squared `s`, geometric `g`); CAD-adjacent without becoming cartoonish. |
| Body | **Inter** | 400, 500, 600, 700 | Body 14-22px, UI 14px | Neutral high-legibility; pairs cleanly with Space Grotesk. |
| Mono | **JetBrains Mono** | 400, 500, 700 | Labels 10-12px caps, throughput numerals, button text, schematic node copy | The brand's tell: the mono used by SREs, used here as a *label font* — signals "operators built this." |

Loaded from Google Fonts in `globals.css` with `display=swap`. The pairing rationale is in [`docs/01-brand-identity.md`](docs/01-brand-identity.md): geometric display + neutral sans body + SRE-mono labels is the industrial-tooling pairing (cf. Klaviyo, Mercury, Cloudflare's tooling pages). Deliberately *not* the all-Inter SaaS-dashboard aesthetic.

**Type scale (display).** 18 / 22 / 26 / 30 / 36 / 40 / 44 / 52 / 64 / 80 / 100 px. **Body scale.** 11 / 12 / 13 / 14 / 15 / 17 / 19 / 22 px. **Letter-spacing.** Display tightens by `-0.02em`; mono labels open to `0.16-0.18em` for caps.

## 6. Spacing, radius, shadows, and borders

- **Base unit** — 4px.
- **Spacing scale** — `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56 / 80 / 120` (slightly tighter than Tailwind defaults; the page reads as instrument-panel layout, not SaaS-padded).
- **Radius** — `0` for cards, plates, buttons, schematic nodes. `2px` reserved for inputs (none on landing). No pill badges. Square-edged like a switchgear panel.
- **Shadows** — none. Depth is created by the steel/plate/graphite layering and the hairline borders, not by drop shadows. Glassmorphism, neumorphism, and gradients beyond the 4% grid tone are forbidden.
- **Borders** — 1px hairlines at `var(--hairline) #3A4651` for all card edges; 1.5-2px `var(--signal)` accent rules for masthead breaks and section accents. The `frame-corners` decorator adds 14px L-shaped corners in `var(--signal)` to top-left and bottom-right of "instrument panel" plates (used on Hero readout and Schematic).

## 7. Layout system and responsive rules

- **Container.** `max-w-prose = 1240px`, 40-80px gutters at desktop, 24px at mobile. The landing uses `mx-auto max-w-prose px-6 md:px-10` consistently.
- **Grid.** 12-column conceptually; most sections are 1 / 2 / 3 / 4-column flex+grid combinations. Pricing is `md:grid-cols-3`. Channel matrix is `md:grid-cols-3`. Schematic stages are `md:grid-cols-3` or `md:grid-cols-4`. Deliverability proof is `md:grid-cols-12` with 5/7 split.
- **Breakpoints.** Mobile-first; `sm 640`, `md 768`, `lg 1024`, `xl 1280`. Tested at 320 / 390 / 768 / 1024 / 1440.
- **Vertical rhythm.** Sections separated by `border-b border-hairline`. Section padding `py-20` (80px) at desktop, narrower hero/CTA at `py-16-24`.
- **Reading width.** Long-form prose capped at `max-w-2xl` (672px) so dense paragraphs don't sprawl across the panel.

## 8. Component catalog

All components are local (in `apps/landing/app/page.tsx`) until shadcn primitives land in `apps/app/`. Each has an explicit hover/focus state.

| Component | Where defined | Notes |
|-----------|---------------|-------|
| `Logo` | `page.tsx` Masthead | Inline SVG of a 6-point line graph in safety-orange + Space Grotesk wordmark + JetBrains Mono subtitle. The brand's signature. |
| `.btn` | `globals.css` | Square-edged, signal-orange fill, JetBrains Mono uppercase 12.5px. Hover lightens to `#ff7d35`. Focus ring is 2px signal-orange offset 3px (always visible). |
| `.btn-ghost` | `globals.css` | Transparent + hairline border, bone text. Hover swaps to steel background + bone border. Used as secondary CTA. |
| `.btn-secondary` | `globals.css` | Steel fill + hairline border. Used for non-highlighted pricing tier CTAs. |
| `Readout` | `page.tsx` Hero | Display Bold 40-44px numeral + JetBrains Mono label below + optional chalk italic sub. The hero's instrument-panel readout. |
| `SectionHeader` | `page.tsx` | Mono kicker + signal eyebrow + 1px hairline rule + display 36-52px title + 2px signal under-rule. |
| `.plate` | `globals.css` | Steel fill + hairline border. The default raised surface. |
| `.plate-2` | `globals.css` | Plate fill + hairline border. The recessed surface (used for nested code/schematic panels). |
| `.frame-corners` | `globals.css` | L-shaped 14px signal-orange corners at top-left and bottom-right. Used to mark "instrument panel" plates (Hero readout, Schematic). |
| `Node` (`.node`) | `page.tsx` + `globals.css` | Schematic block: graphite fill, hairline border, 4 rivet dots in corners. Tone variants: signal / amber / verdigris / ghost. |
| `BlueprintRow` | `page.tsx` | Stage row: left-aligned stage label, right-aligned spec label, then a row of nodes. |
| `Connector` (`.conn-v`) | `page.tsx` + `globals.css` | 1.5px dashed vertical line in hairline. Used between schematic stages. |
| `pulse-dot` | `globals.css` | 8×8 signal-orange square with a 1.8s pulse-ring around it. Only persistent animation on the page. |
| `label` | `globals.css` | JetBrains Mono 10.5px, 0.18em tracking, uppercase. Variants: `--signal` (orange), `--bone` (light), default (slate). |
| `TriageCard` | `page.tsx` | Plate with a label header, an inset plate-2 email-mock panel, and a 2-row classify/action grid. The reply-triage demo. |
| `PricingCta` | `app/pricing-cta.tsx` (client) | NOWPayments hosted-invoice trigger. POSTs to `/api/checkout/nowpayments`, redirects on success, surfaces a fallback message + mailto if 503/upstream error. |
| `Pricing tier card` | `page.tsx` | Plate with label + 40px Bold price + JetBrains Mono cadence + 2px signal rule + bullet list + full-width CTA at bottom. Highlighted tier swaps to signal border. |

**Accessibility for each.** Buttons inherit native focus ring (always visible at 2px signal offset 3px); the masthead `Logo` carries `aria-label="Cadence"`; SVG icons (`Arrow`, `Logo`) use `aria-hidden`; nav anchors are real `<a>` elements via `next/link`. Keyboard tab order: hero CTAs → masthead nav → channel matrix CTAs → pricing CTAs → footer links.

## 9. Landing page structure

`apps/landing/app/page.tsx` renders nine sections in order:

1. **Masthead** — Cadence logo + `/ Outbound Machines` mono subtitle + nav (`Channels / Blueprint / Deliverability / Pricing / Start a run`).
2. **Hero** — Pulse-dot kicker (`RUN.LIVE — Q2 2026 // Build #02-08`), 48-100px display headline (`Outbound is a throughput problem.`), 22px chalk lede, two CTAs (`Start a run` solid / `See the blueprint` ghost), throughput-readout instrument panel (4 KPIs), trust band (Smartlead / Instantly / HeyReach / Synthflow as rails).
3. **Channel matrix** — 3-column plate grid (Email / LinkedIn / Voice) with stat per channel.
4. **Sequence-as-blueprint** — directed-graph schematic with 4 stages (ICP → Execute → Reply Gate → Outcome), connectors between stages, framed in an instrument-panel plate-2 with rev-mark in the header.
5. **Deliverability proof** — 12-column split: 5/7. Left: prose intro + bar-chart of weekly inbox placement (92.4 → 98.7%). Right: deliverability checklist + bounce / complaint / blacklist stats.
6. **Reply triage demo** — 2-column plate grid showing two real triage cards: REPLY.POSITIVE (auto-booked) and REPLY.OBJECTION (drafted, held for human send).
7. **Pricing** — three-tier card grid (Self-serve $490/mo / Managed $4,900/mo / Enterprise $24,990/qtr) with NOWPayments crypto checkout CTA on Self-serve + Managed and `mailto:ops@prin7r.com` on Enterprise.
8. **Operator's Covenant** — 5-bullet anti-feature manifesto.
9. **Closer + Footer** — single-paragraph closing CTA, mailto, footer with logo, repo link, mono brand stamp.

**Copy origin.** Hero, channel matrix, deliverability proof, pricing, covenant, and closer copy are sourced from [`docs/08-marketing-strategy.md`](docs/08-marketing-strategy.md) and [`docs/07-sales-strategy.md`](docs/07-sales-strategy.md). No copy is generated; no Lorem ipsum; no `TODO` strings ship.

## 10. Imagery and generated asset rules

The landing intentionally ships **no raster imagery** — the visual identity is carried entirely by typography, hairlines, the schematic / blueprint, the throughput readout, and the safety-orange accent. `apps/landing/public/` contains `robots.txt` and (via `app/icon.svg`) the favicon (the 6-point line-graph logo).

**If we add imagery in a later pass.**
- Generated via `prin7r-generate-image` (GPT Image 2 backed) when an OpenAI Image-API key is available. Save under `apps/landing/public/generated/<filename>.png` with a sibling `<filename>.prompt.txt` recording the prompt + model + date.
- Allowed subjects: industrial control panels, blueprint engineering schematics in graphite + signal-orange, abstract geometric backgrounds in the brand palette, isometric line art of an outbound-machine diagram.
- Forbidden: stock photography of laptops, hands at keyboards, "diverse-team-pointing-at-laptop," gradient mesh backgrounds, glow effects, AI-generated dashboards.
- **Graceful fallback** — if the generator is unavailable, ship without imagery; do not block release. The current landing exemplifies this.

**Logo SVG** lives inline in `apps/landing/app/page.tsx` (`Logo` component) and as `apps/landing/app/icon.svg` for the favicon.

## 11. Motion and interaction rules

- **Principle** — A page should feel like an industrial control panel powering on. No springs, no bounce, no scroll-jacking, no parallax.
- **Easing** — `cubic-bezier(0.2, 0.6, 0.2, 1)` over 200-380ms for everything (hover transitions, hero reveal).
- **Hero reveal** — three-stage `type-reveal` keyframe on the kicker / headline / lede / buttons (380ms, staggered 0/120/240ms), once on first paint. No re-trigger on scroll.
- **Pulse dot** — 1.8s ease-out pulse-ring on the hero kicker dot; the dot itself stays solid, the ring scales from 0.6 to 1.6 with opacity fading 0.6 → 0. Only persistent animation on the page.
- **Hover** — buttons lighten fill (`#F26B1F` → `#ff7d35`); links gain a 1px dashed signal-orange underline; nav items shift from `chalk` to `bone`. No color-shift fades.
- **Focus** — explicit focus ring (`outline: 2px solid var(--signal); outline-offset: 3px`) on every button. Always visible. Native default ring preserved on links.
- **Reduced motion** — `@media (prefers-reduced-motion: reduce)` disables `type-reveal` and the pulse-ring, holding both at their final state. Implemented in `globals.css`.

## 12. Accessibility and quality gates

- **WCAG target** — AA. AAA where the type scale already gets us there (display bone-on-graphite).
- **Color contrast** — verified for every foreground/background pair in section 4.
- **Keyboard** — Tab cycles cleanly through hero CTAs → masthead nav → pricing CTAs → footer links. Focus is visible everywhere (explicit signal-orange ring on buttons; native default ring on links).
- **Alt text** — `Logo` is wrapped with `aria-label="Cadence"`; the `Arrow` glyph and the inline schematic SVG are `aria-hidden`. The `PlacementChart` bars carry `aria-label` per bar (e.g. `aria-label="Wk-6: 98.7% inbox placement"`). Decorative SVGs use `aria-hidden`.
- **Semantics** — `header > nav`, `main`, `section[id]` for in-page anchors, `footer`. Real `<a>` (via `next/link`), real `<h1>` / `<h2>` / `<h3>` hierarchy with no skipped levels.
- **Real copy** — no Lorem ipsum; no `TODO` strings; every quoted figure (6.4% / 98.7% / 14.2k / $4.20 / 0.34% / 0.04% / 32.1% / 11.4% / 92.4% / 95.1% / 96.8% / 97.9% / 98.4% / 98.7%) traces to the cohort definition in `docs/02-architecture.md` and the throughput readout policy in `docs/08-marketing-strategy.md`. The pricing numbers ($490 / $4,900 / $24,990 / $80) trace to `docs/07-sales-strategy.md`.
- **Production checks** — `curl -sI https://outbound-sales-machines.prin7r.com` returns HTTP/2 200 with valid Let's Encrypt cert; static HTML contains hero copy without client-side hydration.

**Verification cadence.** Before any landing-affecting commit lands on `main`: re-capture `docs/screenshots/landing-desktop.png` and `landing-mobile.png`, re-curl the deploy URL, verify keyboard tab cycle, lint, build.

## 13. Screenshots and verification artifacts

Captured from the live deploy at `https://outbound-sales-machines.prin7r.com` via Playwright (Chromium, `fullPage: true`) on 2026-05-08. Committed at full-page height — desktop and mobile both scroll.

| Surface | Viewport | Path |
|---------|----------|------|
| Landing — desktop | 1440 × 900 (`fullPage`) | [`docs/screenshots/landing-desktop.png`](docs/screenshots/landing-desktop.png) |
| Landing — mobile | 390 × 844 (`fullPage`) | [`docs/screenshots/landing-mobile.png`](docs/screenshots/landing-mobile.png) |

![Cadence landing — desktop, 1440×900](docs/screenshots/landing-desktop.png)

![Cadence landing — mobile, 390×844](docs/screenshots/landing-mobile.png)

Capture script: `scripts/capture-landing-screenshots.mjs` (Playwright Chromium, `device_scale_factor: 2`, `wait_until: networkidle`). Re-run after any landing-affecting change.

## 14. External references and library sources

- **Brand identity source-of-truth** — [`docs/01-brand-identity.md`](docs/01-brand-identity.md). All tokens here trace back to it.
- **Component baseline** — [Prin7r Component Library Baseline: ShadCN-first](https://www.notion.so/3563ceec261981c1a147c81bf3bd0566) (Notion, internal).
- **Refero Styles** — [styles.refero.design](https://styles.refero.design/) for cross-project DESIGN.md references when expanding `apps/app/`.
- **Industrial visual references** — Klaviyo's confident brand frame; Mercury / Ramp's operator voice; Bombora's tooling-first dryness; switchgear panel safety-orange + graphite palettes; CAD blueprint typography conventions.
- **Tooling references** — Smartlead / Instantly (email infrastructure rails); HeyReach (LinkedIn lane); Synthflow + Twilio (voice lane). Cadence sits on top of these, not against them.
- **shadcn/ui** — [ui.shadcn.com](https://ui.shadcn.com/) (used as the import path for `apps/app/` primitives once that surface starts).
- **Tailwind CSS 3.4** — [tailwindcss.com](https://tailwindcss.com/docs).
- **Next.js 15 App Router** — [nextjs.org/docs](https://nextjs.org/docs).
- **Space Grotesk / Inter / JetBrains Mono** — Google Fonts, loaded with `display=swap`.
- **Payment integration reference** — [`/Users/keer/projects/prin7r/payments-prototypes/`](../payments-prototypes/). NOWPayments invoice + IPN HMAC-SHA512 verification logic mirrors the prototype.

## 15. Changelog

| Date | Change | Reviewer |
|------|--------|----------|
| 2026-05-08 | Wave 2 build — DESIGN.md created with all 15 sections; landing shipped (9 sections); NOWPayments crypto checkout integration (`/api/checkout/nowpayments` route + Pricing CTAs + IPN webhook with HMAC-SHA512); 10 strategy/design docs published; pitch-deck.html shipped; brand identity locked (Cadence — graphite + signal-orange industrial blueprint). | Wave 2 build agent |
