import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, Filter, ChevronDown } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

const FindJobs = () => {
  const [filters, setFilters] = useState({
    type: [],
    salary: "",
    location: "",
  });

  const jobs = [
    { 
      id: 1, 
      title: "Senior Product Designer", 
      company: "Dropbox", 
      location: "Remote", 
      type: "Full-time", 
      salary: "$120k - $160k",
      posted: "1 day ago",
      tags: ["Figma", "UI/UX", "System Design"]
    },
    { 
      id: 2, 
      title: "Lead Backend Developer", 
      company: "Stripe", 
      location: "San Francisco, CA", 
      type: "Full-time", 
      salary: "$150k - $200k",
      posted: "3 days ago",
      tags: ["Node.js", "PostgreSQL", "AWS"]
    },
    { 
      id: 3, 
      title: "React Native Developer", 
      company: "Coinbase", 
      location: "Remote", 
      type: "Contract", 
      salary: "$80 - $120 / hr",
      posted: "5 hours ago",
      tags: ["React Native", "TypeScript", "Mobile"]
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center">Find your next opportunity</h1>
            <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2 border border-gray-100">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Job title, keywords, or company" 
                  className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm"
                />
              </div>
              <div className="hidden md:block w-px bg-gray-100 h-10 self-center"></div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Location (City, State, or Remote)" 
                  className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm"
                />
              </div>
              <Button className="h-[52px] px-8 rounded-xl">Search</Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
               <span className="text-xs text-gray-400">Popular:</span>
               {['Frontend', 'Marketing', 'Product Manager', 'Data Scientist'].map(tag => (
                 <button key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all">
                    {tag}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="font-bold text-lg flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filters
               </h3>
               <button className="text-xs text-blue-600 font-semibold">Reset</button>
            </div>

            <div className="space-y-6">
               <div>
                  <h4 className="text-sm font-semibold mb-3">Job Type</h4>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                    <label key={type} className="flex items-center space-x-3 mb-2 cursor-pointer group">
                       <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                       <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                    </label>
                  ))}
               </div>

               <div>
                  <h4 className="text-sm font-semibold mb-3">Salary Range</h4>
                  <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all">
                     <option>Any Salary</option>
                     <option>$50k - $80k</option>
                     <option>$80k - $120k</option>
                     <option>$120k - $160k</option>
                     <option>$160k+</option>
                  </select>
               </div>

               <div>
                  <h4 className="text-sm font-semibold mb-3">Experience Level</h4>
                  {['Entry Level', 'Mid Level', 'Senior', 'Director'].map(level => (
                    <label key={level} className="flex items-center space-x-3 mb-2 cursor-pointer group">
                       <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                       <span className="text-sm text-gray-600 group-hover:text-gray-900">{level}</span>
                    </label>
                  ))}
               </div>
            </div>
          </div>

          {/* Job List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between mb-4">
               <p className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900">324</span> jobs</p>
               <div className="flex items-center text-sm">
                  <span className="text-gray-400 mr-2">Sort by:</span>
                  <button className="font-semibold text-gray-900 flex items-center">
                     Newest
                     <ChevronDown size={14} className="ml-1" />
                  </button>
               </div>
            </div>

            {jobs.map(job => (
              <motion.div
                key={job.id}
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                   <div className="h-16 w-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:border-blue-100 transition-colors">
                      <div className="text-xl font-bold text-gray-400 group-hover:text-blue-600 uppercase">{job.company[0]}</div>
                   </div>
                   <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                             <span className="flex items-center"><MapPin size={14} className="mr-1" /> {job.location}</span>
                             <span className="flex items-center"><Briefcase size={14} className="mr-1" /> {job.type}</span>
                             <span className="flex items-center"><DollarSign size={14} className="mr-1" /> {job.salary}</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{job.posted}</span>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex flex-wrap gap-2">
                           {job.tags.map(tag => (
                             <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full font-medium">{tag}</span>
                           ))}
                        </div>
                        <Button variant="outline" size="sm">Apply Now</Button>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-center pt-8">
               <Button variant="outline" className="px-8">Load More Jobs</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FindJobs;
