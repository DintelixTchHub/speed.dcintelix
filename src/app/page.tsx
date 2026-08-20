"use client";

import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Footer } from "@/components/Footer";
import { SpeedTestScene } from "@/components/SpeedTestScene";

export default function HomePage() {
  return (
    <div className="relative w-full flex-1">
      <SpeedTestScene />
      <AnalyticsDashboard />
      <Footer />
    </div>
  );
}
