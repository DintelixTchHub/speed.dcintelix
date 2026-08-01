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

function formatShareDate(date?: Date | string | number): string {
  const value = date instanceof Date ? date : new Date(date ?? Date.now());
  return value.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }

  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function generateResultImage({
  result,
  isp,
  connectionType,
  quality,
}: {
  result: { download: number; upload: number; ping: number; jitter: number; timestamp?: Date | string | number };
  isp?: { isp?: string; city?: string; country?: string; ip?: string } | null;
  connectionType?: string | null;
  quality: { label: string; color: string };
}): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1400;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not supported in this browser.");
  }

  const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, "#040814");
  background.addColorStop(0.5, "#071c2b");
  background.addColorStop(1, "#020409");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow1 = ctx.createRadialGradient(250, 220, 40, 250, 220, 260);
  glow1.addColorStop(0, "rgba(0, 255, 136, 0.24)");
  glow1.addColorStop(1, "rgba(0, 255, 136, 0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow2 = ctx.createRadialGradient(950, 260, 30, 950, 260, 260);
  glow2.addColorStop(0, "rgba(0, 217, 255, 0.18)");
  glow2.addColorStop(1, "rgba(0, 217, 255, 0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cardX = 80;
  const cardY = 100;
  const cardWidth = canvas.width - cardX * 2;
  const cardHeight = canvas.height - 140;

  ctx.fillStyle = "rgba(9, 15, 24, 0.8)";
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 36);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 36);
  ctx.stroke();

  ctx.fillStyle = "#00FF88";
  ctx.fillRect(cardX + 52, cardY + 54, 12, 12);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 40px sans-serif";
  ctx.fillText("DCintelix", cardX + 84, cardY + 70);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "600 18px sans-serif";
  ctx.fillText("Internet Speed Test", cardX + 52, cardY + 120);

  ctx.fillStyle = quality.color;
  ctx.fillRect(cardX + cardWidth - 210, cardY + 42, 150, 42);
  ctx.fillStyle = "#061018";
  ctx.font = "700 20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(quality.label, cardX + cardWidth - 135, cardY + 70);
  ctx.textAlign = "left";

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 90px sans-serif";
  ctx.fillText(`${result.download.toFixed(1)}`, cardX + 52, cardY + 260);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "600 30px sans-serif";
  ctx.fillText("Mbps download", cardX + 52, cardY + 310);

  const metricStartY = cardY + 420;
  const metricCardWidth = (cardWidth - 120) / 2;
  const metricCardHeight = 180;
  const metricCards = [
    { label: "Upload", value: `${result.upload.toFixed(1)} Mbps`, color: "#00D9FF", x: cardX + 52, y: metricStartY },
    { label: "Ping", value: `${result.ping.toFixed(0)} ms`, color: "#00FF88", x: cardX + 52 + metricCardWidth + 16, y: metricStartY },
    { label: "Jitter", value: `${result.jitter.toFixed(0)} ms`, color: "#FFC107", x: cardX + 52, y: metricStartY + metricCardHeight + 24 },
    { label: "Quality", value: quality.label, color: quality.color, x: cardX + 52 + metricCardWidth + 16, y: metricStartY + metricCardHeight + 24 },
  ];

  metricCards.forEach((card) => {
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    drawRoundedRect(ctx, card.x, card.y, metricCardWidth, metricCardHeight, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.stroke();

    ctx.fillStyle = card.color;
    ctx.fillRect(card.x + 22, card.y + 20, 8, 8);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "600 18px sans-serif";
    ctx.fillText(card.label, card.x + 42, card.y + 48);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 38px sans-serif";
    ctx.fillText(card.value, card.x + 42, card.y + 114);
  });

  const infoY = metricStartY + 2 * (metricCardHeight + 24) + 28;
  const infoWidth = cardWidth - 104;
  const infoItems = [
    { label: "ISP", value: isp?.isp || "Unknown" },
    { label: "Connection", value: formatConnectionType(connectionType) },
    { label: "Location", value: `${isp?.city || "Unknown"}, ${isp?.country || "Unknown"}` },
    { label: "Test Time", value: formatShareDate(result.timestamp) },
  ];

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  drawRoundedRect(ctx, cardX + 52, infoY, infoWidth, 180, 24);
  ctx.fill();

  infoItems.forEach((item, index) => {
    const x = cardX + 72 + (index % 2) * (infoWidth / 2 - 12);
    const y = infoY + 40 + Math.floor(index / 2) * 60;
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "600 16px sans-serif";
    ctx.fillText(item.label.toUpperCase(), x, y);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 24px sans-serif";
    ctx.fillText(item.value, x, y + 32);
  });

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "600 20px sans-serif";
  const footerText = `Public IP • ${isp?.ip || "Unknown"} • Quality score ${Math.max(0, Math.min(100, Math.round(result.download / 2)))}/100`;
  ctx.fillText(footerText, cardX + 52, cardHeight - 120);

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "500 18px sans-serif";
  ctx.fillText("Share on WhatsApp • Instagram • Facebook", cardX + 52, cardHeight - 80);
  ctx.fillText("speed.dcintelix.rw", cardX + 52, cardHeight - 48);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Unable to generate image."));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
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
    const shareText = `My internet speed: ${result.download.toFixed(1)} Mbps download, ${result.upload.toFixed(1)} Mbps upload, ${result.ping.toFixed(0)} ms ping and ${result.jitter.toFixed(0)} ms jitter. Quality: ${quality.label}. Shared from DCintelix.`;
    const socialCaption = `⚡ My latest internet speed test result:\n${result.download.toFixed(1)} Mbps download • ${result.upload.toFixed(1)} Mbps upload\nPing: ${result.ping.toFixed(0)} ms • Jitter: ${result.jitter.toFixed(0)} ms\nQuality: ${quality.label}\n\nPerfect for WhatsApp, Instagram, and Facebook posts!`;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    try {
      const blob = await generateResultImage({ result, isp, connectionType, quality });
      const file = new File([blob], "dcintelix-speed-test-result.png", { type: "image/png" });

      if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "DCintelix Speed Test Result",
          text: socialCaption,
          url: shareUrl,
          files: [file],
        });
        showToast("Share ready for WhatsApp, Instagram & Facebook!", "success");
        return;
      }

      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "DCintelix Speed Test Result",
          text: socialCaption,
          url: shareUrl,
        });
        showToast("Share ready for social media!", "success");
        return;
      }

      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = "dcintelix-speed-test-result.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      showToast("Image ready to share on WhatsApp, Instagram or Facebook!", "success");
    } catch (error) {
      console.error("Unable to prepare share image:", error);
      try {
        const fallbackBlob = await generateResultImage({ result, isp, connectionType, quality });
        const fallbackUrl = URL.createObjectURL(fallbackBlob);
        const anchor = document.createElement("a");
        anchor.href = fallbackUrl;
        anchor.download = "dcintelix-speed-test-result.png";
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        setTimeout(() => URL.revokeObjectURL(fallbackUrl), 1000);
        showToast("Image ready to share on social media!", "success");
      } catch {
        showToast("Unable to share result", "error");
      }
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
