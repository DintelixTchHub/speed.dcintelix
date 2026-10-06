import Link from "next/link";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Footer } from "@/components/Footer";
import { SpeedTestScene } from "@/components/SpeedTestScene";

export default function HomePage() {
  return (
    <div className="relative w-full flex-1">
      <section className="mx-auto max-w-6xl px-4 pt-10 text-center sm:px-6">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          Free Internet Speed Test in Rwanda
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
          Check your download speed, upload speed, ping, and jitter with the
          DCintelix speed test. Test your connection and explore measured ISP
          performance across Rwanda and East Africa.
        </p>
      </section>
      <SpeedTestScene />
      <AnalyticsDashboard />
      <section className="mx-auto max-w-6xl space-y-4 px-4 py-8 text-text-secondary sm:px-6">
        <h2 className="text-2xl font-bold text-text-primary">
          Understand your internet speed test results
        </h2>
        <p>
          Download speed shows how quickly your connection receives data, while
          upload speed measures how quickly it sends data. Ping measures
          response time, and jitter shows how much that response time varies.
          These results can help you understand how your internet connection is
          performing.
        </p>
        <p>
          Want to compare providers? See the{" "}
          <Link
            href="/analytics"
            className="font-semibold text-brand underline underline-offset-4"
          >
            Rwanda ISP speed rankings
          </Link>{" "}
          or run the dedicated{" "}
          <Link
            href="/speed-test"
            className="font-semibold text-brand underline underline-offset-4"
          >
            internet speed test
          </Link>
          .
        </p>
      </section>
      <Footer />
    </div>
  );
}
