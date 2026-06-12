import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, MoreVertical, Paperclip, Send, Mail, AlertCircle, Loader2 } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import DoubleTick from "../components/ui/DoubleTick";
import { cn } from "../utils/cn";
import { getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Emails = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
  // Data States
  const [companies, setCompanies] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  
  // UI States
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Companies on Mount
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoadingCompanies(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/api/companies`, {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        });
        
        if (res.status === 401 || res.status === 403) {
          throw new Error("Admin access required to view companies and emails.");
        }
        
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Failed to fetch companies");
        
        setCompanies(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingCompanies(false);
      }
    };
    
    fetchCompanies();
  }, []);

  // 2. Fetch Email Logs when a company is selected
  useEffect(() => {
    if (!selectedId) {
      setSelectedLogs([]);
      return;
    }
    
    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const res = await fetch(`${BASE_URL}/api/emails/company/${selectedId}`, {
          headers: {
            "Authorization": `Bearer ${getToken()}`
          }
        });
        
        if (res.status === 401 || res.status === 403) {
          throw new Error("Admin access required to view emails.");
        }
        
        const data = await res.json();
        if (data.success) {
          // Keep API chronological ordering
          setSelectedLogs(data.data || []);
        } else {
          setSelectedLogs([]);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        setSelectedLogs([]);
      } finally {
        setLoadingLogs(false);
      }
    };
    
    fetchLogs();
  }, [selectedId]);

  // Client-side search filtration natively
  const filteredCompanies = companies.filter(c => 
    c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.jobRole && c.jobRole.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedCompany = companies.find(c => c._id === selectedId);

  // Parse readable time dynamically from timestamps
  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-[#E2E8F0]">
        
        {/* LEFT PANEL */}
        <div className={cn(
          "w-full md:w-[320px] flex-col border-r border-[#E2E8F0] bg-[#F8FAFC]",
          showMobileDetail ? "hidden md:flex" : "flex"
        )}>
          {/* Header */}
          <div className="p-3 md:p-4 bg-white dark:bg-slate-800 border-b border-[#E2E8F0] flex items-center justify-between shadow-sm z-10"> {/* size-fix */}
            <h1 className="text-lg md:text-xl font-bold text-[#0F172A]">Mails Database</h1> {/* size-fix */}
            {!loadingCompanies && !error && (
              <span className="bg-[#1740A6] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {companies.length}
              </span>
            )}
          </div>

          {/* Search Bar */}
          <div className="p-2 md:p-3 bg-white dark:bg-slate-800 border-b border-[#E2E8F0]"> {/* size-fix */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder="Search companies or roles"
                className="w-full bg-[#F1F5F9] border-none rounded-lg py-2 pl-9 pr-3 text-sm focus:ring-1 focus:ring-[#1740A6] outline-none transition-shadow" /* size-fix py-2*/
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Main List Box */}
          <div className="flex-1 overflow-y-auto">
            {error ? (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 h-full animate-in fade-in">
                <div className="bg-red-50 p-3 rounded-full"><AlertCircle className="text-red-500" size={24}/></div>
                <p className="text-red-600 font-bold text-sm leading-snug">{error}</p>
                <p className="text-gray-400 text-xs mt-1">Check tokens or switch accounts.</p>
              </div>
            ) : loadingCompanies ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 text-[#94A3B8]">
                <Loader2 size={24} className="animate-spin text-[#1740A6]" />
                <p className="text-sm font-semibold tracking-wide">Syncing Nodes...</p>
              </div>
            ) : filteredCompanies.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                <p className="text-gray-400 font-medium text-sm">No companies match this query.</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCompanies.map(company => (
                  <div 
                    key={company._id}
                    onClick={() => {
                      setSelectedId(company._id);
                      setShowMobileDetail(true);
                    }}
                    className={cn(
                      "px-3 py-2 cursor-pointer transition-all hover:bg-[#F1F5F9] border-l-4", /* size-fix */
                      selectedId === company._id ? "bg-[#EFF6FF] border-[#1740A6]" : "border-transparent"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-bold text-sm text-[#0F172A] truncate">{company.companyName}</p> {/* size-fix text-sm */}
                        <p className="text-[11px] font-medium text-[#64748B] truncate mt-0.5">
                          {company.jobRole || 'Application Target'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1.5 shrink-0 ml-1">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          company.status === 'Sent' ? 'bg-green-100 text-green-700' : 
                          company.status === 'Failed' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500 dark:text-gray-400'
                        }`}>
                          {company.status}
                        </span>
                        {company.sentAt && (
                           <span className="text-[10px] text-[#94A3B8] font-semibold">{formatTime(company.sentAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-slate-800 border-t border-[#E2E8F0] flex items-center justify-between">
            <button className="p-1 hover:bg-[#F1F5F9] rounded-md transition-colors text-[#94A3B8] disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-[#64748B]">All Records</span>
            <button className="p-1 hover:bg-[#F1F5F9] rounded-md transition-colors text-[#1740A6] disabled:opacity-30" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - THREAD VIEWER */}
        <div className={cn(
          "flex-1 flex-col bg-white dark:bg-slate-800 relative",
          !showMobileDetail ? "hidden md:flex" : "flex w-full"
        )}>
          {loadingLogs ? (
             <div className="absolute inset-0 bg-white dark:bg-slate-800/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
               <Loader2 size={32} className="animate-spin text-[#1740A6] mb-4" />
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Compiling Database...</p>
             </div>
          ) : null}

          {selectedCompany ? (
            <>
              {/* Top View Header */}
              <div className="p-3 md:p-4 bg-white dark:bg-slate-800 border-b border-[#E2E8F0] flex items-center justify-between shadow-sm z-20"> {/* size-fix */}
                <div className="flex items-center space-x-2 md:space-x-3"> {/* size-fix */}
                  <button 
                    className="md:hidden p-1 -ml-1 mr-1 hover:bg-gray-100 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"  /* size-fix */
                    onClick={() => setShowMobileDetail(false)}
                  >
                    <ChevronLeft size={20} /> {/* size-fix */}
                  </button>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#1740A6] to-[#2563EB] rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-inner shrink-0"> {/* size-fix */}
                    {selectedCompany.companyName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm md:text-base text-[#0F172A] flex items-center gap-2 truncate"> {/* size-fix */}

                       {selectedCompany.companyName}
                       {selectedCompany.replied && (
                          <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">Replied</span>
                       )}
                    </h2>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <p className="text-xs font-medium text-[#64748B]">{selectedCompany.hrEmail || 'No HR Email Attached'}</p> {/* size-fix text-xs */}
                      {selectedCompany.status === 'Sent' && (
                        <span className="flex items-center space-x-1.5 ml-2 border-l border-gray-200 dark:border-slate-700 pl-3">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> {/* size-fix */}
                          <span className="text-[10px] tracking-wide text-green-600 font-bold uppercase">Dispatched</span> {/* size-fix text-[10px] */}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-5 text-[#94A3B8]">
                  <Search size={20} className="cursor-pointer hover:text-[#1740A6] transition-colors" />
                  <MoreVertical size={20} className="cursor-pointer hover:text-[#1740A6] transition-colors" />
                </div>
              </div>

              {/* Central Logs Feed */}
              <div className="flex-1 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] p-4 md:p-6 overflow-y-auto space-y-4"> {/* size-fix */}
                 {selectedLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-2 opacity-60">
                       <Mail size={24} className="text-[#94A3B8]"/> {/* size-fix */}
                       <p className="text-sm font-semibold tracking-wide text-[#64748B]">No emails logged against this company yet.</p>
                    </div>
                 ) : (
                    selectedLogs.map((log) => (
                      <div key={log._id} className={`flex flex-col space-y-1.5 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 ${ /* size-fix space-y-1.5 */
                         log.status === 'Sent' ? 'ml-auto' : 'mr-auto'
                      }`}>
                         <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(log.createdAt)}</span>
                         </div>
                         <div className={`p-3 md:p-4 rounded-xl shadow-sm border ${ /* size-fix p-3 md:p-4 rounded-xl */
                            log.status === 'Sent' 
                              ? 'bg-[#1740A6] text-white rounded-tr-none border-[#0D2B75]' 
                              : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border-gray-200 dark:border-slate-700'
                         }`}>
                           {log.subject && (
                              <p className={`text-sm font-bold mb-3 pb-2 border-b ${
                                 log.status === 'Sent' ? 'border-white/20' : 'border-gray-100 dark:border-slate-800'
                              }`}>
                                Subject: {log.subject}
                              </p>
                           )}
                           <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium" style={{ opacity: log.status === 'Sent' ? 0.9 : 1 }}>
                             {log.body}
                           </p>
                           <div className="flex items-center justify-end space-x-1.5 mt-3 pt-2">
                             {log.status === 'Failed' && <AlertCircle size={14} className="text-red-400 mr-1" />}
                             <span className="text-[10px] font-bold tracking-wider" style={{ opacity: log.status === 'Sent' ? 0.6 : 0.4 }}>
                               {formatTime(log.createdAt)}
                             </span>
                             {log.status === 'Sent' && <DoubleTick seen={true} size={15} />}
                           </div>
                         </div>
                      </div>
                    ))
                 )}
              </div>

              {/* View Only Banner */}
              <div className="p-3 bg-white dark:bg-slate-800 border-t border-[#E2E8F0] shadow-2xl flex items-center space-x-3 z-20"> {/* size-fix */}
                <Paperclip size={18} className="text-[#94A3B8] cursor-not-allowed opacity-50 hidden sm:block" /> {/* size-fix */}
                <div className="flex-1 bg-[#F8FAFC] border border-gray-100 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-[#94A3B8] font-bold italic shadow-inner"> {/* size-fix */}
                  View-only mode active. Active SMTP bridges are managed by the CRON server.
                </div>
                <button disabled className="p-2 bg-[#E2E8F0] text-white rounded-lg cursor-not-allowed"> {/* size-fix */}
                  <Send size={16} /> {/* size-fix */}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 bg-gradient-to-b from-[#F8FAFC] to-white"> {/* size-fix */}
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#1740A6] shadow-sm mb-1 border border-blue-100/50"> {/* size-fix */}
                <Mail size={32} className="stroke-[1.5]" /> {/* size-fix */}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#0F172A] tracking-tight">Database Viewer</h3> {/* size-fix */}
                <p className="text-[#64748B] text-sm mt-2 max-w-sm mx-auto font-medium">
                  Select a company from the registry on the left to sync remote email threads and delivery statuses.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Emails;
