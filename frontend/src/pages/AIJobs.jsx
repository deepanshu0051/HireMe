import React, { useState } from "react";
import { Search, MapPin, Briefcase, DollarSign, Copy, Check, Zap, ExternalLink, AlertCircle } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { getToken } from "../utils/auth";

// Embedded standalone Modal explicitly requested
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"> {/* size-fix max-w-lg rounded-xl */}
        <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-100 dark:border-slate-800"> {/* size-fix p-3 md:p-4 */}
          <h2 className="text-lg font-bold">{title}</h2> {/* size-fix text-lg */}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:text-gray-100 transition-colors font-bold text-lg"> {/* size-fix text-lg */}
            ✕
          </button>
        </div>
        <div className="p-3 md:p-4 overflow-y-auto bg-gray-50 dark:bg-slate-800/50 flex-1"> {/* size-fix */}
          {children}
        </div>
      </div>
    </div>
  );
};

const AIJobs = () => {
  const [skills, setSkills] = useState("React,Node.js,Express,MongoDB,JavaScript");
  const [limit, setLimit] = useState(2);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal tracking state natively
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [copied, setCopied] = useState(false);

  // 1. Fetch API wrapper dynamically parsing .env Base URL natively
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    setJobs([]);
    
    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const url = `${BASE_URL}/api/jobs/fetch-with-email?skills=${encodeURIComponent(skills)}&limit=${limit}`;
      
      // Include JWT token for authenticated backend routes
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      const output = await response.json();
      
      if (!output.success) throw new Error(output.message || "Failed to fetch jobs");
      
      setJobs(output.data || []);
      
    } catch (err) {
      console.error("[Frontend] API Error:", err);
      setError(err.message || 'An unexpected error occurred while fetching AI jobs. Check if Backend is active on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Open Email GUI
  const openEmailViewer = (email, provider) => {
    setSelectedEmail(email);
    setSelectedProvider(provider);
    setIsModalOpen(true);
    setCopied(false);
  };

  // 3. Simple copy clipboard functionality mapped to Button
  const copyToClipboard = () => {
    if (selectedEmail) {
      navigator.clipboard.writeText(selectedEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4"> {/* size-fix space-y-4 */}
        
        {/* Dynamic Header */}
        <div className="flex flex-col space-y-1 mb-6"> {/* size-fix space-y-1 mb-6 */}
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center tracking-tight"> {/* size-fix text-lg md:text-xl */}
            <Search className="mr-2 text-blue-600 stroke-[3]" size={20} /> Target Jobs {/* size-fix mr-2 size 20 */}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs"> {/* size-fix text-xs */}
            Discover roles globally matched against your explicit skillset, generating AI application coverage dynamically.
          </p>
        </div>

        {/* Action Panel */}
        <div className="bg-white dark:bg-slate-800 p-3 md:p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-end"> {/* size-fix p-3 rounded-lg gap-3 */}
          <div className="flex-1 w-full flex flex-col gap-1.5"> {/* size-fix gap-1.5 */}
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Matched Skills (Comma Separated)</label> {/* size-fix text-xs */}
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm" /* size-fix px-3 py-2 */
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, Python"
            />
          </div>
          <div className="w-full md:w-32 flex flex-col gap-1.5"> {/* size-fix gap-1.5 */}
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Limit Jobs</label> {/* size-fix text-xs */}
            <select 
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg outline-none bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-100 text-sm" /* size-fix px-3 py-2 */
            >
              <option value={1}>1 Job</option>
              <option value={2}>2 Jobs</option>
              <option value={3}>3 Jobs</option>
            </select>
          </div>
          <button 
            onClick={fetchJobs} 
            disabled={loading}
            className="w-full md:w-auto px-4 py-2 bg-[#1740A6] hover:bg-[#0D2B75] disabled:bg-blue-300 text-white font-medium rounded-lg transition-all flex items-center justify-center shrink-0" /* size-fix px-4 py-2 h-auto */
          >
            {loading ? (
              <span className="flex items-center text-xs"><Zap size={14} className="mr-1.5 animate-pulse" /> Scanning...</span> /* size-fix text-xs size 14 */
            ) : (
              <span className="text-xs font-bold tracking-wide">Fetch Jobs</span> /* size-fix text-xs */
            )}
          </button>
        </div>

        {/* Global Error Handle */}
        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start text-red-700 animate-in fade-in">
            <AlertCircle size={20} className="mr-3 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results List */}
        <div className="space-y-4 pt-4">
          {!loading && jobs.length === 0 && !error && (
            <div className="text-center py-16 bg-transparent border-2 border-gray-100 dark:border-slate-800 border-dashed rounded-2xl flex flex-col items-center">
              <Search className="text-gray-300 mb-4" size={48} />
              <h3 className="text-gray-500 dark:text-gray-400 font-bold text-lg">No Active Prospects</h3>
              <p className="text-gray-400 font-medium text-sm mt-1">Adjust limit or skills to search global entries.</p>
            </div>
          )}

          {jobs.map((job) => (
            <div key={job.job_id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all flex flex-col lg:flex-row gap-4"> {/* size-fix p-4 rounded-lg gap-4 */}
              
              {/* Main Metadata Grouping */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#1740A6] transition-colors">{job.job_title}</h3> {/* size-fix text-base */}
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 mb-4 gap-2 flex-wrap"> {/* size-fix text-xs mt-1 mb-4 gap-2 */}
                  <span className="flex items-center bg-gray-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-gray-100 dark:border-slate-800 font-medium text-gray-700 dark:text-gray-300"> {/* size-fix px-2 py-0.5 */}
                    <Briefcase size={12} className="mr-1 text-blue-600" /> {job.employer_name || 'Hiring Team'} {/* size-fix size 12 */}
                  </span>
                  <span className="flex items-center bg-gray-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-gray-100 dark:border-slate-800 font-medium text-gray-700 dark:text-gray-300"> {/* size-fix px-2 py-0.5 */}
                    <MapPin size={12} className="mr-1 text-blue-600" /> {job.job_is_remote ? 'Remote' : 'On-Site'} {/* size-fix size 12 */}
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100/50 font-bold uppercase text-[9px] tracking-wide"> {/* size-fix px-2 text-[9px] */}
                    {job.job_employment_type}
                  </span>
                </div>

                {/* Score Grid Visualizations */}
                <div className="bg-gray-50 dark:bg-slate-800/50/50 p-3 rounded-lg space-y-2 border border-gray-100 dark:border-slate-800"> {/* size-fix p-3 rounded-lg space-y-2 */}
                  <div className="flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Match Accuracy</span> {/* size-fix text-[10px] */}
                    <span className={`text-xs font-extrabold ${job.matchPercentage >= 70 ? 'text-green-600' : 'text-blue-600'}`}> {/* size-fix text-xs */}
                      {job.matchPercentage}% Core Match
                    </span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-200/60 rounded-full overflow-hidden pointer-events-none">
                    <div className={`h-full transition-all duration-1000 ${job.matchPercentage >= 70 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${job.matchPercentage}%` }} />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    {job.matchedSkills?.length > 0 && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        <span className="text-green-600 font-bold mr-1">✓ Matched:</span> {job.matchedSkills.join(', ')}
                      </p>
                    )}
                    {job.missingSkills?.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span className="text-red-400 font-bold mr-1">✗ Missing:</span> {job.missingSkills.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="lg:w-40 flex flex-col justify-end gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-4"> {/* size-fix w-40 gap-2 pt-3 pl-4 */}
                <button
                  onClick={() => openEmailViewer(job.applicationEmail, job.emailProvider)}
                  className="w-full flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors border border-blue-100" /* size-fix px-3 py-2 rounded-lg */
                >
                  View Crafted Email
                </button>
                {job.job_apply_link ? (
                  <a
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-3 py-2 bg-gray-900 hover:bg-black text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors border border-gray-800" /* size-fix px-3 py-2 rounded-lg */
                  >
                    Direct Apply <ExternalLink size={12} className="ml-1 opacity-70" /> {/* size-fix size 12 */}
                  </a>
                ) : (
                  <button disabled className="w-full flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-gray-200 dark:border-slate-700 cursor-not-allowed"> {/* size-fix px-3 py-2 rounded-lg */}
                    No Direct Link
                  </button>
                )}
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Pop-out Editor ReadOnly Display */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Application Draft Preview">
        <div className="space-y-4 flex flex-col h-full pointer-events-auto">
          <div className="flex items-center justify-between select-none">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center">
              Generated by:
              <span className={`ml-2 px-2 py-0.5 rounded text-white text-[10px] uppercase font-bold tracking-widest shadow-sm
                ${selectedProvider === 'gemini' ? 'bg-purple-600' : 'bg-gray-500'}
              `}>
                {selectedProvider || 'Unknown'}
              </span>
            </span>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border ${copied ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:bg-slate-800/50 hover:text-black'}`} /* size-fix px-3 py-1.5 text-[10px] */
            >
              {copied ? <Check size={12} className="mr-1.5" /> : <Copy size={12} className="mr-1.5 text-gray-400" />} {/* size-fix 14->12 */}
              {copied ? 'Copied to Clipboard' : 'Copy Content'}
            </button>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-3 md:p-4 shadow-sm flex-1 whitespace-pre-wrap font-sans text-xs text-gray-800 dark:text-gray-200 leading-relaxed overflow-y-auto selection:bg-blue-100 selection:text-blue-900"> {/* size-fix rounded-lg p-3 text-xs */}
            {selectedEmail || "System Error: No email payload successfully evaluated."}
          </div>
        </div>
      </Modal>

    </DashboardLayout>
  );
};

export default AIJobs;
