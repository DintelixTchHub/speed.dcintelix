"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { Globe, MapPin, Monitor, Wifi, Server, Clock, ChevronDown, ChevronUp, FileText } from "lucide-react";

function getBrowserInfo(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  return "Unknown";
}

function getOSInfo(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
}

function getDeviceType(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated/i.test(ua)) return "Mobile";
  return "Desktop";
}

async function getIPVersion(): Promise<string> {
  if (typeof window === "undefined") return "Unknown";
  const rtc = new RTCPeerConnection({ iceServers: [] });
  rtc.createDataChannel("");
  const offer = await rtc.createOffer();
  await rtc.setLocalDescription(offer);
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const sdp = rtc.localDescription?.sdp;
      const candidates = sdp?.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/g);
      if (candidates && candidates.some((ip) => ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172."))) {
        resolve("IPv4 (Local)");
      } else if (candidates && candidates.some((ip) => ip.includes(":"))) {
        resolve("IPv6");
      } else {
        resolve("IPv4");
      }
      rtc.close();
    }, 1000);
  }).catch(() => "IPv4");
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function AdvancedDetails() {
  const { result, isp, selectedServer, status, startTime } = useSpeedTestStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const advancedDetailsExpanded = useSpeedTestStore((state) => state.advancedDetailsExpanded);
  const setAdvancedDetailsExpanded = useSpeedTestStore((state) => state.setAdvancedDetailsExpanded);
  const [ipVersion, setIpVersion] = useState<string>("Detecting...");

  useEffect(() => {
    if (typeof window !== "undefined") {
      getIPVersion().then(setIpVersion);
    }
  }, []);

  useEffect(() => {
    setIsExpanded(advancedDetailsExpanded);
  }, [advancedDetailsExpanded]);

  if (status !== "complete" || !result) {
    return null;
  }

  const testDuration = startTime ? Date.now() - startTime : 0;

  const details = [
    { label: "ISP Name", value: isp?.isp || "Unknown", icon: Globe },
    { label: "Public IP", value: isp?.ip || "Unknown", icon: Globe },
    { label: "City", value: isp?.city || "Unknown", icon: MapPin },
    { label: "Country", value: isp?.country || "Unknown", icon: MapPin },
    { label: "Browser", value: typeof navigator !== "undefined" ? getBrowserInfo() : "Unknown", icon: Monitor },
    { label: "Operating System", value: typeof navigator !== "undefined" ? getOSInfo() : "Unknown", icon: Monitor },
    { label: "Device Type", value: typeof navigator !== "undefined" ? getDeviceType() : "Unknown", icon: Monitor },
    { label: "IP Version", value: ipVersion, icon: Wifi },
    { label: "Server", value: selectedServer?.name || "Kigali - Primary", icon: Server },
    { label: "Test Duration", value: testDuration > 0 ? formatDuration(testDuration) : "Unknown", icon: Clock },
  ];

  return (
    <div id="advanced-details" className="w-full max-w-4xl mx-auto">
      <GlassCard className="p-0 overflow-hidden">
        <button
          onClick={() => {
            const next = !isExpanded;
            setIsExpanded(next);
            setAdvancedDetailsExpanded(next);
          }}
          className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-secondary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Advanced Details
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="p-3 rounded-xl bg-white/5 border border-glass-border"
                >
                  <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">
                    {detail.label}
                  </p>
                  <p className="text-sm font-medium text-text-primary truncate">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
