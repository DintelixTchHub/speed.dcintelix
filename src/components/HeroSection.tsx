"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="relative w-full py-20 px-4 text-center flex flex-col items-center gap-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="flex items-center gap-4"
      >
        <div className="relative">
          <img
            src="/dc-speed-icon-logo.png"
            alt="DCintelix Speed Test logo"
            className="h-20 w-20 rounded-[28px] object-cover shadow-[0_0_30px_rgba(0,255,136,0.45)]"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-text-primary">DCintelix</span>
          <span className="block text-xl md:text-2xl font-light text-text-secondary mt-2">
            Speed Test
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="max-w-2xl text-base md:text-lg text-text-secondary"
      >
        Premium futuristic internet intelligence platform. Test your download, upload speeds and ping with precision.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-4 text-xs text-text-secondary"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          <span>Live Servers</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: "0.5s" }} />
          <span>High Precision</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" style={{ animationDelay: "1s" }} />
          <span>Real-time Analytics</span>
        </div>
      </motion.div>
    </motion.section>
  );
}
