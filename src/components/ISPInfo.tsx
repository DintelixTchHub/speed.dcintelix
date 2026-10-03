"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Globe, Activity, TrendingUp, Award, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ISP, ispService } from "@/services/isp.service";
import { cn } from "@/lib/utils";

export function ISPInfo() {
  const { data: isps = [], isLoading } = useQuery<ISP[]>({
    queryKey: ["isps", "list"],
    queryFn: () => ispService.getISPList(),
  });

  const topISP = isps[0];
  const hasISPs = isps.length > 0;
  const stats = [
    {
      label: "Top ISP",
      value: topISP ? topISP.name : "N/A",
      icon: Award,
      color: "brand",
    },
    {
      label: "Avg Download",
      value: topISP ? `${topISP.avgDownload} Mbps` : "N/A",
      icon: TrendingUp,
      color: "secondary",
    },
    {
      label: "Measured Tests",
      value: hasISPs ? isps.reduce((sum, isp) => sum + isp.users, 0).toLocaleString() : "N/A",
      icon: Activity,
      color: "secondary",
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-brand" />
          <h3 className="text-lg font-semibold text-text-primary">
            ISP Rankings
          </h3>
        </div>
        <GlassCard className="p-8 text-center text-text-secondary">
          Loading ISP data...
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-brand" />
        <h3 className="text-lg font-semibold text-text-primary">
          Rwanda & East Africa ISP Rankings
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <GlassCard hover key={stat.label} className="p-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${stat.color === "brand" ? "rgba(0,255,136,0.1)" : "rgba(0,217,255,0.1)"}`,
              }}
            >
              <stat.icon
                className={cn("w-5 h-5", stat.color === "brand" ? "text-brand" : "text-secondary")}
              />
            </div>
            <p className="text-2xl font-bold font-mono text-text-primary mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-text-secondary uppercase tracking-widest">
              {stat.label}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard hudBorder className="p-6">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-4">
          Leading Providers
        </h4>
        <div className="space-y-3">
          {hasISPs ? (
            isps.slice(0, 5).map((isp, index) => (
              <div
                key={isp.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-background bg-linear-to-r from-brand to-secondary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{isp.name}</p>
                    <div className="flex flex-col gap-1 mt-0.5 text-xs text-text-secondary">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-text-secondary" />
                        <span>
                          {isp.location ?? isp.country ?? "Unknown"}
                        </span>
                      </div>
                      {isp.networkType && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Type:</span>
                          <span>{isp.networkType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold text-text-primary">
                      {isp.avgDownload} Mbps
                    </p>
                    <p className="text-xs text-text-secondary">DL</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold text-text-primary">
                      {isp.avgUpload} Mbps
                    </p>
                    <p className="text-xs text-text-secondary">UL</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold text-text-primary">
                      {isp.avgPing} ms
                    </p>
                    <p className="text-xs text-text-secondary">PING</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <GlassCard className="p-8 text-center text-text-secondary">
              No ISP data available.
            </GlassCard>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
