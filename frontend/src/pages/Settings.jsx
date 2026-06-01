import React, { useState } from "react";
import {
  Sun, Moon, Send, Pen, Bell, Shield,
  Check, X, Info, Download, Trash2
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useTheme } from "../context/ThemeContext";

// ─── Reusable Toggle Switch ────────────────────────────────────
const Toggle = ({ checked, onChange, color = "#2563EB" }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none"
    style={{
      width: 52,
      height: 28,
      backgroundColor: checked ? color : "#CBD5E1",
      flexShrink: 0,
    }}
  >
    <span
      className="inline-block bg-white rounded-full shadow-md transition-all duration-300"
      style={{
        width: 22,
        height: 22,
        transform: checked ? "translateX(26px)" : "translateX(4px)",
      }}
    />
  </button>
);

// ─── Reusable Toast Component ──────────────────────────────────
export const Toast = ({ message, type = "success", onClose }) => {
  const colors = {
    success: { border: "#10B981", icon: <Check size={16} className="text-[#10B981]" /> },
    error:   { border: "#EF4444", icon: <X size={16} className="text-[#EF4444]" /> },
    info:    { border: "#3B82F6", icon: <Info size={16} className="text-[#3B82F6]" /> },
  };
  const { border, icon } = colors[type] || colors.success;

  return (
    <div
      className="animate-slide-in-right fixed bottom-8 right-8 z-[200] flex items-start space-x-3 rounded-xl shadow-xl px-5 py-4 max-w-xs"
      style={{ backgroundColor: "var(--card-bg)", border: `1px solid var(--border-color)", borderLeft: "4px solid ${border}` }}
    >
      <span className="mt-0.5">{icon}</span>
      <p className="text-sm font-semibold flex-1" style={{ color: "var(--text-primary)" }}>{message}</p>
      <button onClick={onClose} className="text-[#94A3B8] hover:text-[#64748B] mt-0.5">
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Section Card Wrapper ──────────────────────────────────────
const SectionCard = ({ title, icon, children }) => (
  <div
    className="rounded-[14px] p-6 space-y-6"
    style={{
      backgroundColor: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      boxShadow: "var(--shadow)",
    }}
  >
    <div
      className="flex items-center space-x-3 pb-4"
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      <span className="text-[#2563EB]">{icon}</span>
      <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2>
    </div>
    {children}
  </div>
);

// ─── Row with toggle ───────────────────────────────────────────
const ToggleRow = ({ label, subtext, checked, onChange, color, divider = true }) => (
  <>
    <div
      className="flex items-center justify-between py-3 px-1 rounded-lg transition-colors hover:cursor-default"
      style={{ '&:hover': { backgroundColor: 'var(--bg-secondary)' } }}
    >
      <div>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{subtext}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} color={color} />
    </div>
    {divider && <div style={{ borderBottom: "1px solid var(--border-color)" }} />}
  </>
);

// ─── Main Settings Component ───────────────────────────────────
const Settings = () => {
  const { isDark, toggleTheme } = useTheme();

  // Auto-Send
  const [autoSend, setAutoSend] = useState(true);
  const [emailsPerDay, setEmailsPerDay] = useState(5);
  const [sendTime, setSendTime] = useState("09:00");
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  // Signature
  const [signature, setSignature] = useState(
    `Best regards,\nDeepanshu\nFull Stack Developer\n📞 +91 9560287251\n🔗 linkedin.com/in/deepanshu-bhati\n💻 github.com/deepanshu0051`
  );
  const [sigError, setSigError] = useState("");

  // Notifications
  const [notifs, setNotifs] = useState({
    emailSent: true,
    dailySummary: true,
    replyAlert: true,
    weeklyReport: false,
  });

  // Toast
  const [toast, setToast] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto py-8 space-y-8 animate-fade-in">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h1>

        {/* ─── SECTION 1: APPEARANCE ─── */}
        <SectionCard title="Appearance" icon={<span style={{ fontSize: 20 }}>🎨</span>}>
          <div
            className="flex items-center justify-between p-5 rounded-xl"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
          >
            {/* Light side */}
            <div className="flex items-center space-x-3">
              <Sun size={22} className="text-yellow-500" />
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Light Mode</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Clean white interface</p>
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={toggleTheme}
              className="relative inline-flex items-center rounded-full transition-all duration-300 focus:outline-none mx-4"
              style={{
                width: 56,
                height: 30,
                backgroundColor: isDark ? "#2563EB" : "#CBD5E1",
              }}
            >
              <span
                className="inline-block bg-white rounded-full shadow-md transition-all duration-300"
                style={{
                  width: 24,
                  height: 24,
                  transform: isDark ? "translateX(28px)" : "translateX(4px)",
                }}
              />
            </button>

            {/* Dark side */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Dark Mode</p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Easy on the eyes</p>
              </div>
              <Moon size={22} className="text-indigo-400" />
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center">
            <span
              className="px-4 py-1.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: isDark ? "#1E3A5F" : "#EFF6FF",
                color: isDark ? "#93C5FD" : "#1E40AF",
                border: "1px solid",
                borderColor: isDark ? "#334155" : "#BFDBFE",
              }}
            >
              {isDark ? "🌙 Currently: Dark Mode" : "☀️ Currently: Light Mode"}
            </span>
          </div>
        </SectionCard>

        {/* ─── SECTION 2: AUTO-SEND ─── */}
        <SectionCard title="Auto-Send Configuration" icon={<Send size={20} />}>
          <ToggleRow
            label="Enable Auto-Send"
            subtext="Automatically send emails daily"
            checked={autoSend}
            onChange={setAutoSend}
            color="#10B981"
          />

          {/* Emails Per Day stepper */}
          <div className="flex items-center justify-between py-3 px-1">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Emails Per Day</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>How many companies to email daily</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (emailsPerDay <= 1) showToast("Minimum limit is 1 email per day", "info");
                  else setEmailsPerDay(p => p - 1);
                }}
                className="w-9 h-9 rounded-lg bg-[#2563EB] text-white font-bold text-lg flex items-center justify-center shadow hover:bg-[#1d4ed8] transition-colors"
              >−</button>
              <span className="text-2xl font-bold w-10 text-center" style={{ color: "var(--text-primary)" }}>
                {emailsPerDay}
              </span>
              <button
                onClick={() => {
                  if (emailsPerDay >= 20) showToast("Maximum limit is 20 emails per day", "info");
                  else setEmailsPerDay(p => p + 1);
                }}
                className="w-9 h-9 rounded-lg bg-[#2563EB] text-white font-bold text-lg flex items-center justify-center shadow hover:bg-[#1d4ed8] transition-colors"
              >+</button>
            </div>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-color)" }} />

          {/* Send Time */}
          <div className="flex items-center justify-between py-3 px-1">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Daily Send Time</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>What time to send emails every day</p>
            </div>
            <input
              type="time"
              value={sendTime}
              onChange={e => {
                const val = e.target.value;
                setSendTime(val);
                if (val && (val < "06:00" || val > "22:00")) {
                  showToast("⚠️ Tip: Emails sent during business hours (9AM–6PM) get better response rates", "info");
                }
              }}
              className="border rounded-lg px-3 py-2 text-sm font-semibold outline-none transition-all"
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
              onFocus={e => e.target.style.borderColor = "#2563EB"}
              onBlur={e => e.target.style.borderColor = "var(--border-color)"}
            />
          </div>
          <div style={{ borderBottom: "1px solid var(--border-color)" }} />

          {/* Send Days */}
          <div className="py-3 px-1 space-y-3">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Send on days</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Select which days to send emails</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {allDays.map(day => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
                    style={{
                      backgroundColor: active ? "#2563EB" : "var(--bg-secondary)",
                      color: active ? "#fff" : "var(--text-secondary)",
                      borderColor: active ? "#2563EB" : "var(--border-color)",
                    }}
                  >{day}</button>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* ─── SECTION 3: EMAIL SIGNATURE ─── */}
        <SectionCard title="Email Signature" icon={<Pen size={20} />}>
          <div className="space-y-4">
            <div className="space-y-2">
              <textarea
                value={signature}
                onChange={e => {
                  setSignature(e.target.value);
                  setSigError("");
                }}
                onBlur={e => {
                  const val = signature.trim();
                  
                  // Update state error message
                  if (!val) setSigError("Signature cannot be empty");
                  else if (val.length < 10) setSigError("Signature must be at least 10 characters");
                  else if (val.length > 500) setSigError("Signature cannot exceed 500 characters");
                  else setSigError("");

                  // Update border color
                  const hasError = !val || val.length < 10 || val.length > 500;
                  e.target.style.borderColor = hasError ? "#EF4444" : (val.length >= 10 ? "#10B981" : "var(--border-color)");
                }}
                rows={7}
                className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none resize-none transition-all"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: sigError ? "1px solid #EF4444" : "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                }}
                onFocus={e => e.target.style.borderColor = sigError ? "#EF4444" : "#2563EB"}
              />
              <div className="flex justify-between items-center px-1">
                {sigError ? (
                  <p className="text-[#EF4444] text-[12px] font-semibold">{sigError}</p>
                ) : <span />}
                <p className={`text-[12px] font-semibold ${signature.length > 450 ? "text-[#EF4444]" : "text-[#64748B]"}`}>
                  Characters: {signature.length} / 500
                </p>
              </div>
            </div>

            {/* Preview card */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
            >
              <p className="text-[10px] uppercase font-bold" style={{ color: "var(--text-secondary)" }}>Preview</p>
              <div
                className="border-l-4 border-[#2563EB] pl-4 py-1"
              >
                <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans" style={{ color: "var(--text-primary)" }}>
                  {signature}
                </pre>
              </div>
            </div>

            <button
              onClick={() => {
                const val = signature.trim();
                let err = "";
                if (!val) err = "Signature cannot be empty";
                else if (val.length < 10) err = "Signature must be at least 10 characters";
                else if (val.length > 500) err = "Signature cannot exceed 500 characters";
                
                if (err) {
                  setSigError(err);
                  showToast("Please fix all errors before saving", "error");
                } else {
                  setSignature(val);
                  showToast("Signature saved ✓", "success");
                }
              }}
              className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#1d4ed8] transition-colors"
            >
              Save Signature
            </button>
          </div>
        </SectionCard>

        {/* ─── SECTION 4: NOTIFICATIONS ─── */}
        <SectionCard title="Notifications" icon={<Bell size={20} />}>
          <ToggleRow
            label="Email Sent Confirmation"
            subtext="Get notified when email is sent"
            checked={notifs.emailSent}
            onChange={v => setNotifs(p => ({ ...p, emailSent: v }))}
          />
          <ToggleRow
            label="Daily Summary"
            subtext="Daily report of applications sent"
            checked={notifs.dailySummary}
            onChange={v => setNotifs(p => ({ ...p, dailySummary: v }))}
          />
          <ToggleRow
            label="Reply Received Alert"
            subtext="Alert when a company replies"
            checked={notifs.replyAlert}
            onChange={v => setNotifs(p => ({ ...p, replyAlert: v }))}
          />
          <ToggleRow
            label="Weekly Progress Report"
            subtext="Weekly stats of your job search"
            checked={notifs.weeklyReport}
            onChange={v => setNotifs(p => ({ ...p, weeklyReport: v }))}
            divider={false}
          />
        </SectionCard>

        {/* ─── SECTION 5: ACCOUNT ─── */}
        <SectionCard title="Account" icon={<Shield size={20} />}>
          {/* Email */}
          <div className="flex items-center justify-between py-2 px-1">
            <div>
              <p className="text-xs font-bold uppercase" style={{ color: "var(--text-secondary)" }}>Email Address</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>deepubhati0051@gmail.com</p>
            </div>
            <button className="text-xs font-bold text-[#2563EB] hover:underline">Change</button>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-color)" }} />

          {/* Export */}
          <div className="flex items-center justify-between py-3 px-1">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Export My Data</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Download all your HireMe data</p>
            </div>
            <button
              onClick={() => showToast("Data export will be ready shortly", "info")}
              className="flex items-center space-x-2 border px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{
                borderColor: "#2563EB",
                color: "#2563EB",
                backgroundColor: "transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#EFF6FF"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Download size={14} />
              <span>Download Data</span>
            </button>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-color)" }} />

          {/* Clear Data */}
          <div className="flex items-center justify-between py-3 px-1">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Clear All Data</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Permanently delete all application history</p>
            </div>
            <button
              onClick={() => setShowClearModal(true)}
              className="flex items-center space-x-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-all"
            >
              <Trash2 size={14} />
              <span>Clear Data</span>
            </button>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-color)" }} />

          {/* App Version */}
          <div className="py-3 px-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>HireMe v1.0.0</p>
            <p className="text-xs mt-1 text-green-600 font-medium">✓ You are on the latest version</p>
          </div>
        </SectionCard>
      </div>

      {/* ─── TOAST ─── */}
      {toast && (
        <div
          className="animate-slide-in-right fixed bottom-8 right-8 z-[200] flex items-center space-x-3 rounded-xl shadow-xl px-5 py-4 max-w-xs"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            borderLeft: `4px solid ${toast.type === "success" ? "#10B981" : toast.type === "info" ? "#3B82F6" : "#EF4444"}`,
          }}
        >
          {toast.type === "success" && <Check size={18} className="text-[#10B981] shrink-0" />}
          {toast.type === "info" && <Info size={18} className="text-[#3B82F6] shrink-0" />}
          {toast.type === "error" && <X size={18} className="text-[#EF4444] shrink-0" />}
          <p className="text-sm font-semibold flex-1" style={{ color: "var(--text-primary)" }}>{toast.message}</p>
          <button onClick={() => setToast(null)} style={{ color: "var(--text-muted)" }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ─── CLEAR DATA MODAL ─── */}
      {showClearModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div
            className="rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in"
            style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-50 p-3 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <button onClick={() => setShowClearModal(false)} style={{ color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Clear all data?</h3>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              This will delete all your mail history and application data. Are you sure? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowClearModal(false);
                  showToast("All data cleared.", "error");
                }}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
