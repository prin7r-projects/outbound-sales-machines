# 10 — Pitch Deck

> Ten slides. Each slide ≤ ~50 words. The HTML version at `pitch-deck.html` renders these with the Cadence brand identity.

## Slide 1 — Title
**Cadence**
The outbound sales machine for operators who measure.

> Multi-channel outbound — email, LinkedIn, voice — wired into one sequence with deliverability and reply triage built in.

## Slide 2 — The problem
**Outbound is broken at the infrastructure layer.**
- Domain reputation dies the moment a vendor changes IP pools.
- "Multi-channel" usually means three tools in three tabs.
- Reply triage stops scaling at 800 replies/week.
- Performance billing is opaque and unauditable.
- Customers call this a tooling problem. It's not. It's an *operations* problem.

## Slide 3 — The thesis
**Throughput, not pipeline.**
The unit of value is *qualified replies per dollar* — not "emails sent."
Operators who can measure throughput will pay for infrastructure that protects it.
Cadence is that infrastructure.

## Slide 4 — The product
**Three lanes. One thread. One control panel.**
- Email lane: warmed mailbox pools, persona-aware copy, adaptive throttling.
- LinkedIn lane: real warmed accounts, threaded with email.
- Voice lane: AI voicemail in your voice clone, human SDR within 60s on live answer.
- All sharing state. A reply on any lane pauses the others.

## Slide 5 — Why now
- LLMs make personalization 10x cheaper *if and only if* enrichment depth keeps up.
- 2024-25 deliverability incidents at every major vendor → market is shopping.
- Stablecoin settlement removes billing friction for international ops teams.
- The operator-built brand has earned trust capital that incumbents lost.

## Slide 6 — Traction (managed pilot)
**27 accounts. 90 days.**
- 6.4% median reply rate / ICP-1
- 98.7% inbox placement, post-warmup
- $4.20 cost per qualified reply
- Zero domains blacklisted
Numbers from rolling 30d, audited weekly.

## Slide 7 — Business model
**Three tiers. Productized prices. Paid in stablecoin.**
- Self-serve: $490 / mo / seat (Theo persona, PLG)
- Managed: $4,900 / mo + $80 / qualified meeting (Mira persona, sales-led)
- Enterprise: from $24,990 / quarter (procurement-gated, wire/ACH)

## Slide 8 — Why we win
- Deliverability layer is *part of the product*, not the customer's homework.
- Reply triage is a fork in the directed graph, not a manual labeling tax.
- Lead operator who runs your machine is the same person you onboarded with.
- Performance billing is itemized and auditable against the meeting log.
- Operators built it; the brand earns trust other vendors can't.

## Slide 9 — Plan to $5M ARR
- W2-W12: 22 customers, $36k MRR (90-day target).
- M3-M6: 75 customers, $180k MRR — second operator hires, second SDR pod.
- M6-M12: 200 customers, $480k MRR — Sequence Engine + control panel ship; Self-serve becomes 60% of MRR.
- M12-M18: $5M ARR run-rate; Enterprise pipeline > 12 active deals.
- No paid acquisition until M9. Distribution = operator content + earned podcast + dogfood.

## Slide 10 — The team / the ask
- Founder + lead operator (operator-led, no professional SDR hires until cohort needs > 80 reply/week of human triage).
- Wave 2 (this build): landing live, NOWPayments wired, 10 docs published.
- Next two waves: Sequence Engine (Bun + Hono + Postgres), Control Panel (Wasp / open-saas), Reply Triage classifier (Claude Haiku 4.5).
- Ask (Wave 2 ship target): 3 Self-serve + 1 Managed customer paid in 14 days.

---

## Notes

- The HTML version at `docs/pitch-deck.html` is a single self-contained file (no build step) styled with the Cadence brand identity.
- All numbers are sourced from the `docs/02-architecture.md` cohort definition or the `docs/07-sales-strategy.md` pricing table.
