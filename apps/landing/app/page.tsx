import Link from "next/link";
import { PricingCta, type PricingPlanId } from "./pricing-cta";

export default function HomePage() {
  return (
    <main className="min-h-screen text-bone">
      <Masthead />
      <Hero />
      <ChannelMatrix />
      <SequenceBlueprint />
      <DeliverabilityProof />
      <ReplyTriage />
      <Pricing />
      <Covenant />
      <Closer />
      <Footer />
    </main>
  );
}

/* ---------------- Masthead ---------------- */

function Masthead() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-5 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link href="#channels" className="text-chalk hover:text-bone transition-colors">
            Channels
          </Link>
          <Link href="#blueprint" className="text-chalk hover:text-bone transition-colors">
            Blueprint
          </Link>
          <Link href="#deliverability" className="text-chalk hover:text-bone transition-colors">
            Deliverability
          </Link>
          <Link href="#pricing" className="text-chalk hover:text-bone transition-colors">
            Pricing
          </Link>
          <Link href="#start" className="btn">
            Start a run
            <Arrow />
          </Link>
        </nav>
        <Link href="#start" className="md:hidden btn">
          Start
          <Arrow />
        </Link>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/" aria-label="Cadence" className="inline-flex items-center gap-3">
      <svg width="36" height="22" viewBox="0 0 36 22" aria-hidden>
        <path d="M2 18 L9 11 L15 15 L21 6 L26 10 L34 4" stroke="#F26B1F" strokeWidth="1.8" fill="none" strokeLinecap="square" />
        <circle cx="2" cy="18" r="1.5" fill="#F26B1F" />
        <circle cx="9" cy="11" r="1.5" fill="#F26B1F" />
        <circle cx="15" cy="15" r="1.5" fill="#F26B1F" />
        <circle cx="21" cy="6" r="1.5" fill="#F26B1F" />
        <circle cx="26" cy="10" r="1.5" fill="#F26B1F" />
        <circle cx="34" cy="4" r="1.5" fill="#F26B1F" />
      </svg>
      <span className="font-display font-bold tracking-tight text-[20px] leading-none">
        Cadence
      </span>
      <span className="hidden sm:inline label">/ Outbound Machines</span>
    </Link>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <section className="border-b border-hairline relative overflow-hidden">
      <div className="mx-auto max-w-prose px-6 md:px-10 pt-20 pb-24">
        <div className="flex items-center gap-3 reveal">
          <span className="pulse-dot" />
          <span className="label label--signal">RUN.LIVE — Q2 2026 // Build #02-08</span>
        </div>

        <h1 className="reveal mt-8 font-display font-bold leading-[0.92] tracking-tight text-[48px] md:text-[80px] lg:text-[100px]">
          <span className="block">Outbound is</span>
          <span className="block">a <span className="text-signal">throughput</span></span>
          <span className="block">problem.</span>
        </h1>

        <p className="reveal-2 mt-10 max-w-[640px] text-[19px] md:text-[22px] leading-[1.5] text-chalk">
          Cadence is the multi-channel outbound machine for operators who measure.
          Email, LinkedIn, and voice run as one sequence — with deliverability,
          persona-aware copy, and reply triage built in. No 12-tab Frankenstack.
          One control panel, one accountability metric:
          <span className="text-bone font-semibold"> reply rate by ICP segment.</span>
        </p>

        <div className="reveal-3 mt-12 flex flex-wrap gap-4">
          <Link href="#start" className="btn">
            Start a run
            <Arrow />
          </Link>
          <Link href="#blueprint" className="btn btn-ghost">
            See the blueprint
            <Arrow />
          </Link>
        </div>

        {/* Hero throughput readout — instrument panel */}
        <div className="mt-20 plate frame-corners p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-hairline pb-3 mb-6">
            <div className="label">Throughput readout / 90-day rolling / managed cohort N=27</div>
            <div className="label label--signal">LIVE</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
            <Readout
              n="6.4%"
              t="Reply rate / ICP-1"
              sub="median across 27 managed accounts"
            />
            <Readout
              n="98.7%"
              t="Inbox placement"
              sub="post-warmup, 30-day"
            />
            <Readout
              n="14.2k"
              t="Sends / week / seat"
              sub="email + LinkedIn + voice combined"
            />
            <Readout
              n="$4.20"
              t="Cost per qualified reply"
              sub="incl. data, tooling, and ops"
            />
          </div>
        </div>

        {/* Trust band */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-4 items-center">
          <span className="label">RAILS</span>
          <CompanyMark name="Smartlead" />
          <CompanyMark name="Instantly" />
          <CompanyMark name="HeyReach" />
          <CompanyMark name="Synthflow" />
        </div>
        <p className="mt-3 label text-[10px]">
          Cadence sits on top of these — not against them. Bring your seats; we run them.
        </p>
      </div>
    </section>
  );
}

function Readout({ n, t, sub }: { n: string; t: string; sub?: string }) {
  return (
    <div>
      <div className="font-display font-bold text-[40px] md:text-[44px] leading-none text-bone">
        {n}
      </div>
      <div className="mt-2 label label--bone">{t}</div>
      {sub && <div className="text-slate text-[12px] mt-1 italic">{sub}</div>}
    </div>
  );
}

function CompanyMark({ name }: { name: string }) {
  return (
    <span className="font-display text-chalk text-[18px] tracking-tight border border-hairline py-2 px-3 text-center">
      {name}
    </span>
  );
}

function Arrow() {
  return <span aria-hidden className="font-mono text-[14px]">→</span>;
}

/* ---------------- Channel matrix ---------------- */

function ChannelMatrix() {
  const channels = [
    {
      id: "email",
      label: "01 / EMAIL",
      title: "Cold inbox, hot reply.",
      lines: [
        "Mailboxes pooled across SPF-clean domains, warmed 21 days before first send.",
        "Hyper-personalized first-touch from a 14-field ICP enrichment pass.",
        "Adaptive throttling — sends back off automatically when bounces or spam complaints rise.",
      ],
      stat: "98.7%",
      statLabel: "inbox placement, 30-day",
      tone: "signal" as const,
    },
    {
      id: "linkedin",
      label: "02 / LINKEDIN",
      title: "Connection requests that land.",
      lines: [
        "Run from real, warmed accounts — never bot-flagged greys.",
        "Request copy mirrors the email thread so cross-channel context survives.",
        "Throttled to 18-22 connect requests / day / seat per LinkedIn limits.",
      ],
      stat: "32.1%",
      statLabel: "connect-accept rate, ICP-1",
      tone: "amber" as const,
    },
    {
      id: "voice",
      label: "03 / VOICE",
      title: "AI voicemail, then a human.",
      lines: [
        "An AI agent leaves a 22-second voicemail in the operator's voice clone.",
        "Live answers route to a human SDR — never a bot — within 60 seconds.",
        "Call disposition is logged and merged back into the email/LinkedIn thread.",
      ],
      stat: "11.4%",
      statLabel: "voicemail-to-meeting conversion",
      tone: "verdigris" as const,
    },
  ];

  return (
    <section id="channels" className="border-b border-hairline">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader
          kicker="Section 02"
          eyebrow="Channels"
          title="Three channels. One thread. One operator."
        />
        <p className="mt-6 max-w-2xl text-chalk text-[17px] leading-[1.65]">
          Most outbound stacks treat email, LinkedIn, and voice as three teams in
          three tools. Cadence treats them as one sequence with three executors.
          A reply on any channel pauses the others; a positive disposition
          collapses the rest of the cadence to a meeting confirmation.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {channels.map((c) => (
            <div key={c.id} className="plate p-7 flex flex-col">
              <div className="flex items-center justify-between">
                <span className={`label ${c.tone === "signal" ? "label--signal" : ""}`}>
                  {c.label}
                </span>
                <span className="label">CH</span>
              </div>
              <h3 className="mt-5 font-display text-[26px] leading-[1.15] tracking-tight">
                {c.title}
              </h3>
              <span className={`block w-12 h-[2px] mt-4 ${tonelineClass(c.tone)}`} />
              <ul className="mt-5 space-y-3 text-[14.5px] text-chalk leading-[1.55]">
                {c.lines.map((line) => (
                  <li key={line} className="grid grid-cols-[14px_1fr] gap-3">
                    <span className="font-mono text-signal text-[12px] mt-[3px]">›</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-5 border-t border-hairline">
                <div className="font-display font-bold text-[30px] leading-none text-bone">
                  {c.stat}
                </div>
                <div className="label mt-2">{c.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function tonelineClass(tone: "signal" | "amber" | "verdigris") {
  if (tone === "signal") return "bg-signal";
  if (tone === "amber") return "bg-amber";
  return "bg-verdigris";
}

/* ---------------- Sequence-as-blueprint ---------------- */

function SequenceBlueprint() {
  return (
    <section id="blueprint" className="border-b border-hairline bg-plate/40">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader
          kicker="Section 03"
          eyebrow="Sequence as blueprint"
          title="A run isn't a list. It's a flowchart."
        />
        <p className="mt-6 max-w-2xl text-chalk text-[17px] leading-[1.65]">
          Cadence treats every run as a directed graph: an ICP node fans out to
          three execution lanes (email, LinkedIn, voice) that share state. A
          reply on lane B halts lane A and B and routes the contact to triage.
          A no-show triggers a re-engagement node 14 days later. This is what's
          actually shipping in your tenant — read top to bottom.
        </p>

        <div className="mt-12 plate-2 frame-corners p-6 md:p-10">
          <div className="flex items-center justify-between border-b border-hairline pb-3 mb-8">
            <div className="label">Cadence schematic — RUN.0428.ICP-VC.Series-A</div>
            <div className="label">REV B / 2026-04</div>
          </div>

          <BlueprintDiagram />
        </div>
      </div>
    </section>
  );
}

function BlueprintDiagram() {
  return (
    <div className="grid gap-6">
      {/* Stage 1: ICP source */}
      <BlueprintRow
        leftLabel="STAGE 01 // ICP"
        rightLabel="14-field enrichment"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Node tone="signal">
            <div className="label label--signal">ICP-1.SOURCE</div>
            <div className="mt-2 text-bone">VC partner, Series A,<br/>NA + EU, deploying $2-15M</div>
          </Node>
          <Node tone="ghost">
            <div className="label">ENRICH</div>
            <div className="mt-2">
              firmographic · trigger event<br/>
              fund vintage · LP commitments
            </div>
          </Node>
          <Node tone="ghost">
            <div className="label">SEGMENT</div>
            <div className="mt-2">
              tier-1 / tier-2 split<br/>
              by recent deployment cadence
            </div>
          </Node>
        </div>
      </BlueprintRow>

      <Connector />

      {/* Stage 2: Three lanes */}
      <BlueprintRow leftLabel="STAGE 02 // EXECUTE" rightLabel="3 lanes / 1 thread">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Node tone="signal">
            <div className="label label--signal">LANE.A — EMAIL</div>
            <div className="mt-2">
              D+0  first-touch<br/>
              D+3  follow-up (referenced)<br/>
              D+8  hand-off to ops
            </div>
          </Node>
          <Node tone="amber">
            <div className="label" style={{ color: "var(--amber)" }}>LANE.B — LINKEDIN</div>
            <div className="mt-2">
              D+1  connection request<br/>
              D+5  voice-note DM (post-accept)<br/>
              D+9  resource share
            </div>
          </Node>
          <Node tone="verdigris">
            <div className="label" style={{ color: "var(--verdigris)" }}>LANE.C — VOICE</div>
            <div className="mt-2">
              D+6  AI voicemail (22s)<br/>
              D+7  human callback if dial<br/>
              D+10 SMS recap
            </div>
          </Node>
        </div>
      </BlueprintRow>

      <Connector />

      {/* Stage 3: Reply gate */}
      <BlueprintRow leftLabel="STAGE 03 // REPLY GATE" rightLabel="triage in <90s">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Node tone="signal">
            <div className="label label--signal">REPLY.POSITIVE</div>
            <div className="mt-2">collapse all lanes →<br/>book meeting</div>
          </Node>
          <Node tone="amber">
            <div className="label" style={{ color: "var(--amber)" }}>REPLY.OBJECTION</div>
            <div className="mt-2">human SDR drafts →<br/>1-touch override</div>
          </Node>
          <Node tone="ghost">
            <div className="label">REPLY.NOT-NOW</div>
            <div className="mt-2">14-day re-engage<br/>node armed</div>
          </Node>
          <Node tone="ghost">
            <div className="label" style={{ color: "var(--hot)" }}>REPLY.HARD-NO</div>
            <div className="mt-2">unsubscribe →<br/>suppression list</div>
          </Node>
        </div>
      </BlueprintRow>

      <Connector />

      {/* Stage 4: Outcome */}
      <BlueprintRow leftLabel="STAGE 04 // OUTCOME" rightLabel="merged into CRM">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Node tone="signal">
            <div className="label label--signal">MEETING.BOOKED</div>
            <div className="mt-2">
              calendar invite + thread digest<br/>
              + recording placeholder
            </div>
          </Node>
          <Node tone="ghost">
            <div className="label">RUN.METRICS</div>
            <div className="mt-2">
              reply rate · book rate · CPQR<br/>
              dispatched to operator daily 09:00 local
            </div>
          </Node>
        </div>
      </BlueprintRow>
    </div>
  );
}

function Node({
  tone = "ghost",
  children,
}: {
  tone?: "signal" | "amber" | "verdigris" | "ghost";
  children: React.ReactNode;
}) {
  const cls =
    tone === "signal" ? "node node--signal"
    : tone === "amber" ? "node node--amber"
    : tone === "verdigris" ? "node node--verdigris"
    : "node node--ghost";
  return (
    <div className={cls}>
      <span className="node__rivet node__rivet--tl" />
      <span className="node__rivet node__rivet--tr" />
      <span className="node__rivet node__rivet--bl" />
      <span className="node__rivet node__rivet--br" />
      {children}
    </div>
  );
}

function BlueprintRow({
  leftLabel,
  rightLabel,
  children,
}: {
  leftLabel: string;
  rightLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="label label--signal">{leftLabel}</span>
        <span className="label">{rightLabel}</span>
      </div>
      {children}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center" aria-hidden>
      <div className="h-8 w-px conn-v" />
    </div>
  );
}

/* ---------------- Deliverability proof block ---------------- */

function DeliverabilityProof() {
  const checklist = [
    "SPF, DKIM, DMARC verified per domain — not per send",
    "21-day warmup pre-send, with adaptive ramp curve",
    "Bounce + complaint thresholds wired to circuit-breaker pause",
    "Mailbox rotation by domain pool, not by send volume alone",
    "Custom tracking domain isolated from corporate DNS",
    "Daily inbox placement test from a control mailbox per pool",
  ];
  return (
    <section id="deliverability" className="border-b border-hairline">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader
          kicker="Section 04"
          eyebrow="Deliverability is the product"
          title="98.7% inbox placement, audited weekly."
        />

        <div className="mt-12 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="text-chalk text-[17px] leading-[1.65]">
              Most outbound tools ship a sequence and call it done. We treat
              deliverability as a continuous operations problem — because that's
              what it is. The numbers below come from the rolling 30-day audit
              of the managed cohort, run by the same engine that operates your
              tenant.
            </p>

            <div className="mt-8 plate p-6">
              <div className="label mb-4">Inbox placement / cohort N=27 / rolling 30d</div>
              <PlacementChart />
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="plate-2 p-7">
              <div className="flex items-center justify-between">
                <span className="label label--signal">DELIVERABILITY CHECKLIST</span>
                <span className="label">REV C</span>
              </div>
              <ul className="mt-6 space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="grid grid-cols-[20px_1fr] gap-3 items-start py-2 border-b border-hairline last:border-b-0">
                    <span className="font-mono text-signal text-[14px] mt-[2px]">[✓]</span>
                    <span className="text-chalk text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-hairline">
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <div className="font-display font-bold text-[28px] leading-none text-bone">
                      0.34%
                    </div>
                    <div className="label mt-2">bounce rate</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-[28px] leading-none text-bone">
                      0.04%
                    </div>
                    <div className="label mt-2">spam complaints</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-[28px] leading-none text-signal">
                      ZERO
                    </div>
                    <div className="label mt-2">domains blacklisted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlacementChart() {
  // Simple bar-chart rendered as inline SVG, fully accessible
  const bars = [
    { day: "Wk-1", v: 92.4 },
    { day: "Wk-2", v: 95.1 },
    { day: "Wk-3", v: 96.8 },
    { day: "Wk-4", v: 97.9 },
    { day: "Wk-5", v: 98.4 },
    { day: "Wk-6", v: 98.7 },
  ];
  return (
    <div className="grid grid-cols-6 gap-2 items-end h-[140px]">
      {bars.map((b) => (
        <div key={b.day} className="flex flex-col h-full justify-end">
          <div className="font-mono text-[10px] text-bone mb-1">{b.v}</div>
          <div
            className="bg-signal w-full"
            style={{ height: `${(b.v - 88) * 6}%` }}
            aria-label={`${b.day}: ${b.v}% inbox placement`}
          />
          <div className="label text-[9px] mt-2">{b.day}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Reply triage demo ---------------- */

function ReplyTriage() {
  return (
    <section id="triage" className="border-b border-hairline bg-plate/40">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader
          kicker="Section 05"
          eyebrow="Reply triage — the hardest part"
          title="A reply is a fork in the graph."
        />
        <p className="mt-6 max-w-2xl text-chalk text-[17px] leading-[1.65]">
          The hardest part of outbound at scale is not the sending — it's the
          replying. A 5-rep team gets buried at 800 replies per week. Cadence
          classifies each reply, drafts a response, and routes only the ones
          that need a human.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <TriageCard
            label="REPLY.POSITIVE"
            tone="signal"
            from="Anil S. — Partner, Vellum Capital"
            subject="Re: 4 firms in your portfolio shipping the same RAG bug"
            body={`Interested. I'm at the All Markets summit Wed-Thu — can your team take a 20-min slot Friday 11:00 PT? I'll loop in the platform partner.`}
            classification="Meeting-ready · ICP-1 · Cohort A"
            action="Auto-booked Friday 11:00 PT. Other 2 lanes paused."
          />
          <TriageCard
            label="REPLY.OBJECTION"
            tone="amber"
            from="Jess R. — VP RevOps, Foundry"
            subject="Re: Your team's reply rate vs ours"
            body={`We tried something similar with [competitor] in 2024 and got blacklisted on 3 SPF pools. Why is yours different?`}
            classification="Objection · deliverability · loop in human SDR"
            action="Drafted reply citing rotation policy + 30-day audit. Held for human send."
          />
        </div>
      </div>
    </section>
  );
}

function TriageCard({
  label,
  tone,
  from,
  subject,
  body,
  classification,
  action,
}: {
  label: string;
  tone: "signal" | "amber";
  from: string;
  subject: string;
  body: string;
  classification: string;
  action: string;
}) {
  const toneClass = tone === "signal" ? "label--signal" : "";
  return (
    <div className="plate p-7">
      <div className="flex items-center justify-between">
        <span className={`label ${toneClass}`} style={tone === "amber" ? { color: "var(--amber)" } : undefined}>
          {label}
        </span>
        <span className="label">INBOUND // T+47s</span>
      </div>

      <div className="mt-5 plate-2 p-5 font-mono text-[12.5px] leading-[1.55]">
        <div className="text-slate">FROM:    <span className="text-bone">{from}</span></div>
        <div className="text-slate mt-1">SUBJECT: <span className="text-bone">{subject}</span></div>
        <div className="border-t border-hairline mt-3 pt-3 text-chalk italic">
          {body}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <span className="label">CLASSIFY</span>
          <span className="text-bone text-[14px]">{classification}</span>
        </div>
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <span className="label">ACTION</span>
          <span className="text-bone text-[14px]">{action}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Pricing ---------------- */

type PricingTier = {
  name: string;
  price: string;
  cadence: string;
  oneliner: string;
  bullets: string[];
  cta: string;
  highlight: boolean;
  planId?: PricingPlanId;
  fallbackHref?: string;
};

function Pricing() {
  const tiers: PricingTier[] = [
    {
      name: "Self-serve",
      price: "$490",
      cadence: "/ month / seat",
      oneliner: "You run the machine. We give you the rails.",
      bullets: [
        "1 seat, 3 mailboxes, 1 LinkedIn account",
        "Up to 3,000 contacts / month enriched",
        "Sequence builder + reply triage UI",
        "Self-managed deliverability dashboard",
        "Email + chat support, 24h SLA",
      ],
      cta: "Pay $490 in stablecoin",
      highlight: false,
      planId: "self_serve",
    },
    {
      name: "Managed",
      price: "$4,900",
      cadence: "/ month",
      oneliner: "We run the machine. You run your day.",
      bullets: [
        "5 seats, 25 mailboxes, 5 LinkedIn accounts",
        "Up to 30,000 contacts / month enriched",
        "Dedicated SDR pod (1 lead + 2 ops)",
        "Bring-your-own ICP or we build it from scratch",
        "Weekly cohort report + monthly retro",
        "Performance fee: $80 / qualified meeting",
      ],
      cta: "Book a managed run",
      highlight: true,
      planId: "managed",
    },
    {
      name: "Enterprise",
      price: "From $24,990",
      cadence: "/ quarter",
      oneliner: "Custom rails, custom shape.",
      bullets: [
        "Custom seat / mailbox / contact volume",
        "Dedicated infra (private domains, isolated IPs)",
        "Custom ICP enrichment pipeline",
        "Priority human SDR pod (24/5)",
        "SOC 2 + DPA + custom retention",
        "Quarterly business review + roadmap input",
      ],
      cta: "Talk to ops",
      highlight: false,
      fallbackHref:
        "mailto:ops@prin7r.com?subject=Cadence%20enterprise%20inquiry&body=Company%3A%0AAvg.%20deal%20size%3A%0ATarget%20ICP%3A%0ACurrent%20outbound%20stack%3A%0ANotes%3A%0A",
    },
  ];

  return (
    <section id="pricing" className="border-b border-hairline">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader
          kicker="Section 06"
          eyebrow="Pricing"
          title="Three tiers. Productized. Paid in stablecoin."
        />
        <p className="mt-6 max-w-2xl text-chalk text-[17px] leading-[1.65]">
          The first 30 days on Self-serve and Managed are pre-paid in USDT or
          USDC via NOWPayments. Card on-ramp where the NOWPayments fiat partner
          is enabled. Enterprise contracts go through ops with a wire/ACH
          alternative if needed.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "plate p-7 flex flex-col " +
                (t.highlight ? "border-signal" : "")
              }
            >
              <div className="flex items-center justify-between">
                <div className="label">{t.name}</div>
                {t.highlight && (
                  <span className="label label--signal">Most picked</span>
                )}
              </div>
              <div className="mt-4 font-display font-bold text-[40px] leading-none">
                {t.price}
              </div>
              <div className="text-chalk text-[13px] mt-1 font-mono">{t.cadence}</div>
              <span className="block w-12 h-[2px] bg-signal mt-5" />
              <p className="mt-5 text-chalk text-[14.5px] italic">{t.oneliner}</p>
              <ul className="mt-5 space-y-2 text-[14px] text-bone">
                {t.bullets.map((b) => (
                  <li key={b} className="grid grid-cols-[16px_1fr] gap-2 items-start">
                    <span className="font-mono text-signal text-[12px] mt-1">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                {t.planId ? (
                  <PricingCta
                    plan={t.planId}
                    label={t.cta}
                    className={
                      "btn justify-center w-full " +
                      (t.highlight ? "" : "btn-secondary")
                    }
                  />
                ) : (
                  <Link
                    href={t.fallbackHref ?? "#start"}
                    className="btn btn-ghost justify-center w-full"
                  >
                    {t.cta}
                    <Arrow />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-slate italic max-w-2xl text-[13.5px]">
          NOWPayments hosted invoice — USDT (TRC-20 / ERC-20) or USDC (ERC-20 / Polygon).
          Fiat / card on-ramp partner enabled where supported. Webhook IPN signed with
          HMAC-SHA512 per provider spec.
        </p>
      </div>
    </section>
  );
}

/* ---------------- Operator's covenant ---------------- */

function Covenant() {
  const items = [
    "Scrape sources we don't have a license to use.",
    "Send from cold-pooled domains we can't verify SPF on.",
    "Run sequences on accounts we can't ramp to clean baseline.",
    "Bill on a 'qualified meeting' that didn't show up.",
    "Outsource the human SDR pod to anyone who wouldn't pass our own hiring bar.",
  ];
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <SectionHeader
              kicker="Section 07"
              eyebrow="Operator's covenant"
              title="What we won't do."
            />
            <p className="mt-6 text-chalk text-[15.5px] leading-[1.65]">
              The reason most outbound shops blow up is they take shortcuts on the
              boring infra layer to chase volume. We refuse those shortcuts in
              writing. Your domain reputation is a finite resource — we treat it
              like one.
            </p>
          </div>
          <ul className="md:col-span-7 space-y-5 text-[18px] font-display leading-[1.4]">
            {items.map((i) => (
              <li
                key={i}
                className="grid grid-cols-[28px_1fr] gap-3 hr-thin pt-5"
              >
                <span className="font-mono text-signal text-[14px] mt-[5px]">×</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Closer ---------------- */

function Closer() {
  return (
    <section id="start" className="border-b border-hairline">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-24">
        <div className="max-w-3xl">
          <span className="label label--signal">START A RUN</span>
          <h2 className="mt-4 font-display font-bold text-[44px] md:text-[64px] leading-[1.05] tracking-tight">
            Your first reply lands{" "}
            <span className="text-signal italic">inside two weeks.</span>
          </h2>
          <p className="mt-8 max-w-xl text-chalk text-[17px] leading-[1.6]">
            Self-serve onboarding is a 22-minute setup. Managed onboarding is a
            45-minute call with the lead operator who will run your machine. Both
            ship a first send within 14 days — no exceptions, no
            sales-engineering loops.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="#pricing" className="btn">
              Pick a tier <Arrow />
            </Link>
            <a
              href="mailto:ops@prin7r.com?subject=Cadence%20managed%20run&body=Company%3A%0AAvg.%20deal%20size%3A%0ATarget%20ICP%3A%0ACurrent%20outbound%20stack%3A%0ATime%20zone%3A%0ANotes%3A%0A"
              className="btn btn-ghost"
            >
              Email ops directly <Arrow />
            </a>
          </div>
          <p className="font-mono text-[11px] tracking-wider text-slate uppercase mt-10">
            ops@prin7r.com · 14-day first-send SLA · paid in stablecoin
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-prose px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3 items-end border-t border-hairline">
        <div>
          <Logo />
          <p className="mt-5 text-slate text-[13px] max-w-xs leading-[1.55]">
            Cadence is operated by Prin7r. Outbound ops pod across NYC, Berlin,
            and Tbilisi. Built on the company-outbound engine.
          </p>
        </div>
        <div className="md:text-center">
          <div className="label">RUN BUILD #02-08 / 2026</div>
          <p className="mt-3 font-display italic text-[15px]">
            "Sequences as flowcharts. Reply rate as the only ego."
          </p>
        </div>
        <div className="md:text-right">
          <ul className="space-y-2 text-[13px]">
            <li><Link href="#channels" className="signal">Channels</Link></li>
            <li><Link href="#blueprint" className="signal">Blueprint</Link></li>
            <li><Link href="#deliverability" className="signal">Deliverability</Link></li>
            <li><Link href="#pricing" className="signal">Pricing</Link></li>
            <li>
              <a
                className="signal"
                href="https://github.com/prin7r-projects/outbound-sales-machines"
                target="_blank"
                rel="noreferrer"
              >
                Repository
              </a>
            </li>
          </ul>
          <p className="font-mono text-[10px] tracking-wider text-slate uppercase mt-6">
            © 2026 Prin7r · ops@prin7r.com
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Helpers ---------------- */

function SectionHeader({
  kicker,
  eyebrow,
  title,
}: {
  kicker: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="label">{kicker}</span>
        <span className="block w-8 h-[1px] bg-hairline" />
        <span className="label label--signal">{eyebrow}</span>
      </div>
      <h2 className="mt-5 font-display font-bold text-[36px] md:text-[52px] leading-[1.05] tracking-tight">
        {title}
      </h2>
      <span className="block w-14 h-[2px] bg-signal mt-5" />
    </div>
  );
}
