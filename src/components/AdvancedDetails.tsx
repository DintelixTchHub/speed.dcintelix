"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useSpeedTestStore } from "@/store/useSpeedTestStore";
import { Globe, MapPin, Monitor, Wifi, Server, Clock, ChevronDown, ChevronUp, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

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

function generatePhaseData(
  phase: "ping" | "downloading" | "uploading",
  duration: number,
  baseSpeed: number
): { time: string; speed: number }[] {
  const points: { time: string; speed: number }[] = [];
  const now = new Date();
  for (let i = 0; i <= 10; i++) {
    const time = new Date(now.getTime() + (duration / 10) * i * 1000);
    const variance = baseSpeed * 0.15;
    points.push({
      time: time.toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
      speed: Math.max(0, baseSpeed + (Math.random() - 0.5) * variance),
    });
  }
  return points;
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

  const downloadData = generatePhaseData("downloading", 15, result.download);
  const uploadData = generatePhaseData("uploading", 15, result.upload);
  const pingData = generatePhaseData("ping", 5, result.ping);

  return (
    <motion.div
      id="advanced-details"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
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

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {details.map((detail, index) => (
                    <motion.div
                      key={detail.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="p-3 rounded-xl bg-white/5 border border-glass-border"
                    >
                      <p className="text-xs text-text-secondary uppercase tracking-widest mb-1">
                        {detail.label}
                      </p>
                      <p className="text-sm font-medium text-text-primary truncate">
                        {detail.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-glass-border">
                    <p className="text-xs text-text-secondary uppercase tracking-widest mb-3">Download Graph</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={downloadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.25)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                        <YAxis stroke="rgba(255,255,255,0.25)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "1px solid rgba(0,255,136,0.3)",
                            borderRadius: "8px",
                            backdropFilter: "blur(10px)",
                          }}
                          labelStyle={{ color: "#00FF88" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line type="monotone" dataKey="speed" stroke="#00FF88" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-glass-border">
                    <p className="text-xs text-text-secondary uppercase tracking-widest mb-3">Upload Graph</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={uploadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.25)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                        <YAxis stroke="rgba(255,255,255,0.25)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "1px solid rgba(0,217,255,0.3)",
                            borderRadius: "8px",
                            backdropFilter: "blur(10px)",
                          }}
                          labelStyle={{ color: "#00D9FF" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line type="monotone" dataKey="speed" stroke="#00D9FF" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-glass-border">
                    <p className="text-xs text-text-secondary uppercase tracking-widest mb-3">Ping Graph</p>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={pingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.25)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                        <YAxis stroke="rgba(255,255,255,0.25)" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "1px solid rgba(255,193,7,0.3)",
                            borderRadius: "8px",
                            backdropFilter: "blur(10px)",
                          }}
                          labelStyle={{ color: "#FFC107" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Line type="monotone" dataKey="speed" stroke="#FFC107" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}
