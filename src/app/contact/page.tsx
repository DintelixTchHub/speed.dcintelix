import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact DCintelix Speed Test",
  description:
    "Get in touch with DCintelix Speed Test for support, feedback, partnerships, and business inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact DCintelix Speed Test",
    description:
      "Get in touch with DCintelix Speed Test for support, feedback, partnerships, and business inquiries.",
    url: "https://speed.dcintelix.rw/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact DCintelix Speed Test",
    description:
      "Get in touch with DCintelix Speed Test for support, feedback, partnerships, and business inquiries.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Contact</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Contact DCintelix Speed Test</h1>
        </div>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Get In Touch</h2>
          <p>
            We would love to hear from you.
          </p>
          <p>
            Whether you have questions, feedback, partnership opportunities, or need support with our platform, our team is ready to help.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Contact Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium text-white">Company:</span> DCintelix</p>
            <p><span className="font-medium text-white">Product:</span> DCintelix Speed Test</p>
            <p>
              <span className="font-medium text-white">Website:</span>{" "}
              <a href="http://www.dcintelix.rw/" className="text-cyan-400 hover:underline">
                www.dcintelix.rw
              </a>
            </p>
            <p>
              <span className="font-medium text-white">Email:</span>{" "}
              <a href="mailto:info@dcintelix.rw" className="text-cyan-400 hover:underline">
                info@dcintelix.rw
              </a>
            </p>
          </div>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Support Requests</h2>
          <p>You can contact us regarding:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Technical issues with the speed test</li>
            <li>Feedback and suggestions</li>
            <li>Partnership opportunities</li>
            <li>Business inquiries</li>
            <li>Data and privacy questions</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-7 text-gray-300">
          <h2 className="text-xl font-semibold text-white">Business Partnerships</h2>
          <p>
            We are open to collaborations with:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Internet service providers</li>
            <li>Technology companies</li>
            <li>Research organizations</li>
            <li>Digital infrastructure partners</li>
          </ul>
          <p>
            If you are interested in working with DCintelix Speed Test, please contact our team.
          </p>
        </section>

        <p className="text-sm text-gray-400">
          Thank you for choosing DCintelix Speed Test.
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
