import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Mail, MapPin, Clock, Star, 
  Briefcase, ShieldCheck
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import AIMatchScore from "../ui/AIMatchScore";
import { cn } from "../../utils/cn";

const ApplicantDrawer = ({ isOpen, onClose, applicant }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!applicant) return null;

  const statuses = ["Applied", "Reviewing", "Shortlisted", "Interview", "Selected", "Rejected"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                     {applicant.name[0]}
                  </div>
                  <div>
                     <h2 className="text-xl font-bold dark:text-white">{applicant.name}</h2>
                     <p className="text-sm text-gray-500">{applicant.role}</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
               {/* Quick Info Bar */}
               <div className="bg-gray-50/50 dark:bg-gray-900/30 p-6 flex flex-wrap gap-6 items-center justify-between border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                     <span className="flex items-center"><MapPin size={14} className="mr-1.5" /> {applicant.location}</span>
                     <span className="flex items-center"><Clock size={14} className="mr-1.5" /> {applicant.experience} exp</span>
                  </div>
                  <div className="flex items-center space-x-3">
                     <Button variant="outline" size="sm" className="h-9"><Mail size={14} className="mr-2" /> Email</Button>
                     <Button size="sm" className="h-9 bg-blue-600">Schedule Interview</Button>
                  </div>
               </div>

               <div className="p-8 space-y-8">
                  {/* Status Workflow */}
                  <section>
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Hiring Status</h3>
                     <div className="flex flex-wrap gap-2">
                        {statuses.map((s) => (
                          <button
                            key={s}
                            className={cn(
                              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
                              applicant.status === s 
                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100" 
                                : "bg-white text-gray-500 border-gray-100 hover:border-blue-200 dark:bg-gray-800 dark:border-gray-700"
                            )}
                          >
                            {s}
                          </button>
                        ))}
                     </div>
                  </section>

                  {/* AI Match Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <AIMatchScore score={applicant.matchScore} className="md:col-span-1" />
                     <Card className="md:col-span-2 border-none bg-blue-50/50 dark:bg-blue-900/10 p-5">
                        <div className="flex items-center space-x-2 text-blue-600 mb-2">
                           <ShieldCheck size={18} />
                           <h4 className="font-bold text-sm">AI Fit Analysis</h4>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                          "{applicant.aiSummary}"
                        </p>
                     </Card>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-100 dark:border-gray-700">
                     <div className="flex space-x-8">
                        {["overview", "resume", "activity"].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                              "pb-4 text-sm font-bold capitalize transition-all relative",
                              activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                            {tab}
                            {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
                          </button>
                        ))}
                     </div>
                  </div>

                  {/* Tab Panels */}
                  <div className="space-y-6">
                     {activeTab === "overview" && (
                       <div className="space-y-6 animate-fade-in">
                          <div className="space-y-3">
                             <h4 className="font-bold text-sm">Top Skills</h4>
                             <div className="flex flex-wrap gap-2">
                                {applicant.skills.map(skill => (
                                  <span key={skill} className="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg border border-gray-100 dark:border-gray-600">
                                     {skill}
                                  </span>
                                ))}
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 rounded-2xl border border-gray-50 dark:border-gray-700">
                                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                                   <Briefcase size={14} />
                                   <span className="text-[10px] font-bold uppercase">Education</span>
                                </div>
                                <p className="text-xs font-bold">M.S. in Design Strategy</p>
                                <p className="text-[10px] text-gray-500">Stanford University</p>
                             </div>
                             <div className="p-4 rounded-2xl border border-gray-50 dark:border-gray-700">
                                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                                   <Star size={14} />
                                   <span className="text-[10px] font-bold uppercase">Highlights</span>
                                </div>
                                <p className="text-xs font-bold">Fortune 500 Experience</p>
                                <p className="text-[10px] text-gray-500">Lead 10+ major redesigns</p>
                             </div>
                          </div>
                       </div>
                     )}

                     {activeTab === "activity" && (
                       <div className="space-y-6 animate-fade-in">
                          {applicant.timeline.map((item, idx) => (
                            <div key={idx} className="flex space-x-4">
                               <div className="relative flex flex-col items-center">
                                  <div className="h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-600 z-10" />
                                  {idx !== applicant.timeline.length - 1 && <div className="h-full w-0.5 bg-gray-100 dark:bg-gray-700 absolute top-4" />}
                               </div>
                               <div className="pb-8">
                                  <p className="text-xs font-bold dark:text-white">{item.event}</p>
                                  <p className="text-[10px] text-gray-500">{item.date}</p>
                               </div>
                            </div>
                          ))}
                       </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30">
               <Button variant="ghost" className="text-gray-500">View Full Resume</Button>
               <div className="flex space-x-3">
                  <Button variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">Reject</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Shortlist Candidate</Button>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ApplicantDrawer;
