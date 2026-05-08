import Link from "next/link";
import { PricingCta, type PricingPlanId } from "./pricing-cta";

export default function HomePage() {
  return (
    <main className="min-h-screen text-bone">
      <SystemTicker />
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

/* ---------------- System ticker ---------------- */

function SystemTicker() {
  // A persistent runtime band — mimics a control-room status line.
  const items = [
    { k: "REGION", v: "NA-EU // 5 zones" },
    { k: "MAILBOX POOLS", v: "47 ramped" },
    { k: "VOICE LANES", v: "12 live" },
    { k: "LATENCY P95", v: "164ms" },
    { k: "BACKLOG", v: "0 / nominal" },
    { k: "INCIDENT", v: "none open" },
    { k: "BUILD", v: "02-08 / 2026-05" },
    { k: "REPLY-RATE TODAY", v: "6.71% rolling" },
  ];
  // Duplicate for seamless loop
  const loop = [...items, ...items];
  return (
    <div className="border-b border-hairline bg-plate">
      <div className="mx-auto max-w-prose px-6 md:px-10 flex items-stretch h-8">
        <div className="flex items-center gap-2 pr-4 border-r border-hairline shrink-0">
          <span className="pulse-dot" />
          <span className="label label--phosphor">SYS</span>
        </div>
        <div className="marquee flex-1 pl-4">
          <div className="marquee__track items-center text-[11px] font-mono tracking-[0.14em] text-slate uppercase">
            {loop.map((it, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-slate/70">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="text-chalk">{it.k}</span>
                <span className="text-bone">{it.v}</span>
                <span className="text-hairline-bright">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Masthead ---------------- */

function Masthead() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-5 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-mono uppercase tracking-[0.16em]">
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
          <Link href="#start" className="btn btn-secondary">
            Start a run
            <Arrow />
          </Link>
        </nav>
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
          <span className="label label--signal">RUN.LIVE — Q2 2026 // BUILD #02-08</span>
          <span className="hidden sm:inline label">/ TZ UTC // 14:22:07</span>
        </div>

        <h1 className="reveal mt-8 font-display font-bold leading-[0.92] tracking-[-0.03em] text-[48px] md:text-[80px] lg:text-[100px]">
          <span className="block">Outbound is</span>
          <span className="block">a <span className="text-signal glow-signal">throughput</span></span>
          <span className="block">problem.</span>
        </h1>

        <p className="reveal-2 mt-10 max-w-[640px] text-[19px] md:text-[21px] leading-[1.55] text-chalk">
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

        {/* Hero throughput — telemetry dashboard ribbon */}
        <TelemetryRibbon />

        {/* Trust band */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-4 items-center">
          <span className="label">RAILS // ON</span>
          <CompanyMark name="Smartlead" />
          <CompanyMark name="Instantly" />
          <CompanyMark name="HeyReach" />
          <CompanyMark name="Synthflow" />
        </div>
        <p className="mt-3 label text-[10px] normal-case tracking-[0.1em] text-slate">
          [ Cadence sits on top of these — not against them. Bring your seats; we run them. ]
        </p>
      </div>
    </section>
  );
}

/* ---- Telemetry ribbon (the hero readout, dressed as a real dashboard) ---- */

function TelemetryRibbon() {
  const cells: Array<{
    chan: string;
    n: string;
    unit?: string;
    label: string;
    sub: string;
    delta: string;
    deltaTone: "up" | "down" | "flat";
    spark: number[];
    status: "live" | "ok" | "watch";
  }> = [
    {
      chan: "CH-01",
      n: "6.4",
      unit: "%",
      label: "Reply rate / ICP-1",
      sub: "median // 27 managed accounts // 90d",
      delta: "+0.31 vs prev",
      deltaTone: "up",
      spark: [3.9, 4.2, 4.6, 5.1, 5.3, 5.7, 5.9, 6.1, 6.0, 6.2, 6.3, 6.4],
      status: "live",
    },
    {
      chan: "CH-02",
      n: "98.7",
      unit: "%",
      label: "Inbox placement",
      sub: "post-warmup // 30d rolling",
      delta: "+0.18 vs prev",
      deltaTone: "up",
      spark: [92.4, 93.6, 94.8, 95.7, 96.2, 96.6, 97.1, 97.5, 97.9, 98.2, 98.4, 98.7],
      status: "ok",
    },
    {
      chan: "CH-03",
      n: "14.2",
      unit: "k/wk",
      label: "Sends per seat",
      sub: "email + linkedin + voice combined",
      delta: "stable",
      deltaTone: "flat",
      spark: [11.0, 11.4, 12.1, 12.7, 13.0, 13.2, 13.5, 13.8, 14.0, 14.1, 14.2, 14.2],
      status: "ok",
    },
    {
      chan: "CH-04",
      n: "$4.20",
      unit: "",
      label: "Cost per qualified reply",
      sub: "incl. data, tooling, ops",
      delta: "−$0.42 vs prev",
      deltaTone: "down",
      spark: [6.8, 6.4, 6.1, 5.8, 5.5, 5.3, 5.0, 4.8, 4.6, 4.4, 4.3, 4.2],
      status: "ok",
    },
  ];

  return (
    <div className="mt-16 telemetry brackets-4 brackets-4--signal">
      <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br br" />

      {/* Header bar */}
      <div className="grid grid-cols-[1fr_auto] gap-4 px-5 md:px-6 py-3 border-b border-hairline-bright">
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <span className="label label--signal">[ THROUGHPUT READOUT ]</span>
          <span className="hidden sm:inline label">/ RUN.0428.ICP-VC.SeriesA</span>
          <span className="hidden md:inline label">/ COHORT N=27</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="label">SCAN 90d</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-phosphor inline-block phosphor-blink" />
            <span className="label label--phosphor">LIVE</span>
          </span>
        </div>
      </div>

      {/* 4-cell ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        {cells.map((c) => (
          <TelemetryCell key={c.chan} {...c} />
        ))}
      </div>

      {/* Footer bar — ASCII coords + last sync */}
      <div className="grid grid-cols-[1fr_auto] gap-4 px-5 md:px-6 py-2.5 border-t border-hairline-bright text-[10.5px] font-mono uppercase tracking-[0.16em] text-slate">
        <span className="truncate">&gt;&gt;&gt; LAT 40.7128°N · LON 74.0060°W // tier-1 mailbox pools // dkim verified per send</span>
        <span className="hidden sm:inline whitespace-nowrap">LAST SYNC // T−00:18s</span>
      </div>
    </div>
  );
}

function TelemetryCell({
  chan,
  n,
  unit,
  label,
  sub,
  delta,
  deltaTone,
  spark,
  status,
}: {
  chan: string;
  n: string;
  unit?: string;
  label: string;
  sub: string;
  delta: string;
  deltaTone: "up" | "down" | "flat";
  spark: number[];
  status: "live" | "ok" | "watch";
}) {
  const deltaColor =
    deltaTone === "up" ? "text-phosphor" : deltaTone === "down" ? "text-signal" : "text-chalk";
  const arrow = deltaTone === "up" ? "▲" : deltaTone === "down" ? "▼" : "◆";

  // Sparkline path
  const max = Math.max(...spark);
  const min = Math.min(...spark);
  const range = Math.max(0.0001, max - min);
  const w = 200;
  const h = 28;
  const pts = spark.map((v, i) => {
    const x = (i / (spark.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const lastX = w;
  const lastY = h - ((spark[spark.length - 1] - min) / range) * h;

  return (
    <div className="telemetry__cell">
      <div className="flex items-center justify-between">
        <span className="label">{chan}</span>
        <span className={`label ${status === "live" ? "label--phosphor" : ""}`}>
          {status === "live" ? "LIVE" : status === "ok" ? "OK" : "WATCH"}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display font-bold text-[44px] md:text-[44px] leading-none text-bone tnum">
          {n}
        </span>
        {unit && <span className="font-mono text-[14px] text-chalk leading-none">{unit}</span>}
      </div>

      {/* Sparkline */}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="spark mt-2"
        aria-hidden
      >
        {/* baseline */}
        <line x1="0" y1={h - 0.5} x2={w} y2={h - 0.5} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
        {/* tick marks */}
        {[0.25, 0.5, 0.75].map((p, i) => (
          <line
            key={i}
            x1={w * p}
            y1={h - 4}
            x2={w * p}
            y2={h}
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
        <path d={pathD} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
      </svg>

      <div className="mt-3 flex items-center justify-between">
        <span className="label label--bone">{label}</span>
        <span className={`font-mono text-[11px] tracking-[0.06em] ${deltaColor} tnum`}>
          {arrow} {delta}
        </span>
      </div>
      <div className="text-slate text-[11.5px] mt-1 font-mono uppercase tracking-[0.1em]">
        {sub}
      </div>
    </div>
  );
}

function CompanyMark({ name }: { name: string }) {
  return (
    <span className="font-display text-chalk text-[18px] tracking-tight border border-hairline py-2 px-3 text-center hover:border-bone hover:text-bone transition-colors">
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

        <div className="mt-12 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {channels.map((c) => (
            <div key={c.id} className="bg-steel p-7 flex flex-col">
              <div className="flex items-center justify-between">
                <span className={`label ${c.tone === "signal" ? "label--signal" : ""}`}>
                  &#91; {c.label} &#93;
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
                <div className="font-display font-bold text-[30px] leading-none text-bone tnum">
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

        <div className="mt-12 plate-2 frame-corners brackets-4 p-6 md:p-10 relative">
          <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br br" />

          {/* Drawing-sheet header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-end border-b border-hairline pb-3 mb-8">
            <div>
              <div className="label">DRAWING NO.</div>
              <div className="font-mono text-bone text-[14px] mt-1">CDN-RUN.0428.ICP-VC.SeriesA</div>
            </div>
            <div className="hidden md:block">
              <div className="label">SCALE</div>
              <div className="font-mono text-bone text-[14px] mt-1">1 : 1 // 14d run</div>
            </div>
            <div>
              <div className="label">REV</div>
              <div className="font-mono text-bone text-[14px] mt-1">B / 2026-04</div>
            </div>
          </div>

          <BlueprintDiagram />

          {/* Drawing-sheet footer — title block */}
          <div className="mt-8 pt-4 border-t border-hairline grid grid-cols-2 md:grid-cols-4 gap-4 text-[10.5px] font-mono uppercase tracking-[0.16em] text-slate">
            <div><span className="text-chalk">DRAWN</span> // ops.cadence</div>
            <div><span className="text-chalk">CHECKED</span> // mira.r</div>
            <div><span className="text-chalk">UNIT</span> // D-01 / per tenant</div>
            <div><span className="text-chalk">SHEET</span> // 1 of 1</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlueprintDiagram() {
  return (
    <div className="relative">
      {/* Side measurement column — left ruler */}
      <div className="hidden md:block absolute -left-7 top-0 bottom-0 w-5 select-none pointer-events-none">
        <div className="h-full border-l border-hairline relative">
          {[
            { y: "6%", label: "01" },
            { y: "30%", label: "02" },
            { y: "60%", label: "03" },
            { y: "88%", label: "04" },
          ].map((m) => (
            <div key={m.label} className="absolute -left-[1px] flex items-center" style={{ top: m.y }}>
              <span className="block w-2 h-px bg-hairline-bright" />
              <span className="ml-1 text-[10px] font-mono text-slate tracking-[0.1em]">{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-0">
        {/* Stage 1: ICP source */}
        <BlueprintRow
          stage="01"
          leftLabel="STAGE 01 // ICP"
          rightLabel="14-field enrichment // N=2,840 contacts"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
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

        <BlueprintConnector branches={3} />

        {/* Stage 2: Three lanes */}
        <BlueprintRow stage="02" leftLabel="STAGE 02 // EXECUTE" rightLabel="3 lanes / 1 thread">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline">
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

        <BlueprintConnector branches={4} merging />

        {/* Stage 3: Reply gate */}
        <BlueprintRow stage="03" leftLabel="STAGE 03 // REPLY GATE" rightLabel="triage in <90s">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline border border-hairline">
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

        <BlueprintConnector branches={2} />

        {/* Stage 4: Outcome */}
        <BlueprintRow stage="04" leftLabel="STAGE 04 // OUTCOME" rightLabel="merged into CRM">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-hairline border border-hairline">
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
    <div className={cls + " border-0"}>
      <span className="node__rivet node__rivet--tl" />
      <span className="node__rivet node__rivet--tr" />
      <span className="node__rivet node__rivet--bl" />
      <span className="node__rivet node__rivet--br" />
      {children}
    </div>
  );
}

function BlueprintRow({
  stage,
  leftLabel,
  rightLabel,
  children,
}: {
  stage: string;
  leftLabel: string;
  rightLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden md:inline-flex w-7 h-7 items-center justify-center border border-signal text-signal text-[10.5px] font-mono tracking-wider shrink-0">
            {stage}
          </span>
          <span className="label label--signal truncate">{leftLabel}</span>
        </div>
        <span className="label hidden sm:inline">{rightLabel}</span>
      </div>
      {children}
    </div>
  );
}

/* Drawn connector — actual blueprint linework with branches + ASCII tick */
function BlueprintConnector({ branches, merging }: { branches: 1 | 2 | 3 | 4; merging?: boolean }) {
  // SVG width matches container fluidly; we use viewBox + preserveAspectRatio="none"
  // Trunk runs vertically through center; branch points fan to columns.
  const positions: Record<number, number[]> = {
    1: [50],
    2: [25, 75],
    3: [16.67, 50, 83.33],
    4: [12.5, 37.5, 62.5, 87.5],
  };
  const targets = positions[branches];
  const H = 56;
  return (
    <div className="relative h-14 my-1" aria-hidden>
      <svg
        viewBox={`0 0 100 ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full text-hairline-bright"
      >
        {/* Trunk in */}
        <line x1="50" y1="0" x2="50" y2={H * 0.45} stroke="currentColor" strokeWidth="0.4" />
        {/* Horizontal at midline spanning targets */}
        <line
          x1={targets[0]}
          y1={H * 0.45}
          x2={targets[targets.length - 1]}
          y2={H * 0.45}
          stroke="currentColor"
          strokeWidth="0.4"
        />
        {/* Branch verticals */}
        {targets.map((t, i) => (
          <line key={i} x1={t} y1={H * 0.45} x2={t} y2={H} stroke="currentColor" strokeWidth="0.4" />
        ))}
        {/* Crosshair markers at intersections */}
        <g fill="currentColor">
          <circle cx="50" cy={H * 0.45} r="0.9" />
          {targets.map((t, i) => (
            <circle key={"d" + i} cx={t} cy={H * 0.45} r="0.7" />
          ))}
          {targets.map((t, i) => (
            <rect key={"e" + i} x={t - 0.5} y={H - 1.2} width="1" height="1.2" />
          ))}
        </g>
        {/* Dimension tick marks on trunk */}
        <g stroke="currentColor" strokeWidth="0.3">
          {[0.12, 0.22, 0.32].map((p) => (
            <line key={p} x1="48.5" x2="51.5" y1={H * p} y2={H * p} />
          ))}
        </g>
      </svg>
      {/* Merging arrow label */}
      {merging && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 label translate-x-2 hidden md:inline">
          /// MERGE
        </span>
      )}
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

            <div className="mt-8 plate brackets-4 p-6 relative">
              <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br br" />
              <div className="flex items-center justify-between mb-4">
                <span className="label">[ INBOX PLACEMENT ]</span>
                <span className="label">N=27 // 30d</span>
              </div>
              <PlacementChart />
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="plate-2 brackets-4 p-7 relative">
              <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br br" />
              <div className="flex items-center justify-between">
                <span className="label label--signal">[ DELIVERABILITY CHECKLIST ]</span>
                <span className="label">REV C</span>
              </div>
              <ul className="mt-6 divide-y divide-hairline">
                {checklist.map((item, i) => (
                  <li key={item} className="grid grid-cols-[28px_20px_1fr] gap-3 items-start py-3">
                    <span className="font-mono text-slate text-[10.5px] tracking-wider mt-[3px] tnum">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-mono text-signal text-[14px] mt-[2px]">[+]</span>
                    <span className="text-chalk text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-hairline">
                <div className="grid grid-cols-3 gap-x-6">
                  <div>
                    <div className="font-display font-bold text-[28px] leading-none text-bone tnum">
                      0.34%
                    </div>
                    <div className="label mt-2">bounce rate</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-[28px] leading-none text-bone tnum">
                      0.04%
                    </div>
                    <div className="label mt-2">spam complaints</div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-[28px] leading-none text-signal glow-signal">
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
    <div className="grid grid-cols-6 gap-2 items-end h-[160px] relative">
      {/* Y-axis hairlines */}
      <div className="absolute inset-0 pointer-events-none">
        {[0.2, 0.4, 0.6, 0.8].map((p) => (
          <div
            key={p}
            className="absolute left-0 right-0 border-t border-hairline opacity-60"
            style={{ top: `${p * 100}%` }}
          />
        ))}
      </div>
      {bars.map((b) => (
        <div key={b.day} className="flex flex-col h-full justify-end relative z-10">
          <div className="font-mono text-[10px] text-bone mb-1 tnum">{b.v}</div>
          <div
            className="bg-signal w-full"
            style={{ height: `${(b.v - 88) * 6}%`, boxShadow: "0 0 14px -3px rgba(242,107,31,0.45)" }}
            aria-label={`${b.day}: ${b.v}% inbox placement`}
          />
          <div className="label text-[9px] mt-2">{b.day}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Reply triage demo (CRT/HUD list) ---------------- */

type TriageItem = {
  id: string;
  ts: string;
  cls: "REPLY.POSITIVE" | "REPLY.OBJECTION" | "REPLY.NOT-NOW" | "REPLY.HARD-NO";
  tone: "signal" | "amber" | "ghost" | "hot";
  from: string;
  subject: string;
  preview: string;
  action: string;
};

function ReplyTriage() {
  const items: TriageItem[] = [
    {
      id: "T-04812",
      ts: "T+00:47s",
      cls: "REPLY.POSITIVE",
      tone: "signal",
      from: "Anil S. — Partner, Vellum Capital",
      subject: "Re: 4 firms in your portfolio shipping the same RAG bug",
      preview: "Interested. I'm at the All Markets summit Wed-Thu — can your team take a 20-min slot Friday 11:00 PT? I'll loop in the platform partner.",
      action: "Auto-booked Fri 11:00 PT. Lanes B+C paused. Calendar invite sent.",
    },
    {
      id: "T-04813",
      ts: "T+01:12s",
      cls: "REPLY.OBJECTION",
      tone: "amber",
      from: "Jess R. — VP RevOps, Foundry",
      subject: "Re: Your team's reply rate vs ours",
      preview: "We tried something similar with [competitor] in 2024 and got blacklisted on 3 SPF pools. Why is yours different?",
      action: "Drafted reply citing rotation policy + 30-day audit. Held for human send.",
    },
    {
      id: "T-04814",
      ts: "T+01:28s",
      cls: "REPLY.NOT-NOW",
      tone: "ghost",
      from: "Marisol O. — COO, Hardline Logistics",
      subject: "Re: 22% revenue compression in your sector",
      preview: "Bandwidth in Q3 is brutal. Catch me end of August? I'm the right person but not the right week.",
      action: "Re-engage node armed for D+74 (2026-07-21). Lane A+B paused.",
    },
    {
      id: "T-04815",
      ts: "T+02:03s",
      cls: "REPLY.HARD-NO",
      tone: "hot",
      from: "K. Bauer — Head of Talent, Northway",
      subject: "Re: We could ship you 15 SDR-ready meetings monthly",
      preview: "Please remove me. We're not the buyer here.",
      action: "Suppression list updated. Domain-level opt-out written.",
    },
    {
      id: "T-04816",
      ts: "T+02:41s",
      cls: "REPLY.POSITIVE",
      tone: "signal",
      from: "Daichi M. — Founder, Loaderbox",
      subject: "Re: How Smartlead pools are misclassified after July",
      preview: "Yes — send the full audit. If the cost-per-reply numbers hold, this is a 30-min handshake, not a procurement loop.",
      action: "Audit packet auto-attached. Cal slot offered (Mon, Wed).",
    },
  ];

  return (
    <section id="triage" className="border-b border-hairline bg-plate/40">
      <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
        <SectionHeader
          kicker="Section 05"
          eyebrow="Reply triage — the hardest part"
          title="A reply is a fork in the graph."
        />
        <p className="mt-6 max-w-2xl text-chalk text-[17px] leading-[1.65]">
          The hardest part of outbound at scale is not the sending — it&apos;s the
          replying. A 5-rep team gets buried at 800 replies per week. Cadence
          classifies each reply, drafts a response, and routes only the ones
          that need a human.
        </p>

        {/* HUD frame */}
        <div className="mt-12 plate-2 brackets-4 brackets-4--signal relative">
          <span className="br tl" /><span className="br tr" /><span className="br bl" /><span className="br br" />

          {/* Header strip */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 md:px-6 py-3 border-b border-hairline">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-phosphor inline-block phosphor-blink" />
              <span className="label label--phosphor">TRIAGE.STREAM</span>
            </span>
            <span className="label hidden md:inline truncate">/ RUN.0428.ICP-VC.SeriesA / inbox window 03:14 LOCAL</span>
            <span className="label">5 / 32 SHOWN</span>
          </div>

          {/* Column header */}
          <div className="hidden md:grid grid-cols-[78px_88px_140px_1fr_300px] gap-3 px-5 md:px-6 py-2 border-b border-hairline text-[10px] font-mono uppercase tracking-[0.16em] text-slate">
            <span>ID</span>
            <span>T+</span>
            <span>CLASSIFY</span>
            <span>FROM // SUBJECT</span>
            <span>ACTION DISPATCHED</span>
          </div>

          {/* Rows */}
          <ul className="divide-y divide-hairline font-mono text-[12.5px]">
            {items.map((it) => (
              <TriageRow key={it.id} item={it} />
            ))}
          </ul>

          {/* Footer strip */}
          <div className="grid grid-cols-[1fr_auto] gap-3 items-center px-5 md:px-6 py-3 border-t border-hairline">
            <span className="label">&gt;&gt;&gt; AUTO-CLASSIFIER v3 // 96.4% precision // 27 humans-in-loop</span>
            <span className="flex items-center gap-2 label">
              <span className="text-bone phosphor-blink">_</span>
              <span>WAITING NEXT</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TriageRow({ item }: { item: TriageItem }) {
  const toneColor =
    item.tone === "signal" ? "text-signal"
    : item.tone === "amber" ? "text-amber"
    : item.tone === "hot" ? "text-hot"
    : "text-slate";
  const dotColor =
    item.tone === "signal" ? "bg-signal"
    : item.tone === "amber" ? "bg-amber"
    : item.tone === "hot" ? "bg-hot"
    : "bg-slate";
  return (
    <li className="crt-row">
      {/* Mobile stack */}
      <div className="md:hidden p-5 grid gap-2">
        <div className="flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 inline-block ${dotColor}`} />
            <span className={`label ${toneColor === "text-signal" ? "label--signal" : ""}`} style={item.tone === "amber" ? { color: "var(--amber)" } : item.tone === "hot" ? { color: "var(--hot)" } : undefined}>{item.cls}</span>
          </span>
          <span className="label">{item.ts}</span>
        </div>
        <div className="text-bone">{item.from}</div>
        <div className="text-chalk text-[12px]">{item.subject}</div>
        <div className="text-slate italic text-[12px]">"{item.preview}"</div>
        <div className="mt-1 grid grid-cols-[64px_1fr] gap-2"><span className="label">ACTION</span><span className="text-bone text-[12px]">{item.action}</span></div>
      </div>

      {/* Desktop dense row */}
      <div className="hidden md:grid grid-cols-[78px_88px_140px_1fr_300px] gap-3 items-start px-5 md:px-6 py-3.5">
        <span className="text-slate tnum">{item.id}</span>
        <span className="text-chalk tnum">{item.ts}</span>
        <span className="flex items-center gap-2 truncate">
          <span className={`w-1.5 h-1.5 inline-block shrink-0 ${dotColor}`} />
          <span className={`${toneColor} truncate`}>{item.cls}</span>
        </span>
        <div className="min-w-0">
          <div className="text-bone truncate">{item.from}</div>
          <div className="text-chalk text-[11.5px] truncate mt-0.5">{item.subject}</div>
          <div className="text-slate italic text-[11.5px] mt-1 line-clamp-2">"{item.preview}"</div>
        </div>
        <div className="text-bone text-[11.5px] leading-[1.55]">
          <span className="text-signal">▸</span> {item.action}
        </div>
      </div>
    </li>
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

        <div className="mt-12 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
          {tiers.map((t, idx) => (
            <div
              key={t.name}
              className={
                "bg-steel p-7 flex flex-col relative " +
                (t.highlight ? "ring-1 ring-signal ring-inset" : "")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="label">[ {String(idx + 1).padStart(2, "0")} ]</span>
                  <span className="label label--bone">{t.name}</span>
                </div>
                {t.highlight && (
                  <span className="label label--signal">// MOST PICKED</span>
                )}
              </div>
              <div className="mt-4 font-display font-bold text-[40px] leading-none tnum">
                {t.price}
              </div>
              <div className="text-chalk text-[13px] mt-1 font-mono">{t.cadence}</div>
              <span className={`block w-12 h-[2px] mt-5 ${t.highlight ? "bg-signal" : "bg-hairline-bright"}`} />
              <p className="mt-5 text-chalk text-[14.5px] italic">{t.oneliner}</p>
              <ul className="mt-5 space-y-2 text-[14px] text-bone">
                {t.bullets.map((b) => (
                  <li key={b} className="grid grid-cols-[16px_1fr] gap-2 items-start">
                    <span className="font-mono text-signal text-[12px] mt-1">›</span>
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
          <ul className="md:col-span-7 space-y-0 text-[18px] font-display leading-[1.4] divide-y divide-hairline border-y border-hairline">
            {items.map((i, idx) => (
              <li
                key={i}
                className="grid grid-cols-[40px_28px_1fr] gap-3 py-5"
              >
                <span className="font-mono text-slate text-[11px] tracking-wider mt-[6px] tnum">{String(idx + 1).padStart(2, "0")}</span>
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
          <span className="label label--signal">[ START A RUN ]</span>
          <h2 className="mt-4 font-display font-bold text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.03em]">
            Your first reply lands{" "}
            <span className="text-signal italic glow-signal">inside two weeks.</span>
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
          <ul className="space-y-2 text-[13px] font-mono uppercase tracking-[0.14em]">
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
        <span className="block w-8 h-[1px] bg-hairline-bright" />
        <span className="label label--signal">[ {eyebrow.toUpperCase()} ]</span>
      </div>
      <h2 className="mt-5 font-display font-bold text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.03em]">
        {title}
      </h2>
      <span className="block w-14 h-[2px] bg-signal mt-5" />
    </div>
  );
}
