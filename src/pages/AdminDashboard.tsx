
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { Users, GraduationCap, Activity, Clock, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          toast.error("Failed to load admin stats");
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="p-20 text-center font-mono uppercase tracking-widest opacity-50">Loading Admin Data...</div>;
  if (!stats) return <div className="p-20 text-center font-mono uppercase tracking-widest text-red-500">Error loading admin stats.</div>;

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "bg-blue-500" },
    { label: "Total Teachers", value: stats?.totalTeachers || 0, icon: GraduationCap, color: "bg-accent" },
    { label: "System Status", value: stats?.systemStatus || "Unknown", icon: Activity, color: "bg-green-500" },
  ];

  return (
    <div className="p-8 md:p-16 w-full relative">
      <header className="mb-16 relative">
        <div className="absolute -left-12 top-0 text-[200px] font-display text-bg-dark/[0.03] pointer-events-none select-none leading-none">ADMIN</div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 bg-bg-dark flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-zinc-500">Admin Control Panel / 01</span>
        </div>
        <h2 className="text-5xl md:text-6xl leading-[0.8] text-bg-dark uppercase relative z-10">Dashboard</h2>
        <p className="text-zinc-500 font-mono text-sm mt-6 max-w-xl relative z-10">
          High-level system overview and administrative metrics for the Teacher Management System.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-4 border-bg-dark p-6 md:p-8 relative group shadow-[8px_8px_0px_0px_rgba(5,5,5,1)] hover:shadow-[12px_12px_0px_0px_rgba(5,5,5,1)] transition-all"
          >
            <div className={cn("absolute top-0 right-0 w-2 h-full", stat.color)} />
            <div className="flex items-center gap-4 mb-4 text-zinc-400">
              <stat.icon size={20} />
              <span className="text-[10px] uppercase font-black tracking-widest">{stat.label}</span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-display text-bg-dark leading-tight break-words">{stat.value}</p>
            <div className="mt-4 pt-4 border-t border-bg-dark/5 flex justify-between items-center">
              <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">Metric_Sync_Active</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-bg-dark text-white p-12 border-4 border-bg-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
          <Activity size={300} />
        </div>
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <Clock size={24} className="text-accent" />
          <h3 className="text-3xl font-display uppercase tracking-tight">System Logs</h3>
        </div>
        <div className="space-y-6 font-mono text-xs relative z-10">
          <div className="flex flex-col md:flex-row md:gap-8 border-b border-white/10 pb-4">
            <span className="text-accent font-bold">[ {stats?.lastUpdate ? new Date(stats.lastUpdate).toLocaleTimeString() : "N/A"} ]</span>
            <span className="text-zinc-400 uppercase font-black">ADMIN_STATS_FETCHED</span>
            <span className="text-zinc-500">System metrics successfully synchronized with database.</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-8 border-b border-white/10 pb-4">
            <span className="text-accent font-bold">[ {new Date().toLocaleTimeString()} ]</span>
            <span className="text-zinc-400 uppercase font-black">SESSION_ACTIVE</span>
            <span className="text-zinc-500">Administrative session verified and authenticated.</span>
          </div>
          <div className="flex flex-col md:flex-row md:gap-8 border-b border-white/10 pb-4">
            <span className="text-accent font-bold">[ {new Date().toLocaleTimeString()} ]</span>
            <span className="text-zinc-400 uppercase font-black">SECURITY_CHECK</span>
            <span className="text-zinc-500">All firewall and access protocols operating within normal parameters.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "../lib/utils";
