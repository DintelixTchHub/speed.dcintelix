"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrendingUp } from "lucide-react";
import { analyticsService } from "@/services/analytics.service";
import { useQuery } from "@tanstack/react-query";

type HistoryPoint = {
  date: string;
  download: number;
  upload: number;
  ping: number;
};

function renderLegend(props: any) {
  const { payload } = props;
  if (!payload || !Array.isArray(payload)) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-white rounded-2xl border border-white/10 bg-black/50 p-3 shadow-lg shadow-black/20">
      {payload.map((entry: any) => (
        <div key={entry.dataKey ?? entry.value} className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function SpeedHistoryChart() {
  const { data: historyData, isLoading } = useQuery<Array<HistoryPoint>>({
    queryKey: ["analytics", "speedHistory"],
    queryFn: () => analyticsService.getHistoricalTrend("30d"),
    staleTime: 60000,
  });

  const data = (historyData ?? []).map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric" }),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">
          Speed History
        </h3>
      </div>

      <GlassCard className="p-6">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.25)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.25)"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(0,255,136,0.3)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
                labelStyle={{ color: "#00FF88" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend content={renderLegend} />
              <Line
                type="monotone"
                dataKey="download"
                stroke="#00FF88"
                strokeWidth={2}
                activeDot={{ r: 6, fill: "#00FF88", stroke: "#fff", strokeWidth: 2 }}
                dot={{ r: 4, fill: "#00FF88", stroke: "#000", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="#00D9FF"
                strokeWidth={2}
                activeDot={{ r: 6, fill: "#00D9FF", stroke: "#fff", strokeWidth: 2 }}
                dot={{ r: 4, fill: "#00D9FF", stroke: "#000", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="ping"
                stroke="#FFC107"
                strokeWidth={2}
                activeDot={{ r: 6, fill: "#FFC107", stroke: "#fff", strokeWidth: 2 }}
                dot={{ r: 4, fill: "#FFC107", stroke: "#000", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </GlassCard>
    </motion.div>
  );
}
