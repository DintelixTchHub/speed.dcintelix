import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the privacy policy for DCintelix Speed Test and understand how anonymous performance data is collected and used.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "Read the privacy policy for DCintelix Speed Test and understand how anonymous performance data is collected and used.",
    url: "https://speed.dcintelix.rw/privacy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "Read the privacy policy for DCintelix Speed Test and understand how anonymous performance data is collected and used.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Legal</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Effective Date: August 1, 2026</p>
        </div>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Introduction</h2>
          <p>
            DCintelix Speed Test (&quot;we&quot;, &quot;our&quot;, or &quot;the platform&quot;) respects your privacy and is committed to protecting information collected through our services.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, and protect information when you use DCintelix Speed Test.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
          <p>
            When you use our platform, we may collect anonymous technical information, including:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Internet connection speed results</li>
            <li>Download and upload speed measurements</li>
            <li>Latency and network performance information</li>
            <li>Internet service provider information</li>
            <li>Browser and device information</li>
            <li>General location information such as country or region</li>
          </ul>
          <p>We do not require users to create accounts to perform speed tests.</p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">How We Use Information</h2>
          <p>Collected information may be used to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Provide speed testing services</li>
            <li>Improve platform performance</li>
            <li>Analyze internet performance trends</li>
            <li>Generate anonymous ISP and network analytics</li>
            <li>Detect technical issues</li>
            <li>Improve user experience</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Anonymous Data</h2>
          <p>
            DCintelix Speed Test is designed to collect performance information without requiring personally identifiable information.
          </p>
          <p>
            We do not intentionally collect sensitive personal information through speed tests.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Cookies and Analytics</h2>
          <p>We may use cookies and analytics technologies to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Understand website usage</li>
            <li>Improve website performance</li>
            <li>Measure traffic and user interaction</li>
            <li>Support advertising services such as Google AdSense</li>
          </ul>
          <p>
            Third-party providers may use cookies according to their own privacy policies.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Data Security</h2>
          <p>
            We take reasonable measures to protect collected information from unauthorized access, misuse, or disclosure.
          </p>
          <p>
            However, no online service can guarantee complete security.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Third-Party Services</h2>
          <p>Our platform may use third-party services for:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Website hosting</li>
            <li>Analytics</li>
            <li>Advertising</li>
            <li>Performance monitoring</li>
          </ul>
          <p>
            These providers may process information according to their own privacy policies.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Your Rights</h2>
          <p>
            You may contact us if you have questions about data collected through our platform or privacy concerns.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
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
