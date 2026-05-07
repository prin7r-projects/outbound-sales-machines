# 04 — Pain Points

> Root-cause analysis of what current alternatives actually fail at — written from the perspective of the operator running outbound today.

## The five operator pains we exist to solve

### Pain 01 — Domain reputation is single-vendor risk
**Failure mode of incumbents.** Apollo, Outreach, Salesloft, Smartlead, Instantly all ship send infrastructure that the customer warms up themselves. When a vendor changes IP pools, throttles policies, or deprioritizes a domain, the customer's outbound goes to spam overnight — and they have no audit trail for *why*.

**Root cause.** No incumbent owns the SPF/DKIM/DMARC posture *across* domains because each customer is on a shared sending pool. When the pool degrades, the customer is collateral damage.

**Cadence fix.** We own the posture per pool, audit weekly, run a daily inbox-placement test from a control mailbox in each pool, and trip a circuit breaker before customer reputation tanks. The operator gets a real ledger of what was sent from where, and the placement curve is on the landing.

### Pain 02 — Reply triage doesn't scale past 3 SDRs
**Failure mode of incumbents.** A 5-person SDR team gets ~800 inbound replies per week. Apollo / Salesloft offer manual classification (you label each reply) and Outreach has a half-baked AI assist that classifies but doesn't *route* and doesn't pause the rest of the sequence.

**Root cause.** Reply triage in incumbents is a feature bolted to the inbox. It's not a fork in the directed graph of the run.

**Cadence fix.** The reply-gate stage in the schematic is the canonical example. A positive reply collapses *all three lanes* for that contact; an objection routes to a human SDR with a draft already written; not-now arms a 14-day re-engage node; hard-no triggers suppression. Triage happens in <90s by SLA, not by hope.

### Pain 03 — "Multi-channel" usually means three tools in three tabs
**Failure mode of incumbents.** Apollo + HeyReach + Twilio with a Zapier glue layer is the modal "multi-channel" stack. Threads don't merge across channels; a positive LinkedIn reply doesn't pause the email lane; voice dispositions never make it back to the email thread.

**Root cause.** Incumbent vendors specialize: email tools don't speak LinkedIn; LinkedIn tools don't speak voice; voice tools don't speak the rest. Integration is the customer's problem.

**Cadence fix.** Email, LinkedIn, and voice are three lanes in the same sequence engine, sharing thread state. A reply on lane B halts lanes A and B and routes to triage. The merged thread is what hits CRM.

### Pain 04 — "AI personalization" is a bullet on every slide and nobody can prove it works
**Failure mode of incumbents.** Every outbound vendor since 2024 has shipped "AI personalization" and lifted reply rates by ~0.2% on average. The first-touch email is now 50% slop, 50% cargo-culted "{first_name}, I noticed your company {achievement}…" templates.

**Root cause.** Personalization works only when the *enrichment depth* matches the message complexity. Most vendors enrich 3-5 fields (name, title, company size, industry, maybe a recent post) and ask the LLM to write a tailored message off that.

**Cadence fix.** The 14-field enrichment pass on every contact (firmographic + trigger event + fund vintage + LP commitments + tech stack + hiring signals + recent shipped products + hidden trigger events from public sources) gives the LLM enough surface to write a message that earns the 6.4% reply rate measured across the managed cohort. Vanity personalization is forbidden by the prompt template.

### Pain 05 — Performance billing is opaque and customers can't reconcile the invoice
**Failure mode of incumbents.** Agencies bill "per qualified meeting" but use proprietary qualification criteria. Customers can't audit. Disputes burn the relationship.

**Root cause.** "Qualified meeting" is a contractual term, not an engineering one. Without a shared schema for what counts, the metric becomes negotiable.

**Cadence fix.** Qualified meeting is defined in the contract and in the control panel: (i) calendar invite accepted by the prospect, (ii) prospect title within ICP definition, (iii) meeting actually happens (no-shows refund). Performance fee invoice ($80/qualified meeting) is itemized and reconcilable against the meeting log. The covenant is on the landing.

## Specific failures of named alternatives

| Alternative | What works | What fails |
|-------------|-----------|-----------|
| **Apollo.io** | Best-in-class data layer, decent sequence builder, good ICP filters. | Multi-channel is bolt-on; deliverability is the customer's problem; reply triage is manual; no human SDR pod. |
| **Outreach** | Enterprise-grade reporting, Salesforce sync, mature workflow engine. | Per-seat pricing punishes the very customers it claims to serve; AI features feel like 2024 retrofits; deliverability metric is hidden behind a tab nobody opens. |
| **Salesloft** | Strong cadence builder, decent reporting, good Salesforce integration. | Same multi-channel-is-three-tools problem; reply triage is a manual labeling tax; no real voice integration. |
| **Smartlead / Instantly** | Cheap, decent deliverability for the price, fast onboarding. | No LinkedIn, no voice, no reply triage beyond keyword filters; you still need 5 other tools. |
| **HeyReach** | Best LinkedIn-only outbound tool, real account warming, good limits respect. | Single channel; doesn't merge with email/voice; no reply triage. |
| **Outbound agencies (Memory, Belkins, Martal)** | Done-for-you motion, real human pod, OK deliverability if the pod is good. | Domain warmup ledger never shared; performance metrics are negotiable; can't audit; lock-in via contract not via product. |

## What customers say (qualitative, not quoted directly)

- "I switched from Apollo to Smartlead because Apollo's deliverability cratered. Six months later Smartlead's pool degraded and I switched again. Now I just want a vendor whose entire job is the deliverability layer."
- "We pay an agency $9k/mo and they refuse to show us how the warmup ledger looks. The reply rate goes up and down and they say 'it's the market.'"
- "I tried to build this in-house with Smartlead + HeyReach + Synthflow + a Zapier glue. Six months later I had a Frankenstack that nobody understood, and one of my mailboxes was on a Spamhaus list."

These pains map directly to the five sections on the landing.
