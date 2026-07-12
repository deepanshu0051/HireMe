import React, { useState, useEffect } from "react";
import {
  ArrowRight, Send, MessageSquare, Calendar,
  Code, Layers, Globe, Server, Monitor,
  Clock, Lightbulb, Zap
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { getRole, getToken, isGuest } from "../utils/auth";
import { Play, Square, AlertTriangle } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────
const today = new Date();
const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const todayLabel = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

const guestWeekData = [
  { day: "Mon", val: 5 },
  { day: "Tue", val: 5 },
  { day: "Wed", val: 3 },
  { day: "Thu", val: 5 },
  { day: "Fri", val: 4 },
  { day: "Sat", val: 2 },
  { day: "Sun", val: 0 },
];

// Colors and generic fallback icons for dynamically generated Role Cards
const ROLE_COLORS = ["#6366F1", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];
const ROLE_ICONS = [Layers, Code, Globe, Server, Monitor, Clock, Lightbulb, Zap];

// ─── Guest Mocks ──────────────────────────────────────────────────────────
const guestStats = { totalCompanies: 24, sentToday: 5, pendingCount: 2, failedCount: 1, repliedCount: 7 };
const guestRoleCards = [
  { role: "MERN Stack",   count: 8,  color: "#6366F1", icon: Layers },
  { role: "React Dev",    count: 6,  color: "#0EA5E9", icon: Code },
  { role: "Full Stack",   count: 5,  color: "#10B981", icon: Globe },
  { role: "Node.js",      count: 3,  color: "#F59E0B", icon: Server },
  { role: "Frontend",     count: 2,  color: "#EF4444", icon: Monitor },
];
const guestActivityFeed = [
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
    className={`rounded-lg p-3 md:p-4 ${className}`} /* size-fix */
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
const AdminDashboard = () => {
  const [stats, setStats] = useState(isGuest() ? guestStats : {
    totalCompanies: 0,
    sentToday: 0,
    pendingCount: 0,
    failedCount: 0,
    repliedCount: 0
  });

  const [roleCardsState, setRoleCardsState] = useState(isGuest() ? guestRoleCards : []);
  const [feedState, setFeedState] = useState(isGuest() ? guestActivityFeed : []);
  const [weekStats, setWeekStats] = useState(isGuest() ? guestWeekData : []);
  const [maxWeekVal, setMaxWeekVal] = useState(isGuest() ? 5 : 0);
  const [loading, setLoading] = useState(!isGuest()); // Loading state for admins
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("User");

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (isGuest()) {
      setCurrentTime("(Demo) Thursday, 11 June 2026 | 14:32:05");
      setUserName("Demo User");
      return;
    }

    // Fetch Profile for real name
    const fetchProfile = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const token = localStorage.getItem("hireme_token");
        const res = await fetch(`${baseUrl}/api/profile`, { headers: { "Authorization": `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data.fullName) {
             setUserName(data.data.fullName.split(" ")[0]); // Use first name
          }
        }
      } catch (e) { console.error("Profile fetch error", e); }
    };
    fetchProfile();

    const interval = setInterval(() => {
      const now = new Date();
      const optionsDate = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' };
      const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' };
      
      const datePart = new Intl.DateTimeFormat('en-GB', optionsDate).format(now);
      const timePart = new Intl.DateTimeFormat('en-GB', optionsTime).format(now);
      setCurrentTime(`${datePart} | ${timePart} IST`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ─── Automation Toggle State ────────────────────────────────────
  // Tracks whether the cron auto-send engine is active (from DB via GET /api/settings)
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [automationLoading, setAutomationLoading] = useState(false);
  const [automationToast, setAutomationToast] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const showAutomationToast = (message, type = "info") => {
    setAutomationToast({ message, type });
    setTimeout(() => setAutomationToast(null), 4000);
  };

  useEffect(() => {
    if (isGuest()) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const token = getToken();
        
        const [resComp, resWeek] = await Promise.all([
          fetch(`${baseUrl}/api/companies`, { headers: { "Authorization": `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/emails/weekly-stats`, { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        if (!resComp.ok || !resWeek.ok) throw new Error("Failed to fetch dashboard metrics");
        
        const dataComp = await resComp.json();
        const dataWeek = await resWeek.json();
        
        const companies = dataComp.data || [];
        const todayStr = new Date().toDateString();
        
        // Sync Weekly Data Component Mapping
        const weekRows = dataWeek.data || [];
        const mMax = Math.max(...weekRows.map(d => d.val >= 0 ? d.val : 0));
        setWeekStats(weekRows);
        setMaxWeekVal(mMax > 0 ? mMax : 1); // fallback 1 to avoid / 0 errors natively

        let sentToday = 0;
        let pendingCount = 0;
        let failedCount = 0;
        let repliedCount = 0;

        // Dynamic Time Formatter
        const getTimeLabel = (dateStr) => {
          if (!dateStr) return "";
          const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
          if (diff < 60) return "Just now";
          if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
          if (diff < 86400) {
            const h = Math.floor(diff / 3600);
            return h === 1 ? "1 hour ago" : `${h} hours ago`;
          }
          if (diff < 172800) return "Yesterday";
          return `${Math.floor(diff / 86400)} days ago`;
        };

        const jobCounts = {};
        const events = [];

        companies.forEach(company => {
          // Stats aggregation
          if (company.status === "Pending") pendingCount++;
          if (company.status === "Failed") failedCount++;
          if (company.replied === true) repliedCount++;
          
          if (company.sentAt) {
            if (new Date(company.sentAt).toDateString() === todayStr) {
              sentToday++;
            }
          }

          // Role aggregation
          const role = company.jobTitle || "General";
          jobCounts[role] = (jobCounts[role] || 0) + 1;

          // Event feeds
          if (company.replied) {
            events.push({ timeVal: new Date(company.updatedAt || company.sentAt), dot: "#10B981", text: `Reply received from ${company.companyName}` });
          } else if (company.status === "Sent") {
            events.push({ timeVal: new Date(company.sentAt), dot: "#2563EB", text: `Email sent to ${company.companyName} — ${company.jobTitle}` });
          } else if (company.status === "Failed") {
            events.push({ timeVal: new Date(company.updatedAt), dot: "#EF4444", text: `Failed to email ${company.companyName}` });
          }
        });

        // Map Roles
        const parsedRoles = Object.entries(jobCounts)
          .sort((a, b) => b[1] - a[1]) // Descending
          .slice(0, 8)                 // Max 8
          .map(([roleStr, count], idx) => ({
            role: roleStr,
            count: count,
            color: ROLE_COLORS[idx % ROLE_COLORS.length],
            icon: ROLE_ICONS[idx % ROLE_ICONS.length]
          }));
        setRoleCardsState(parsedRoles);

        // Sort Feed
        const sortedEvents = events
          .sort((a, b) => b.timeVal - a.timeVal)
          .slice(0, 10)
          .map(ev => ({
            dot: ev.dot,
            text: ev.text,
            time: getTimeLabel(ev.timeVal)
          }));
        setFeedState(sortedEvents);

        setStats({
          totalCompanies: companies.length,
          sentToday,
          pendingCount,
          failedCount,
          repliedCount
        });
      } catch (err) {
        console.error("Dashboard Stats Fetch Error:", err);
        setError("Could not load real stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // ─── Fetch current automation state from DB ─────────────────────────────
    const fetchAutomationState = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/settings`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if (data.success) {
          setAutoSendEnabled(!!data.data.autoSendEnabled);
        }
      } catch (e) {
        console.error("Failed to fetch automation state:", e);
      }
    };
    fetchAutomationState();
  }, []);

  /**
   * toggleAutomation — Handles Start/Stop button clicks.
   *
   * RESUME GUARD: Before enabling automation, we verify the user has
   * uploaded a resume (localStorage 'hireme_resume_uploaded' = 'true').
   * Without a resume, there is nothing to attach to job applications,
   * so we block the start and show an instructional toast.
   *
   * Guest Guard: This function is never called for guest users (button is hidden).
   */
  const handleToggleAutomation = async () => {
    const newState = !autoSendEnabled;

    // RESUME GUARD: Only check when trying to ENABLE automation
    if (newState === true) {
      const resumeUploaded = localStorage.getItem("hireme_resume_uploaded");
      if (resumeUploaded !== "true") {
        showAutomationToast("Please upload your resume in the Resume tab first!", "warning");
        return; // Block the API call entirely
      }
    }

    setAutomationLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/settings/auto-send`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ enabled: newState })
      });
      const data = await res.json();
      if (data.success) {
        setAutoSendEnabled(newState);
        showAutomationToast(
          newState ? "Automation started! Emails will be sent at 9:00 AM IST daily." : "Automation stopped.",
          newState ? "success" : "info"
        );
      } else {
        showAutomationToast("Failed to update automation setting.", "error");
      }
    } catch (e) {
      showAutomationToast("Network error. Please try again.", "error");
    } finally {
      setAutomationLoading(false);
    }
  };

  return (
    <DashboardLayout>
    {/* Page tint */}
    <div className="space-y-5 animate-fade-in" style={{ color: "var(--text-primary)" }}>

      {/* ── SECTION 1: GREETING BAR ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-lg md:text-xl font-bold" style={{ color: "var(--text-primary)" }}> {/* size-fix */}
            Good morning, {userName} 👋
          </h1>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {stats.sentToday} emails sent today &nbsp;·&nbsp; {currentTime || "Loading time..."}
            {loading && <span className="ml-2 text-xs text-blue-500 opacity-80">(loading stats...)</span>}
            {error && <span className="ml-2 text-xs text-red-500 opacity-80">({error})</span>}
          </p>
          {/* Progress bar */}
          <div className="flex items-center space-x-3 mt-1">
            <div className="w-[150px] h-2 rounded-full" style={{ backgroundColor: "#DBEAFE" }}> {/* size-fix */}
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.min((stats.sentToday / 5) * 100, 100)}%`, backgroundColor: "#2563EB" }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: "#2563EB" }}>{Math.min(stats.sentToday, 5)} / 5</span>
          </div>
        </div>

        {/* ── AUTOMATION CONTROL BUTTON ──────────────────────────────────────────
            Visible to Admin only. Guests see nothing here.
            - If autoSendEnabled is true  → shows "Stop Automation" (red)
            - If autoSendEnabled is false → shows "Start Today's Emails" (green)
              with a resume guard that blocks start if no resume has been uploaded.
        ─────────────────────────────────────────────────────────────────────── */}
        {!isGuest() && (
          <div className="flex flex-col items-end gap-2">
            {/* Status badge */}
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full border ${ /* size-fix */
              autoSendEnabled
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-slate-100 border-slate-200 text-slate-500"
            }`}>
              <span className={`w-2 h-2 rounded-full ${autoSendEnabled ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
              {autoSendEnabled ? "Automation: ACTIVE · 10AM–5PM IST" : "Automation: STOPPED"}
            </div>

            {/* Start / Stop button */}
            <button
              onClick={handleToggleAutomation}
              disabled={automationLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${ /* size-fix */
                autoSendEnabled
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                  : "bg-[#10B981] hover:bg-[#059669] text-white shadow-green-200"
              }`}
            >
              {automationLoading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : autoSendEnabled ? (
                <Square size={16} fill="white" />
              ) : (
                <Play size={16} fill="white" />
              )}
              <span>{autoSendEnabled ? "Stop Automation" : "Start Today's Emails"}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── AUTOMATION TOAST ─── */}
      {automationToast && (
        <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border text-sm font-semibold transition-all animate-slide-in-right ${
          automationToast.type === "success" ? "bg-green-50 border-green-200 text-green-800" :
          automationToast.type === "error"   ? "bg-red-50 border-red-200 text-red-800" :
          automationToast.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" :
          "bg-blue-50 border-blue-200 text-blue-800"
        }`}>
          {automationToast.type === "warning" && <AlertTriangle size={16} />}
          {automationToast.message}
        </div>
      )}

      {/* ── SECTION 2: HERO TOTAL CARD ── */}
      <div
        className="w-full rounded-lg px-4 py-5 flex flex-col items-center justify-center text-white relative overflow-hidden" /* size-fix */
        style={{ background: "linear-gradient(135deg, #1740A6 0%, #2563EB 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-xl" />

        {/* Main number */}
        <p
          className="font-bold text-white z-10 select-none text-4xl" /* size-fix */
          style={{
            lineHeight: 1.1,
            animation: "pulse-soft 2.5s ease-in-out infinite",
          }}
        >
          {stats.totalCompanies}
        </p>
        <p className="text-sm font-semibold opacity-80 uppercase tracking-widest z-10 mb-5">
          Total Companies Messaged
        </p>

        {/* Mini stats row */}
        <div className="flex items-center flex-wrap justify-center gap-y-2 divide-x divide-white/30 z-10">
          {[
            { icon: Send,           label: `${stats.sentToday} sent today` },
            { icon: MessageSquare,  label: `${stats.repliedCount} replied` },
            { icon: Clock,          label: `${stats.pendingCount} pending` },
            { icon: Zap,            label: `${stats.failedCount} failed` },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center space-x-1.5 px-3 md:px-4 first:pl-0 last:pr-0"> {/* size-fix */}
              <Icon size={14} className="opacity-80" /> {/* size-fix */}
              <span className="text-xs font-semibold opacity-90">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 3: ROLE CARDS (single flex/grid) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"> {/* size-fix */}
        {roleCardsState.map(({ role, count, color, icon: Icon }) => (
          <div
            key={role}
            className="rounded-lg p-3 md:p-4 flex flex-col justify-between cursor-default" /* size-fix */
            style={{
              height: 120, /* size-fix */
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
              className="text-xs font-bold uppercase tracking-wider" /* size-fix */
              style={{ color: "var(--text-secondary)" }}
            >
              {role}
            </span>
            <div className="flex flex-col items-start space-y-1">
              <Icon size={16} style={{ color }} /> {/* size-fix */}
              <p className="font-bold text-2xl" style={{ lineHeight: 1, color: "var(--text-primary)" }}> {/* size-fix */}
                {count}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION 4: WEEKLY ACTIVITY CHART ── */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <SectionTitle icon={Zap} title="Weekly Application Activity" />
          {isGuest() && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md shadow-sm border border-amber-200 uppercase tracking-widest">(Demo Data)</span>}
        </div>
        
        {loading ? (
          <div className="flex items-end justify-around h-[160px] animate-pulse">
            {[1,2,3,4,5,6,7].map(k => <div key={k} className="w-8 bg-slate-200/50 border border-slate-200 rounded-t-md h-full opacity-25" />)}
          </div>
        ) : (
          <div className="flex items-end justify-around" style={{ height: 160, gap: 8 }}>
            {weekStats.map(({ day, val, isToday }) => {
              const heightPct = maxWeekVal > 0 && val > 0 ? (val / maxWeekVal) * 100 : 0;
              const isFuture = val === -1;
              const isFilled = val > 0;
              
              return (
                <div key={day} className="flex flex-col items-center justify-end space-y-1 flex-1 relative">
                  {/* Today Overlay Pill */}
                  {isToday && (
                    <div className="absolute -top-6 text-[9px] uppercase font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full shadow-sm animate-pulse-soft">
                      Today
                    </div>
                  )}
                  {/* Value label */}
                  <span
                    className="text-xs font-bold"
                    style={{ color: isFilled ? "#2563EB" : isFuture ? "var(--border-color)" : "var(--text-secondary)" }}
                  >
                    {isFuture ? "–" : val}
                  </span>
                  {/* Bar */}
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: isFilled ? `${heightPct}%` : 4,
                      backgroundColor: isFuture ? "transparent" : isFilled ? (isToday ? "#1D4ED8" : "#2563EB") : "var(--border-color)",
                      border: isFuture ? "1px dashed var(--border-color)" : "none",
                      minHeight: isFilled ? 16 : 4,
                      maxHeight: "100%",
                      opacity: isToday ? 1 : 0.8
                    }}
                  />
                  {/* Day label */}
                  <span className="text-[10px] font-bold" style={{ color: isToday ? "#1D4ED8" : "var(--text-secondary)" }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ── SECTION 5: TWO COLUMN BOTTOM ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* LEFT — Recent Activity Feed */}
        <Card>
          <SectionTitle icon={Clock} title="Recent Activity" />
          {feedState.length === 0 ? (
            <p className="text-sm text-slate-500 py-2">No timeline events to display.</p>
          ) : (
            feedState.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Custom Dot */}
                <div className="flex flex-col items-center mt-1">
                  <div className="w-[10px] h-[10px] rounded-full z-10" style={{ backgroundColor: item.dot, boxShadow: `0 0 0 4px ${item.dot}20` }} />
                  {idx !== feedState.length - 1 && (
                    <div className="w-[2px] h-10 bg-slate-100 absolute top-3" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-semibold text-slate-700 leading-snug">{item.text}</p>
                  <p className="text-[11px] font-medium text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))
          )}
        </Card>

        {/* RIGHT — Quick Tips */}
        <Card>
          <SectionTitle icon={Lightbulb} title="Job Search Tips 💡" />
          <div className="space-y-2.5">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="relative rounded-lg px-3 py-2" /* size-fix */
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
                  className="absolute top-2.5 right-3 text-[10px] font-bold px-1.5 py-0.5 rounded-full" /* size-fix */
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
};

export default AdminDashboard;
