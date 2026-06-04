/**
 * [SALTRUN_PRELAUNCH] — In-landing pre-launch status page.
 *
 * Destination for the next.config.mjs rewrites (`/app`, `/login`, `/signup`,
 * `/dashboard`, `/checkout`). Closes the GPT-5.5 2026-06-04 URL/app sweep
 * finding: the public CTA on the landing points at paths that no longer
 * exist as standalone surfaces while the SaaS app (apps/app/) is still a
 * Wasp fork target, not production.
 *
 * This is the "deliberate waitlist / payment fallback" branch of the
 * issue's Definition of Done:
 *   - root          → marketing landing (existing page.tsx)
 *   - /app          → this page (status + deliberate handoff)
 *   - /dashboard    → this page (status + deliberate handoff)
 *   - /checkout     → this page (status + deliberate handoff)
 *   - /login,/signup → this page (status + deliberate handoff)
 *
 * No code on this page calls the SaaS app, the database, or the in-app
 * dashboard. The visible path is:
 *   1. Read the status (PRE-LAUNCH, deliberate posture)
 *   2. Pick a path: a) Email ops for a manual handoff, b) Use the
 *      pricing CTAs on the landing to start a paid run, c) Email ops
 *      for enterprise procurement.
 *
 * Design system compliance (DESIGN.md §4-9): the page uses only the
 * brand tokens (graphite, steel, bone, slate, hairline, signal). The
 * pre-launch posture is expressed in the same mono/display split as
 * the landing — JetBrains Mono labels on every instrument tag, Space
 * Grotesk display, no violet/orange/amber accent.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Saltrun — pre-launch / app handoff",
  description:
    "The Saltrun app is in pre-launch. The landing at outbound-sales-machines.prin7r.com is the only live surface. Email ops for a manual run, or pick a paid tier on the landing to start a sequence within 14 days.",
  robots: { index: false, follow: true }
};

const OPS_EMAIL = "ops@prin7r.com";

const MAILTO_RUN =
  "mailto:ops@prin7r.com?subject=Saltrun%20run%20request&body=Plan%3A%0ACompany%3A%0ATarget%20ICP%3A%0ATime%20zone%3A%0AStart%20date%3A%0ANotes%3A%0A";

const PATHS = [
  {
    kicker: "Path 01",
    title: "Start a paid run from the landing",
    body:
      "Pick Self-serve ($490/mo) or Managed ($4,900/mo + $80/qualified meeting) on the pricing section. The Pay-in-stablecoin CTA opens a NOWPayments hosted invoice; the IPN webhook is HMAC-SHA512 verified and your run is provisioned within one business day.",
    cta: "Go to pricing",
    href: "/#pricing"
  },
  {
    kicker: "Path 02",
    title: "Email ops for a manual handoff",
    body:
      "If you need a custom ICP build, a different billing wire, or you're an Enterprise procurement team — email ops directly. We book a 45-minute call with the lead operator who will run your machine.",
    cta: "Email ops",
    href: MAILTO_RUN
  },
  {
    kicker: "Path 03",
    title: "Wait for the in-app dashboard",
    body:
      "The dashboard, sequence builder, and reply-triage UI live under apps/app/ (Wasp fork target). It is gated from docker-compose per PRI-4468; the patch removed the public apps/app host. The next public release is tracked against the portfolio revision.",
    cta: "Back to landing",
    href: "/"
  }
];

const TIMELINE = [
  { row: "00", label: "Self-serve checkout",  state: "LIVE",     note: "POST /api/checkout/nowpayments → invoice_url redirect" },
  { row: "01", label: "Managed run intake",   state: "LIVE",     note: "ops@prin7r.com handoff · 45-min lead-operator call" },
  { row: "02", label: "Enterprise intake",    state: "LIVE",     note: "ops@prin7r.com · wire/ACH alternative available" },
  { row: "03", label: "In-app dashboard",     state: "GATED",    note: "apps/app/ is a Wasp fork target; pri4468 gates the host" },
  { row: "04", label: "Multi-tenant login",   state: "GATED",    note: "Not on the public surface; SSO/audit live only on the post-launch deploy" }
];

export default function PrelaunchPage() {
  return (
    <main className="min-h-screen text-bone">
      <header className="border-b border-hairline">
        <div className="mx-auto max-w-prose px-6 md:px-10 py-5 flex items-center justify-between">
          <Link href="/" aria-label="Saltrun" className="brand-link inline-flex items-center gap-3">
            <svg width="36" height="22" viewBox="0 0 36 22" aria-hidden>
              <path d="M2 18 L9 11 L15 15 L21 6 L26 10 L34 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="square" />
              <circle cx="2" cy="18" r="1.5" fill="currentColor" />
              <circle cx="9" cy="11" r="1.5" fill="currentColor" />
              <circle cx="15" cy="15" r="1.5" fill="currentColor" />
              <circle cx="21" cy="6" r="1.5" fill="currentColor" />
              <circle cx="26" cy="10" r="1.5" fill="currentColor" />
              <circle cx="34" cy="4" r="1.5" fill="currentColor" />
            </svg>
            <span className="font-display font-bold tracking-tight text-[20px] leading-none">
              Saltrun
            </span>
            <span className="hidden sm:inline label">/ Outbound Machines</span>
          </Link>
          <Link href="/" className="btn btn-ghost justify-center">
            Back to landing
            <span aria-hidden className="font-mono text-[14px]">→</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-prose px-6 md:px-10 pt-20 pb-16">
          <div className="flex items-center gap-3 reveal">
            <span className="pulse-dot" />
            <span className="label label--signal">RUN.STATUS — PRE-LAUNCH // BUILD #02-08</span>
            <span className="hidden sm:inline label">/ TZ UTC // 14:22:07</span>
          </div>

          <h1 className="reveal mt-8 font-display font-bold leading-[0.95] tracking-[-0.03em] text-[44px] md:text-[72px] lg:text-[88px]">
            <span className="block">The app is in</span>
            <span className="block">a <span className="text-signal">deliberate</span></span>
            <span className="block">pre-launch.</span>
          </h1>

          <p className="reveal-2 mt-10 max-w-[640px] text-[18px] md:text-[20px] leading-[1.55] text-chalk">
            The marketing landing at{" "}
            <Link href="/" className="signal font-mono">outbound-sales-machines.prin7r.com</Link>{" "}
            is the only live surface today. The in-app dashboard, multi-tenant login,
            and sequence builder are gated until the post-launch deploy lands. This
            page is the deliberate handoff — three paths, one email.
          </p>

          <div className="reveal-3 mt-12 grid md:grid-cols-3 gap-px bg-hairline border border-hairline">
            {PATHS.map((p) => (
              <article key={p.kicker} className="bg-steel p-7 flex flex-col">
                <span className="label">[ {p.kicker} ]</span>
                <h2 className="mt-4 font-display font-bold text-[22px] leading-[1.2] tracking-[-0.02em]">
                  {p.title}
                </h2>
                <p className="mt-4 text-chalk text-[14.5px] leading-[1.6] flex-1">
                  {p.body}
                </p>
                <div className="mt-6">
                  <Link
                    href={p.href}
                    className={
                      "btn justify-center w-full " +
                      (p.kicker === "Path 02" ? "" : "btn-secondary")
                    }
                  >
                    {p.cta}
                    <span aria-hidden className="font-mono text-[14px]">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Status table */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-prose px-6 md:px-10 py-20">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="label">Section 01</span>
            <span className="block w-8 h-[1px] bg-hairline-bright" />
            <span className="label label--signal">[ RUN.STATUS ]</span>
          </div>
          <h2 className="mt-5 font-display font-bold text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.03em]">
            What is live, what is gated.
          </h2>
          <span className="block w-14 h-[2px] bg-signal mt-5" />

          <div className="mt-10 plate-2 border border-hairline">
            <div className="hidden md:grid grid-cols-[64px_1fr_120px_280px] gap-4 items-center px-6 py-3 border-b border-hairline font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate">
              <span>ROW</span>
              <span>SURFACE</span>
              <span>STATE</span>
              <span>DETAIL</span>
            </div>
            <ul className="divide-y divide-hairline font-mono text-[12.5px]">
              {TIMELINE.map((row) => {
                const liveTone =
                  row.state === "LIVE"
                    ? "text-bone"
                    : row.state === "GATED"
                    ? "text-slate"
                    : "text-bone";
                return (
                  <li
                    key={row.row}
                    className="grid grid-cols-[48px_1fr] md:grid-cols-[64px_1fr_120px_280px] gap-3 items-start px-4 md:px-6 py-4"
                  >
                    <span className="text-slate tnum">{row.row}</span>
                    <span className="text-bone">{row.label}</span>
                    <span className={`hidden md:inline ${liveTone} uppercase tracking-[0.16em] text-[10.5px]`}>
                      [ {row.state} ]
                    </span>
                    <span className="hidden md:inline text-chalk text-[12px] leading-[1.55]">
                      {row.note}
                    </span>
                    {/* Mobile: stack STATE and DETAIL under the surface label */}
                    <span className="md:hidden col-span-2 -mt-1">
                      <span className={`${liveTone} uppercase tracking-[0.16em] text-[10.5px]`}>
                        [ {row.state} ]&nbsp;
                      </span>
                      <span className="text-chalk text-[12px] leading-[1.55]">
                        {row.note}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="mt-10 max-w-2xl text-chalk text-[14.5px] leading-[1.6]">
            The dashboard and login paths are intentionally not on the public
            surface. The docker-compose patch in{" "}
            <code className="font-mono text-bone">patches/pri4468-gate-app-admin-customer/</code>{" "}
            removed the <code className="font-mono text-bone">app</code> and{" "}
            <code className="font-mono text-bone">db</code> services from the
            live host; the only route that resolves to a real surface is the
            marketing landing.
          </p>
        </div>
      </section>

      {/* Closer */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-prose px-6 md:px-10 py-24">
          <div className="max-w-3xl">
            <span className="label label--signal">[ HANDOFF ]</span>
            <h2 className="mt-4 font-display font-bold text-[36px] md:text-[52px] leading-[1.05] tracking-[-0.03em]">
              One email. One operator. One reply.
            </h2>
            <p className="mt-8 max-w-xl text-chalk text-[16px] leading-[1.6]">
              Every path above ends at{" "}
              <a
                href={MAILTO_RUN}
                className="signal font-mono"
                data-action="mailto-ops"
              >
                {OPS_EMAIL}
              </a>
              . Include your plan tier (or "unsure"), target ICP, time zone,
              and the date you need the first send to leave the building. We
              reply within one business day.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/#pricing" className="btn">
                Pick a tier <span aria-hidden className="font-mono text-[14px]">→</span>
              </Link>
              <a href={MAILTO_RUN} className="btn btn-ghost" data-action="mailto-ops">
                Email ops directly <span aria-hidden className="font-mono text-[14px]">→</span>
              </a>
            </div>
            <p className="font-mono text-[11px] tracking-wider text-slate uppercase mt-10">
              {OPS_EMAIL} · 14-day first-send SLA · paid in stablecoin
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="mx-auto max-w-prose px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3 items-end border-t border-hairline">
          <div>
            <Link href="/" aria-label="Saltrun" className="brand-link inline-flex items-center gap-3">
              <svg width="36" height="22" viewBox="0 0 36 22" aria-hidden>
                <path d="M2 18 L9 11 L15 15 L21 6 L26 10 L34 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="square" />
                <circle cx="2" cy="18" r="1.5" fill="currentColor" />
                <circle cx="9" cy="11" r="1.5" fill="currentColor" />
                <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                <circle cx="21" cy="6" r="1.5" fill="currentColor" />
                <circle cx="26" cy="10" r="1.5" fill="currentColor" />
                <circle cx="34" cy="4" r="1.5" fill="currentColor" />
              </svg>
              <span className="font-display font-bold tracking-tight text-[20px] leading-none">
                Saltrun
              </span>
            </Link>
            <p className="mt-5 text-slate text-[13px] max-w-xs leading-[1.55]">
              Saltrun is operated by Prin7r. Outbound ops pod across NYC, Berlin,
              and Tbilisi. Built on the company-outbound engine.
            </p>
          </div>
          <div className="md:text-center">
            <div className="label">RUN BUILD #02-08 / 2026</div>
            <p className="mt-3 font-display italic text-[15px]">
              &ldquo;Sequences as flowcharts. Reply rate as the only ego.&rdquo;
            </p>
          </div>
          <div className="md:text-right">
            <ul className="space-y-2 text-[13px] font-mono uppercase tracking-[0.14em]">
              <li><Link href="/#channels" className="signal">Channels</Link></li>
              <li><Link href="/#blueprint" className="signal">Blueprint</Link></li>
              <li><Link href="/#deliverability" className="signal">Deliverability</Link></li>
              <li><Link href="/#pricing" className="signal">Pricing</Link></li>
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
              © 2026 Prin7r · {OPS_EMAIL}
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
