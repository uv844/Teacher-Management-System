
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { User, GraduationCap, Mail, Calendar, Hash } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          toast.error("Failed to load profile");
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="p-20 text-center font-mono uppercase tracking-widest opacity-50">Loading Profile...</div>;
  if (!profile) return <div className="p-20 text-center font-mono uppercase tracking-widest text-red-500">Error loading profile data.</div>;

  // Resiliently handle teacher data (handle both array and object responses)
  const teacherInfo = Array.isArray(profile?.teachers) ? profile.teachers[0] : profile?.teachers;

  return (
    <div className="p-8 md:p-16 w-full relative">
      <header className="mb-16 relative">
        <div className="absolute -left-12 top-0 text-[200px] font-display text-bg-dark/[0.03] pointer-events-none select-none leading-none">USER</div>
        <h2 className="text-5xl md:text-6xl leading-[0.8] text-bg-dark relative z-10">PROFILE</h2>
        <p className="text-accent uppercase font-black tracking-[0.4em] text-xs mt-4 ml-2 relative z-10">Personal Identity / 02</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* User Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-bg-dark p-8 shadow-[12px_12px_0px_0px_rgba(5,5,5,1)]"
        >
          <div className="flex items-center gap-4 mb-8 text-accent">
            <User size={24} />
            <span className="text-[10px] uppercase font-black tracking-widest">Account Info</span>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Full Name</label>
              <p className="text-3xl font-display uppercase leading-tight">{profile?.first_name} {profile?.last_name}</p>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Email Address</label>
              <p className="font-mono text-sm bg-bg-light p-2 border border-bg-dark/5">{profile?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Teacher Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-dark text-white p-8 relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <GraduationCap size={200} />
          </div>
          <div className="flex items-center gap-4 mb-8 text-accent">
            <GraduationCap size={24} />
            <span className="text-[10px] uppercase font-black tracking-widest">Academic Records</span>
          </div>
          <div className="space-y-6 relative z-10">
            <div>
              <label className="text-[10px] uppercase font-bold text-zinc-600 block mb-1">University</label>
              <p className="text-3xl font-display uppercase leading-tight">{teacherInfo?.university_name || "Not Set"}</p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-600 block mb-1">Joined</label>
                <p className="font-mono text-xl">{teacherInfo?.year_joined || "N/A"}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-600 block mb-1">Gender</label>
                <p className="font-mono uppercase text-xl">{teacherInfo?.gender || "N/A"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent text-white p-8 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-4 mb-8 text-bg-dark">
              <Hash size={24} />
              <span className="text-[10px] uppercase font-black tracking-widest">System Metadata</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Unique Identifier</label>
                <p className="font-mono text-[10px] break-all bg-bg-dark/20 p-2">{profile?.id}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Registration Date</label>
                <p className="font-mono text-sm">{profile?.created_at ? new Date(profile.created_at).toLocaleString() : "N/A"}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] uppercase font-black tracking-widest">Session Active</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12 p-8 border-4 border-bg-dark flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
        <div className="flex items-center gap-4 text-bg-dark">
          <div className="w-10 h-10 bg-bg-dark text-white flex items-center justify-center font-display text-xl">!</div>
          <p className="text-xs font-black uppercase tracking-tight">
            Security Notice: Your academic profile is synchronized with the central faculty registry.
          </p>
        </div>
      </div>
    </div>
  );
}
