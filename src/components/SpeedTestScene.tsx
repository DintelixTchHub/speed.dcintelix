"use client";

import dynamic from "next/dynamic";

const DynamicSpeedTestRunner = dynamic(() => import("@/components/SpeedTestRunner").then(mod => mod.SpeedTestRunner), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-4xl mx-auto h-96 flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

interface SpeedTestSceneProps {
  children?: React.ReactNode;
}

export function SpeedTestScene({ children }: SpeedTestSceneProps) {
  return (
    <div className="relative w-full min-h-[480px] sm:min-h-[560px] flex items-center justify-center bg-background">
      <div className="relative z-10 w-full">
        <DynamicSpeedTestRunner />
        {children}
      </div>
    </div>
  );
}
