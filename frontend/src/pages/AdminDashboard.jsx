import React from "react";
import {
  ArrowRight, Send, MessageSquare, Calendar,
  Code, Layers, Globe, Server, Monitor,
  Clock, Lightbulb, Zap
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";

// ─── Helpers ────────────────────────────────────────────────────
const today = new Date();
const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const todayLabel = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

// Week chart data (Mon–Sun)
const weekData = [
  { day: "Mon", val: 5 },
  { day: "Tue", val: 5 },
  { day: "Wed", val: 3 },
  { day: "Thu", val: 5 },
  { day: "Fri", val: 4 },
  { day: "Sat", val: 2 },
  { day: "Sun", val: 0 },
];
const maxVal = Math.max(...weekData.map(d => d.val));

// Role cards config
const roleCards = [
  { role: "MERN Stack",   count: 8,  color: "#6366F1", icon: Layers },
  { role: "React Dev",    count: 6,  color: "#0EA5E9", icon: Code },
  { role: "Full Stack",   count: 5,  color: "#10B981", icon: Globe },
  { role: "Node.js",      count: 3,  color: "#F59E0B", icon: Server },
  { role: "Frontend",     count: 2,  color: "#EF4444", icon: Monitor },
];

// Activity feed
const activityFeed = [
  { dot: "#2563EB", text: "Email sent to Infosys — React Developer",    time: "2 hours ago" },
  { dot: "#10B981", text: "Reply received from Cognizant",               time: "5 hours ago" },
  { dot: "#F59E0B", text: "Email sent to TCS — Frontend Engineer",       time: "9:05 AM" },
  { dot: "#10B981", text: "Interview scheduled with Wipro",              time: "Yesterday" },
  { dot: "#2563EB", text: "Email sent to HCL — Node.js Developer",       time: "Yesterday" },
  { dot: "#EF4444", text: "Rejected by Tech Mahindra",                   time: "2 days ago" },
];

// Tips
const tips = [
  "Personalize each email with the company's name and specific role for higher response rates.",
  "Follow up after 5–7 days if you don't receive a reply.",
  "Keep your resume updated with your latest projects and skills.",
];

// ─── Card wrapper ────────────────────────────────────────────────
const Card = ({ children, className = "", style = {} }) => (
  <div
    className={`rounded-[14px] p-5 ${className}`}
    style={{
      backgroundColor: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 mb-4">
    <Icon size={18} className="text-[#2563EB]" />
    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{title}</h3>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────
const AdminDashboard = () => (
  <DashboardLayout>
    {/* Page tint */}
    <div className="space-y-5 animate-fade-in" style={{ color: "var(--text-primary)" }}>

      {/* ── SECTION 1: GREETING BAR ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Good morning, Deepanshu 👋
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            3 of 5 emails sent today &nbsp;·&nbsp; {todayLabel}
          </p>
          {/* Progress bar */}
          <div className="flex items-center space-x-3 mt-1">
            <div className="w-[200px] h-[6px] rounded-full" style={{ backgroundColor: "#DBEAFE" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: "60%", backgroundColor: "#2563EB" }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: "#2563EB" }}>3 / 5</span>
          </div>
        </div>

        <button className="bg-[#2563EB] text-white px-6 py-3 rounded-[10px] font-bold text-sm flex items-center space-x-2 shadow-md hover:bg-[#1d4ed8] transition-all active:scale-95 w-fit">
          <span>Send today's emails</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* ── SECTION 2: HERO TOTAL CARD ── */}
      <div
        className="w-full rounded-[14px] px-8 py-7 flex flex-col items-center justify-center text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1740A6 0%, #2563EB 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-xl" />

        {/* Main number */}
        <p
          className="font-bold text-white z-10 select-none"
          style={{
            fontSize: 52,
            lineHeight: 1.1,
            animation: "pulse-soft 2.5s ease-in-out infinite",
          }}
        >
          24
        </p>
        <p className="text-sm font-semibold opacity-80 uppercase tracking-widest z-10 mb-5">
          Total Companies Messaged
        </p>

        {/* Mini stats row */}
        <div className="flex items-center divide-x divide-white/30 z-10">
          {[
            { icon: Send,           label: "5 sent today" },
            { icon: MessageSquare,  label: "7 replies received" },
            { icon: Calendar,       label: "2 interviews" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center space-x-2 px-6 first:pl-0 last:pr-0">
              <Icon size={15} className="opacity-80" />
              <span className="text-xs font-semibold opacity-90">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: ROLE CARDS (single row) ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        {roleCards.map(({ role, count, color, icon: Icon }) => (
          <div
            key={role}
            className="rounded-[14px] p-4 flex flex-col justify-between cursor-default"
            style={{
              height: 140,
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              borderTop: `4px solid ${color}`,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
            }}
          >
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {role}
            </span>
            <div className="flex flex-col items-start space-y-1">
              <Icon size={18} style={{ color }} />
              <p className="font-bold" style={{ fontSize: 32, lineHeight: 1, color: "var(--text-primary)" }}>
                {count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION 4: WEEKLY ACTIVITY CHART ── */}
      <Card>
        <SectionTitle icon={Zap} title="Weekly Application Activity" />
        <div className="flex items-end justify-around" style={{ height: 160, gap: 8 }}>
          {weekData.map(({ day, val }) => {
            const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
            return (
              <div key={day} className="flex flex-col items-center justify-end space-y-1 flex-1">
                {/* Value label */}
                <span
                  className="text-xs font-bold"
                  style={{ color: val > 0 ? "#2563EB" : "var(--text-secondary)" }}
                >
                  {val > 0 ? val : "–"}
                </span>
                {/* Bar */}
                <div
                  className="w-full rounded-t-lg transition-all"
                  style={{
                    height: val > 0 ? `${heightPct}%` : 4,
                    backgroundColor: val > 0 ? "#2563EB" : "var(--border-color)",
                    minHeight: val > 0 ? 16 : 4,
                    maxHeight: "100%",
                  }}
                />
                {/* Day label */}
                <span className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── SECTION 5: TWO COLUMN BOTTOM ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* LEFT — Recent Activity Feed */}
        <Card>
          <SectionTitle icon={Clock} title="Recent Activity" />
          <div className="space-y-4">
            {activityFeed.map(({ dot, text, time }, i) => (
              <div key={i} className="flex items-start space-x-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: dot }}
                  />
                  {i < activityFeed.length - 1 && (
                    <div
                      className="w-[1.5px] flex-1 mt-1"
                      style={{ backgroundColor: "var(--border-color)", minHeight: 20 }}
                    />
                  )}
                </div>
                <div className="flex-1 flex justify-between items-start pb-3">
                  <p
                    className="text-xs font-semibold leading-snug max-w-[75%]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {text}
                  </p>
                  <span className="text-[10px] font-medium ml-2 shrink-0" style={{ color: "var(--text-secondary)" }}>
                    {time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* RIGHT — Quick Tips */}
        <Card>
          <SectionTitle icon={Lightbulb} title="Job Search Tips 💡" />
          <div className="space-y-2.5">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="relative rounded-[10px] px-4 py-3.5"
                style={{
                  backgroundColor: "var(--stat-bg)",
                  borderLeft: "3px solid #2563EB",
                  border: "1px solid var(--stat-border)",
                  borderLeftWidth: 3,
                  borderLeftColor: "#2563EB",
                }}
              >
                {/* Tip number badge */}
                <span
                  className="absolute top-2.5 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
                >
                  #{i + 1}
                </span>
                <p className="text-xs leading-relaxed pr-8" style={{ color: "var(--text-primary)" }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>

    {/* Pulse animation injected inline */}
    <style>{`
      @keyframes pulse-soft {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.88; transform: scale(1.03); }
      }
    `}</style>
  </DashboardLayout>
);

export default AdminDashboard;
