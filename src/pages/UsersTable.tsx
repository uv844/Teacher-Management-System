
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { Search, Filter, ArrowUpRight, Trash2, X, AlertTriangle } from "lucide-react";
import { cn } from "../lib/utils";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_admin: boolean;
}

import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { token, user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        toast.error(data.error || "Failed to fetch users");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAdmin = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}/admin`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isAdmin: !user.is_admin }),
      });
      if (res.ok) {
        toast.success(`User ${user.is_admin ? 'demoted' : 'promoted'} successfully`);
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update admin status");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  return (
    <div className="p-8 md:p-16 w-full relative">
      <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
        <div className="absolute -left-12 top-0 text-[200px] font-display text-bg-dark/[0.03] pointer-events-none select-none leading-none">DATA</div>
        <div className="relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            className="h-1 bg-accent mb-6"
          />
          <h2 className="text-5xl md:text-6xl leading-[0.8] text-bg-dark">USERS</h2>
          <p className="text-zinc-500 uppercase font-black tracking-[0.4em] text-xs mt-4 ml-2">Database Registry / 03</p>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white border-4 border-bg-dark p-4 flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(5,5,5,1)]">
            <Search size={18} className="text-bg-dark" />
            <input 
              type="text" 
              placeholder="SEARCH RECORDS..." 
              className="bg-transparent outline-none font-mono text-xs uppercase font-bold w-40 md:w-64"
            />
          </div>
          <button className="bg-bg-dark text-white p-5 border-4 border-bg-dark hover:bg-accent transition-colors shadow-[6px_6px_0px_0px_rgba(5,5,5,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="relative z-10 overflow-x-auto pb-4">
        <div className="min-w-[800px] space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1.5fr_1.5fr_1fr_160px] p-6 bg-bg-dark text-white text-[10px] uppercase font-black tracking-[0.2em]">
            <div>#</div>
            <div>Full Name</div>
            <div>Email Identity</div>
            <div className="text-right">Registration</div>
            <div className="text-right">Actions</div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm border-2 border-dashed border-zinc-200">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Accessing Secure Database...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-zinc-200 bg-white/50">
              <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">No records found in current scope</p>
            </div>
          ) : (
            users.map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="grid grid-cols-[60px_1.5fr_1.5fr_1fr_160px] p-6 bg-white border-2 border-transparent hover:border-bg-dark hover:shadow-[12px_12px_0px_0px_rgba(5,5,5,1)] transition-all group cursor-pointer relative z-10"
                >
                  <div className="font-mono text-xs text-zinc-400 group-hover:text-accent transition-colors">{(idx + 1).toString().padStart(3, '0')}</div>
                  <div className="font-black uppercase text-lg flex items-center gap-2">
                    {user.first_name} {user.last_name}
                    {user.is_admin && <ShieldCheck size={16} className="text-accent" />}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                  </div>
                  <div className="font-mono text-xs text-zinc-500 flex items-center">{user.email}</div>
                  <div className="font-mono text-xs text-zinc-400 text-right flex items-center justify-end">
                    {new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAdmin(user);
                      }}
                      title={user.is_admin ? "Demote from Admin" : "Promote to Admin"}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 border-2 transition-all font-mono text-[10px] uppercase font-black",
                        user.is_admin 
                          ? "bg-accent text-white border-accent hover:bg-bg-dark hover:border-bg-dark" 
                          : "bg-white text-zinc-400 border-zinc-200 hover:border-accent hover:text-accent"
                      )}
                    >
                      <Shield size={12} />
                      <span>{user.is_admin ? "ADMIN" : "SET ADMIN"}</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingId(user.id);
                      }}
                      className="p-2 text-zinc-300 hover:text-red-500 transition-colors border-2 border-transparent hover:border-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
            ))
          )}
        </div>
      </div>

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
                Are you sure you want to delete this user? This will also permanently remove their associated teacher record from the database.
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

      <footer className="mt-12 pt-8 border-t border-zinc-200 flex justify-between items-center">
        <p className="text-[10px] font-mono text-zinc-400 uppercase">Total Records: {users.length}</p>
        {users.length > 10 && (
          <div className="flex gap-2">
            {[1].map(p => (
              <button key={p} className={cn("w-8 h-8 font-display text-sm border-2 border-bg-dark transition-colors bg-bg-dark text-white")}>
                {p}
              </button>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
}
