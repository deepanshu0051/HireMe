import React, { useState, useRef } from "react";
import { 
  User, Mail, Phone, MapPin, Globe, 
  Briefcase, Code, 
  Camera, Edit3, Check, Save, X, Plus, 
  ExternalLink 
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";

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
    const val = v.trim();
    if (!val) return "Name is required";
    if (!/^[a-zA-Z\s]+$/.test(val)) return "Name can only contain letters and spaces";
    if (val.length < 2) return "Name must be at least 2 characters";
    if (val.length > 50) return "Name must be under 50 characters";
    return "";
  },
  email: (v) => {
    const val = v.trim();
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Please enter a valid email address (e.g. name@gmail.com)";
    return "";
  },
  mobile: (v) => {
    const val = v.trim().replace(/^\+91\s?/, "");
    if (!val) return "Mobile number is required";
    if (!/^\d+$/.test(val)) return "Mobile number can only contain digits";
    if (val.length !== 10) return "Mobile number must be exactly 10 digits";
    if (!/^[6-9]/.test(val)) return "Please enter a valid Indian mobile number";
    return "";
  },
  role: (v) => (!v || !v.trim() ? "Please select your current role" : ""),
  address: (v) => {
    const val = v.trim();
    if (!val) return "Address is required";
    if (val.length < 10) return "Please enter a complete address";
    if (val.length > 200) return "Address must be under 200 characters";
    return "";
  },
  linkedin: (v) => {
    const val = v.trim();
    if (!val) return "";
    if (/\s/.test(val)) return "URL cannot contain spaces";
    if (!val.includes("linkedin.com/in/")) return "Please enter a valid LinkedIn URL (e.g. linkedin.com/in/your-name)";
    return "";
  },
  github: (v) => {
    const val = v.trim();
    if (!val) return "";
    if (/\s/.test(val)) return "URL cannot contain spaces";
    if (!val.includes("github.com/")) return "Please enter a valid GitHub URL (e.g. github.com/your-username)";
    return "";
  },
  portfolio: (v) => {
    const val = v.trim();
    if (!val) return "";
    if (/\s/.test(val)) return "URL cannot contain spaces";
    if (!val.includes(".")) return "Please enter a valid website URL";
    return "";
  },
  salary: (v) => (!v || !v.trim() ? "Please select expected salary range" : ""),
};

const validateLanguageTag = (val, existing) => {
  const v = val.trim();
  if (!v) return "Language name cannot be empty";
  if (!/^[a-zA-Z\s]+$/.test(v)) return "Language name can only contain letters";
  if (v.length < 2) return "Language must be at least 2 characters";
  if (v.length > 30) return "Language must be under 30 characters";
  if (existing.map(l => l.toLowerCase()).includes(v.toLowerCase())) return "This language is already added";
  return "";
};

const validateSkillTag = (val, existing) => {
  const v = val.trim();
  if (!v) return "Skill name cannot be empty";
  if (!/^[a-zA-Z0-9.+\s]+$/.test(v)) return "Skill can contain letters, numbers, dots, +, spaces";
  if (v.length > 30) return "Skill must be under 30 characters";
  if (existing.map(s => s.toLowerCase()).includes(v.toLowerCase())) return "This skill is already added";
  return "";
};

// ─── Error text component ─────────────────────────────────
const FieldError = ({ error }) => {
  if (!error) return null;
  return <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4, fontWeight: 600 }}>{error}</p>;
};

// ─── Main Profile Component ──────────────────────────────
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("Profile updated successfully ✓");
  const [toastColor, setToastColor] = useState("#10B981");
  
  // Profile Data States
  const [profile, setProfile] = useState({
    fullName: "Deepanshu",
    email: "deepubhati0051@gmail.com",
    mobile: "+91 9560287251",
    role: "Full Stack Developer",
    address: "Greater Noida, Uttar Pradesh",
    avatar: null,
    linkedin: "linkedin.com/in/deepanshu-bhati",
    github: "github.com/deepanshu0051",
    portfolio: "yourportfolio.com",
    jobType: "Full Time",
    salary: "8-12 LPA",
    availability: "Immediately Available"
  });

  const [languages, setLanguages] = useState(["Hindi", "English"]);
  const [skills, setSkills] = useState([
    "React.js", "Node.js", "Express.js", "MongoDB", 
    "MySQL", "JavaScript", "REST APIs", "JWT Auth", 
    "Git", "GitHub"
  ]);
  const [prefLocations, setPrefLocations] = useState(["Noida", "Delhi", "Greater Noida", "Remote"]);
  
  const [newLanguage, setNewLanguage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // ─── Validation error states ────────────────────────────
  const [errors, setErrors] = useState({});
  const [tagErrors, setTagErrors] = useState({ language: "", skill: "" });

  const fileInputRef = useRef(null);
  const firstErrorRef = useRef(null);

  const setFieldError = (name, msg) => setErrors(prev => ({ ...prev, [name]: msg }));
  const clearFieldError = (name) => setErrors(prev => ({ ...prev, [name]: "" }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Strip invalid input on paste for name-only / number-only fields
    let sanitized = value;
    if (name === "fullName") sanitized = value.replace(/[^a-zA-Z\s]/g, "");
    if (name === "mobile") sanitized = value.replace(/[^0-9+\s]/g, "");
    setProfile(prev => ({ ...prev, [name]: sanitized }));
    clearFieldError(name);
  };

  const handleBlur = (name) => {
    if (!isEditing) return;
    const fn = validators[name];
    if (fn) setFieldError(name, fn(profile[name]));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── Full validate on Save ──────────────────────────────
  const handleSave = () => {
    // Trim all values
    const trimmedProfile = { ...profile };
    Object.keys(trimmedProfile).forEach(k => {
      if (typeof trimmedProfile[k] === "string") trimmedProfile[k] = trimmedProfile[k].trim();
    });
    setProfile(trimmedProfile);

    // Run all validators
    const newErrors = {};
    ["fullName", "email", "mobile", "role", "address", "linkedin", "github", "portfolio", "salary"].forEach(field => {
      const fn = validators[field];
      if (fn) {
        const err = fn(trimmedProfile[field]);
        if (err) newErrors[field] = err;
      }
    });
    if (languages.length === 0) newErrors["languages"] = "Please add at least one language";
    if (skills.length === 0) newErrors["skills"] = "Please add at least one skill";

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(v => v);
    if (hasErrors) {
      setToastMsg("Please fix all errors before saving");
      setToastColor("#EF4444");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      // Scroll to first error
      setTimeout(() => {
        const el = document.querySelector("[data-validation-error='true']");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    setIsEditing(false);
    setToastMsg("Saved successfully ✓");
    setToastColor("#10B981");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setErrors({});
  };

  // Tag Handlers with validation
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
      setPrefLocations([...prefLocations, newLocation.trim()]);
      setNewLocation("");
    }
  };

  const removeTag = (type, tagToRemove) => {
    if (type === "language") setLanguages(languages.filter(t => t !== tagToRemove));
    else if (type === "skill") setSkills(skills.filter(t => t !== tagToRemove));
    else if (type === "location") setPrefLocations(prefLocations.filter(t => t !== tagToRemove));
  };

  // Border color helper
  const borderFor = (name) => {
    if (!isEditing) return undefined;
    if (errors[name]) return "1px solid #EF4444";
    if (profile[name] !== undefined && validators[name] && !validators[name](profile[name])) return "1px solid #10B981";
    return undefined;
  };

  return (
    <DashboardLayout>
      <div className="max-w-[900px] mx-auto py-8 space-y-8 animate-fade-in relative">
        
        {/* SUCCESS/ERROR TOAST */}
        {showToast && (
          <div className="fixed top-24 right-8 z-[100] animate-slide-in-right">
            <div className="text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-3" style={{ backgroundColor: toastColor }}>
              <Check size={20} className="bg-white/20 rounded-full p-0.5" />
              <span className="font-bold text-sm">{toastMsg}</span>
            </div>
          </div>
        )}

        {/* TOP SECTION - HERO CARD */}
        <div className="bg-white border border-[#BFDBFE] rounded-[16px] p-8 shadow-[0_4px_20px_rgba(37,99,235,0.08)] flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16"></div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 z-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-[120px] h-[120px] rounded-full border-4 border-[#EFF6FF] bg-[#F1F5F9] flex items-center justify-center overflow-hidden shadow-sm">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={60} className="text-[#94A3B8]" />
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
              <h1 className="text-3xl font-bold text-[#0F172A]">{profile.fullName}</h1>
              <p className="text-[#64748B] font-medium text-sm">{profile.role}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 text-[#94A3B8] text-xs pt-1">
                <MapPin size={12} />
                <span>{profile.address}</span>
              </div>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center md:justify-start space-x-3 pt-4">
                <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold px-3 py-1 rounded-full border border-[#BFDBFE]">
                  5 Emails/day
                </span>
                <span className="bg-[#DCFCE7] text-[#166534] text-[10px] font-bold px-3 py-1 rounded-full border border-[#BBF7D0]">
                  Auto-send ON
                </span>
                <span className="bg-[#F5F3FF] text-[#5B21B6] text-[10px] font-bold px-3 py-1 rounded-full border border-[#DDD6FE]">
                  24 Applied
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`z-10 flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md group ${
              isEditing 
                ? "bg-[#2563EB] text-white hover:bg-[#1d4ed8]" 
                : "border border-[#BFDBFE] text-[#2563EB] bg-white hover:bg-[#EFF6FF]"
            }`}
          >
            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </button>
        </div>

        {/* SECTION 2 - PERSONAL INFORMATION */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-[#F1F5F9] pb-4">
            <User size={20} className="text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A]">Personal Information</h2>
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
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">Current Role</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#2563EB] transition-colors">
                  <Briefcase size={16} />
                </div>
                {isEditing ? (
                  <select 
                    name="role"
                    value={profile.role}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("role")}
                    className="w-full bg-white rounded-lg py-3 pl-10 pr-4 text-sm font-medium outline-none shadow-sm"
                    style={{ border: borderFor("role") || "1px solid #2563EB" }}
                  >
                    {[
                      "Full Stack Developer", "Frontend Developer", "Backend Developer", 
                      "MERN Stack Developer", "React Developer", "Software Engineer", 
                      "Node.js Developer"
                    ].map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                ) : (
                  <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-3 pl-10 pr-4 text-sm font-semibold text-[#0F172A]">
                    {profile.role}
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
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">Languages Known</label>
              <div className={`flex flex-wrap gap-2 p-3 rounded-xl border ${isEditing ? "border-[#BFDBFE] bg-white" : "border-[#E2E8F0] bg-[#F8FAFC]"}`}>
                {languages.map(lang => (
                  <Tag 
                    key={lang} 
                    label={lang} 
                    isEditing={isEditing} 
                    onRemove={() => removeTag("language", lang)} 
                  />
                ))}
                {isEditing && (
                  <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg pl-3 pr-1 py-1 ml-1 shadow-sm">
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
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-sm space-y-6" data-validation-error={!!errors.skills || undefined}>
          <div className="flex items-center space-x-3 border-b border-[#F1F5F9] pb-4">
            <Code size={20} className="text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A]">My Skills <span className="text-xs font-medium text-[#94A3B8] ml-2">✨ Sparkle magic</span></h2>
          </div>

          <div className="space-y-6">
            <div className={`flex flex-wrap gap-3 p-4 rounded-xl border ${isEditing ? "border-[#BFDBFE] bg-white" : "border-transparent bg-[#F0F7FF]/50"}`}>
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
                <div className="flex items-center space-x-3">
                  <input 
                    type="text" 
                    placeholder="Type skill name..." 
                    className="flex-1 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#2563EB] transition-all"
                    value={newSkill}
                    onChange={(e) => { setNewSkill(e.target.value); setTagErrors(p => ({ ...p, skill: "" })); }}
                    onKeyDown={(e) => e.key === "Enter" && addTag("skill")}
                  />
                  <button 
                    onClick={() => addTag("skill")}
                    className="bg-[#2563EB] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:bg-[#1d4ed8]"
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
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-[#F1F5F9] pb-4">
            <Globe size={20} className="text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A]">Social Links</h2>
          </div>

          <div className="space-y-4">
            <SocialLinkInput 
              icon={<LinkedinIcon size={18} className="text-[#0077B5]" />}
              label="LinkedIn URL" name="linkedin" value={profile.linkedin}
              placeholder="linkedin.com/in/your-profile" isEditing={isEditing}
              onChange={handleInputChange} onBlur={() => handleBlur("linkedin")}
              error={errors.linkedin} borderOverride={borderFor("linkedin")}
            />
            <SocialLinkInput 
              icon={<GithubIcon size={18} className="text-[#181717]" />}
              label="GitHub URL" name="github" value={profile.github}
              placeholder="github.com/your-username" isEditing={isEditing}
              onChange={handleInputChange} onBlur={() => handleBlur("github")}
              error={errors.github} borderOverride={borderFor("github")}
            />
            <SocialLinkInput 
              icon={<Globe size={18} className="text-[#2563EB]" />}
              label="Portfolio Website" name="portfolio" value={profile.portfolio}
              placeholder="yourportfolio.com" isEditing={isEditing}
              onChange={handleInputChange} onBlur={() => handleBlur("portfolio")}
              error={errors.portfolio} borderOverride={borderFor("portfolio")}
            />
          </div>
        </div>

        {/* SECTION 5 - JOB PREFERENCES */}
        <div className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-3 border-b border-[#F1F5F9] pb-4">
            <Briefcase size={20} className="text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A]">Job Preferences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Preferred Job Type</label>
              <div className="flex flex-wrap gap-2">
                {["Full Time", "Remote", "Hybrid", "Internship"].map(type => (
                  <button 
                    key={type}
                    disabled={!isEditing}
                    onClick={() => setProfile(prev => ({ ...prev, jobType: type }))}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                      profile.jobType === type 
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-100" 
                        : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", profile.jobType === type ? "bg-white" : "bg-[#94A3B8]")}></div>
                      <span>{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Preferred Locations</label>
              <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                {prefLocations.map(loc => (
                  <Tag 
                    key={loc} 
                    label={loc} 
                    isEditing={isEditing} 
                    onRemove={() => removeTag("location", loc)}
                  />
                ))}
                {isEditing && (
                  <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 ml-1">
                    <input 
                      type="text" 
                      placeholder="Add city" 
                      className="text-[10px] font-bold outline-none w-16"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag("location")}
                    />
                    <button onClick={() => addTag("location")} className="ml-1 text-[#2563EB]">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2" data-validation-error={!!errors.salary || undefined}>
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Expected Salary</label>
              {isEditing ? (
                <select 
                  name="salary"
                  value={profile.salary}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("salary")}
                  className="w-full bg-white rounded-lg px-4 py-2.5 text-sm font-medium outline-none"
                  style={{ border: borderFor("salary") || "1px solid #2563EB" }}
                >
                  {["3-5 LPA", "5-8 LPA", "8-12 LPA", "12+ LPA"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0F172A]">{profile.salary}</div>
              )}
              <FieldError error={errors.salary} />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Availability</label>
              {isEditing ? (
                <select 
                  name="availability"
                  value={profile.availability}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-[#2563EB] rounded-lg px-4 py-2.5 text-sm font-medium outline-none"
                >
                  {["Immediately Available", "Within 15 days", "Within 1 month"].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              ) : (
                <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0F172A]">{profile.availability}</div>
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
    <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">{label}</label>
    <div className="relative group">
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? "text-[#2563EB]" : "text-[#94A3B8]"}`}>
        {icon}
      </div>
      {isEditing ? (
        <input 
          type="text" 
          name={name}
          value={value} 
          onChange={onChange}
          onBlur={onBlur}
          className="w-full bg-white rounded-lg py-3 pl-10 pr-4 text-sm font-medium outline-none shadow-sm transition-all"
          style={{ border: borderOverride || "1px solid #2563EB" }}
        />
      ) : (
        <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-3 pl-10 pr-4 text-sm font-semibold text-[#0F172A]">
          {value}
        </div>
      )}
    </div>
    <FieldError error={error} />
  </div>
);

const SocialLinkInput = ({ icon, label, name, value, placeholder, isEditing, onChange, onBlur, error, borderOverride }) => (
  <div className="space-y-1">
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? "opacity-100" : "opacity-60"}`}>
        {icon}
      </div>
      {isEditing ? (
        <input 
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full rounded-xl py-3 pl-12 pr-28 text-sm outline-none transition-all"
          style={{ border: borderOverride || "1px solid #E2E8F0" }}
        />
      ) : (
        <div className="w-full bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl py-3 pl-12 pr-28 text-sm font-semibold text-[#1E40AF]">
          {value}
        </div>
      )}
      <button 
        onClick={() => window.open(`https://${value}`, "_blank")}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 py-1 px-3 rounded-lg text-[10px] font-bold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors border border-transparent hover:border-[#BFDBFE]"
      >
        <span>Open</span>
        <ExternalLink size={10} />
      </button>
    </div>
    <FieldError error={error} />
  </div>
);

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
