"use client";

import { motion } from "framer-motion";
import { Zap, Globe, Shield, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="w-full max-w-4xl mx-auto mt-20 pt-8 pb-12 border-t border-glass-border"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/dcintelix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-brand transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <div className="flex items-center gap-2 text-text-secondary">
            <Globe className="w-4 h-4" />
            <span className="text-sm">speedtest.dcintelix.rw</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-brand" />
            <span>Fast Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-brand" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-brand" />
            <span>Global Network</span>
          </div>
        </div>

        <p className="text-xs text-text-secondary">
          © {currentYear} DCintelix. Premium Internet Intelligence Platform.
        </p>
      </div>
    </motion.footer>
  );
}
