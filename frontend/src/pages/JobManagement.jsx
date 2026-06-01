import React, { useState } from "react";
import { 
  Plus, Search, Filter, MapPin,
  MoreHorizontal, Edit, Trash2, 
  Eye, Archive, Copy,
  ArrowUpRight, Users, Inbox
} from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useFetch } from "../hooks/useFetch";
import { jobService } from "../services/jobService";
import { JobItemSkeleton } from "../components/ui/Skeletons";
import JobEditorModal from "../components/shared/JobEditorModal";
import { cn } from "../utils/cn";

const JobManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  
  const { data: jobs, loading } = useFetch(jobService.getJobs);

  const handleEdit = (job) => {
    setActiveJob(job);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setActiveJob(null);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
             <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Job Postings</h1>
             <p className="text-gray-500 font-medium font-sans">Control and analyze your open job requisitions across the platform.</p>
          </div>
          <Button onClick={handleCreate} className="h-10 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold text-sm flex items-center space-x-2 shadow-sm transition-all active:scale-95">
             <Plus size={16} />
             <span>Create New Job</span>
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 saas-card p-4">
           <div className="relative w-full lg:w-[400px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
               type="text" 
               placeholder="Search by title, department or ID..." 
               className="pl-10 pr-4 py-2 w-full bg-canvas border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/10 outline-none dark:text-white font-medium"
              />
           </div>
           
           <div className="flex items-center space-x-3">
              <div className="flex bg-canvas dark:bg-gray-900 p-1 rounded-lg border border-border">
                 {["All", "Published", "Draft"].map(s => (
                   <button key={s} className={cn(
                     "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                     s === "All" ? "bg-white dark:bg-gray-800 text-primary shadow-sm" : "text-gray-400"
                   )}>{s}</button>
                 ))}
              </div>
              <Button variant="ghost" size="sm" className="h-10 px-3 text-gray-500 font-bold hover:bg-canvas">
                 <Filter size={16} />
              </Button>
           </div>
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 gap-6">
           {loading ? (
             [1, 2, 3].map(i => <JobItemSkeleton key={i} />)
           ) : (
             jobs?.map((job) => (
               <div key={job.id} className="saas-card overflow-hidden group">
                  <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                     <div className="p-8 flex-1 space-y-6">
                        <div className="flex items-start justify-between">
                           <div className="space-y-1.5">
                              <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors tracking-tight">{job.title}</h4>
                              <div className="flex items-center space-x-6 text-[13px] font-medium text-gray-500">
                                 <span className="flex items-center"><MapPin size={14} className="mr-2 opacity-50" /> {job.location}</span>
                                 <span className="px-2 py-0.5 bg-canvas border border-border rounded text-[11px] uppercase tracking-wider font-bold">{job.type}</span>
                              </div>
                           </div>
                           <span className={cn(
                              "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              job.status === "Published" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                           )}>
                              {job.status}
                           </span>
                        </div>

                        <div className="flex items-center space-x-10 pt-2">
                           <div className="flex items-center space-x-3">
                              <div className="flex -space-x-2">
                                 {[1, 2, 3].map(i => <div key={i} className="h-7 w-7 rounded-full bg-primary-soft/20 border-2 border-white dark:border-gray-800" />)}
                              </div>
                              <span className="text-[13px] font-bold text-primary">{job.applicants || 0} applicants</span>
                           </div>
                           <div className="flex items-center text-[13px] font-medium text-gray-400">
                              <Inbox size={14} className="mr-2 opacity-60" /> 
                              <span>4 new candidates today</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-canvas/50 p-6 flex md:w-56 flex-col justify-center gap-2">
                        <Button onClick={() => handleEdit(job)} variant="outline" size="sm" className="h-10 w-full rounded-lg font-bold border-border bg-white hover:bg-gray-50 shadow-sm active:scale-95 transition-all flex items-center justify-start px-4">
                           <Edit size={16} className="mr-3 text-primary" /> Edit Post
                        </Button>
                        <div className="flex gap-2">
                           <Button variant="ghost" size="sm" className="h-10 flex-1 rounded-lg hover:bg-white border border-transparent hover:border-border transition-all">
                              <Eye size={18} />
                           </Button>
                           <Button variant="ghost" size="sm" className="h-10 flex-1 rounded-lg text-rose-500 hover:bg-rose-50 border border-transparent hover:border-border transition-all">
                              <Trash2 size={18} />
                           </Button>
                           <Button variant="ghost" size="sm" className="h-10 flex-1 rounded-lg hover:bg-white border border-transparent hover:border-border transition-all">
                              <MoreHorizontal size={18} />
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Global Components */}
        <JobEditorModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          job={activeJob} 
        />
      </div>
    </DashboardLayout>
  );
};

export default JobManagement;
