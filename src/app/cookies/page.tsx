import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Review DCintelix Speed Test's cookie policy and learn how cookies support functionality, analytics, and advertising.",
  alternates: {
    canonical: "/cookies",
  },
  openGraph: {
    title: "Cookie Policy",
    description:
      "Review DCintelix Speed Test's cookie policy and learn how cookies support functionality, analytics, and advertising.",
    url: "https://speed.dcintelix.rw/cookies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy",
    description:
      "Review DCintelix Speed Test's cookie policy and learn how cookies support functionality, analytics, and advertising.",
  },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Legal</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Cookie Policy</h1>
          <p className="text-sm text-gray-400">Effective Date: August 2, 2026</p>
        </div>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Introduction</h2>
          <p>
            This Cookie Policy explains how DCintelix Speed Test (&quot;we,&quot; &quot;our,&quot; or &quot;the Platform&quot;), powered by DCintelix, uses cookies and similar technologies when you visit our website.
          </p>
          <p>
            By continuing to use our Platform, you agree to the use of cookies as described in this policy, except where you have disabled them through your browser or cookie preferences where available.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, improve functionality, analyze performance, and, in some cases, provide relevant advertising.
          </p>
          <p>
            Cookies do not typically contain information that directly identifies you, but they may be linked with information associated with your browser or device.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">How We Use Cookies</h2>
          <p>DCintelix Speed Test uses cookies to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Ensure the Platform functions properly.</li>
            <li>Remember your preferences and settings.</li>
            <li>Improve website performance and user experience.</li>
            <li>Measure website traffic and usage.</li>
            <li>Analyze anonymous speed test activity.</li>
            <li>Support advertising services where applicable.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Types of Cookies We Use</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Essential Cookies</h3>
              <p>
                These cookies are necessary for the Platform to function correctly. Examples include maintaining website functionality, security features, preventing abuse, and load balancing.
              </p>
              <p>Without these cookies, some parts of the Platform may not work properly.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Performance and Analytics Cookies</h3>
              <p>
                These cookies help us understand how visitors use the Platform. They may collect anonymous information such as pages visited, time spent on pages, browser type, device type, operating system, general geographic region, and speed test usage statistics.
              </p>
              <p>This information helps us improve the Platform.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Preference Cookies</h3>
              <p>
                These cookies remember your preferences, such as language selection, display settings, and other user preferences. These cookies improve your experience by avoiding the need to re-enter preferences during future visits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">Advertising Cookies</h3>
              <p>
                If advertising is enabled on the Platform, third-party advertising providers such as Google AdSense may use cookies to display relevant advertisements, limit repetition, measure advertising performance, and personalize advertising based on browsing activity where permitted.
              </p>
              <p>Advertising partners may set their own cookies according to their respective privacy policies.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Third-Party Services</h2>
          <p>
            We may use trusted third-party services that place or access cookies, including services for website analytics, advertising, website performance monitoring, and security.
          </p>
          <p>Each third-party service operates under its own privacy and cookie policies.</p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Managing Cookies</h2>
          <p>
            Most web browsers allow you to view stored cookies, delete cookies, block all cookies, block cookies from specific websites, and receive notifications before cookies are stored.
          </p>
          <p>
            Please note that disabling cookies may affect certain features and functionality of the Platform.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Anonymous Analytics</h2>
          <p>
            DCintelix Speed Test may collect anonymous technical information related to internet performance testing, including internet service provider, download speed, upload speed, latency, jitter, packet loss, browser information, device information, and general location.
          </p>
          <p>
            This information is used to improve our services and generate anonymous network performance insights. It is not intended to directly identify individual users.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our services.
          </p>
          <p>Any updates will be published on this page with a revised Effective Date.</p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2>
          <div className="space-y-1">
            <p>DCintelix</p>
            <p>
              Email: <a href="mailto:info@dcintelix.rw" className="text-cyan-400 hover:underline">info@dcintelix.rw</a>
            </p>
            <p>
              Website: <a href="http://www.dcintelix.rw/" className="text-cyan-400 hover:underline">www.dcintelix.rw</a>
            </p>
          </div>
        </section>

        <p className="text-sm text-gray-400">
          Thank you for using DCintelix Speed Test, powered by DCintelix.
        </p>

        <div className="pt-4">
          <Link href="/" className="text-sm text-cyan-400 transition hover:text-cyan-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
