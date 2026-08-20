"use client";

import { cn } from "@/lib/utils";
import { ResponsiveAd } from "./ResponsiveAd";

interface AdBannerProps {
  location: "homepage" | "results" | "footer";
  className?: string;
}

export function AdBanner({ location, className }: AdBannerProps) {
  const formatConfig = {
    homepage: { format: "horizontal" as const },
    results: { format: "rectangle" as const },
    footer: { format: "horizontal" as const },
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto my-6", className)}>
      <ResponsiveAd {...formatConfig[location]} slot={`ad-${location}`} />
    </div>
  );
}
