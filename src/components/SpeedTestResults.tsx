"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { Wifi, Upload, Timer, Activity, Globe } from "lucide-react";

interface SpeedResult {
  testId: string;
  server: {
    name: string;
    location: string;
  };
  latency: number;
  downloadMbps: number;
  uploadMbps: number;
}

interface IPInfo {
  ip: string;
  isp: string;
  org: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  connection: {
    asn: number;
    org: string;
    isp: string;
    domain: string;
  };
}

interface ServerInfo {
  name: string;
  host: string;
  location: string;
}

interface SpeedTestResultsProps {
  result: SpeedResult;
  isp: IPInfo | null;
  connectionType: string | null;
  selectedServer: ServerInfo | null;
  className?: string;
}

function MetricCard(props: {
  label: string;
  value: number | string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: "brand" | "secondary" | "warning" | "error";
}) {
  const { label: lbl, value: val, unit: unt, icon: Icon, color } = props;
  const safeColor: "brand" | "secondary" | "warning" | "error" = color ?? "brand";
  type ColorKey = "brand" | "secondary" | "warning" | "error";
  type ColorValue = { bg: string; text: string };
  const colorMap: Record<ColorKey, ColorValue> = {
    brand: { bg: "rgba(0,255,136,0.1)", text: "text-brand" },
    secondary: { bg: "rgba(0,217,255,0.1)", text: "text-secondary" },
    warning: { bg: "rgba(255,193,7,0.1)", text: "text-yellow-500" },
    error: { bg: "rgba(255,59,48,0.1)", text: "text-red-500" },
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colorMap.brand.bg }}
        >
          <Icon className={"w-4 h-4 " + colorMap.brand.text} />
        </div>
        <div>
          <p className="text-xl font-bold font-mono text-text-primary">
            {typeof val === "number" ? val.toFixed(1) : val}
          </p>
          <p className="text-xs text-text-secondary uppercase tracking-widest">{lbl}</p>
        </div>
      </div>
      <p className="text-xs text-text-secondary mt-2">{unt}</p>
    </GlassCard>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-text-secondary uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium text-text-primary text-right">{value}</span>
    </div>
  );
}

export function SpeedTestResults({
  result,
  isp,
  connectionType,
  selectedServer,
  className,
}: SpeedTestResultsProps) {
  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-4", className)}>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="Download" value={result.downloadMbps} unit="Mbps" icon={Wifi} color="brand" />
        <MetricCard label="Upload" value={result.uploadMbps} unit="Mbps" icon={Upload} color="secondary" />
        <MetricCard label="Latency" value={result.latency} unit="ms" icon={Timer} color="secondary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-3.5 h-3.5 text-brand" />
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
              Connection Info
            </h4>
          </div>
          <div className="space-y-1">
            <InfoRow label="Server" value={selectedServer?.name || result.server.name} />
            <InfoRow label="Server Location" value={selectedServer?.location || result.server.location} />
            <InfoRow label="ISP" value={isp?.isp || isp?.org} />
            <InfoRow label="Country" value={isp?.country} />
            <InfoRow label="City" value={isp?.city} />
            <InfoRow label="Connection" value={connectionType} />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-3.5 h-3.5 text-secondary" />
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-widest">
              Detailed Metrics
            </h4>
          </div>
          <div className="mt-3 space-y-1">
            <InfoRow label="Test ID" value={result.testId} />
            <InfoRow label="IP Address" value={isp?.ip} />
            <InfoRow label="ASN" value={isp?.connection?.asn ? `AS${isp.connection.asn}` : null} />
            <InfoRow label="ISP Org" value={isp?.connection?.org} />
            <InfoRow label="Domain" value={isp?.connection?.domain} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
