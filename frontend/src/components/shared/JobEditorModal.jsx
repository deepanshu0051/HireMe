import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Globe, MapPin, DollarSign, Briefcase
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { cn } from "../../utils/cn";

const JobEditorModal = ({ isOpen, onClose, job }) => {
  const [formData, setFormData] = useState(job || {
    title: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    status: "Published"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving job:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center min-h-screen z-[100] p-4 lg:p-8">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
           initial={{ scale: 0.95, opacity: 0, y: 20 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.95, opacity: 0, y: 20 }}
           className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white"
        >
           {/* Header */}
           <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center space-x-4">
                 <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Briefcase size={24} />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black">{job ? "Edit Job Posting" : "New Job Opportunity"}</h2>
                    <p className="text-sm text-gray-500 font-medium">Define the roles and responsibilities for your next hire.</p>
                 </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                 <X size={24} className="text-gray-400" />
              </button>
           </div>

           {/* Form Content */}
           <div className="flex-1 overflow-y-auto p-8 lg:p-12">
              <form id="job-form" onSubmit={handleSubmit} className="space-y-10">
                 {/* Basic Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="Job Title" 
                      placeholder="e.g. Senior Product Designer" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="rounded-2xl"
                    />
                    <div className="space-y-1.5">
                       <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Job Type</label>
                       <select 
                         value={formData.type}
                         onChange={(e) => setFormData({...formData, type: e.target.value})}
                         className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                       >
                          <option>Full-time</option>
                          <option>Contract</option>
                          <option>Part-time</option>
                          <option>Freelance</option>
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input 
                      label="Location" 
                      icon={MapPin} 
                      placeholder="e.g. Remote, Worldwide" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="rounded-2xl"
                    />
                    <Input 
                      label="Salary Range" 
                      icon={DollarSign} 
                      placeholder="e.g. $120k - $160k" 
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="rounded-2xl"
                    />
                 </div>

                 {/* Description */}
                 <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Job Description</label>
                    <textarea 
                      rows={6}
                      className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-6 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                      placeholder="Describe the mission, requirements, and benefits..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                 </div>

                 {/* Status & Options */}
                 <div className="flex items-center justify-between p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50">
                    <div className="flex items-center space-x-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                          <Globe size={24} />
                       </div>
                       <div>
                          <p className="text-sm font-bold">Publish to Public Board</p>
                          <p className="text-xs text-gray-500">Make this job visible to everyone.</p>
                       </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, status: formData.status === "Published" ? "Draft" : "Published"})}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all duration-300 relative",
                        formData.status === "Published" ? "bg-blue-600" : "bg-gray-300"
                      )}
                    >
                       <div className={cn(
                         "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                         formData.status === "Published" ? "translate-x-6" : ""
                       )} />
                    </button>
                 </div>
              </form>
           </div>

           {/* Footer */}
           <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <Button variant="ghost" className="text-gray-400 font-bold">Discard Changes</Button>
              <div className="flex items-center space-x-3">
                 <Button variant="outline" className="px-6 rounded-xl border-gray-200">Preview</Button>
                 <Button type="submit" form="job-form" className="px-10 rounded-xl bg-blue-600 shadow-lg shadow-blue-200">Save & Publish</Button>
              </div>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JobEditorModal;
