"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Footer } from "@/components/Footer";
import { ResultsPanel } from "@/components/ResultsPanel";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const result = useSpeedTestStore((state) =>
    [state.result, ...state.testHistory].find((item) => item?.testId === id)
  );

  return (
    <main id="result" className="relative flex w-full flex-1 flex-col">
      {result ? (
        <section className="flex-1 py-10 sm:py-16">
          <ResultsPanel resultOverride={result} />
        </section>
      ) : (
        <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-text-primary">Result unavailable</h1>
          <p className="mt-3 max-w-md text-text-secondary">
            This result is not available in this browser session. Run a new speed test to see your results.
          </p>
          <Link href="/" className="mt-6 text-brand transition hover:text-secondary">
            Return to speed test
          </Link>
        </section>
      )}
      <Footer />
    </main>
  );
}