const fs = require('fs');

const profilePath = 'c:/Users/deepu/OneDrive/Desktop/HireMe/frontend/src/pages/Profile.jsx';
let pContent = fs.readFileSync(profilePath, 'utf8');

const pReplacements = [
  {
    from: '<div className="bg-white dark:bg-slate-800 border border-[#BFDBFE] rounded-lg p-6 shadow-[0_4px_20px_rgba(37,99,235,0.08)] flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden">',
    to: '<div className="border border-[#BFDBFE] rounded-lg p-6 shadow-[0_4px_20px_rgba(37,99,235,0.08)] flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden" style={{ backgroundColor: "var(--card-bg)" }}>'
  },
  {
    from: '<h1 className="text-lg md:text-xl font-bold text-[#0F172A]">{profile.fullName || "User Name"}</h1>',
    to: '<h1 className="text-lg md:text-xl font-bold" style={{ color: "var(--text-primary)" }}>{profile.fullName || "User Name"}</h1>'
  },
  {
    from: '<p className="text-[#64748B] font-medium text-xs">{profile.role || "Role not set"}</p>',
    to: '<p className="font-medium text-xs" style={{ color: "var(--text-secondary)" }}>{profile.role || "Role not set"}</p>'
  },
  {
    from: '<div className="flex items-center justify-center md:justify-start space-x-2 text-[#94A3B8] text-xs pt-1">',
    to: '<div className="flex items-center justify-center md:justify-start space-x-2 text-xs pt-1" style={{ color: "var(--text-muted)" }}>'
  },
  {
    from: '<div className="bg-white dark:bg-slate-800 border border-[#E2E8F0] rounded-lg p-4 md:p-6 shadow-sm space-y-4">',
    to: '<div className="border rounded-lg p-4 md:p-6 shadow-sm space-y-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>'
  },
  {
    from: '<div className="flex items-center space-x-2 border-b border-[#F1F5F9] pb-3">',
    to: '<div className="flex items-center space-x-2 border-b pb-3" style={{ borderBottomColor: "var(--border-color)" }}>'
  },
  {
    from: '<h2 className="text-base md:text-lg font-bold text-[#0F172A]">Personal Information</h2>',
    to: '<h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>Personal Information</h2>'
  },
  {
    from: '<label className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">Current Role</label>',
    to: '<label className="text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>Current Role</label>'
  },
  {
    from: '<div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors">',
    to: '<div className="absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#2563EB] transition-colors" style={{ color: "var(--text-muted)" }}>'
  },
  {
    from: 'className="w-full bg-white dark:bg-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none shadow-sm"\n                    style={{ border: borderFor("role") || "1px solid #2563EB" }}',
    to: 'className="w-full rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none shadow-sm"\n                    style={{ border: borderFor("role") || "1px solid #2563EB", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}'
  },
  {
    from: '<div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-2 pl-10 pr-4 text-sm font-semibold text-[#0F172A]">',
    to: '<div className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm font-semibold" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>'
  },
  {
    from: '<label className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">Languages Known</label>',
    to: '<label className="text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>Languages Known</label>'
  },
  {
    from: '<div className={`flex flex-wrap gap-2 p-3 rounded-xl border ${isEditing ? "border-[#BFDBFE] bg-white dark:bg-slate-800" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}>',
    to: '<div className={`flex flex-wrap gap-2 p-3 rounded-xl border ${isEditing ? "border-[#BFDBFE]" : ""}`} style={{ backgroundColor: isEditing ? "var(--input-bg)" : "var(--bg-secondary)", borderColor: isEditing ? undefined : "var(--border-color)" }}>'
  },
  {
    from: '<div className="flex items-center bg-white dark:bg-slate-800 border border-[#E2E8F0] rounded-lg pl-3 pr-1 py-1 ml-1 shadow-sm">',
    to: '<div className="flex items-center border rounded-lg pl-3 pr-1 py-1 ml-1 shadow-sm" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)" }}>'
  },
  {
    from: '<div className="bg-white dark:bg-slate-800 border border-[#E2E8F0] rounded-lg p-4 md:p-6 shadow-sm space-y-4" data-validation-error={!!errors.skills || undefined}>',
    to: '<div className="border rounded-lg p-4 md:p-6 shadow-sm space-y-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }} data-validation-error={!!errors.skills || undefined}>'
  },
  {
    from: '<h2 className="text-base md:text-lg font-bold text-[#0F172A]">My Skills <span className="text-xs font-medium text-[#94A3B8] ml-2">✨ Sparkle magic</span></h2>',
    to: '<h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>My Skills <span className="text-xs font-medium ml-2" style={{ color: "var(--text-muted)" }}>✨ Sparkle magic</span></h2>'
  },
  {
    from: '<div className={`flex flex-wrap gap-3 p-4 rounded-xl border ${isEditing ? "border-[#BFDBFE] bg-white dark:bg-slate-800" : "border-transparent bg-[#F0F7FF]/50"}`}>',
    to: '<div className={`flex flex-wrap gap-3 p-4 rounded-xl border ${isEditing ? "border-[#BFDBFE]" : "border-transparent"}`} style={{ backgroundColor: isEditing ? "var(--input-bg)" : "rgba(240,247,255,0.5)" }}>'
  },
  {
    from: 'className="flex-1 bg-white dark:bg-slate-800 border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"',
    to: 'className="flex-1 border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] transition-all" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}'
  },
  {
    from: '<h2 className="text-base md:text-lg font-bold text-[#0F172A]">Social Links</h2>',
    to: '<h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>Social Links</h2>'
  },
  {
    from: '<h2 className="text-base md:text-lg font-bold text-[#0F172A] dark:text-gray-100">Job Preferences</h2>',
    to: '<h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>Job Preferences</h2>'
  },
  {
    from: '<label className="text-xs font-bold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Preferred Job Type</label>',
    to: '<label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Preferred Job Type</label>'
  },
  {
    from: '<label className="text-xs font-bold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Preferred Locations</label>',
    to: '<label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Preferred Locations</label>'
  },
  {
    from: '<div className="flex flex-wrap gap-2 p-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700">',
    to: '<div className="flex flex-wrap gap-2 p-2 rounded-xl border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>'
  },
  {
    from: '<div className="flex items-center bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-lg px-2 py-1 ml-1 flex-1 min-w-[100px]">',
    to: '<div className="flex items-center border rounded-lg px-2 py-1 ml-1 flex-1 min-w-[100px]" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)" }}>'
  },
  {
    from: 'className="text-[10px] font-bold outline-none w-full bg-transparent text-[#0F172A] dark:text-gray-100"',
    to: 'className="text-[10px] font-bold outline-none w-full bg-transparent" style={{ color: "var(--text-primary)" }}'
  },
  {
    from: '<label className="text-xs font-bold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Expected Salary (LPA)</label>',
    to: '<label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Expected Salary (LPA)</label>'
  },
  {
    from: '<div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-[#2563EB] shadow-sm flex-wrap gap-y-2 max-w-[200px]">',
    to: '<div className="flex items-center space-x-2 rounded-lg p-2.5 border border-[#2563EB] shadow-sm flex-wrap gap-y-2 max-w-[200px]" style={{ backgroundColor: "var(--input-bg)" }}>'
  },
  {
    from: 'className="w-12 text-center text-sm font-bold bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded py-1 outline-none focus:border-[#2563EB] text-[#0F172A] dark:text-gray-100 transition-colors"',
    to: 'className="w-12 text-center text-sm font-bold border rounded py-1 outline-none focus:border-[#2563EB] transition-colors" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}'
  },
  {
    from: '<span className="text-xs font-bold text-[#64748B] dark:text-gray-400 px-1">-</span>',
    to: '<span className="text-xs font-bold px-1" style={{ color: "var(--text-secondary)" }}>-</span>'
  },
  {
    from: '<span className="text-xs font-bold text-[#0F172A] dark:text-gray-100 ml-1">LPA</span>',
    to: '<span className="text-xs font-bold ml-1" style={{ color: "var(--text-primary)" }}>LPA</span>'
  },
  {
    from: '<div className="w-full max-w-[200px] bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-[#0F172A] dark:text-gray-100 flex justify-between items-center cursor-default">',
    to: '<div className="w-full max-w-[200px] border rounded-lg px-3 py-2 text-sm font-semibold flex justify-between items-center cursor-default" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>'
  },
  {
    from: '<label className="text-xs font-bold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Availability</label>',
    to: '<label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Availability</label>'
  },
  {
    from: 'className="w-full bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-[#2563EB] shadow-sm transition-colors text-[#0F172A] dark:text-gray-100"',
    to: 'className="w-full border rounded-lg px-3 py-2 text-sm font-medium outline-none shadow-sm transition-colors" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}'
  },
  {
    from: '<div className="w-full bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-semibold text-[#0F172A] dark:text-gray-100 flex items-center cursor-default">',
    to: '<div className="w-full border rounded-lg px-3 py-2 text-sm font-semibold flex items-center cursor-default" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>'
  },
  {
    from: 'const InputGroup = ({ label, name, value, icon, isEditing, onChange, onBlur, error, borderOverride }) => (\n  <div className="space-y-2" data-validation-error={!!error || undefined}>\n    <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">{label}</label>\n    <div className="relative group">\n      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? "text-[#2563EB]" : "text-[#94A3B8]"}`}>\n        {icon}\n      </div>\n      {isEditing ? (\n        <input \n          type="text" \n          name={name}\n          value={value} \n          onChange={onChange}\n          onBlur={onBlur}\n          className="w-full bg-white dark:bg-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none shadow-sm transition-all"\n          style={{ border: borderOverride || "1px solid #2563EB" }}\n        />\n      ) : (\n        <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-2 pl-10 pr-4 text-sm font-semibold text-[#0F172A]">\n          {value || "-"}\n        </div>\n      )}\n    </div>\n    <FieldError error={error} />\n  </div>\n);',
    to: 'const InputGroup = ({ label, name, value, icon, isEditing, onChange, onBlur, error, borderOverride }) => (\n  <div className="space-y-2" data-validation-error={!!error || undefined}>\n    <label className="text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>{label}</label>\n    <div className="relative group">\n      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? "text-[#2563EB]" : ""}`} style={{ color: !isEditing ? "var(--text-muted)" : undefined }}>\n        {icon}\n      </div>\n      {isEditing ? (\n        <input \n          type="text" \n          name={name}\n          value={value} \n          onChange={onChange}\n          onBlur={onBlur}\n          className="w-full rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none shadow-sm transition-all"\n          style={{ border: borderOverride || "1px solid #2563EB", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}\n        />\n      ) : (\n        <div className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm font-semibold" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>\n          {value || "-"}\n        </div>\n      )}\n    </div>\n    <FieldError error={error} />\n  </div>\n);'
  },
  {
    from: 'className="flex-1 bg-white dark:bg-slate-800 rounded-lg py-2 pl-12 pr-4 text-sm font-medium outline-none shadow-sm transition-all"\n              style={{ border: error ? "1px solid #EF4444" : "1px solid #2563EB" }}',
    to: 'className="flex-1 rounded-lg py-2 pl-12 pr-4 text-sm font-medium outline-none shadow-sm transition-all"\n              style={{ border: error ? "1px solid #EF4444" : "1px solid #2563EB", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}'
  },
  {
    from: 'className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#F1F5F9] transition-colors"',
    to: 'className="border px-3 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-colors" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}'
  },
  {
    from: '<div className="w-full bg-[#F8FAFC] flex items-center border border-[#E2E8F0] rounded-lg py-2 pl-12 pr-32 text-sm font-semibold text-[#1E40AF]">',
    to: '<div className="w-full flex items-center border rounded-lg py-2 pl-12 pr-32 text-sm font-semibold" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>'
  },
  {
    from: '<span className="text-[#94A3B8] font-medium">No {label.toLowerCase()} configured</span>',
    to: '<span className="font-medium" style={{ color: "var(--text-muted)" }}>No {label.toLowerCase()} configured</span>'
  },
  {
    from: '<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-[#F8FAFC] px-1 space-x-1">',
    to: '<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-1 space-x-1" style={{ backgroundColor: "var(--bg-secondary)" }}>'
  }
];

let pCount = 0;
for (const r of pReplacements) {
  if (pContent.includes(r.from)) {
    pContent = pContent.replace(r.from, r.to);
    pCount++;
  } else {
    console.log("Could not find replacement in Profile.jsx:", r.from.substring(0, 50));
  }
}
fs.writeFileSync(profilePath, pContent, 'utf8');
console.log(`Replaced ${pCount} items in Profile.jsx`);
