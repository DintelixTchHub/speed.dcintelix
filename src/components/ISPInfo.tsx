"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Globe, Users, TrendingUp, Award, Server, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { ISP, ispService } from "@/services/isp.service";
import { cn } from "@/lib/utils";

export function ISPInfo() {
  const [isps, setIsps] = useState<ISP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadISPs = async () => {
      try {
        const data = await ispService.getISPList();
        setIsps(Array.isArray(data) ? data : []);
      } catch {
        setIsps([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadISPs();
  }, []);

  const topISP = isps[0];
  const hasISPs = isps.length > 0;
  const totalUsers = isps.reduce((sum, isp) => sum + isp.users, 0);

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
      label: "Active Users",
      value: hasISPs ? `${totalUsers >= 1000 ? `${(totalUsers / 1000).toFixed(0)}K` : totalUsers}` : "N/A",
      icon: Users,
      color: "brand",
    },
    {
      label: "Servers",
      value: "12",
      icon: Server,
      color: "secondary",
    },
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-4xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-brand" />
          <h3 className="text-lg font-semibold text-text-primary">
            ISP Rankings
          </h3>
        </div>
        <GlassCard className="p-8 text-center text-text-secondary">
          Loading ISP data...
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-brand" />
        <h3 className="text-lg font-semibold text-text-primary">
          Rwanda & East Africa ISP Rankings
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index + 0.3 }}
          >
            <GlassCard hover className="p-4">
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
          </motion.div>
        ))}
      </div>

      <GlassCard hudBorder className="p-6">
        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-4">
          Leading Providers
        </h4>
        <div className="space-y-3">
          {hasISPs ? (
            isps.slice(0, 5).map((isp, index) => (
              <motion.div
                key={isp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
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
                    <p className="text-sm font-mono font-semibold text-yellow-500">
                      ⭐ {isp.rating}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <GlassCard className="p-8 text-center text-text-secondary">
              No ISP data available.
            </GlassCard>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
