"use client";

import { motion } from "framer-motion";
import { Globe, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Speed Test", href: "#speed-test" },
    { label: "ISP Rankings", href: "/analytics" },
    { label: "Analytics", href: "/analytics" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="w-full max-w-6xl mx-auto mt-20 pt-8 pb-10 border-t border-glass-border"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-semibold">DCintelix Speed Test</h3>
          </div>
          <p className="max-w-xs text-sm text-text-secondary">
            Measure internet performance, compare ISPs, and explore analytics for Rwanda and East Africa.
          </p>
          <a
            href="https://github.com/dcintelix"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>dcintelix</span>
          </a>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition-colors hover:text-brand">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>DCintelix</li>
              <li>www.dcintelix.rw</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-glass-border pt-6 text-center text-xs text-text-secondary">
        <p>© {currentYear} DCintelix. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}
