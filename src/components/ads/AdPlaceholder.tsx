"use client";

import { cn } from "@/lib/utils";

interface AdPlaceholderProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
}

export function AdPlaceholder({
  width = 728,
  height = 90,
  label = "Advertisement",
  className,
}: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-glass-bg border border-glass-border rounded-xl",
        className
      )}
      style={{ width: "100%", maxWidth: width, height }}
    >
      <div className="flex flex-col items-center gap-2 text-text-secondary">
        <span className="text-xs uppercase tracking-widest">{label}</span>
        <span className="text-xs opacity-50">{width}x{height}</span>
      </div>
    </div>
  );
}
