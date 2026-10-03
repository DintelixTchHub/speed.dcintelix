"use client";

import { Globe, Github } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Speed Test", href: "#speed-test" },
    { label: "ISP Rankings", href: "/analytics" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="w-full mt-12 border-t border-glass-border">
      <AdBanner location="footer" className="max-w-6xl mx-auto mt-8" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Globe className="w-6 h-6 text-brand" />
              <h3 className="text-xl font-semibold">DCintelix Speed Test</h3>
            </div>
            <p className="max-w-sm text-base text-text-secondary">
              Measure internet performance, compare ISPs, and explore analytics for Rwanda and East Africa.
            </p>
            <a
              href="https://github.com/dcintelix"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base text-text-secondary hover:text-brand transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>dcintelix</span>
            </a>
          </div>

          <div>
          <h4 className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-text-secondary">
            Quick Links
          </h4>
          <ul className="space-y-2 text-base text-text-secondary">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-brand">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h4 className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-text-secondary">
                Legal
              </h4>
              <ul className="space-y-2 text-base text-text-secondary">
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
              <h4 className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-text-secondary">
                Company
              </h4>
              <ul className="space-y-2 text-base text-text-secondary">
                <li>DCintelix</li>
                <li>www.dcintelix.rw</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-glass-border pt-5 text-center text-sm text-text-secondary">
          <p>© {currentYear} DCintelix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
