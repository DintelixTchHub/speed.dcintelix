"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, Globe2, TimerReset, Wifi } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { analyticsService } from "@/services/analytics.service";

type OverviewData = {
  totalTests: number;
  averageDownload: number;
  averageUpload: number;
  averagePing: number;
  averageJitter: number;
  averagePacketLoss: number;
};

type ISPEntry = {
  name: string;
  tests: number;
  averageDownload: number;
  averagePing: number;
  rank?: number;
};

type RwandaISPEntry = {
  name: string;
  rank: number;
  averageDownload: number;
  averageUpload: number;
  averagePing: number;
  averageJitter: number;
  packetLoss: number;
  tests: number;
  country: string;
};

export function AnalyticsDashboard() {
  const { data: overview } = useQuery<OverviewData>({
    queryKey: ["analytics", "overview"],
    queryFn: (): Promise<OverviewData> => analyticsService.getOverview(),
    refetchInterval: 30000,
  });

  const { data: ispRanks } = useQuery<Array<ISPEntry>>({
    queryKey: ["analytics", "ispRankings"],
    queryFn: (): Promise<Array<ISPEntry>> => analyticsService.getISPRankings("30d"),
    refetchInterval: 30000,
  });

  const { data: rwandaIspRanks } = useQuery<Array<RwandaISPEntry>>({
    queryKey: ["analytics", "rwandaIspRankings"],
    queryFn: (): Promise<Array<RwandaISPEntry>> => analyticsService.getRwandaIspRankings("30d"),
    refetchInterval: 30000,
  });

  const summaryCards = [
    { label: "Total Tests", value: overview?.totalTests ?? 0, icon: Activity },
    { label: "Avg Download", value: `${overview?.averageDownload ?? 0} Mbps`, icon: Wifi },
    { label: "Avg Ping", value: `${overview?.averagePing ?? 0} ms`, icon: TimerReset },
    { label: "Packet Loss", value: `${overview?.averagePacketLoss ?? 0}%`, icon: Globe2 },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6 text-[17px]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Analytics Platform</p>
          <h2 className="mt-2 text-xl font-bold text-text-primary">ISP Rankings</h2>
        </div>
        <p className="text-xs text-text-secondary">Rankings are built from anonymous user submissions.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <GlassCard key={label} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">{label}</p>
                <p className="mt-2 text-xl font-bold text-text-primary">{value}</p>
              </div>
              <div className="rounded-xl bg-brand/10 p-2">
                <Icon className="h-5 w-5 text-brand" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Global ISP Rankings</h3>
          <div className="space-y-2">
            {(ispRanks ?? []).slice(0, 10).map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <p className="font-semibold text-text-primary text-sm">#{entry.rank ?? "?"} {entry.name}</p>
                  <p className="text-xs text-text-secondary">{entry.tests} tests · {entry.averagePing} ms ping</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand">{entry.averageDownload} Mbps</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Rwanda ISP Rankings</h3>
          <div className="space-y-2">
            {(rwandaIspRanks ?? []).slice(0, 5).map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <p className="font-semibold text-text-primary text-sm">#{entry.rank} {entry.name}</p>
                  <p className="text-xs text-text-secondary">{entry.tests} tests · {entry.averagePing} ms ping</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand">{entry.averageDownload} Mbps</p>
                  <p className="text-xs text-text-secondary">{entry.averageUpload} Mbps UL</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
