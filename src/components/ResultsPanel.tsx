"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { ArrowDown, ArrowUp, Clock, Activity, Globe, Wifi, EthernetPortIcon, Share2, FileText } from "lucide-react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/Toast";

function formatConnectionType(type: string | null | undefined): string {
  if (!type) return "Unknown";
  const map: Record<string, string> = {
    wifi: "WiFi",
    ethernet: "Ethernet",
    cellular: "Cellular",
    bluetooth: "Bluetooth",
    wimax: "WiMAX",
    other: "Other",
    none: "None",
    unknown: "Unknown",
  };
  return map[type.toLowerCase()] || type;
}

export function ResultsPanel() {
  const { result, status, isp, connectionType } = useSpeedTestStore();

  if (status !== "complete" || !result) {
    return null;
  }

  const metrics = [
    {
      label: "Download",
      value: result.download,
      unit: "Mbps",
      icon: ArrowDown,
      color: "brand" as const,
    },
    {
      label: "Upload",
      value: result.upload,
      unit: "Mbps",
      icon: ArrowUp,
      color: "secondary" as const,
    },
    {
      label: "Ping",
      value: result.ping,
      unit: "ms",
      icon: Clock,
      color: "brand" as const,
    },
    {
      label: "Jitter",
      value: result.jitter,
      unit: "ms",
      icon: Activity,
      color: "secondary" as const,
    },
  ];

  const getQuality = (
    download: number,
    thresholds: { excellent: number; good: number; fair: number } = { excellent: 200, good: 100, fair: 50 }
  ): { label: string; color: string } => {
    if (download >= thresholds.excellent) return { label: "Excellent", color: "#00FF88" };
    if (download >= thresholds.good) return { label: "Good", color: "#00D9FF" };
    if (download >= thresholds.fair) return { label: "Fair", color: "#FFC107" };
    return { label: "Poor", color: "#FF3B30" };
  };

  const quality = getQuality(result.download);
  const ConnectionIcon = connectionType === "ethernet" ? EthernetPortIcon : Wifi;

  const handleShare = async () => {
    const shareData = {
      title: "DCintelix Speed Test Result",
      text: `My internet speed: ${result.download.toFixed(1)} Mbps download, ${result.upload.toFixed(1)} Mbps upload, ${result.ping.toFixed(0)} ms ping, ${result.jitter.toFixed(0)} ms jitter. Quality: ${quality.label}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text} - ${shareData.url}`
        );
        showToast("Result copied to clipboard!", "success");
      }
    } catch {
      showToast("Unable to share result", "error");
    }
  };

  const handleViewAdvancedDetails = () => {
    const advancedDetailsEl = document.getElementById("advanced-details");
    if (advancedDetailsEl) {
      advancedDetailsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={cn("w-3 h-3 rounded-full animate-pulse")} style={{ backgroundColor: quality.color, boxShadow: `0 0 15px ${quality.color}` }} />
        <span className="text-sm font-medium tracking-widest uppercase text-text-secondary">
          Test Complete
        </span>
        <span className="text-sm font-bold px-3 py-1 rounded-full border" style={{ borderColor: quality.color, color: quality.color }}>
          {quality.label}
        </span>
      </div>

      <GlassCard className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  backgroundColor: `${metric.color}15`,
                  boxShadow: `0 0 30px ${metric.color}25`,
                }}
              >
                <metric.icon
                  className="w-7 h-7"
                  style={{ color: metric.color }}
                />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold font-mono text-text-primary mb-1">
                  <AnimatedNumber value={metric.value} duration={2} decimals={1} />
                  <span className="text-sm ml-1 text-text-secondary">{metric.unit}</span>
                </p>
                <p className="text-xs text-text-secondary uppercase tracking-widest">
                  {metric.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {(isp || connectionType) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 pt-6 border-t border-glass-border flex flex-wrap items-center justify-center gap-6"
          >
            {isp && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Globe className="w-4 h-4 text-secondary" />
                <span>{isp.isp}</span>
              </div>
            )}
            {connectionType && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <ConnectionIcon className="w-4 h-4 text-secondary" />
                <span>{formatConnectionType(connectionType)}</span>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <NeoButton onClick={handleShare} variant="secondary" size="sm">
            <Share2 className="w-4 h-4" />
            Share Result
          </NeoButton>
          <NeoButton onClick={handleViewAdvancedDetails} variant="outline" size="sm">
            <FileText className="w-4 h-4" />
            View Advanced Details
          </NeoButton>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
