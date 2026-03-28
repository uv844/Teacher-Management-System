
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Users, GraduationCap, LogOut, LayoutDashboard, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    ...(user?.isAdmin ? [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard }] : []),
    { to: "/profile", label: "My Profile", icon: User },
    ...(user?.isAdmin ? [{ to: "/users", label: "Users", icon: Users }] : []),
    { to: "/teachers", label: "Teachers", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-bg-light flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden bg-bg-dark text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-display tracking-tighter">TEACHER<span className="text-accent">PORTAL</span></h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={cn(
              "fixed md:relative inset-0 md:inset-auto z-40 w-full md:w-80 bg-bg-dark text-white flex flex-col h-screen",
              !isMobileMenuOpen && "hidden md:flex"
            )}
          >
            <div className="p-12 border-b border-white/5 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-[60px] font-display text-white/5 pointer-events-none select-none">TP</div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-display tracking-tighter relative z-10"
              >
                TEACHER<span className="text-accent">PORTAL</span>
              </motion.h1>
              <div className="mt-4 flex items-center gap-2 relative z-10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500">System Online</span>
              </div>
            </div>

            <div className="px-12 py-4 border-b border-white/5 bg-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-zinc-600 uppercase">Session_ID</span>
                <span className="text-[8px] font-mono text-accent uppercase">#{(Math.random() * 10000).toFixed(0)}</span>
              </div>
            </div>

            <nav className="flex-1 p-6 space-y-4">
              <p className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.3em] mb-6 px-4">Navigation</p>
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-4 px-6 py-5 text-sm font-black uppercase tracking-widest transition-all relative group overflow-hidden",
                      isActive ? "text-bg-dark" : "text-zinc-500 hover:text-white"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div 
                          layoutId="nav-bg"
                          className="absolute inset-0 bg-white z-0"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon size={20} className="relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                      {isActive && (
                        <motion.div 
                          initial={{ x: -10 }}
                          animate={{ x: 0 }}
                          className="absolute right-4 z-10 text-accent"
                        >
                          <div className="w-2 h-2 bg-accent rotate-45" />
                        </motion.div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="p-8 border-t border-white/10 bg-accent">
              <div className="mb-6">
                <p className="text-[10px] text-white/70 uppercase font-black tracking-[0.2em] mb-2">Authenticated</p>
                <p className="text-sm font-black truncate text-white uppercase tracking-tight">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest bg-bg-dark text-white hover:bg-white hover:text-bg-dark transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <LogOut size={16} />
                Terminate Session
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-auto bg-bg-light relative bg-grid">
        {/* Subtle noise overlay */}
        <div className="fixed inset-0 pointer-events-none bg-noise z-50" />
        
        {/* Decorative Vertical Marquee */}
        <div className="fixed right-0 top-0 h-full w-12 border-l border-bg-dark/10 hidden xl:flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="writing-vertical-rl text-[10px] uppercase font-black tracking-[0.5em] text-bg-dark/5 whitespace-nowrap animate-marquee-vertical">
            TEACHER MANAGEMENT SYSTEM // AUTHENTICATED SESSION // {new Date().getFullYear()} // 
            TEACHER MANAGEMENT SYSTEM // AUTHENTICATED SESSION // {new Date().getFullYear()} // 
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-full relative z-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
