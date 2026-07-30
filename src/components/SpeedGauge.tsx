"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { HUDMeter } from "@/components/ui/HUDMeter";

interface SpeedGaugeProps {
  speed: number;
  maxSpeed?: number;
  label: string;
  unit?: "Mbps" | "ms" | "ms" | "Mbps";
  size?: "sm" | "md" | "lg";
  color?: "brand" | "secondary";
  className?: string;
}

export function SpeedGauge({
  speed,
  maxSpeed = 1000,
  label,
  unit = "Mbps",
  size = "lg",
  color = "brand",
  className,
}: SpeedGaugeProps) {
  const animatedSpeed = useSpring(speed, {
    stiffness: 100,
    damping: 30,
  });

  const glowIntensity = useTransform(animatedSpeed, (v) => Math.min(v / maxSpeed, 1));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background: color === "brand" ? "rgba(0,255,136,0.15)" : "rgba(0,217,255,0.15)",
            scale: glowIntensity,
          }}
        />
        <HUDMeter
          value={speed}
          max={maxSpeed}
          label={label}
          unit={unit}
          size={size}
          color={color}
        />
      </div>
    </motion.div>
  );
}
