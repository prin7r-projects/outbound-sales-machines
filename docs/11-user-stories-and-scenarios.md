# 11 · User stories and scenarios

> Saltrun is the outbound sales machine for operators who measure. Multi-channel email + LinkedIn
> + voice with deliverability + reply triage built in. Sold as managed service + SaaS tiers.

## 1. Personas summary

- **Mira, 30–42, RevOps lead at Series B+ B2B SaaS.** Wants 4 qualified meetings / SDR / week +
  28–32% sequence completion. Frustrated by 12-tab Frankenstack across Apollo / Smartlead / Sales
  Nav / Salesloft / Avoma / ZoomInfo / etc. — see `05-audience-profile.md` §Mira.
- **Theo, 28–40, founder/CEO of seed/Series-A B2B SaaS.** Wants to kill the agency he hired and
  replace with one operator + the machine. Reads dashboards in throughput numbers. — see
  `05-audience-profile.md` §Theo.
- **Saltrun pod operator (internal).** Manages domain warmup + reply triage + sequence tuning for
  a portfolio of customer accounts in the managed-service tier.

## 2. Primary user stories (12)

1. **As Mira**, I want to import an ICP (CSV or Apollo URL), so that the system seeds the sequence
   without me hand-uploading every contact.
2. **As Mira**, I want a single deliverability dashboard with SPF/DKIM/DMARC/warmup status across
   all sending domains, so that domain reputation is one panel away.
3. **As Mira**, I want to author a 6-step sequence with email + LinkedIn + voice steps in one
   builder, so that I'm not coordinating across three tools.
4. **As Mira**, I want sequence pause / circuit-breaker triggered automatically on
   deliverability degradation (bounce > 3%, complaint > 0.1%), so that one bad batch doesn't
   destroy domain reputation.
5. **As Mira**, I want the LLM-classifier to triage replies into `hot/warm/cold/auto-reply/oof`
   buckets, so that I only manually review the hot pile.
6. **As Mira**, I want a daily throughput email (sequence completion rate, qualified meetings,
   reply rate, deliverability) at 06:00 local, so that I get one number to take into standup.
7. **As Theo**, I want to switch between Self-Serve ($499/mo) and Managed ($2,990/mo) tiers from
   billing without re-onboarding, so that I don't restart implementation when I outgrow Self-Serve.
8. **As Theo**, I want a managed pod (operator + system) that handles deliverability + reply
   triage + sequence tuning, so that I can fire the agency.
9. **As Mira**, I want every sequence change versioned + diffable, so that I can A/B with
   statistical confidence.
10. **As Saltrun pod operator**, I want a queue of "domains needing warmup intervention" sorted by
    sequence priority, so that I can act on highest-impact first.
11. **As Saltrun pod operator**, I want a kill-switch per customer per channel, so that I can stop
    a single customer's email lane without affecting LinkedIn or voice.
12. **As Mira**, I want CRM round-trip: contacts pushed to Salesforce/HubSpot, replies pulled to
    show context, so that the SDRs use Salesforce and not a fourth tool.

## 3. Main scenarios (happy paths)

### Scenario A — Mira onboards Saltrun, ships her first sequence

1. **Trigger.** Mira fires the agency on Friday; signs up for Saltrun Self-Serve Sunday.
2. **Steps.**
   1. Sign up; attaches 3 sending domains; Saltrun verifies SPF/DKIM/DMARC.
   2. Triggers warmup playbook (40-day ramp).
   3. Imports ICP from Apollo URL (1,200 contacts).
   4. Builds a 6-step sequence in the builder: Day 1 email, Day 3 LI connect, Day 7 email, Day 14
      voice, Day 17 LI message, Day 21 email "breakup."
   5. Hits "Launch." Sequence cron starts at 09:00 local; throttled to warmup-permitted volume.
   6. Daily 06:00 email summarizes: sent / replied / bounced / qualified.
3. **Success criteria.** Sequence runs without circuit-breaker firing; warmup advances; first
   qualified reply by day 4.

### Scenario B — Reply triage routes a hot reply to Mira's inbox

1. **Trigger.** Prospect replies "interested, can we chat Thursday?"
2. **Steps.** LLM-classifier returns `hot`. Reply routed to Mira's hot bucket + Slack ping. CRM
   row created in Salesforce with `meeting_requested = true`.
3. **Success criteria.** Mira sees the hot reply within 5 min of receipt; sequence on that contact
   pauses.

### Scenario C — Circuit-breaker pauses a sequence on deliverability degradation

1. **Trigger.** Bounce rate on `mira-co.com` hits 3.2% over a 100-msg window.
2. **Steps.** Circuit-breaker pauses email lane on that domain. Webhook fires
   `deliverability.degraded`. Pod operator (or Mira on Self-Serve) gets pinged.
3. **Success criteria.** Email lane paused within 60s; LinkedIn + voice continue.

### Scenario D — Pod operator tunes a sequence for Theo (Managed tier)

1. **Trigger.** Theo signed up for Managed; pod operator owns his account.
2. **Steps.** Pod operator reviews ICP, copy, channel mix; suggests tweaks; A/B variants. Reports
   weekly to Theo.
3. **Success criteria.** Theo's reply rate improves vs baseline within 2 weeks.

### Scenario E — Tier upgrade Self-Serve → Managed

1. **Trigger.** Mira's headcount needs grow.
2. **Steps.** Billing flip via NOWPayments subscription change; pod operator assigned within 2 BD;
   no data migration.
3. **Success criteria.** Continuous service; no sequence interruption.

### Scenario F — Mira A/B's two subject lines

1. **Trigger.** Mira creates a sequence variant with different subject.
2. **Steps.** Saltrun assigns 50/50 randomized contacts; tracks open + reply rates; reports
   statistical significance.
3. **Success criteria.** After 200 sends per arm, p<0.05 declared and winner promoted.

## 4. Edge case scenarios

### Edge A — Email provider outage

If Smartlead/Instantly returns 5xx for >5 min, sequence email lane pauses; LI + voice continue.
Operator alerted. Resumes when provider 200s for 10 min.

### Edge B — A contact replies via two channels simultaneously

Reply triage merges both replies onto the contact; LLM-classifier picks the higher-priority bucket;
sequence on that contact pauses.

### Edge C — LinkedIn account gets restricted

LI lane circuit-breaker pauses immediately on 4xx LI-restricted error; operator pinged; manual
recovery flow.

### Edge D — Domain expires mid-warmup

Warmup detector flags expiring domains 30 days out; renewal nudge to operator. If domain expires,
lane pauses.

### Edge E — Voice lane local hour out-of-bounds

Voice cron only fires 09:00–17:30 local; out-of-bounds calls queue to next allowed window.

### Edge F — CRM rate limit (Salesforce)

Outbound CRM upserts queue; backoff with jitter; never lose a row. If queue depth > 10k, operator
alerted.

## 5. Anti-scenarios

1. **No spam-bomb mode.** Hard caps on daily sends per warmed domain; any attempt to bypass is
   refused with a deliverability explainer.
2. **No greylist evasion.** We will not rotate IPs to evade complaint feedback loops.
3. **No bulk LinkedIn auto-connect that violates LI TOS.** Per-day limits enforced; no
   profile-scraping for cold-DM.
4. **No "every customer gets a custom integration."** Saltrun integrates with Salesforce and
   HubSpot natively; other CRMs via Zapier (Wave 4 candidate).
5. **No referral / affiliate program in Wave 2/3.**
