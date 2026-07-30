"use client";

import { SpeedTestScene } from "@/components/SpeedTestScene";
import { HeroSection } from "@/components/HeroSection";
import { AdBanner } from "@/components/ads/AdBanner";
import { ISPInfo } from "@/components/ISPInfo";
import { SpeedHistoryChart } from "@/components/SpeedHistoryChart";
import { AdvancedDetails } from "@/components/AdvancedDetails";
import { Footer } from "@/components/Footer";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";

export default function HomePage() {
  const status = useSpeedTestStore((state) => state.status);
  const showHomepageAd = ["initializing", "detectingNetwork", "selectingServer", "ping", "downloading", "uploading", "calculatingQuality", "complete"].includes(status);

  return (
    <div className="relative w-full min-h-screen">
      <SpeedTestScene>
        <div className="relative z-10 flex flex-col items-center gap-12 py-12">
          <HeroSection />
          {showHomepageAd && <AdBanner location="homepage" />}
          <ISPInfo />
          <AdBanner location="results" />
          <AdvancedDetails />
          <AdBanner location="footer" />
          <SpeedHistoryChart />
          <Footer />
        </div>
      </SpeedTestScene>
    </div>
  );
}
