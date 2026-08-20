"use client";

import { cn } from "@/lib/utils";

interface MinimalGaugeProps {
  value: number;
  maxValue?: number;
  unit?: string;
  label?: string;
  isRunning?: boolean;
  status?: string;
  onClick?: () => void;
  size?: number;
}

function buildTickMarks(cx: number, cy: number, radius: number, count: number) {
  const ticks: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  const majorEvery = Math.max(1, Math.floor(count / 12));
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % majorEvery === 0;
    const innerR = isMajor ? radius - 10 : radius - 6;
    const outerR = radius;
    const x1 = +(cx + innerR * Math.cos(angle)).toFixed(4);
    const y1 = +(cy + innerR * Math.sin(angle)).toFixed(4);
    const x2 = +(cx + outerR * Math.cos(angle)).toFixed(4);
    const y2 = +(cy + outerR * Math.sin(angle)).toFixed(4);
    ticks.push({ x1, y1, x2, y2, key: `tick-${i}` });
  }
  return ticks;
}

export function MinimalGauge({
  value,
  maxValue = 1000,
  unit = "Mbps",
  label = "Download",
  isRunning = false,
  status,
  onClick,
  size = 260,
}: MinimalGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = size / 2 - 12;
  const progressRadius = size / 2 - 22;
  const progressStrokeWidth = 5;
  const circumference = 2 * Math.PI * progressRadius;
  const progressRatio = Math.min(value / maxValue, 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const ticks = buildTickMarks(cx, cy, outerRadius, 60);
  const showGo = status === "complete" && !isRunning;

  const phaseLabel =
    status === "ping"
      ? "Ping"
      : status === "downloading"
        ? "Download"
        : status === "uploading"
          ? "Upload"
          : status === "calculatingQuality"
            ? "Quality"
            : label;

  return (
    <div
      className={cn("relative flex flex-col items-center", onClick && "cursor-pointer")}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px]"
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1.2}
        />

        {ticks.map((tick) => (
          <line
            key={tick.key}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}

        <circle
          cx={cx}
          cy={cy}
          r={progressRadius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={progressStrokeWidth}
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        <circle
          cx={cx}
          cy={cy}
          r={progressRadius}
          fill="none"
          stroke={showGo ? "#00FF88" : "#00D9FF"}
          strokeWidth={progressStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${showGo ? "rgba(0,255,136,0.5)" : "rgba(0,217,255,0.4)"})`,
          }}
        />

        <circle
          cx={cx}
          cy={cy}
          r={size / 2 - 30}
          fill="rgba(10,12,16,0.85)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {showGo ? (
          <button
            type="button"
            onClick={onClick}
            className="pointer-events-auto font-bold uppercase tracking-[0.3em] text-3xl sm:text-4xl text-brand transition-colors hover:text-white"
          >
            GO
          </button>
        ) : (
          <>
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono text-text-primary">
              {isRunning ? value.toFixed(0) : "0"}
            </span>
            <span className="text-xs sm:text-sm text-text-secondary uppercase tracking-widest mt-1">
              {unit}
            </span>
            {isRunning && (
              <span className="text-xs text-text-secondary mt-2 tracking-wide">
                {phaseLabel}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
