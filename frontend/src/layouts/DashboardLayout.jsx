import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Mail, 
  FileText, User, Settings, 
  Briefcase
} from "lucide-react";
import { cn } from "../utils/cn";

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Mails", href: "/emails", icon: Mail },
    { name: "Resume", href: "/resume", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex font-sans" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Sidebar — always Royal Blue, same in both modes */}
      <aside className="w-[220px] bg-[#1740A6] text-[#93B4E8] fixed h-screen flex flex-col z-50">
        <div className="p-6 flex items-center space-x-3 text-white">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <Briefcase size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">HireMe</span>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-medium text-sm",
                  isActive 
                    ? "bg-[#2251C5] text-white" 
                    : "hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Status Box */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-[#0D2B75] p-3 rounded-lg text-center">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#7DD3FC]">
              Auto-send ON
            </p>
            <p className="text-[11px] font-medium text-[#7DD3FC] mt-0.5">
              9:00 AM daily
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[220px] min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="p-8 max-w-[1280px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export { DashboardLayout };
