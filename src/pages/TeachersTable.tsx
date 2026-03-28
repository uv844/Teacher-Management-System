
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { GraduationCap, MapPin, Calendar, ExternalLink, X, User, Mail, BookOpen, Trash2, AlertTriangle } from "lucide-react";

interface Teacher {
  id: string;
  university_name: string;
  gender: string;
  year_joined: number;
  auth_user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export default function TeachersTable() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { token, user: currentUser } = useAuth();

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTeachers(data);
      } else {
        toast.error(data.error || "Failed to fetch teachers");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Teacher record deleted");
        fetchTeachers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete record");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8 md:p-16 w-full relative">
      <header className="mb-16 relative">
        <div className="absolute -left-12 top-0 text-[200px] font-display text-bg-dark/[0.03] pointer-events-none select-none leading-none">FACULTY</div>
        <div className="flex items-center gap-4 mb-6 relative z-10">
          <div className="w-12 h-12 bg-accent flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-accent">Faculty Directory / 04</span>
        </div>
        <h2 className="text-5xl md:text-6xl leading-[0.8] text-bg-dark relative z-10">TEACHERS</h2>
        <p className="text-zinc-500 font-mono text-sm mt-6 max-w-xl relative z-10">
          Comprehensive academic mapping linking authentication identities to institutional roles and history.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-zinc-100 animate-pulse border-4 border-zinc-200" />
          ))
        ) : teachers.length === 0 ? (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-zinc-200 bg-white/50 backdrop-blur-sm">
            <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">No faculty members registered</p>
          </div>
        ) : (
          teachers.map((teacher, idx) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white border-4 border-bg-dark p-8 relative group overflow-hidden shadow-[10px_10px_0px_0px_rgba(5,5,5,1)] hover:shadow-[15px_15px_0px_0px_rgba(5,5,5,1)] transition-all"
            >
              {/* Decorative background number */}
              <div className="absolute top-[-20px] right-[-10px] text-[120px] font-display text-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {idx + 1}
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-display text-bg-dark group-hover:text-accent transition-colors">
                      {teacher.auth_user.first_name} {teacher.auth_user.last_name}
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{teacher.auth_user.email}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTeacher(teacher)}
                    className="w-12 h-12 border-4 border-bg-dark flex items-center justify-center group-hover:bg-bg-dark group-hover:text-white transition-all active:translate-x-1 active:translate-y-1"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-accent" />
                    <span className="font-bold uppercase tracking-tight break-words">{teacher.university_name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Calendar size={14} />
                      <span className="font-mono uppercase">Joined {teacher.year_joined}</span>
                    </div>
                    <div className="px-3 py-1 bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      {teacher.gender}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t-2 border-zinc-100 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-300">ID: {teacher.id.slice(0, 8).toUpperCase()}</span>
                  <div className="flex items-center gap-4">
                    {currentUser?.isAdmin && (
                      <button 
                        onClick={() => setDeletingId(teacher.id)}
                        className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <motion.button 
                      whileHover={{ x: 5 }}
                      onClick={() => setSelectedTeacher(teacher)}
                      className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2"
                    >
                      View Full Profile <ArrowUpRight size={12} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedTeacher && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeacher(null)}
              className="absolute inset-0 bg-bg-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white border-4 border-bg-dark shadow-[20px_20px_0px_0px_rgba(255,99,33,1)] p-8 md:p-12 overflow-hidden"
            >
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="absolute top-4 right-4 text-bg-dark hover:text-accent transition-colors"
              >
                <X size={32} />
              </button>

              <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-accent mb-4">
                    <User size={16} />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em]">Identity Details</span>
                  </div>
                  <h3 className="text-6xl font-display text-bg-dark leading-none mb-4">
                    {selectedTeacher.auth_user.first_name}<br />
                    <span className="text-accent">{selectedTeacher.auth_user.last_name}</span>
                  </h3>
                  <div className="flex items-center gap-3 text-zinc-500 font-mono text-sm mb-8">
                    <Mail size={14} />
                    {selectedTeacher.auth_user.email}
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                    <div>
                      <span className="text-[10px] uppercase font-black text-zinc-400 block mb-2">Gender</span>
                      <p className="font-display text-2xl">{selectedTeacher.gender}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black text-zinc-400 block mb-2">Joined</span>
                      <p className="font-display text-2xl">{selectedTeacher.year_joined}</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-1/3 bg-zinc-50 p-6 border-l-4 border-accent">
                  <div className="flex items-center gap-2 text-bg-dark mb-6">
                    <BookOpen size={16} />
                    <span className="text-[10px] uppercase font-black tracking-widest">Institution</span>
                  </div>
                  <p className="text-xl font-display uppercase leading-tight mb-4">
                    {selectedTeacher.university_name}
                  </p>
                  <div className="w-full h-px bg-zinc-200 my-6" />
                  <p className="text-[10px] font-mono text-zinc-400 leading-relaxed uppercase">
                    Verified academic record linked to system UID: {selectedTeacher.id.slice(0, 12)}...
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-bg-dark/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white border-4 border-bg-dark p-8 md:p-10 shadow-[15px_15px_0px_0px_rgba(239,68,68,1)]"
            >
              <div className="flex items-center gap-4 text-red-500 mb-6">
                <AlertTriangle size={32} />
                <h3 className="text-3xl font-display uppercase leading-none">Critical Action</h3>
              </div>
              
              <p className="text-sm font-mono text-zinc-500 uppercase leading-relaxed mb-8">
                Are you sure you want to delete this teacher record? This action cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(deletingId)}
                  className="w-full bg-red-500 text-white py-4 font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
                >
                  Confirm Deletion
                </button>
                <button 
                  onClick={() => setDeletingId(null)}
                  className="w-full bg-zinc-100 text-bg-dark py-4 font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArrowUpRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="square" 
      strokeLinejoin="inherit" 
      className={className}
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
