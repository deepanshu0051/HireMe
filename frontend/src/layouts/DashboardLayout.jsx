import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Mail, 
  FileText, User, Settings, 
  Briefcase, Search, Menu, X, LogOut
} from "lucide-react";
import { cn } from "../utils/cn";
import { getRole, logout } from "../utils/auth";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const role = getRole(); // 'admin' | 'guest' | null

  const handleLogout = () => {
    logout();
    navigate("/access");
  };

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const navLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Mails", href: "/emails", icon: Mail },
    { name: "Resume", href: "/resume", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const [settings, setSettings] = useState({ autoSend: false, start: 10, end: 17 });
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [editStart, setEditStart] = useState(10);
  const [editEnd, setEditEnd] = useState(17);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const formatHour = (h) => {
    if (h === 0) return "12 AM";
    if (h === 12) return "12 PM";
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/settings`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setSettings({
            autoSend: !!data.data.autoSendEnabled,
            start: data.data.cronStartHour ?? 10,
            end: data.data.cronEndHour ?? 17
          });
          setEditStart(data.data.cronStartHour ?? 10);
          setEditEnd(data.data.cronEndHour ?? 17);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSchedule = async () => {
    if (role === "guest") {
      setToastMsg("Guest mode — saving disabled. Admin access only.");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }
    if (editStart >= editEnd) {
      setToastMsg("End time must be after start time");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem("hireme_token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/settings/schedule`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ startHour: editStart, endHour: editEnd })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(s => ({ ...s, start: editStart, end: editEnd }));
        setToastMsg("Schedule Saved!");
        setTimeout(() => { setToastMsg(""); setIsScheduleOpen(false); }, 1500);
      } else {
        setToastMsg(data.message || "Failed to save");
        setTimeout(() => setToastMsg(""), 3000);
      }
    } catch (err) {
      setToastMsg("Network error");
      setTimeout(() => setToastMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — Off-canvas on mobile, fixed on desktop */}
      <aside className={cn(
        "w-56 bg-[#1740A6] text-[#93B4E8] fixed h-screen flex flex-col z-50 transition-transform duration-300 ease-in-out", /* size-fix: w-[220px] -> w-56 */
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 flex items-center justify-between text-white"> {/* size-fix: p-6 -> p-4 */}
          <div className="flex items-center space-x-2"> {/* size-fix: space-x-3 -> space-x-2 */}
            <div className="bg-white/20 p-1.5 rounded-lg border border-white/30">
              <Briefcase size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">HireMe</span> {/* size-fix: text-xl -> text-lg */}
          </div>
          <button 
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all font-medium text-sm", /* size-fix: px-4 py-3 space-x-3 -> px-3 py-2 space-x-2 */
                  isActive 
                    ? "bg-[#2251C5] text-white" 
                    : "hover:text-white hover:bg-white"
                )}
              >
                <Icon size={16} /> {/* size-fix: size=18 -> 16 */}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Status Box + Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 relative">
          
          {isScheduleOpen && (
            <div className="absolute bottom-full left-4 bg-white shadow-2xl rounded-xl p-4 w-[280px] mb-2 z-50 border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-800 text-sm">Set Auto-Send Schedule</h3>
                <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              {role === "guest" && (
                <div className="bg-blue-50 text-blue-700 text-[10px] font-semibold leading-tight px-3 py-2 rounded-lg mb-3">
                  Schedule settings are admin-only. Login as admin to change.
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex flex-col flex-1">
                  <label className="text-[10px] font-bold text-slate-500 mb-1">Start Hour</label>
                  <select 
                    value={editStart} 
                    onChange={e => setEditStart(Number(e.target.value))}
                    className="text-sm border border-slate-200 rounded-lg p-1.5 text-slate-800 outline-none"
                  >
                    {[6,7,8,9,10,11,12].map(h => <option key={h} value={h}>{formatHour(h)}</option>)}
                  </select>
                </div>
                <span className="text-slate-300 font-bold mt-4">-</span>
                <div className="flex flex-col flex-1">
                  <label className="text-[10px] font-bold text-slate-500 mb-1">End Hour</label>
                  <select 
                    value={editEnd} 
                    onChange={e => setEditEnd(Number(e.target.value))}
                    className="text-sm border border-slate-200 rounded-lg p-1.5 text-slate-800 outline-none"
                  >
                    {[12,13,14,15,16,17,18,19,20,21,22].map(h => <option key={h} value={h}>{formatHour(h)}</option>)}
                  </select>
                </div>
              </div>

              {toastMsg && (
                <p className={`text-[11px] font-bold mb-2 text-center ${toastMsg === "Schedule Saved!" ? "text-green-600" : "text-red-500"}`}>
                  {toastMsg}
                </p>
              )}

              <button 
                onClick={handleSaveSchedule}
                disabled={role === "guest" || isSaving}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs py-2 rounded-lg transition-colors"
              >
                {isSaving ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          )}

          <button 
            onClick={() => setIsScheduleOpen(!isScheduleOpen)}
            className="w-full text-left focus:outline-none transition-transform active:scale-95 bg-[#0D2B75] hover:bg-[#0B2565] px-3 py-2 rounded-lg flex flex-col items-center justify-center border border-white/5" /* size-fix: px-3 py-2 */
          >
             <p className="text-xs uppercase font-bold tracking-wider text-[#7DD3FC]"> {/* size-fix: text-[10px] -> text-xs */}
               {settings.autoSend ? "AUTO-SEND ON" : "AUTO-SEND OFF"}
             </p>
             <p className="text-xs font-medium text-[#7DD3FC] mt-0.5 opacity-90"> {/* size-fix: text-[11px] -> text-xs */}
               {formatHour(settings.start)} - {formatHour(settings.end)}
             </p>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all" /* size-fix: px-3 py-2 */
            style={{
              backgroundColor: role === "guest" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.07)",
              color: role === "guest" ? "#FCA5A5" : "#93B4E8",
            }}
          >
            <LogOut size={16} /> {/* size-fix size 16 */}
            {role === "guest" ? "Exit Guest" : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen transition-all ml-0 md:ml-56 overflow-x-hidden" style={{ backgroundColor: "var(--bg-primary)" }}> {/* size-fix: ml-[220px] -> ml-56 */}
        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between p-3 bg-[#1740A6] text-white shadow-md z-30 sticky top-0"> {/* size-fix p-4->p-3 */}
          <div className="flex items-center space-x-2"> {/* size-fix space-x-2 */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-1 hover:bg-white rounded-md transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={20} /> {/* size-fix */}
            </button>
            <div className="bg-white/20 p-1 rounded-lg border border-white/30">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">HireMe</span> {/* size-fix text-lg->base */}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white p-1 rounded-md transition-colors"
              title={role === "guest" ? "Exit Guest" : "Logout"}
            >
              <LogOut size={18} /> {/* size-fix 20->18 */}
            </button>
          </div>
        </div>

        <div className="flex-1 relative z-10 w-full overflow-x-hidden px-3 py-3 md:px-6 md:py-6"> {/* size-fix pad */}
          {children}
        </div>
      </main>
    </div>
  );
};

export { DashboardLayout };
