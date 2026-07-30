"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedNumber({
  value,
  duration = 2,
  decimals = 0,
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionVal, value, { duration });
    const unsubscribe = motionVal.on("change", (latest) => {
      setDisplay(Number(latest.toFixed(decimals)));
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, duration, decimals, motionVal]);

  return <motion.span>{display}</motion.span>;
}
