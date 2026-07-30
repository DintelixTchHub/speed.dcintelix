"use client";

import { cn } from "@/lib/utils";
import { AdPlaceholder } from "./AdPlaceholder";

interface ResponsiveAdProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function ResponsiveAd({
  slot: _slot,
  format = "auto",
  className,
}: ResponsiveAdProps) {
  const sizes = {
    auto: { width: 728, height: 90 },
    rectangle: { width: 300, height: 250 },
    horizontal: { width: 728, height: 90 },
    vertical: { width: 160, height: 600 },
  };

  return (
    <div className={cn("w-full", className)}>
      <AdPlaceholder
        width={sizes[format].width}
        height={sizes[format].height}
        label="Sponsored"
      />
    </div>
  );
}
