/**
 * [SALTRUN_LANDING_NEXT_CONFIG]
 *
 * next.config.mjs for the Saltrun landing (Next.js 15 App Router, standalone
 * output, served via Traefik on storage-contabo).
 *
 * Two responsibilities beyond the default:
 *
 *   1. Security headers (PRI-3801, P2) — `headers()` emits a baseline set on
 *      every response, including the standalone API routes
 *      (`/api/checkout/nowpayments`, `/api/webhooks/nowpayments`):
 *        - Strict-Transport-Security: HSTS preload (2y + includeSubDomains)
 *        - X-Content-Type-Options: nosniff
 *        - X-Frame-Options: DENY  (alternatively enforced by CSP frame-ancestors)
 *        - Referrer-Policy: strict-origin-when-cross-origin
 *        - Permissions-Policy: tighten the noise
 *        - Content-Security-Policy: starter policy that still allows the
 *          NOWPayments hosted-invoice redirect, mailto: links, the Reown
 *          stub, and the JetBrains Mono / Space Grotesk / Inter fonts (which
 *          are self-hosted via next/font/google in layout.tsx — no
 *          fonts.gstatic.com requests in the rendered page, so the policy
 *          does NOT need to white-list fonts.googleapis.com or
 *          fonts.gstatic.com anymore).
 *
 *   2. Rewrites for the app-surface expectation gap (PRI-3801, P2 #2).
 *      The core SaaS app at `/app`, `/login`, `/signup` is not deployed
 *      yet (apps/app/ is a Wasp fork target; P2-1 from PRI-3781). To avoid
 *      dropping a paid self-serve buyer on a generic 404, these paths
 *      rewrite to a single in-landing status page that explains the
 *      pre-launch posture and points to ops. The pricing page itself
 *      lives at the `#pricing` in-page anchor (no rewrite needed).
 *
 *      Note: `next.config` rewrites do NOT match API routes. They apply
 *      to non-API GET paths only, which is exactly what we want.
 *
 * Standalone output is preserved so the existing Dockerfile.landing /
 * docker-compose.yml pipeline is unchanged. No Traefik middleware change
 * is required to ship the headers; they ride the same response.
 *
 * Re-verify with `curl -sI https://outbound-sales-machines.prin7r.com/`
 * — expect every header below in the response.
 */

/** @type {import('next').NextConfig} */
const securityHeaders = [
  // HSTS: 2 years, include subdomains, eligible for preload.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  // Block MIME sniffing.
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // No framing — defense in depth alongside CSP frame-ancestors.
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // Don't leak Referer to third parties on cross-origin navigations.
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Tighten optional browser features we never use.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  // Baseline CSP. Notes on what we allow:
  //   - default-src 'self'                   — same-origin by default
  //   - script-src 'self' 'unsafe-inline'    — Next.js injects inline JSON
  //                                            hydration scripts; nonce-based
  //                                            tightening is a follow-up
  //   - style-src 'self' 'unsafe-inline'     — Tailwind + globals.css inject
  //                                            inline styles for the noise
  //                                            grain SVG data-URI and reveal
  //                                            animation keyframes
  //   - img-src 'self' data:                 — local + favicon data-URIs
  //   - font-src 'self'                      — self-hosted via next/font
  //   - connect-src 'self' https://nowpayments.io — invoice redirect target
  //   - frame-ancestors 'none'               — replaces X-Frame-Options
  //   - form-action 'self' mailto:           — checkout POST + contact mailto
  //   - base-uri 'self'                      — block <base> hijacks
  //   - object-src 'none'                    — block Flash / Java
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self' https://nowpayments.io",
      "frame-ancestors 'none'",
      "form-action 'self' mailto:",
      "base-uri 'self'",
      "object-src 'none'"
    ].join('; ')
  }
];

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Apply baseline to every route (HTML pages + API routes + assets).
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  async rewrites() {
    return [
      // PRI-3801 P2 #2: collapse the app-surface 404s into a single
      // branded pre-launch status page until apps/app ships.
      // PRI-5485 (2026-06-04 URL/app sweep): /dashboard and /checkout
      // added to the same collapse — the dashboard is gated from the
      // public surface by pri4468 (apps/app/ is a Wasp fork target);
      // /checkout is the public-facing pre-launch handoff, not a live
      // hosted-invoice page (the actual payment flow is the pricing
      // CTA's POST /api/checkout/nowpayments → invoice_url redirect).
      {
        source: '/app',
        destination: '/prelaunch'
      },
      {
        source: '/login',
        destination: '/prelaunch'
      },
      {
        source: '/signup',
        destination: '/prelaunch'
      },
      {
        source: '/dashboard',
        destination: '/prelaunch'
      },
      {
        source: '/checkout',
        destination: '/prelaunch'
      }
    ];
  }
};

export default nextConfig;
