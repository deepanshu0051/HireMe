import React, { useState } from "react";
import { 
  Search, Filter, Download, Briefcase, Clock,
  MoreVertical, Eye, Trash2,
  CheckCircle, XCircle, ChevronDown,
  UserPlus
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useFetch } from "../hooks/useFetch";
import { applicantService } from "../services/applicantService";
import { JobItemSkeleton } from "../components/ui/Skeletons";
import ApplicantDrawer from "../components/shared/ApplicantDrawer";
import { cn } from "../utils/cn";

const ApplicantManagement = () => {
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeApplicant, setActiveApplicant] = useState(null);
  
  const { data: applicants, loading } = useFetch(applicantService.getApplicants);

  const toggleSelect = (id) => {
    setSelectedApplicants(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleViewProfile = (applicant) => {
    setActiveApplicant(applicant);
    setIsDrawerOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Talent Pool</h1>
             <p className="text-gray-500 font-medium font-sans">Review and manage candidates across your open positions.</p>
          </div>
          <div className="flex items-center space-x-3">
             <Button variant="outline" className="h-10 px-4 rounded-lg font-semibold text-sm">
                <Download size={16} className="mr-2" /> Export
             </Button>
             <Button className="h-10 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-sm flex items-center space-x-2">
                <UserPlus size={16} />
                <span>Add Candidate</span>
             </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 saas-card p-4">
           <div className="flex items-center space-x-4 w-full lg:w-auto">
              {selectedApplicants.length > 0 ? (
                <div className="flex items-center space-x-4 px-2">
                   <span className="text-sm font-bold text-primary">{selectedApplicants.length} selected</span>
                   <div className="h-5 w-px bg-border mx-2" />
                   <Button size="sm" variant="outline" className="h-9 px-4 rounded-lg text-emerald-600 border-emerald-100 hover:bg-emerald-50">Approve</Button>
                   <Button size="sm" variant="outline" className="h-9 px-4 rounded-lg text-rose-600 border-rose-100 hover:bg-rose-50">Reject</Button>
                </div>
              ) : (
                <div className="relative w-full lg:w-[400px]">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                   <input 
                    type="text" 
                    placeholder="Search by name, tags, or role..." 
                    className="pl-10 pr-4 py-2 w-full bg-canvas border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none dark:text-white font-medium"
                   />
                </div>
              )}
           </div>
           
           <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="h-10 px-3 text-gray-500 font-bold hover:bg-canvas">
                 <Filter size={16} className="mr-2" /> Filters
              </Button>
              <div className="flex bg-canvas dark:bg-gray-900 p-1 rounded-lg border border-border">
                 <button className="px-3 py-1.5 bg-white dark:bg-gray-800 text-primary rounded-md text-xs font-bold shadow-sm">Active</button>
                 <button className="px-3 py-1.5 text-gray-400 text-xs font-bold">Archived</button>
              </div>
           </div>
        </div>

        {/* List Content */}
        <div className="grid grid-cols-1 gap-4">
           {loading ? (
             [1, 2, 3].map(i => <JobItemSkeleton key={i} />)
           ) : (
             applicants?.map((applicant) => (
               <div 
                 key={applicant.id} 
                 className={cn(
                   "saas-card p-6 flex items-center gap-6 group transition-all",
                   selectedApplicants.includes(applicant.id) && "ring-2 ring-primary bg-primary-soft/5"
                 )}
               >
                  <div className="flex items-center">
                     <input 
                       type="checkbox" 
                       checked={selectedApplicants.includes(applicant.id)}
                       onChange={() => toggleSelect(applicant.id)}
                       className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer transition-all"
                     />
                  </div>
                  
                  <div className="h-14 w-14 rounded-xl bg-canvas dark:bg-gray-800 flex items-center justify-center text-primary font-bold text-xl border border-border">
                     {applicant.name[0]}
                  </div>

                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between mb-2">
                        <h4 
                          onClick={() => handleViewProfile(applicant)}
                          className="text-base font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary transition-colors leading-tight"
                        >
                          {applicant.name}
                        </h4>
                        <div className="flex items-center space-x-3">
                           <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase",
                              applicant.status === "Shortlisted" ? "bg-emerald-50 text-emerald-600" :
                              applicant.status === "Interview" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-400"
                           )}>
                              {applicant.status}
                           </span>
                           <button className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-canvas rounded-lg transition-colors">
                              <MoreVertical size={16} />
                           </button>
                        </div>
                     </div>
                     
                     <div className="flex flex-wrap items-center gap-y-2 gap-x-8">
                        <div className="flex items-center text-[13px] font-medium text-gray-500">
                           <Briefcase size={14} className="mr-2 opacity-50" /> {applicant.role}
                        </div>
                        <div className="flex items-center text-[13px] font-medium text-gray-500">
                           <CheckCircle size={14} className="mr-2 text-emerald-500" /> Match Score: {applicant.matchScore}%
                        </div>
                        <div className="flex items-center text-[13px] font-medium text-gray-400">
                           <Clock size={14} className="mr-2 opacity-50" /> 2 days ago
                        </div>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Global Components */}
        <ApplicantDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          applicant={activeApplicant} 
        />
      </div>
    </DashboardLayout>
  );
};

export default ApplicantManagement;
