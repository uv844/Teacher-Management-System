
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { UserPlus, ArrowLeft, GraduationCap, User } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    university_name: "",
    gender: "Other",
    year_joined: new Date().getFullYear().toString(),
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Account created successfully! Please login.");
        navigate("/login");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full bg-zinc-900/50 border-2 border-zinc-800 text-white px-4 py-4 focus:outline-none focus:border-accent transition-all font-mono text-sm";
  const labelClasses = "text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-2 block";

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Panel - Info */}
          <div className="md:w-1/3 flex flex-col justify-between">
            <div>
              <Link to="/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-accent transition-colors uppercase text-[10px] font-black tracking-widest mb-12">
                <ArrowLeft size={14} /> Return to Login
              </Link>
              <motion.h1 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-7xl text-white leading-[0.8] mb-6"
              >
                JOIN THE <span className="text-accent">FACULTY</span>
              </motion.h1>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Create a unified account for both authentication and academic profiling. 
                Our system bridges the gap between user data and professional records.
              </p>
            </div>

            <div className="mt-12 space-y-4 hidden md:block">
              <div className="flex items-center gap-4 text-white/50">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center font-display text-xl">01</div>
                <span className="text-[10px] uppercase font-bold tracking-widest">Auth User Table</span>
              </div>
              <div className="w-px h-8 bg-zinc-800 ml-5" />
              <div className="flex items-center gap-4 text-white/50">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center font-display text-xl">02</div>
                <span className="text-[10px] uppercase font-bold tracking-widest">Teachers Table</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="md:w-2/3 bg-zinc-900/30 backdrop-blur-xl border border-white/5 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full flex items-center gap-2 text-accent mb-2">
                  <User size={16} />
                  <span className="text-[10px] uppercase font-black tracking-[0.3em]">Identity Details</span>
                  <div className="flex-1 h-px bg-accent/20 ml-2" />
                </div>
                
                <div className="space-y-1">
                  <label className={labelClasses}>First Name</label>
                  <input name="first_name" required className={inputClasses} placeholder="John" value={formData.first_name} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Last Name</label>
                  <input name="last_name" required className={inputClasses} placeholder="Doe" value={formData.last_name} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Email Address</label>
                  <input name="email" type="email" required className={inputClasses} placeholder="john@university.edu" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Secure Password</label>
                  <input name="password" type="password" required className={inputClasses} placeholder="••••••••" value={formData.password} onChange={handleChange} />
                </div>

                <div className="col-span-full flex items-center gap-2 text-accent mt-4 mb-2">
                  <GraduationCap size={16} />
                  <span className="text-[10px] uppercase font-black tracking-[0.3em]">Academic Profile</span>
                  <div className="flex-1 h-px bg-accent/20 ml-2" />
                </div>

                <div className="col-span-full space-y-1">
                  <label className={labelClasses}>University / Institution</label>
                  <input name="university_name" required className={inputClasses} placeholder="Harvard University" value={formData.university_name} onChange={handleChange} />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Gender</label>
                  <select name="gender" className={inputClasses} value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Year Joined</label>
                  <input name="year_joined" type="number" required className={inputClasses} value={formData.year_joined} onChange={handleChange} />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#050505" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white font-display text-2xl py-6 mt-6 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {loading ? "INITIALIZING..." : "CREATE ACCOUNT"}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
