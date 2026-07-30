"use client";

import { cn } from "@/lib/utils";

interface HUDMeterProps {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  size?: "sm" | "md" | "lg";
  color?: "brand" | "secondary" | "warning" | "error";
  className?: string;
}

export function HUDMeter({
  value,
  max = 100,
  label,
  unit = "",
  size = "md",
  color = "brand",
  className,
}: HUDMeterProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    brand: "#00FF88",
    secondary: "#00D9FF",
    warning: "#FFC107",
    error: "#FF3B30",
  };

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40"
            stroke={colorMap[color]}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${colorMap[color]})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold font-mono text-text-primary", textSizes[size])}>
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-text-secondary uppercase tracking-wider">
            {unit}
          </span>
        </div>
      </div>
      <span className="text-xs text-text-secondary uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  );
}
