import React, { useState, useRef } from "react";
import { 
  Upload, FileText, Trash2, RefreshCw, 
  Sparkles, Loader2, Copy, Check, X,
  FileImage, Eye
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";

const ResumeViewer = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isPDF, setIsPDF] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // AI Section States
  const [jobRole, setJobRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const [jobRoleError, setJobRoleError] = useState("");

  const fileInputRef = useRef(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        showToast("Only PDF, JPG, and PNG files are supported", "error");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast("File size must be less than 5MB", "error");
        return;
      }
      
      setFile(selectedFile);
      const isPdfFile = selectedFile.type === "application/pdf";
      setIsPDF(isPdfFile);
      showToast("Resume uploaded successfully ✓", "success");

      if (isPdfFile) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  const handleDelete = () => {
    setFile(null);
    setFilePreview(null);
    setShowDeleteModal(false);
    setGeneratedEmail(null);
    setJobRole("");
  };

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
      const email = {
        subject: `Application for ${jobRole} Position - Deepanshu`,
        body: `Dear Hiring Team,\n\nI am Deepanshu, a dedicated professional with a strong background in software development. Based on my resume, I have extensive experience in building scalable applications and solving complex problems.\n\nI am particularly interested in the ${jobRole} position because it aligns perfectly with my skills in React.js, Node.js, and modern web technologies. I am confident that my hands-on experience and proactive approach would make me a valuable asset to your team.\n\nPlease find my resume attached for your review. I look forward to the possibility of discussing how my background can contribute to your company's success.\n\nBest regards,\nDeepanshu`
      };
      setGeneratedEmail(email);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    if (generatedEmail) {
      const textToCopy = `Subject: ${generatedEmail.subject}\n\n${generatedEmail.body}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[800px] mx-auto py-4 space-y-10 animate-fade-in">
        
        {/* RESUME SECTION */}
        {!file ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-[#0F172A]">My Resume</h1>
            <div 
              className="w-full h-[320px] bg-[#F8FAFC] border-2 border-dashed border-[#BFDBFE] rounded-[16px] flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-[#F1F5F9] transition-all group"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} className="text-[#2563EB]" />
              </div>
              <h2 className="text-xl font-bold text-[#0F172A]">Upload Your Resume</h2>
              <p className="text-[#64748B] text-sm mt-2 text-center max-w-sm">
                Supports PDF and Image files (JPG, PNG). Your resume will be used to auto-generate personalized job application emails.
              </p>
              <button 
                className="mt-6 bg-[#2563EB] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:bg-[#1d4ed8] transition-all"
              >
                Choose File
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-[11px] text-[#94A3B8] text-center italic">
              Note: Files are processed locally in your browser for privacy.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#0F172A]">Resume Preview</h1>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center space-x-2 border border-[#BFDBFE] text-[#2563EB] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#EFF6FF] transition-all"
                >
                  <RefreshCw size={14} />
                  <span>Replace</span>
                </button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50 transition-all"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Resume Info Bar */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isPDF ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                )}>
                  {isPDF ? <FileText size={20} /> : <FileImage size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F172A] max-w-[300px] truncate">{file.name}</p>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className={cn(
                      "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                      isPDF ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {isPDF ? "PDF" : "IMAGE"}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">{(file.size / 1024).toFixed(0)} KB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm bg-[#F1F5F9]">
              {isPDF ? (
                <iframe 
                  src={filePreview} 
                  className="w-full h-[70vh] border-none"
                  title="Resume Preview"
                />
              ) : (
                <div className="flex justify-center p-4 bg-[#F8FAFC]">
                  <img 
                    src={filePreview} 
                    alt="Resume" 
                    className="max-w-full max-h-[80vh] object-contain rounded shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI SKILLS SECTION */}
        <div className="pt-6 border-t border-[#E2E8F0]">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="text-[#2563EB]" size={20} />
            <h2 className="text-xl font-bold text-[#0F172A]">AI-Powered Email Generator</h2>
          </div>

          <div className="bg-white border border-[#BFDBFE] rounded-[16px] p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Generate Job Application Email</h3>
              <p className="text-sm text-[#64748B] mt-1">AI will read your resume skills and create a personalized email for job applications.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
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
                  className="w-full bg-[#F8FAFC] border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB] outline-none transition-all"
                  style={{ borderColor: jobRoleError ? "#EF4444" : "#E2E8F0" }}
                />
                {jobRoleError && <p className="text-[#EF4444] text-[12px] font-semibold mt-1">{jobRoleError}</p>}
              </div>

              <button 
                onClick={handleGenerateEmail}
                disabled={!jobRole.trim() || isGenerating}
                className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-bold text-sm shadow-md hover:bg-[#1d4ed8] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>AI is thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Generate Email with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Result Box */}
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
                    className="flex-1 border border-[#BFDBFE] bg-white text-[#0F172A] py-2.5 rounded-lg text-xs font-bold hover:bg-[#F8FAFC] transition-all flex items-center justify-center space-x-2"
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

        {/* DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-3 rounded-full">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <button onClick={() => setShowDeleteModal(false)} className="text-[#94A3B8] hover:text-[#0F172A]">
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">Delete resume?</h3>
              <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                Are you sure you want to delete your resume? This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3 mt-8">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-[#F1F5F9] text-[#64748B] py-2.5 rounded-lg text-sm font-bold hover:bg-[#E2E8F0] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-all shadow-md shadow-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="fixed bottom-8 right-8 z-[200] flex items-center space-x-3 rounded-xl shadow-xl px-5 py-4 max-w-xs animate-slide-in-right bg-white border border-[#E2E8F0]" style={{ borderLeft: `4px solid ${toast.type === "success" ? "#10B981" : "#EF4444"}`}}>
            {toast.type === "success" && <Check size={18} className="text-[#10B981] shrink-0" />}
            {toast.type === "error" && <X size={18} className="text-[#EF4444] shrink-0" />}
            <p className="text-sm font-semibold flex-1 text-[#0F172A]">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-[#94A3B8] hover:text-[#64748B]">
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// Simple helper utility (mimicking the one from previous turns)
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default ResumeViewer;
