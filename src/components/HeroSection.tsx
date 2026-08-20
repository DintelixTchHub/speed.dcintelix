"use client";

export function HeroSection() {
  return (
    <section className="relative w-full py-20 px-4 text-center flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src="/dc-speed-icon-logo.png"
            alt="DCintelix Speed Test logo"
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-[28px] object-cover"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-full">
          <span className="text-text-primary">DCINTELIX</span>
          <span className="block text-base sm:text-xl md:text-2xl font-light text-text-secondary mt-2">
            Rwanda & East Africa
          </span>
        </h1>
      </div>

      <p className="max-w-3xl text-sm sm:text-base md:text-lg text-text-secondary">
        Measure internet quality, compare ISP performance across Rwanda and East Africa, and monitor public network analytics through a live performance dashboard. Powered by DCINTELIX CO LTD. innovate. build. grow.
      </p>

      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          <span>Rwanda Coverage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span>ISP Benchmarking</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          <span>Public Analytics</span>
        </div>
      </div>
    </section>
  );
}
