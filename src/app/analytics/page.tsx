import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rwanda ISP Rankings & Internet Speed Analytics",
  description:
    "Compare Rwanda internet service provider performance with aggregated speed-test results for download, upload, ping, and jitter.",
  alternates: {
    canonical: "/analytics",
  },
  keywords: [
    "Rwanda ISP rankings",
    "best internet providers Rwanda",
    "Rwanda internet speed",
    "ISP speed comparison Rwanda",
    "internet performance analytics",
  ],
  openGraph: {
    type: "website",
    url: "https://speed.dcintelix.rw/analytics",
    title: "Rwanda ISP Rankings & Internet Speed Analytics | DCintelix",
    description:
      "Compare Rwanda internet service provider performance using aggregated speed-test results.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rwanda ISP Rankings & Internet Speed Analytics | DCintelix",
    description:
      "Explore aggregated download, upload, ping, and jitter results for Rwanda internet providers.",
  },
};

export default function AnalyticsPage() {
  return (
    <>
      <main className="w-full flex-1 pt-10">
        <section className="mx-auto max-w-6xl px-4 pb-6 text-center sm:px-6">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Rwanda Internet Provider Rankings
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-text-secondary">
            Compare measured internet speeds and connection quality across
            providers. These rankings summarize anonymous speed-test
            submissions; results reflect submitted tests and may vary by
            location, plan, device, and time.
          </p>
        </section>
        <AnalyticsDashboard />
      </main>
      <Footer />
    </>
  );
}
