import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { SpeedTestScene } from "@/components/SpeedTestScene";

export const metadata: Metadata = {
  title: "Internet Speed Test: Download, Upload & Ping",
  description:
    "Check your internet download speed, upload speed, ping, and jitter with the free DCintelix speed test. Get a clear snapshot of your connection performance.",
  alternates: {
    canonical: "/speed-test",
  },
  keywords: [
    "internet speed test",
    "download speed test",
    "upload speed test",
    "ping test",
    "jitter test",
    "free internet speed test",
  ],
  openGraph: {
    type: "website",
    url: "https://speed.dcintelix.rw/speed-test",
    title: "Internet Speed Test: Download, Upload & Ping | DCintelix",
    description:
      "Check your internet download speed, upload speed, ping, and jitter with the free DCintelix speed test.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Internet Speed Test: Download, Upload & Ping | DCintelix",
    description:
      "Check download speed, upload speed, ping, and jitter with the free DCintelix speed test.",
  },
};

export default function SpeedTestPage() {
  return (
    <>
      <main className="w-full flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-10 text-center sm:px-6">
          <p className="text-sm uppercase tracking-[0.28em] text-text-secondary">
            DCintelix Speed Test
          </p>
          <h1 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
            Test your internet speed
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-text-secondary">
            Check your connection with an online internet speed test. See your
            download and upload speeds, latency (ping), and jitter in one
            place.
          </p>
        </section>
        <SpeedTestScene />
        <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 text-text-secondary sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <h2 className="font-semibold text-text-primary">Download speed</h2>
            <p className="mt-2">
              Measures how quickly your connection receives data, such as when
              loading websites or streaming.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Upload speed</h2>
            <p className="mt-2">
              Measures how quickly your connection sends data, such as when
              sharing files or joining a video call.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Ping and latency</h2>
            <p className="mt-2">
              Ping is the response time between your device and the test
              endpoint. Lower latency can make interactive apps feel more
              responsive.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-text-primary">Jitter</h2>
            <p className="mt-2">
              Jitter describes changes in latency over time and can affect
              real-time calls, gaming, and other interactive connections.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
