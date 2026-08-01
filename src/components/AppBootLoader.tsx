"use client";

import { BrandMark } from "@/components/BrandMark";
import { ReactNode, useEffect, useState } from "react";

export function AppBootLoader({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 1600);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`app-shell ${isReady ? "app-shell--ready" : ""}`}>
      <div className="app-loader" aria-live="polite" aria-busy={!isReady}>
        <div className="app-loader__shell">
          <div className="app-loader__ring" aria-hidden="true" />
          <div className="app-loader__brand-wrap">
            <BrandMark size={110} darkBackground className="app-loader__brand" />
          </div>
        </div>
        <p className="app-loader__label">Initializing DCINTELIX CO LTD network performance platform</p>
      </div>

      <div className="app-content">{children}</div>
    </div>
  );
}
