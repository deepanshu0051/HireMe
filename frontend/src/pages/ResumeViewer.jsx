import React, { useState, useRef, useEffect } from "react";
import { isGuest, getToken, getRole } from "../utils/auth";
import { 
  Upload, FileText, Trash2, RefreshCw, 
  Sparkles, Loader2, Copy, Check, X,
  Eye
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ────────────────────────────────────────────────────────────────────────────
// Helper — stable class joiner
// ────────────────────────────────────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

const ResumeViewer = () => {
  // ── Resume state — single source of truth from MongoDB ──────────────────
  // resumeData shape: { url, publicId, filename, uploadedAt } | null
  const [resumeData, setResumeData] = useState(null);

  // ── Loading guards ───────────────────────────────────────────────────────
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting,  setIsDeleting]  = useState(false);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [showModal,       setShowModal]       = useState(false); // full-screen preview modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // delete confirmation
  const [toastMessage,    setToastMessage]    = useState(null);
  const [toastType,       setToastType]       = useState("success"); // "success" | "error" | "warning"

  // ── AI section state ─────────────────────────────────────────────────────
  const [jobRole,        setJobRole]        = useState("");
  const [isGenerating,   setIsGenerating]   = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [copied,         setCopied]         = useState(false);
  const [jobRoleError,   setJobRoleError]   = useState("");

  const fileInputRef = useRef(null);

  // ── Toast helper — auto-dismisses after 3 s ──────────────────────────────
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Handle ESC when full-screen preview modal is open (no scroll lock) ───
  useEffect(() => {
    if (showModal) {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setShowModal(false);
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showModal]);

  // ── Sync resumeData into localStorage for cross-page awareness ───────────
  // localStorage is used only as a secondary cache; MongoDB is the source of truth.
  const syncLocalStorage = (data) => {
    if (getRole() !== "admin") return;
    if (data) {
      localStorage.setItem("hireme_resume_uploaded",  "true");
      localStorage.setItem("hireme_resume_url",       data.url);
      localStorage.setItem("hireme_resume_public_id", data.publicId);
      localStorage.setItem("hireme_resume_filename",  data.filename);
    } else {
      localStorage.removeItem("hireme_resume_uploaded");
      localStorage.removeItem("hireme_resume_url");
      localStorage.removeItem("hireme_resume_public_id");
      localStorage.removeItem("hireme_resume_filename");
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // Fetch resume from MongoDB on load for persistence.
  // Even if the user refreshes or the page reloads, the resume state is
  // restored from the backend rather than relying purely on localStorage.
  // ────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/api/resume`, {
          headers: { "Authorization": `Bearer ${getToken()}` },
        });
        const data = await res.json();

        if (data.success && data.resume) {
          // Hydrate state from MongoDB record
          setResumeData(data.resume);
          // Also keep localStorage in sync for other parts of the app
          syncLocalStorage(data.resume);
        } else {
          // No resume on server — clear any stale localStorage entries
          setResumeData(null);
          syncLocalStorage(null);
        }
      } catch (err) {
        console.error("[ResumeViewer] Failed to fetch resume from backend:", err);
        // Fallback: if network error, try localStorage so UI doesn't blank
        const isUploaded = localStorage.getItem("hireme_resume_uploaded");
        const url        = localStorage.getItem("hireme_resume_url");
        const publicId   = localStorage.getItem("hireme_resume_public_id");
        const filename   = localStorage.getItem("hireme_resume_filename");
        if (isUploaded === "true" && url) {
          setResumeData({ url, publicId, filename, uploadedAt: null });
        }
      }
    };

    fetchResume();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ────────────────────────────────────────────────────────────────────────
  // UPLOAD FLOW
  // ────────────────────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
    if (!selectedFile) return;

    // ── Client-side validation ──────────────────────────────────────────
    const extension = selectedFile.name.split(".").pop().toLowerCase();
    if (extension !== "pdf") {
      showToast(
        "Invalid file! Please upload PDF only. Photos or other documents are not accepted.",
        "error"
      );
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("File too large. Max 5MB allowed.", "error");
      return;
    }

    // ── Upload to backend (which streams to Cloudinary + saves to MongoDB) ─
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res  = await fetch(`${BASE_URL}/api/resume/upload`, {
        method:  "POST",
        headers: { "Authorization": `Bearer ${getToken()}` },
        body:    formData,
      });
      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Upload failed. Please try again.", "error");
        return;
      }

      // Build the new resumeData object from the response
      const newResume = {
        url:      data.url,
        publicId: data.publicId,
        filename: data.filename,
        uploadedAt: new Date().toISOString(),
      };

      setResumeData(newResume);
      syncLocalStorage(newResume); // Keep localStorage cache in sync
      showToast("Resume uploaded successfully!", "success");

    } catch (err) {
      console.error("[ResumeViewer] Upload error:", err);
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // DELETE FLOW
  // Backend DELETE /api/resume/delete uses MongoDB as source of truth —
  // no publicId needs to be sent; the server finds and deletes the record.
  // ────────────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res  = await fetch(`${BASE_URL}/api/resume/delete`, {
        method:  "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type":  "application/json",
        },
      });
      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Delete failed. Please try again.", "error");
        return;
      }

      // Clear state + localStorage
      setResumeData(null);
      syncLocalStorage(null);
      setShowDeleteModal(false);
      setGeneratedEmail(null);
      setJobRole("");

      // ── Admin-only: stop automation when resume is removed ─────────────
      // Auto-send emails require an active resume; disabling prevents broken sends.
      if (getRole() === "admin") {
        try {
          await fetch(`${BASE_URL}/api/settings/auto-send`, {
            method:  "PUT",
            headers: {
              "Authorization": `Bearer ${getToken()}`,
              "Content-Type":  "application/json",
            },
            body: JSON.stringify({ enabled: false }),
          });
          showToast("Resume deleted. Automation stopped.", "error");
        } catch (e) {
          console.error("[ResumeViewer] Failed to stop automation:", e);
          showToast("Resume deleted.", "success");
        }
      } else {
        showToast("Resume deleted.", "success");
      }

    } catch (err) {
      console.error("[ResumeViewer] Delete error:", err);
      showToast("Delete failed. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // AI Email Generator
  // ────────────────────────────────────────────────────────────────────────
  const handleGenerateEmail = () => {
    const val = jobRole.trim();
    if (!val) {
      setJobRoleError("Please enter a job role to generate email");
      return;
    }
    if (val.length < 2) {
      setJobRoleError("Job role must be at least 2 characters");
      return;
    }

    setIsGenerating(true);
    setGeneratedEmail(null);
    setTimeout(() => {
      const applicantName = isGuest() ? "Demo User" : "Deepanshu";
      const email = {
        subject: `Application for ${jobRole} Position - ${applicantName}`,
        body: `Dear Hiring Team,\n\nI am ${applicantName}, a dedicated professional with a strong background in software development. Based on my resume, I have extensive experience in building scalable applications and solving complex problems.\n\nI am particularly interested in the ${jobRole} position because it aligns perfectly with my skills in React.js, Node.js, and modern web technologies. I am confident that my hands-on experience and proactive approach would make me a valuable asset to your team.\n\nPlease find my resume attached for your review. I look forward to the possibility of discussing how my background can contribute to your company's success.\n\nBest regards,\n${applicantName}`,
      };
      setGeneratedEmail(email);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(
        `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // Google Docs Viewer URL
  // Cloudinary serves PDFs as raw binaries; most browsers block them inside
  // iframes due to CSP. Google Docs Viewer fetches the file server-side and
  // renders it as HTML, bypassing the CSP/iframe restrictions entirely.
  // ────────────────────────────────────────────────────────────────────────
  const googleDocsUrl = resumeData?.url
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(resumeData.url)}&embedded=true`
    : null;

  // ──────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto py-4 space-y-6 animate-fade-in">

        {/* ── RESUME SECTION ─────────────────────────────────────────── */}
        {!resumeData ? (
          /* ── UPLOAD AREA (no resume yet) ──────────────────────────── */
          <div className="space-y-4">
            <h1 className="text-lg md:text-xl font-bold text-[#0F172A]">My Resume</h1>
            <div
              className={`w-full h-[200px] md:h-[240px] bg-[#F8FAFC] border-2 border-dashed border-[#BFDBFE] rounded-lg flex flex-col items-center justify-center p-6 transition-all group ${getRole() === "admin" ? "cursor-pointer hover:bg-[#F1F5F9]" : "opacity-60 cursor-not-allowed"}`}
              onClick={() => getRole() === "admin" && !isUploading && fileInputRef.current.click()}
            >
              <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                {isUploading
                  ? <Loader2 size={24} className="text-[#2563EB] animate-spin" />
                  : <Upload size={24} className="text-[#2563EB]" />
                }
              </div>
              <h2 className="text-base font-bold text-[#0F172A]">Upload Your Resume</h2>
              <p className="text-[#64748B] text-xs mt-2 text-center max-w-sm">
                Supports strictly PDF format. Your resume will be used to auto-generate
                personalized job application emails and submit directly to companies.
              </p>
              {getRole() === "admin" ? (
                <button
                  disabled={isUploading}
                  className="mt-4 bg-[#2563EB] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#1d4ed8] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading…" : "Browse File"}
                </button>
              ) : (
                <p className="mt-4 text-[#EF4444] font-bold text-xs">Guest mode — upload disabled.</p>
              )}
              {/* PDF-only, max 5MB note */}
              <p className="text-[11px] text-[#94A3B8] mt-2">PDF files only, max 5MB</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
        ) : (
          /* ── RESUME PREVIEW AREA ──────────────────────────────────── */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg md:text-xl font-bold text-[#0F172A]">Resume Preview</h1>
              <div className="flex items-center space-x-2">
                {/* Preview — opens full-screen Google Docs Viewer modal */}
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center space-x-1.5 border border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB] px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#DBEAFE] transition-all"
                >
                  <Eye size={14} />
                  <span>Preview</span>
                </button>

                {/* Replace — triggers same upload flow as initial upload */}
                {getRole() === "admin" && (
                  <button
                    onClick={() => !isUploading && fileInputRef.current.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-1.5 border border-[#BFDBFE] text-[#2563EB] px-3 py-1 rounded-lg text-xs font-bold hover:bg-[#EFF6FF] transition-all disabled:opacity-50"
                  >
                    {isUploading
                      ? <Loader2 size={14} className="animate-spin" />
                      : <RefreshCw size={14} />
                    }
                    <span>{isUploading ? "Uploading…" : "Replace"}</span>
                  </button>
                )}

                {/* Delete — opens confirmation modal */}
                {getRole() === "admin" && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isDeleting}
                    className="flex items-center space-x-1.5 border border-red-200 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    {isDeleting
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} />
                    }
                    <span>{isDeleting ? "Deleting…" : "Delete"}</span>
                  </button>
                )}

                {/* Hidden file input shared by both Choose and Replace */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* File info card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] max-w-[300px] truncate">
                    {resumeData.filename}
                  </p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                      PDF
                    </span>
                    {resumeData.uploadedAt && (
                      <span className="text-[10px] text-[#94A3B8]">
                        Uploaded {new Date(resumeData.uploadedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Inline PDF Preview via Google Docs Viewer ──────────────
                Cloudinary raw PDFs are blocked by most browsers when rendered
                directly in an iframe due to X-Frame-Options / CSP headers.
                Google Docs Viewer fetches & renders the PDF server-side,
                returning safe HTML that embeds cleanly in the iframe.
            ────────────────────────────────────────────────────────────── */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm bg-[#F1F5F9]">
              {googleDocsUrl ? (
                <iframe
                  key={resumeData.url}  /* force re-render when URL changes */
                  src={googleDocsUrl}
                  className="w-full h-[500px] border-none"
                  title="Resume Preview"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-[#94A3B8] text-sm">
                  <FileText size={36} className="mb-2 opacity-40" />
                  <p>No preview available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── AI EMAIL GENERATOR SECTION ─────────────────────────────── */}
        <div className="pt-6 border-t border-[#E2E8F0]">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="text-[#2563EB]" size={18} />
            <h2 className="text-base md:text-lg font-bold text-[#0F172A]">AI-Powered Email Generator</h2>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-[#BFDBFE] rounded-lg p-4 md:p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Generate Job Application Email</h3>
              <p className="text-xs text-[#64748B] mt-1">
                AI will read your resume skills and create a personalized email for job applications.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0F172A]">Enter job role</label>
                <input
                  type="text"
                  placeholder="e.g. React Developer, MERN Stack..."
                  value={jobRole}
                  onChange={(e) => {
                    const sanitized = e.target.value.replace(/[^a-zA-Z\s./]/g, "");
                    setJobRole(sanitized);
                    setJobRoleError("");
                  }}
                  onBlur={() => {
                    const val = jobRole.trim();
                    if (!val) setJobRoleError("Please enter a job role to generate email");
                    else if (val.length < 2) setJobRoleError("Job role must be at least 2 characters");
                  }}
                  className="w-full bg-[#F8FAFC] border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                  style={{ borderColor: jobRoleError ? "#EF4444" : "#E2E8F0" }}
                />
                {jobRoleError && (
                  <p className="text-[#EF4444] text-[11px] font-semibold mt-1">{jobRoleError}</p>
                )}
              </div>

              <button
                onClick={handleGenerateEmail}
                disabled={!jobRole.trim() || isGenerating}
                className="w-full bg-[#2563EB] text-white py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#1d4ed8] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>AI is thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Email with AI</span>
                  </>
                )}
              </button>
            </div>

            {generatedEmail && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-[#F0F7FF] border border-[#BFDBFE] rounded-xl p-6 space-y-4">
                  <div className="pb-3 border-b border-[#BFDBFE]">
                    <p className="text-[10px] uppercase font-bold text-[#3B82F6] mb-1">Subject</p>
                    <p className="text-sm font-bold text-[#1E3A5F]">{generatedEmail.subject}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#3B82F6] mb-1">Body</p>
                    <p className="text-sm text-[#1E3A5F] leading-relaxed whitespace-pre-wrap">
                      {generatedEmail.body}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 border border-[#BFDBFE] bg-white dark:bg-slate-800 text-[#0F172A] py-2.5 rounded-lg text-xs font-bold hover:bg-[#F8FAFC] transition-all flex items-center justify-center space-x-2"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy Email"}</span>
                  </button>
                  <button
                    className="flex-[2] bg-[#2563EB] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#1d4ed8] transition-all"
                  >
                    Use this Email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FULL-SCREEN PREVIEW MODAL ───────────────────────────────
            // Preview modal: allow background scroll (no body lock) + pointer-events trick
            Uses Google Docs Viewer inside the modal for the same CSP-safe rendering.
        ─────────────────────────────────────────────────────────────── */}
        {showModal && (
          <div
            className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center p-4 animate-fade-in"
          >
            {/* Subtle background overlay (non-interactive) */}
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]"></div>

            <div
              className="relative w-[92vw] max-w-5xl h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-white dark:bg-slate-800 shrink-0">
                <div className="flex items-center space-x-2">
                  <FileText size={18} className="text-red-500" />
                  <span className="text-sm font-bold text-[#0F172A] truncate max-w-[200px] md:max-w-sm">
                    {resumeData?.filename}
                  </span>
                </div>
                {/* X button — closes modal only, does NOT delete */}
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] transition-all"
                  aria-label="Close preview"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal iframe — same Google Docs Viewer URL */}
              <div className="flex-1 bg-[#F8FAFC]">
                <iframe
                  key={`modal-${resumeData?.url}`}
                  src={googleDocsUrl}
                  className="w-full h-full border-none"
                  title="Full Resume Preview"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── DELETE CONFIRMATION MODAL ───────────────────────────────── */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-5 max-w-sm w-full shadow-2xl animate-scale-in">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-red-50 p-2 rounded-full">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <button onClick={() => setShowDeleteModal(false)} className="text-[#94A3B8] hover:text-[#0F172A]">
                  <X size={18} />
                </button>
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#0F172A]">Delete resume?</h3>
              <p className="text-xs md:text-sm text-[#64748B] mt-1.5 leading-relaxed">
                Are you sure you want to delete your resume? This action cannot be undone.
                {getRole() === "admin" && (
                  <span className="block mt-1 text-amber-600 font-semibold">
                    ⚠ Auto-send automation will also be disabled.
                  </span>
                )}
              </p>
              <div className="flex items-center space-x-2 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-[#F1F5F9] text-[#64748B] py-2 rounded-lg text-sm font-bold hover:bg-[#E2E8F0] transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-md shadow-red-200 flex items-center justify-center space-x-1.5 disabled:opacity-70"
                >
                  {isDeleting
                    ? <><Loader2 size={14} className="animate-spin" /><span>Deleting…</span></>
                    : <span>Delete</span>
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── TOAST ───────────────────────────────────────────────────── */}
        {toastMessage && (
          <div
            className="fixed bottom-8 right-8 z-[200] flex items-center space-x-3 rounded-xl shadow-xl px-5 py-4 max-w-xs animate-slide-in-right bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700"
            style={{
              borderLeft: `4px solid ${
                toastType === "success" ? "#10B981"
                : toastType === "warning" ? "#F59E0B"
                : "#EF4444"
              }`
            }}
          >
            {toastType === "success" && <Check size={18} className="text-[#10B981] shrink-0" />}
            {toastType === "warning" && <span className="text-[#F59E0B] shrink-0 font-bold">!</span>}
            {toastType === "error"   && <X    size={18} className="text-[#EF4444] shrink-0" />}
            <p className="text-sm font-semibold flex-1 text-[#0F172A]">{toastMessage}</p>
            <button onClick={() => setToastMessage(null)} className="text-[#94A3B8] hover:text-[#64748B]">
              <X size={14} />
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ResumeViewer;
