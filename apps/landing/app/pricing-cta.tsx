"use client";
/**
 * [CADENCE_PRICING_CTA] Client component that turns Self-serve and Managed
 * tiers into NOWPayments hosted-invoice CTAs.
 *
 * On click → POST /api/checkout/nowpayments → redirect to invoice_url.
 * If env not yet wired, surface a small fallback line under the button
 * so the customer never hits a dead end.
 */

import { useState } from "react";
import Link from "next/link";

export type PricingPlanId = "self_serve" | "managed";

type Props = {
  plan: PricingPlanId;
  label: string;
  className?: string;
};

const FALLBACK_MAILTO =
  "mailto:ops@prin7r.com?subject=Cadence%20checkout%20handoff&body=Plan%3A%0ACompany%3A%0ATarget%20ICP%3A%0ANotes%3A%0A";

export function PricingCta({ plan, label, className }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/checkout/nowpayments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await response.json().catch(() => null)) as
        | { invoice_url?: string; message?: string; error?: string }
        | null;

      if (response.ok && data?.invoice_url) {
        window.location.href = data.invoice_url;
        return;
      }

      const message =
        data?.message ??
        `Checkout unavailable (HTTP ${response.status}). Email ops to start your run.`;
      setError(message);
    } catch {
      setError("Checkout unavailable. Email ops to start your run.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-busy={busy}
        className={
          (className ?? "btn justify-center w-full") +
          (busy ? " opacity-60 cursor-not-allowed" : "")
        }
      >
        {busy ? "Opening invoice…" : label}
        <span aria-hidden className="font-mono text-[14px]">→</span>
      </button>
      {error && (
        <p className="mt-3 text-[12px] text-slate italic">
          {error}{" "}
          <Link href={FALLBACK_MAILTO} className="signal">
            Email ops
          </Link>
          .
        </p>
      )}
    </div>
  );
}
