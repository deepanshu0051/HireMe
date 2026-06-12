import React, { useState, useRef, useEffect } from "react";
import { 
  User, Mail, Phone, MapPin, Globe, 
  Briefcase, Code, 
  Camera, Edit3, Check, Save, X, Plus, 
  ExternalLink 
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { isGuest, getToken } from "../utils/auth";
import { guestData } from "../utils/guestData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Inline SVG icons not available in installed lucide-react version
const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GithubIcon = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

// ─── Validation Helpers ───────────────────────────────────
const validators = {
  fullName: (v) => {
    const val = v?.trim() || "";
    if (!val) return "Name is required";
    if (!/^[a-zA-Z\s]+$/.test(val)) return "Name can only contain letters and spaces";
    if (val.length < 2) return "Name must be at least 2 characters";
    if (val.length > 50) return "Name must be under 50 characters";
    return "";
  },
  email: (v) => {
    const val = v?.trim() || "";
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email address (e.g. name@gmail.com)";
    return "";
  },
  mobile: (v) => {
    const val = v?.trim().replace(/^\+91\s?/, "") || "";
    if (!val) return "Mobile number is required";
    if (!/^\d+$/.test(val)) return "Mobile number can only contain digits";
    if (val.length !== 10) return "Mobile number must be exactly 10 digits";
    if (!/^[6-9]/.test(val)) return "Please enter a valid Indian mobile number starting with 6-9";
    return "";
  },
  role: (v) => (!v || !v.trim() ? "Please select your current role" : ""),
  address: (v) => {
    const val = v?.trim() || "";
    if (!val) return "Address is required";
    if (val.length < 10) return "Please enter a complete address";
    if (val.length > 200) return "Address must be under 200 characters";
    return "";
  },
  linkedin: (v) => validateSocialUrl(v, "linkedin.com/in/"),
  github: (v) => validateSocialUrl(v, "github.com/"),
};

const validateSocialUrl = (v, domainPath) => {
  const val = v?.trim() || "";
  if (!val) return "URL is required for " + domainPath.split(".")[0];
  if (/\s/.test(val)) return "URL cannot contain spaces";
  if (val.includes("javascript:") || val.includes("<") || val.includes(">")) return "URL contains invalid characters";
  if (!val.includes(domainPath)) return `Please enter a valid URL containing ${domainPath}`;
  const parts = val.split(domainPath);
  if (parts.length < 2 || !/[A-Za-z]/.test(parts[1])) return "Slug must contain at least one letter";
  return "";
};

const validateLanguageTag = (val, existing) => {
  const v = val.trim();
  if (!v) return "Language name cannot be empty";
  if (v.includes("<") || v.includes(">")) return "Disallowed characters";
  if (v.length < 2) return "Language must be at least 2 characters";
  if (v.length > 30) return "Language must be under 30 characters";
  if (existing.map(l => l.toLowerCase()).includes(v.toLowerCase())) return "This language is already added";
  return "";
};

const validateSkillTag = (val, existing) => {
  const v = val.trim();
  if (!v) return "Skill name cannot be empty";
  if (v.includes("<") || v.includes(">")) return "Disallowed characters";
  if (v.length < 2) return "Skill must be at least 2 characters";
  if (v.length > 30) return "Skill must be under 30 characters";
  if (existing.map(s => s.toLowerCase()).includes(v.toLowerCase())) return "This skill is already added";
  return "";
};

const validateLocationTag = (val, existing) => {
  const v = val.trim();
  if (!v) return "Location string cannot be empty";
  if (v.includes("<") || v.includes(">")) return "Disallowed characters";
  if (v.length < 2) return "Location must be at least 2 characters";
  if (v.length > 40) return "Location must be under 40 characters";
  if (existing.length >= 10) return "Maximum 10 locations allowed";
  if (existing.map(loc => loc.toLowerCase()).includes(v.toLowerCase())) return "This location is already added";
  return "";
};

// ─── Error text component ─────────────────────────────────
const FieldError = ({ error }) => {
  if (!error) return null;
  return <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4, fontWeight: 600 }}>{error}</p>;
};

// ─── Main Profile Component ──────────────────────────────
const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastColor, setToastColor] = useState("#10B981");

  const [profile, setProfile] = useState({
    fullName: "", email: "", mobile: "", role: "", address: "", avatar: "",
    linkedin: "", github: "",
    jobType: "Full Time", expectedSalaryMinLpa: 1, expectedSalaryMaxLpa: 2,
    availability: "Immediately Available"
  });

  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [prefLocations, setPrefLocations] = useState([]);

  const [newLanguage, setNewLanguage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const [errors, setErrors] = useState({});
  const [tagErrors, setTagErrors] = useState({ language: "", skill: "", location: "" });

  const fileInputRef = useRef(null);

  const displayToast = (message, color = "#10B981") => {
    setToastMsg(message);
    setToastColor(color);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 1) Fetch data from MongoDB on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/profile`, {
          headers: { "Authorization": `Bearer ${getToken()}` },
        });
        if (res.ok) {
          const data = await res.json();
          hydrateState(data);
          
          // One-time partial migration logic for admin: if the DB is a skeleton and we have local data, migrate it.
          if (!isGuest()) {
            const localRaw = localStorage.getItem("hireme_profile");
            if (localRaw && (!data.fullName || data.fullName.trim() === "")) {
              try {
                const localData = JSON.parse(localRaw);
                if (localData.profile) hydrateState({ ...localData.profile, ...localData });
              } catch (e) {
                console.error("Migration failed", e);
              }
            }
          }
        } else {
          displayToast("Failed to fetch profile", "#EF4444");
        }
      } catch (e) {
        displayToast("Network Error fetching profile", "#EF4444");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const hydrateState = (data) => {
    setProfile(prev => ({
      ...prev,
      fullName: data.fullName || "",
      email: data.email || "",
      mobile: data.mobile || "",
      role: data.role || "",
      address: data.address || "",
      avatar: data.avatar || "",
      linkedin: data.linkedin || "",
      github: data.github || "",
      jobType: data.jobType || "Full Time",
      expectedSalaryMinLpa: data.expectedSalaryMinLpa || 1,
      expectedSalaryMaxLpa: data.expectedSalaryMaxLpa || 2,
      availability: data.availability || "Immediately Available"
    }));
    setLanguages(data.languages || []);
    setSkills(data.skills || []);
    setPrefLocations(data.prefLocations || []);
  };

  // 2) API Push Helper
  const pushToApi = async (dataToSave) => {
    if (isGuest()) {
      displayToast("Guest mode — saving disabled. Admin access only.", "#EF4444");
      return false;
    }
    
    try {
      const res = await fetch(`${BASE_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(dataToSave)
      });
      if (res.ok) {
        const data = await res.json();
        hydrateState(data); // Sync completely with server format
        displayToast("Profile saved successfully", "#10B981");
        
        // Clean up legacy localStorage if it exists
        localStorage.removeItem("hireme_profile");
        return true;
      } else {
        const err = await res.json();
        displayToast(err.message || "Failed to save profile", "#EF4444");
        return false;
      }
    } catch (error) {
      displayToast("Network error saving profile", "#EF4444");
      return false;
    }
  };

  const getFullPayload = (overrides = {}) => {
    return {
      ...profile,
      languages,
      skills,
      prefLocations,
      ...overrides
    };
  };

  // ─── Inline Link Editing Handler ───────────────────────
  const handleInlineLinkSave = async (name, newValue) => {
    if (isGuest()) {
      displayToast("Guest mode — saving disabled. Admin access only.", "#EF4444");
      return "Guest mode";
    }

    const val = newValue.trim();
    const err = validators[name](val);
    if (err) return err;

    setProfile(prev => ({ ...prev, [name]: val }));
    const success = await pushToApi(getFullPayload({ [name]: val }));
    return success ? "" : "Failed API";
  };

  const setFieldError = (name, msg) => setErrors(prev => ({ ...prev, [name]: msg }));
  const clearFieldError = (name) => setErrors(prev => ({ ...prev, [name]: "" }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitized = value;
    if (name === "fullName") sanitized = value.replace(/[^a-zA-Z\s]/g, "");
    if (name === "mobile") sanitized = value.replace(/\D/g, "");
    setProfile(prev => ({ ...prev, [name]: sanitized }));
    clearFieldError(name);
  };

  const handleBlur = (name) => {
    if (!isEditing) return;
    const fn = validators[name];
    if (fn) setFieldError(name, fn(profile[name]));
  };

  const handleAvatarChange = (e) => {
    if (isGuest()) {
      displayToast("Guest mode — saving disabled. Admin access only.", "#EF4444");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setProfile(prev => ({ ...prev, avatar: base64 }));
        pushToApi(getFullPayload({ avatar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── Full validate on Top-Level Save ──────────────────────────────
  const handleSave = async () => {
    if (isGuest()) {
      displayToast("Guest mode — saving disabled. Admin access only.", "#EF4444");
      setIsEditing(false);
      return;
    }

    const trimmedProfile = { ...profile };
    Object.keys(trimmedProfile).forEach(k => {
      if (typeof trimmedProfile[k] === "string") trimmedProfile[k] = trimmedProfile[k].trim();
    });

    const newErrors = {};
    ["fullName", "email", "mobile", "role", "address"].forEach(field => {
      const fn = validators[field];
      if (fn) {
        const err = fn(trimmedProfile[field]);
        if (err) newErrors[field] = err;
      }
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(v => v);
    if (hasErrors) {
      displayToast("Please fix all errors before saving", "#EF4444");
      setTimeout(() => {
        const el = document.querySelector("[data-validation-error='true']");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    const payload = getFullPayload();
    const success = await pushToApi(payload);
    if (success) {
      setIsEditing(false);
      setErrors({});
    }
  };

  // Tag Handlers
  const addTag = (type) => {
    if (type === "language") {
      const err = validateLanguageTag(newLanguage, languages);
      if (err) { setTagErrors(p => ({ ...p, language: err })); return; }
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
      setTagErrors(p => ({ ...p, language: "" }));
      clearFieldError("languages");
    } else if (type === "skill") {
      const err = validateSkillTag(newSkill, skills);
      if (err) { setTagErrors(p => ({ ...p, skill: err })); return; }
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setTagErrors(p => ({ ...p, skill: "" }));
      clearFieldError("skills");
    } else if (type === "location" && newLocation.trim()) {
      const err = validateLocationTag(newLocation, prefLocations);
      if (err) { setTagErrors(p => ({ ...p, location: err })); return; }
      setPrefLocations([...prefLocations, newLocation.trim()]);
      setNewLocation("");
      setTagErrors(p => ({ ...p, location: "" }));
    }
  };

  const removeTag = (type, tagToRemove) => {
    if (type === "language") setLanguages(languages.filter(t => t !== tagToRemove));
    else if (type === "skill") setSkills(skills.filter(t => t !== tagToRemove));
    else if (type === "location") setPrefLocations(prefLocations.filter(t => t !== tagToRemove));
  };


  // --- Global Job Preferences UX Handlers ---
  const [isEditingPrefs, setIsEditingPrefs] = useState(false);
  const [jobPrefsBackup, setJobPrefsBackup] = useState({});
  const [salMin, setSalMin] = useState("");
  const [salMax, setSalMax] = useState("");
  const [salErr, setSalErr] = useState("");

  const handleEditPrefsStart = () => {
    setJobPrefsBackup({
      jobType: profile.jobType,
      expectedSalaryMinLpa: profile.expectedSalaryMinLpa,
      expectedSalaryMaxLpa: profile.expectedSalaryMaxLpa,
      availability: profile.availability,
      prefLocations: [...prefLocations]
    });
    setSalMin(profile.expectedSalaryMinLpa || "");
    setSalMax(profile.expectedSalaryMaxLpa || "");
    setIsEditingPrefs(true);
  };

  const handleEditPrefsCancel = () => {
    setProfile(p => ({
      ...p,
      jobType: jobPrefsBackup.jobType,
      expectedSalaryMinLpa: jobPrefsBackup.expectedSalaryMinLpa,
      expectedSalaryMaxLpa: jobPrefsBackup.expectedSalaryMaxLpa,
      availability: jobPrefsBackup.availability
    }));
    setPrefLocations(jobPrefsBackup.prefLocations);
    setSalErr("");
    setIsEditingPrefs(false);
  };

  const handleEditPrefsSave = async () => {
    if (isGuest()) {
      displayToast("Guest mode — saving disabled. Admin access only.", "#EF4444");
      handleEditPrefsCancel();
      return;
    }

    const min = parseInt(salMin, 10);
    const max = parseInt(salMax, 10);
    if (!salMin || !salMax || isNaN(min) || isNaN(max) || min < 1 || max < 1 || min > 99 || max > 99) {
      setSalErr("Requires valid digits 1-99");
      return;
    }
    if (min > max) {
      setSalErr("Min cannot exceed Max");
      return;
    }
    if (prefLocations.length === 0) {
      setSalErr(""); // clear min/max error if fixed but location empty
      displayToast("Select at least 1 preferred location", "#EF4444");
      return;
    }
    
    setSalErr("");
    const newProfile = { ...profile, expectedSalaryMinLpa: min, expectedSalaryMaxLpa: max };
    setProfile(newProfile);
    
    const success = await pushToApi(getFullPayload({ expectedSalaryMinLpa: min, expectedSalaryMaxLpa: max }));
    if (success) {
      setIsEditingPrefs(false);
    }
  };

  const borderFor = (name) => {
    if (!isEditing) return undefined;
    if (errors[name]) return "1px solid #EF4444";
    if (profile[name] !== undefined && validators[name] && !validators[name](profile[name])) return "1px solid #10B981";
    return undefined;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-[#64748B] font-medium animate-pulse">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto py-4 space-y-6 animate-fade-in relative">
        
        {/* SUCCESS/ERROR TOAST */}
        {showToast && (
          <div className="fixed bottom-8 right-8 z-[200] animate-slide-in-right">
            <div className={`text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-3`} style={{ backgroundColor: toastColor }}>
              <Check size={20} className="bg-white rounded-full p-0.5" />
              <span className="font-bold text-sm">{toastMsg}</span>
            </div>
          </div>
        )}

        {/* TOP SECTION - HERO CARD */}
        <div className="border border-[#BFDBFE] rounded-lg p-6 shadow-[0_4px_20px_rgba(37,99,235,0.08)] flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative overflow-hidden" style={{ backgroundColor: "var(--card-bg)" }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full border-4 border-[#EFF6FF] bg-[#F1F5F9] flex items-center justify-center overflow-hidden shadow-sm">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-[#94A3B8]" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 bg-white border border-[#E2E8F0] p-2 rounded-full shadow-md text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".jpg,.jpeg,.png"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Basic Info */}
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-lg md:text-xl font-bold" style={{ color: "var(--text-primary)" }}>{profile.fullName || "User Name"}</h1>
              <p className="font-medium text-xs" style={{ color: "var(--text-secondary)" }}>{profile.role || "Role not set"}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-xs pt-1" style={{ color: "var(--text-muted)" }}>
                <MapPin size={12} />
                <span>{profile.address || "Location not set"}</span>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center md:justify-start space-x-3 pt-4">
                <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-3 py-1 rounded-full border border-[#BFDBFE]">
                  Profile Ready
                </span>
                <span className="bg-[#DCFCE7] text-[#166534] text-[10px] font-bold px-3 py-1 rounded-full border border-[#BBF7D0]">
                  Connected
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 relative z-10 items-end">
            {isGuest() && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-bold text-xs border border-[#E2E8F0] shadow-sm cursor-help" title="Guest interactions disabled for DB">
                <span>View Only (Guest Mode)</span>
              </div>
            )}
            
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md group ${
                isEditing 
                  ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]" 
                  : "border border-[#BFDBFE] text-[#2563EB] bg-white hover:bg-[#EFF6FF]"
              }`}
            >
              {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
              <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
            </button>
          </div>
        </div>

        {/* SECTION 2 - PERSONAL INFORMATION */}
        <div className="border rounded-lg p-4 md:p-6 shadow-sm space-y-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
          <div className="flex items-center space-x-2 border-b pb-3" style={{ borderBottomColor: "var(--border-color)" }}>
            <User size={18} className="text-[#2563EB]" />
            <h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup 
              label="Full Name" name="fullName" value={profile.fullName} 
              icon={<User size={16} />} isEditing={isEditing} 
              onChange={handleInputChange} onBlur={() => handleBlur("fullName")}
              error={errors.fullName} borderOverride={borderFor("fullName")}
            />
            <InputGroup 
              label="Email Address" name="email" value={profile.email} 
              icon={<Mail size={16} />} isEditing={isEditing} 
              onChange={handleInputChange} onBlur={() => handleBlur("email")}
              error={errors.email} borderOverride={borderFor("email")}
            />
            <InputGroup 
              label="Mobile Number" name="mobile" value={profile.mobile} 
              icon={<Phone size={16} />} isEditing={isEditing} 
              onChange={handleInputChange} onBlur={() => handleBlur("mobile")}
              error={errors.mobile} borderOverride={borderFor("mobile")}
            />
            <div className="space-y-2" data-validation-error={!!errors.role || undefined}>
              <label className="text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>Current Role</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#2563EB] transition-colors" style={{ color: "var(--text-muted)" }}>
                  <Briefcase size={16} />
                </div>
                {isEditing ? (
                  <select 
                    name="role"
                    value={profile.role}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("role")}
                    className="w-full rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none shadow-sm"
                    style={{ border: borderFor("role") || "1px solid #2563EB", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                  >
                    <option value="">Select Role</option>
                    {[
                      "Full Stack Developer", "Frontend Developer", "Backend Developer", 
                      "MERN Stack Developer", "React Developer", "Software Engineer", 
                      "Node.js Developer"
                    ].map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                ) : (
                  <div className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm font-semibold" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                    {profile.role || "-"}
                  </div>
                )}
              </div>
              <FieldError error={errors.role} />
            </div>

            <div className="md:col-span-2">
              <InputGroup 
                label="Address" name="address" value={profile.address} 
                icon={<MapPin size={16} />} isEditing={isEditing} 
                onChange={handleInputChange} onBlur={() => handleBlur("address")}
                error={errors.address} borderOverride={borderFor("address")}
              />
            </div>

            {/* Languages Known */}
            <div className="md:col-span-2 space-y-3" data-validation-error={!!errors.languages || undefined}>
              <label className="text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>Languages Known</label>
              <div className={`flex flex-wrap gap-2 p-3 rounded-xl border ${isEditing ? "border-[#BFDBFE]" : ""}`} style={{ backgroundColor: isEditing ? "var(--input-bg)" : "var(--bg-secondary)", borderColor: isEditing ? undefined : "var(--border-color)" }}>
                {languages.map(lang => (
                  <Tag 
                    key={lang} 
                    label={lang} 
                    isEditing={isEditing} 
                    onRemove={() => removeTag("language", lang)} 
                  />
                ))}
                {isEditing && (
                  <div className="flex items-center border rounded-lg pl-3 pr-1 py-1 ml-1 shadow-sm" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)" }}>
                    <input 
                      type="text" 
                      placeholder="Add language" 
                      className="text-xs font-bold outline-none w-24"
                      value={newLanguage}
                      onChange={(e) => { setNewLanguage(e.target.value.replace(/[^a-zA-Z\s]/g, "")); setTagErrors(p => ({ ...p, language: "" })); }}
                      onKeyDown={(e) => e.key === "Enter" && addTag("language")}
                    />
                    <button 
                      onClick={() => addTag("language")}
                      className="p-1 text-[#2563EB] hover:bg-[#EFF6FF] rounded-md"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}
              </div>
              <FieldError error={tagErrors.language || errors.languages} />
            </div>
          </div>
        </div>

        {/* SECTION 3 - SKILLS */}
        <div className="border rounded-lg p-4 md:p-6 shadow-sm space-y-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }} data-validation-error={!!errors.skills || undefined}>
          <div className="flex items-center space-x-2 border-b border-[#F1F5F9] pb-3">
            <Code size={18} className="text-[#2563EB]" />
            <h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>My Skills <span className="text-xs font-medium ml-2" style={{ color: "var(--text-muted)" }}>✨ Sparkle magic</span></h2>
          </div>

          <div className="space-y-6">
            <div className={`flex flex-wrap gap-3 p-4 rounded-xl border ${isEditing ? "border-[#BFDBFE]" : "border-transparent"}`} style={{ backgroundColor: isEditing ? "var(--input-bg)" : "rgba(240,247,255,0.5)" }}>
              {skills.map(skill => (
                <div key={skill} className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1.5 rounded-full text-xs font-bold flex items-center space-x-2 animate-fade-in group shadow-sm transition-all hover:bg-[#DBEAFE] hover:border-[#3B82F6]">
                  <span>{skill}</span>
                  {isEditing && (
                    <button onClick={() => removeTag("skill", skill)} className="hover:text-red-600 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Type skill name..." 
                    className="flex-1 border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] transition-all" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                    value={newSkill}
                    onChange={(e) => { setNewSkill(e.target.value); setTagErrors(p => ({ ...p, skill: "" })); }}
                    onKeyDown={(e) => e.key === "Enter" && addTag("skill")}
                  />
                  <button 
                    onClick={() => addTag("skill")}
                    className="bg-[#2563EB] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-[#1d4ed8]"
                  >
                    Add Skill
                  </button>
                </div>
                <FieldError error={tagErrors.skill || errors.skills} />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4 - SOCIAL LINKS */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-[#F1F5F9] pb-3">
            <Globe size={18} className="text-[#2563EB]" />
            <h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>Social Links</h2>
          </div>

          <div className="space-y-4">
            <SocialLinkInput 
              icon={<LinkedinIcon size={18} className="text-[#0077B5]" />}
              label="LinkedIn URL" name="linkedin" value={profile.linkedin}
              placeholder="https://linkedin.com/in/your-profile"
              onInlineSave={(val) => handleInlineLinkSave("linkedin", val)}
            />
            <SocialLinkInput 
              icon={<GithubIcon size={18} className="text-[#181717]" />}
              label="GitHub URL" name="github" value={profile.github}
              placeholder="https://github.com/your-username"
              onInlineSave={(val) => handleInlineLinkSave("github", val)}
            />
          </div>
        </div>

        {/* SECTION 5 - JOB PREFERENCES */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 md:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center space-x-2">
              <Briefcase size={18} className="text-[#2563EB]" />
              <h2 className="text-base md:text-lg font-bold" style={{ color: "var(--text-primary)" }}>Job Preferences</h2>
            </div>
            {!isEditingPrefs ? (
              <button 
                onClick={handleEditPrefsStart}
                className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-all"
              >
                <Edit3 size={14} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleEditPrefsCancel}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#F1F5F9] transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditPrefsSave}
                  className="bg-[#10B981] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#059669] shadow-sm transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Preferred Job Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Preferred Job Type</label>
              <div className="flex flex-wrap gap-2">
                {["Full Time", "Remote", "Hybrid", "Internship"].map(type => (
                  <button 
                    key={type}
                    onClick={() => isEditingPrefs && setProfile(prev => ({ ...prev, jobType: type }))}
                    disabled={!isEditingPrefs}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-bold border transition-all disabled:opacity-90 disabled:cursor-default",
                      profile.jobType === type 
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-100" 
                        : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                    )}
                  >
                    <div className="flex items-center space-x-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full", profile.jobType === type ? "bg-white" : "bg-[#94A3B8]")}></div>
                      <span>{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Locations */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Preferred Locations</label>
              <div className="flex flex-wrap gap-2 p-2 rounded-xl border" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
                {prefLocations.map(loc => (
                  <Tag 
                    key={loc} 
                    label={loc} 
                    isEditing={isEditingPrefs} 
                    onRemove={() => removeTag("location", loc)}
                  />
                ))}
                {isEditingPrefs && (
                  <div className="flex items-center border rounded-lg px-2 py-1 ml-1 flex-1 min-w-[100px]" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)" }}>
                    <input 
                      type="text" 
                      placeholder="Add city" 
                      className="text-[10px] font-bold outline-none w-full bg-transparent" style={{ color: "var(--text-primary)" }}
                      value={newLocation}
                      onChange={(e) => { setNewLocation(e.target.value); setTagErrors(p => ({ ...p, location: "" })); }}
                      onKeyDown={(e) => e.key === "Enter" && addTag("location")}
                    />
                    <button onClick={() => addTag("location")} className="ml-1 text-[#2563EB]">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
              {isEditingPrefs && <FieldError error={tagErrors.location} />}
            </div>

            {/* Expected Salary Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Expected Salary (LPA)</label>
              
              {isEditingPrefs ? (
                <div className="flex items-center space-x-2 rounded-lg p-2.5 border border-[#2563EB] shadow-sm flex-wrap gap-y-2 max-w-[200px]" style={{ backgroundColor: "var(--input-bg)" }}>
                  <div className="flex items-center space-x-1">
                    <input 
                      type="text" 
                      value={salMin} 
                      onChange={(e) => { setSalMin(e.target.value.replace(/\D/g, '').slice(0, 2)); setSalErr(""); }}
                      placeholder="Min"
                      className="w-12 text-center text-sm font-bold border rounded py-1 outline-none focus:border-[#2563EB] transition-colors" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                    />
                    <span className="text-xs font-bold px-1" style={{ color: "var(--text-secondary)" }}>-</span>
                    <input 
                      type="text" 
                      value={salMax} 
                      onChange={(e) => { setSalMax(e.target.value.replace(/\D/g, '').slice(0, 2)); setSalErr(""); }}
                      placeholder="Max"
                      className="w-12 text-center text-sm font-bold bg-[#F8FAFC] border border-[#E2E8F0] rounded py-1 outline-none focus:border-[#2563EB] text-[#0F172A] transition-colors"
                    />
                    <span className="text-xs font-bold ml-1" style={{ color: "var(--text-primary)" }}>LPA</span>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[200px] border rounded-lg px-3 py-2 text-sm font-semibold flex justify-between items-center cursor-default" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  <span>{profile.expectedSalaryMinLpa || 1} – {profile.expectedSalaryMaxLpa || 2} LPA</span>
                </div>
              )}
              {isEditingPrefs && <FieldError error={salErr} />}
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Availability</label>
              {isEditingPrefs ? (
                <select 
                  value={profile.availability}
                  onChange={(e) => setProfile(p => ({ ...p, availability: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm font-medium outline-none shadow-sm transition-colors" style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                >
                  {["Immediately Available", "15 Days", "30 Days", "45 Days", "60 Days", "90 Days"].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              ) : (
                <div className="w-full border rounded-lg px-3 py-2 text-sm font-semibold flex items-center cursor-default" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  <span>{profile.availability || "Not Set"}</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

// HELPER COMPONENTS
const InputGroup = ({ label, name, value, icon, isEditing, onChange, onBlur, error, borderOverride }) => (
  <div className="space-y-2" data-validation-error={!!error || undefined}>
    <label className="text-xs font-bold uppercase tracking-wider pl-1" style={{ color: "var(--text-secondary)" }}>{label}</label>
    <div className="relative group">
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? "text-[#2563EB]" : ""}`} style={{ color: !isEditing ? "var(--text-muted)" : undefined }}>
        {icon}
      </div>
      {isEditing ? (
        <input 
          type="text" 
          name={name}
          value={value} 
          onChange={onChange}
          onBlur={onBlur}
          className="w-full rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none shadow-sm transition-all"
          style={{ border: borderOverride || "1px solid #2563EB", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
        />
      ) : (
        <div className="w-full border rounded-lg py-2 pl-10 pr-4 text-sm font-semibold" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
          {value || "-"}
        </div>
      )}
    </div>
    <FieldError error={error} />
  </div>
);

const SocialLinkInput = ({ icon, label, name, value, placeholder, onInlineSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value || "");
  const [error, setError] = useState("");

  const handleSave = async () => {
    const err = await onInlineSave(localVal);
    if (err) {
      setError(err);
    } else {
      setError("");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setLocalVal(value || "");
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="space-y-1">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-100 z-10 transition-colors">
          {icon}
        </div>
        
        {isEditing ? (
          <div className="flex items-center space-x-2 w-full">
            <input 
              type="text"
              name={name}
              value={localVal}
              onChange={(e) => { setLocalVal(e.target.value); setError(""); }}
              placeholder={placeholder}
              autoFocus
              className="flex-1 rounded-lg py-2 pl-12 pr-4 text-sm font-medium outline-none shadow-sm transition-all"
              style={{ border: error ? "1px solid #EF4444" : "1px solid #2563EB", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
            />
            <button 
              onClick={handleSave} 
              className="bg-[#10B981] text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#059669] shadow-sm transition-colors"
            >
              Save
            </button>
            <button 
              onClick={handleCancel} 
              className="border px-3 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-colors" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="w-full flex items-center border rounded-lg py-2 pl-12 pr-32 text-sm font-semibold" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
              {value && value.length > 0 ? (
                <span className="truncate">{value}</span>
              ) : (
                <span className="font-medium" style={{ color: "var(--text-muted)" }}>No {label.toLowerCase()} configured</span>
              )}
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-1 space-x-1" style={{ backgroundColor: "var(--bg-secondary)" }}>
              {value && value.length > 0 && (
                <button 
                  onClick={() => window.open(value.startsWith('http') ? value : `https://${value}`, "_blank")}
                  className="flex items-center space-x-1 py-1.5 px-3 rounded-lg text-[10px] font-bold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors border border-transparent"
                >
                  <span>Open</span>
                  <ExternalLink size={12} />
                </button>
              )}
              <button 
                onClick={() => { setIsEditing(true); setLocalVal(value || ""); }}
                className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg text-[11px] font-bold bg-[#EFF6FF] text-[#1E40AF] hover:bg-[#DBEAFE] transition-colors border border-[#BFDBFE] shadow-sm"
              >
                <Edit3 size={12} />
                <span>Change</span>
              </button>
            </div>
          </>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
};

const Tag = ({ label, isEditing, onRemove }) => (
  <div className="bg-[#EFF6FF] text-[#2563EB] px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 border border-[#BFDBFE] animate-scale-in">
    <span>{label}</span>
    {isEditing && (
      <button onClick={onRemove} className="hover:text-red-500 transition-colors">
        <X size={12} />
      </button>
    )}
  </div>
);

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default Profile;
