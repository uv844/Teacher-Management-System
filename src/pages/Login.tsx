
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        toast.success("Welcome back!");
        if (data.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Visual/Brutalist (Hero on Mobile, Side on Desktop) */}
      <div className="flex flex-col md:flex-row flex-1 bg-accent relative items-center justify-center overflow-hidden min-h-[300px] md:min-h-screen">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="absolute inset-0 flex flex-col justify-center pointer-events-none"
        >
          <div className="marquee-track whitespace-nowrap">
            <span className="text-[10vh] md:text-[20vh] font-display text-bg-dark/10 leading-none">PORTAL PORTAL PORTAL PORTAL </span>
            <span className="text-[10vh] md:text-[20vh] font-display text-bg-dark/10 leading-none">PORTAL PORTAL PORTAL PORTAL </span>
          </div>
          <div className="marquee-track whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
            <span className="text-[10vh] md:text-[20vh] font-display text-white/20 leading-none">TEACHERS TEACHERS TEACHERS TEACHERS </span>
            <span className="text-[10vh] md:text-[20vh] font-display text-white/20 leading-none">TEACHERS TEACHERS TEACHERS TEACHERS </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1, type: "spring" }}
          className="relative z-10 bg-bg-dark p-8 md:p-12 skew-box border-4 border-white shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] md:shadow-[20px_20px_0px_0px_rgba(255,255,255,1)]"
        >
          <h1 className="text-6xl md:text-8xl text-white skew-box-reverse">LOGIN</h1>
          <p className="text-accent font-mono font-bold skew-box-reverse mt-2 text-xs md:text-base">ACCESS THE PORTAL</p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-bg-dark min-h-screen md:min-h-0">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="hidden md:block mb-12">
            {/* Desktop header is handled by the left side */}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] mb-2 group-focus-within:text-accent transition-colors">Identity / Email</label>
              <input
                type="email"
                required
                className="w-full bg-transparent border-b-2 border-zinc-800 text-white text-xl py-2 focus:outline-none focus:border-accent transition-all placeholder:text-zinc-800"
                placeholder="admin@portal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-[0.2em] mb-2 group-focus-within:text-accent transition-colors">Security / Password</label>
              <input
                type="password"
                required
                className="w-full bg-transparent border-b-2 border-zinc-800 text-white text-xl py-2 focus:outline-none focus:border-accent transition-all placeholder:text-zinc-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white font-display text-2xl py-6 mt-8 hover:bg-white hover:text-bg-dark transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : (
                <>
                  ENTER PORTAL <ArrowRight size={24} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-between border-t border-zinc-800 pt-8"
          >
            <span className="text-zinc-500 text-xs uppercase font-bold tracking-widest">No account?</span>
            <Link to="/register" className="text-white font-display text-xl hover:text-accent transition-colors flex items-center gap-2">
              REGISTER <UserPlus size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
