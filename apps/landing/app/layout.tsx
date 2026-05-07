import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cadence — outbound sales machines for operators",
  description:
    "Multi-channel outbound — email, LinkedIn, voice — wired into one sequence engine with deliverability, persona-based copy, and reply triage. Sold as managed service or self-serve SaaS.",
  metadataBase: new URL("https://outbound-sales-machines.prin7r.com"),
  openGraph: {
    title: "Cadence — outbound sales machines",
    description:
      "Sequences as flowcharts. Throughput as a metric. Deliverability as table stakes. The outbound machine for operators who measure.",
    url: "https://outbound-sales-machines.prin7r.com"
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
