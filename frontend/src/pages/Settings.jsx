import React, { useState } from "react";
import {
  Sun, Moon, Send, Pen, Bell, Shield,
  Check, X, Info, Download, Trash2
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";

import { isGuest, getToken } from "../utils/auth";
import { guestData } from "../utils/guestData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


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
    className="rounded-lg p-4 md:p-6 space-y-4" /* size-fix rounded-lg p-4 md:p-6 space-y-4 */
    style={{
      backgroundColor: "var(--card-bg)",
      border: "1px solid var(--border-color)",
      boxShadow: "var(--shadow)",
    }}
  >
    <div
      className="flex items-center space-x-2 pb-3" /* size-fix space-x-2 pb-3 */
      style={{ borderBottom: "1px solid var(--border-color)" }}
    >
      <span className="text-[#2563EB]">{icon}</span>
      <h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>{title}</h2> {/* size-fix text-base md:text-lg */}
    </div>
    {children}
  </div>
);

// ─── Row with toggle ───────────────────────────────────────────
const ToggleRow = ({ label, subtext, checked, onChange, color, divider = true }) => (
  <>
    <div
      className="flex items-center justify-between py-2 px-1 rounded-lg transition-colors hover:cursor-default" /* size-fix py-2 */
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
  

  // Local storage helpers
  const loadLocal = (key, defaultVal) => {
    const val = localStorage.getItem(`hireme_settings_${key}`);
    return val ? JSON.parse(val) : defaultVal;
  };
  const saveLocal = (key, val) => {
    if (!isGuest()) {
      localStorage.setItem(`hireme_settings_${key}`, JSON.stringify(val));
    }
    return val;
  };

  // Auto-Send Backend State
  const [autoSend, setAutoSendState] = useState(false);
  const [isAutoSendLoading, setIsAutoSendLoading] = useState(false);

  // Auto-Send Local UI States
  // emailsPerDay: savedValue = last persisted, pendingValue = UI local (not yet saved)
  const [savedEmailsPerDay, setSavedEmailsPerDay] = useState(5);
  const [emailsPerDay, setEmailsPerDay] = useState(5);
  const [isEpdEditing, setIsEpdEditing] = useState(false);
  const [isEpdSaving, setIsEpdSaving] = useState(false);
  const [sendTime, setSendTime] = useState(() => loadLocal("sendTime", "09:00"));
  const [selectedDays, setSelectedDays] = useState(() => loadLocal("selectedDays", ["Mon", "Tue", "Wed", "Thu", "Fri"]));

  // Signature
  const [signature, setSignature] = useState(
    isGuest() ? guestData.emailSignature : `Best regards,\nDeepanshu\nFull Stack Developer\n📞 +91 9560287251\n🔗 linkedin.com/in/deepanshu-bhati\n💻 github.com/deepanshu0051`
  );
  const [sigError, setSigError] = useState("");

  // Notifications Local State
  const [notifs, setNotifs] = useState(() => loadLocal("notifs", {
    emailSent: true,
    dailySummary: true,
    replyAlert: true,
    weeklyReport: false,
  }));

  // Sync to local storage (only non-epd items)
  React.useEffect(() => { saveLocal("sendTime", sendTime); }, [sendTime]);
  React.useEffect(() => { saveLocal("selectedDays", selectedDays); }, [selectedDays]);
  React.useEffect(() => { saveLocal("notifs", notifs); }, [notifs]);

  // Load Auto-Send + emailsPerDay from Server on Mount
  React.useEffect(() => {
    if (isGuest()) return;
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        const json = await res.json();
        if (json.success && json.data) {
          setAutoSendState(json.data.autoSendEnabled || false);
          const epd = json.data.emailsPerDay ?? 5;
          setSavedEmailsPerDay(epd);
          setEmailsPerDay(epd);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();
  }, []);

  // Toast
  const [toast, setToast] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAutoSendToggle = async (checked) => {
    if (isGuest()) {
      showToast("Auto-Send configuration is available to Admins only.", "error");
      return;
    }
    setIsAutoSendLoading(true);
    // Optimistic UI update
    setAutoSendState(checked);
    try {
      const res = await fetch(`${BASE_URL}/api/settings/auto-send`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ enabled: checked }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      showToast(checked ? "Auto-Send Enabled" : "Auto-Send Disabled", "success");
    } catch (err) {
      showToast("Failed to update auto-send setting.", "error");
      setAutoSendState(!checked); // Rollback
    } finally {
      setIsAutoSendLoading(false);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto py-4 space-y-6 animate-fade-in"> {/* size-fix py-4 space-y-6 */}
        <h1 className="text-lg md:text-xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h1> {/* size-fix text-lg md:text-xl */}

        {/* ─── SECTION 1: AUTO-SEND ─── */}
        <SectionCard title="Auto-Send Configuration" icon={<Send size={18} />}> {/* size-fix size 18 */}
          {isGuest() && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-2.5 rounded text-xs text-amber-800 mb-3"> {/* size-fix p-2.5 text-xs mb-3 */}
              <strong>Guest View:</strong> Live email automation settings are locked. Log in as an Admin to configure the CRON engine.
            </div>
          )}
          <div className={isGuest() ? "opacity-60 pointer-events-none" : ""}>
            <ToggleRow
              label="Enable Auto-Send"
              subtext="Automatically send emails daily"
              checked={autoSend}
              onChange={handleAutoSendToggle}
              color="#10B981"
            />
          </div>


          {/* Emails Per Day stepper */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 px-1 gap-3 sm:gap-0">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Emails Per Day</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Max companies to email per day (1–5)</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { if (emailsPerDay > 1) setEmailsPerDay(p => p - 1); }}
                className="w-7 h-7 rounded-md bg-[#2563EB] text-white font-bold text-base flex items-center justify-center shadow hover:bg-[#1d4ed8] transition-colors"
              >−</button>
              <span className="text-xl font-bold w-10 text-center" style={{ color: "var(--text-primary)" }}>
                {emailsPerDay}
              </span>
              <button
                onClick={() => { if (emailsPerDay < 5) setEmailsPerDay(p => p + 1); }}
                className="w-7 h-7 rounded-md bg-[#2563EB] text-white font-bold text-base flex items-center justify-center shadow hover:bg-[#1d4ed8] transition-colors"
              >+</button>

              {/* Set / Cancel */}
              {isEpdEditing ? (
                <button
                  onClick={() => { setEmailsPerDay(savedEmailsPerDay); setIsEpdEditing(false); }}
                  className="ml-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={async () => {
                    if (isGuest()) {
                      setEmailsPerDay(savedEmailsPerDay);
                      showToast("Guest mode — saving disabled. Admin only.", "error");
                      return;
                    }
                    setIsEpdSaving(true);
                    try {
                      const res = await fetch(`${BASE_URL}/api/settings/emails-per-day`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                        body: JSON.stringify({ emailsPerDay }),
                      });
                      const data = await res.json();
                      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
                      setSavedEmailsPerDay(emailsPerDay);
                      setIsEpdEditing(true);
                      showToast(`Saved — max ${emailsPerDay} email${emailsPerDay > 1 ? 's' : ''}/day ✓`, "success");
                    } catch (err) {
                      showToast(err.message || "Failed to save.", "error");
                    } finally {
                      setIsEpdSaving(false);
                    }
                  }}
                  disabled={isEpdSaving || emailsPerDay === savedEmailsPerDay}
                  className="ml-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2563EB] text-white hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isEpdSaving ? "Saving..." : "Set"}
                </button>
              )}
            </div>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-color)" }} />

          {/* Send Time */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 px-1 gap-3 sm:gap-0"> {/* size-fix py-2 gap-3 */}
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
                rows={5} /* size-fix 7->5 */
                className="w-full rounded-lg px-3 py-2 text-sm font-medium outline-none resize-none transition-all" /* size-fix rounded-lg px-3 py-2 */
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
              className="w-full bg-[#2563EB] text-white py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#1d4ed8] transition-colors" /* size-fix py-2 rounded-lg */
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
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>
                {isGuest() ? guestData.email : "user@hireme.com"}
              </p>
            </div>
            <button disabled className="text-xs font-bold text-gray-400 cursor-not-allowed" title="Changing email is coming soon">Change</button>
          </div>
          <div style={{ borderBottom: "1px solid var(--border-color)" }} />

          {/* Export */}
          <div className="flex items-center justify-between py-3 px-1">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Export My Data</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>Download all your HireMe data</p>
            </div>
            <button
              onClick={() => {
                showToast("Data export is coming soon. Feature unavailable in current tier.", "info");
              }}
              className="flex items-center space-x-2 border px-3 py-1.5 rounded-lg text-xs font-bold transition-all opacity-70 cursor-not-allowed" /* size-fix px-3 py-1.5 */
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
              className="flex items-center space-x-2 border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-all" /* size-fix px-3 py-1.5 */
            >
              <Trash2 size={12} /> {/* size-fix size 12 */}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-fade-in"> {/* size-fix p-3 */}
          <div
            className="rounded-xl p-4 md:p-5 max-w-sm w-full shadow-2xl animate-scale-in" /* size-fix rounded-xl p-4 md:p-5 */
            style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}
          >
            <div className="flex justify-between items-start mb-3"> {/* size-fix mb-3 */}
              <div className="bg-red-50 p-2 rounded-full"> {/* size-fix p-2 */}
                <Trash2 size={20} className="text-red-600" /> {/* size-fix 24->20 */}
              </div>
              <button onClick={() => setShowClearModal(false)} style={{ color: "var(--text-muted)" }}>
                <X size={18} /> {/* size-fix 20->18 */}
              </button>
            </div>
            <h3 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>Clear all data?</h3> {/* size-fix text-base */}
            <p className="text-xs md:text-sm mt-1.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}> {/* size-fix text-xs mt-1.5 */}
              This module is disabled. Full data clear operations will be available in the next release.
            </p>
            <div className="flex items-center space-x-2 mt-6"> {/* size-fix space-x-2 mt-6 */}
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 rounded-lg text-sm font-bold transition-all" /* size-fix py-2 */
                style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
              >
                Close
              </button>
              <button
                disabled
                className="flex-1 bg-gray-300 text-gray-500 py-2 rounded-lg text-sm font-bold shadow-md cursor-not-allowed" /* size-fix py-2 */
              >
                Currently Unavailable
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
