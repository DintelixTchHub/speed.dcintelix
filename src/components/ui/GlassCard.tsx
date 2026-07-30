"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "brand" | "secondary" | "none";
  hudBorder?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = "none",
  hudBorder = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card",
        "relative overflow-hidden",
        hover && "glass-card-hover",
        glow === "brand" && "glow-brand",
        glow === "secondary" && "glow-secondary",
        hudBorder && "hud-border",
        "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
