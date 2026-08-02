import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About DCintelix Speed Test",
  description:
    "Learn about DCintelix Speed Test, its mission, how it measures internet performance, and how it helps users understand connectivity trends.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About DCintelix Speed Test",
    description:
      "Learn about DCintelix Speed Test, its mission, and how it helps users understand internet performance trends.",
    url: "https://speed.dcintelix.rw/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About DCintelix Speed Test",
    description:
      "Learn about DCintelix Speed Test, its mission, and how it helps users understand internet performance trends.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">About</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">About DCintelix Speed Test</h1>
        </div>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">About Us</h2>
          <p>
            DCintelix Speed Test is an internet performance analytics platform powered by DCintelix, a technology company focused on building innovative digital solutions.
          </p>
          <p>
            Our mission is to help people understand the quality of their internet connection by providing accurate speed measurements and meaningful network insights.
          </p>
          <p>
            The platform allows users to test their internet performance, including download speed, upload speed, latency, and other network quality indicators. Through anonymous measurements, DCintelix Speed Test helps create a better understanding of internet performance trends across different regions and internet service providers.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">What We Do</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Measuring internet connection performance</li>
            <li>Providing insights into network quality</li>
            <li>Tracking internet speed trends</li>
            <li>Helping users understand ISP performance</li>
            <li>Building internet analytics solutions for a connected world</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">How It Works</h2>
          <p>
            When a user runs a speed test, the platform measures network performance by analyzing connection speed and latency. The results help users understand their current internet experience.
          </p>
          <p>We may collect anonymous technical information such as:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Internet service provider information</li>
            <li>General location information (such as country or region)</li>
            <li>Connection type</li>
            <li>Speed test results</li>
            <li>Network performance metrics</li>
          </ul>
          <p>
            This information is used to improve the platform and generate anonymous internet performance insights.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Powered By DCintelix</h2>
          <p>
            DCintelix Speed Test is developed and maintained by DCintelix.
          </p>
          <p>
            DCintelix creates technology solutions focused on innovation, software development, and digital transformation.
          </p>
          <p>
            For more information about DCintelix, visit:{" "}
            <a href="http://www.dcintelix.rw/" className="text-cyan-400 hover:underline">
              www.dcintelix.rw
            </a>
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Our Vision</h2>
          <p>
            We aim to build a trusted internet intelligence platform that helps individuals, businesses, and communities understand and improve their digital connectivity experience.
          </p>
          <p>Thank you for using DCintelix Speed Test.</p>
        </section>

        <div className="pt-4">
          <Link href="/" className="text-sm text-cyan-400 transition hover:text-cyan-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
