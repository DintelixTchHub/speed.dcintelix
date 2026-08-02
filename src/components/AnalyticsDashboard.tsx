"use client";

import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Activity, BarChart3, Globe2, TimerReset, Wifi, Smartphone, MonitorSmartphone } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { analyticsService } from "@/services/analytics.service";

const palette = ["#00FF88", "#00D9FF", "#FFC107", "#8B5CF6", "#F97316", "#F43F5E"];

type OverviewData = {
  totalTests: number;
  averageDownload: number;
  averageUpload: number;
  averagePing: number;
  averageJitter: number;
  averagePacketLoss: number;
};

type TrendPoint = {
  date: string;
  download: number;
  upload: number;
  ping: number;
};

type MetricEntry = {
  name: string;
  value: number;
};

type ISPEntry = {
  name: string;
  tests: number;
  averageDownload: number;
  averagePing: number;
  rank?: number;
};

type RwandaOverviewData = {
  country: string;
  totalTests: number;
  averageDownload: number;
  averageUpload: number;
  averagePing: number;
  averageJitter: number;
  averagePacketLoss: number;
  testsToday: number;
  activeISPs: number;
  cities: number;
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

  const { data: dailyTrend } = useQuery<Array<{ date: string; count: number }>>({
    queryKey: ["analytics", "dailyTrend"],
    queryFn: (): Promise<Array<{ date: string; count: number }>> => analyticsService.getDailyStats(7),
    refetchInterval: 30000,
  });

  const { data: historyTrend } = useQuery<Array<TrendPoint>>({
    queryKey: ["analytics", "history"],
    queryFn: (): Promise<Array<TrendPoint>> => analyticsService.getHistoricalTrend("30d"),
    refetchInterval: 30000,
  });

  const { data: ispRanks } = useQuery<Array<ISPEntry>>({
    queryKey: ["analytics", "ispRankings"],
    queryFn: (): Promise<Array<ISPEntry>> => analyticsService.getISPRankings("30d"),
    refetchInterval: 30000,
  });

  const { data: rwandaOverview } = useQuery<RwandaOverviewData>({
    queryKey: ["analytics", "rwandaOverview"],
    queryFn: (): Promise<RwandaOverviewData> => analyticsService.getRwandaOverview(),
    refetchInterval: 30000,
  });

  const { data: rwandaIspRanks } = useQuery<Array<RwandaISPEntry>>({
    queryKey: ["analytics", "rwandaIspRankings"],
    queryFn: (): Promise<Array<RwandaISPEntry>> => analyticsService.getRwandaIspRankings("30d"),
    refetchInterval: 30000,
  });

  const { data: deviceStats } = useQuery<Array<MetricEntry>>({
    queryKey: ["analytics", "devices"],
    queryFn: (): Promise<Array<MetricEntry>> => analyticsService.getDeviceStats(),
    refetchInterval: 30000,
  });

  const { data: browserStats } = useQuery<Array<MetricEntry>>({
    queryKey: ["analytics", "browsers"],
    queryFn: (): Promise<Array<MetricEntry>> => analyticsService.getBrowserStats(),
    refetchInterval: 30000,
  });

  const { data: osStats } = useQuery<Array<MetricEntry>>({
    queryKey: ["analytics", "os"],
    queryFn: (): Promise<Array<MetricEntry>> => analyticsService.getOperatingSystemStats(),
    refetchInterval: 30000,
  });

  const summaryCards = [
    { label: "Total Tests", value: overview?.totalTests ?? 0, icon: Activity },
    { label: "Avg Download", value: `${overview?.averageDownload ?? 0} Mbps`, icon: Wifi },
    { label: "Avg Upload", value: `${overview?.averageUpload ?? 0} Mbps`, icon: MonitorSmartphone },
    { label: "Avg Ping", value: `${overview?.averagePing ?? 0} ms`, icon: TimerReset },
    { label: "Avg Jitter", value: `${overview?.averageJitter ?? 0} ms`, icon: BarChart3 },
    { label: "Packet Loss", value: `${overview?.averagePacketLoss ?? 0}%`, icon: Globe2 },
  ];

  const chartData = (historyTrend ?? []).map((entry) => ({
    date: new Date(entry.date).toLocaleDateString([], { month: "short", day: "numeric" }),
    download: entry.download,
    upload: entry.upload,
    ping: entry.ping,
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Analytics Platform</p>
          <h2 className="mt-2 text-3xl font-bold text-text-primary">Live Network Insights</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <GlassCard key={label} className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">{label}</p>
                <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
              </div>
              <div className="rounded-xl bg-brand/10 p-2">
                <Icon className="h-5 w-5 text-brand" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Download & Upload Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip />
                <Line type="monotone" dataKey="download" stroke="#00FF88" strokeWidth={2} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="upload" stroke="#00D9FF" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Ping Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip />
                <Line type="monotone" dataKey="ping" stroke="#FFC107" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Tests per Day</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrend ?? []}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip />
                <Bar dataKey="count" fill="#00FF88" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Browser Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={browserStats ?? []} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={3}>
                  {(browserStats ?? []).map((entry, index) => (
                    <Cell key={entry.name ?? index} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Device Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceStats ?? []} layout="vertical">
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.4)" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#00D9FF" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Rwanda Overview</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Total Tests</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{rwandaOverview?.totalTests ?? 0}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Active ISPs</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{rwandaOverview?.activeISPs ?? 0}</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Avg Download</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{rwandaOverview?.averageDownload ?? 0} Mbps</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-text-secondary">Cities</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{rwandaOverview?.cities ?? 0}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Rwanda ISP Rankings</h3>
          <div className="space-y-3">
            {(rwandaIspRanks ?? []).slice(0, 5).map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div>
                  <p className="font-semibold text-text-primary">#{entry.rank} {entry.name}</p>
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

        <GlassCard className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Operating Systems</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={osStats ?? []}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" />
                <YAxis stroke="rgba(255,255,255,0.4)" />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </motion.section>
  );
}
