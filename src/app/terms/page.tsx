import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms of service for DCintelix Speed Test and understand the rules for using the platform.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service",
    description:
      "Read the terms of service for DCintelix Speed Test and understand the rules for using the platform.",
    url: "https://speed.dcintelix.rw/terms",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service",
    description:
      "Read the terms of service for DCintelix Speed Test and understand the rules for using the platform.",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Legal</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Terms of Service</h1>
          <p className="text-sm text-gray-400">Effective Date: August 1, 2026</p>
        </div>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Acceptance of Terms</h2>
          <p>
            By accessing or using DCintelix Speed Test, you agree to these Terms of Service.
          </p>
          <p>
            If you do not agree with these terms, please do not use the platform.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Use of Service</h2>
          <p>
            DCintelix Speed Test provides internet performance testing and analytics services.
          </p>
          <p>
            Users agree to use the platform responsibly and only for legitimate purposes.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Accuracy of Results</h2>
          <p>Speed test results may vary depending on:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Network conditions</li>
            <li>Device performance</li>
            <li>Internet provider limitations</li>
            <li>Background applications</li>
            <li>Location and connection quality</li>
          </ul>
          <p>
            Results are provided for informational purposes and should not be considered a guarantee of network performance.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Prohibited Activities</h2>
          <p>Users must not:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Attempt to damage or disrupt the platform</li>
            <li>Abuse testing services</li>
            <li>Attempt unauthorized access</li>
            <li>Use the platform for illegal activities</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Intellectual Property</h2>
          <p>
            All content, branding, software, and technology related to DCintelix Speed Test are owned by or licensed to DCintelix.
          </p>
          <p>
            Users may not copy, modify, or redistribute platform content without permission.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Service Availability</h2>
          <p>
            We work to keep the platform available and reliable, but we do not guarantee uninterrupted access.
          </p>
          <p>
            We may update, modify, or improve the service at any time.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Limitation of Liability</h2>
          <p>
            DCintelix is not responsible for losses or damages caused by reliance on speed test results or temporary service interruptions.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Changes To Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Continued use of the platform means you accept updated terms.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <p>For questions about these terms:</p>
          <div className="space-y-1">
            <p>DCintelix</p>
            <p>
              Email: <a href="mailto:info@dcintelix.rw" className="text-cyan-400 hover:underline">info@dcintelix.rw</a>
            </p>
            <p>
              Website: <a href="http://www.dcintelix.rw" className="text-cyan-400 hover:underline">www.dcintelix.rw</a>
            </p>
          </div>
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
