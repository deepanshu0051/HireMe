import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  MapPin, Briefcase, DollarSign, Clock, 
  Share2, Bookmark, CheckCircle2, ArrowLeft, 
  Building2, Globe, Users
} from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const JobDetails = () => {
  const { id } = useParams();

  // Mock data for a single job
  const job = {
    title: "Senior Product Designer",
    company: "Dropbox",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    posted: "1 day ago",
    description: `
      We are looking for a Senior Product Designer to join our team...
      Dropbox is looking for a Senior Product Designer to help us build the future of work. You will be responsible for designing and building products that help people work better together.
    `,
    responsibilities: [
      "Lead the design of complex features from concept to release",
      "Collaborate with product managers and engineers to define product strategy",
      "Conduct user research and translate insights into design decisions",
      "Mentor and guide junior designers on the team"
    ],
    requirements: [
      "5+ years of experience in product design",
      "Strong portfolio demonstrating high-quality visual and interaction design",
      "Experience with design systems and accessibility standards",
      "Excellent communication and collaboration skills"
    ]
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/jobs" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to job list
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
               <div className="flex items-start space-x-6">
                  <div className="h-20 w-20 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 text-3xl font-bold text-gray-400">
                     D
                  </div>
                  <div className="space-y-2">
                     <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                     <div className="flex flex-wrap items-center gap-4 text-gray-500">
                        <span className="flex items-center font-medium text-blue-600">{job.company}</span>
                        <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {job.location}</span>
                        <span className="flex items-center"><Clock size={16} className="mr-1.5" /> Posted {job.posted}</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center space-x-3">
                  <Button variant="outline" size="lg" className="rounded-xl">
                    <Bookmark size={20} className="mr-2" /> Save
                  </Button>
                  <Button size="lg" className="px-8 rounded-xl">Apply Now</Button>
               </div>
            </div>

            {/* Description */}
            <div className="space-y-8">
               <section>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Job Description</h3>
                  <p className="text-gray-600 leading-relaxed">{job.description}</p>
               </section>

               <section>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Responsibilities</h3>
                  <ul className="space-y-3">
                     {job.responsibilities.map((item, idx) => (
                       <li key={idx} className="flex items-start">
                          <CheckCircle2 size={18} className="text-blue-600 mt-1 mr-3 shrink-0" />
                          <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                  </ul>
               </section>

               <section>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Requirements</h3>
                  <ul className="space-y-3">
                     {job.requirements.map((item, idx) => (
                       <li key={idx} className="flex items-start">
                          <CheckCircle2 size={18} className="text-blue-600 mt-1 mr-3 shrink-0" />
                          <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                  </ul>
               </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm dark:bg-gray-800">
               <CardContent className="p-6 space-y-6">
                  <h3 className="font-bold text-lg mb-4">Role Overview</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                           <DollarSign size={18} className="mr-2" /> Salary
                        </div>
                        <span className="font-semibold text-sm">{job.salary}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                           <Briefcase size={18} className="mr-2" /> Type
                        </div>
                        <span className="font-semibold text-sm">{job.type}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                           <Users size={18} className="mr-2" /> Experience
                        </div>
                        <span className="font-semibold text-sm">5+ Years</span>
                     </div>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between items-center text-xs text-gray-400">
                     <span>Job ID: 28419</span>
                     <button className="flex items-center hover:text-blue-600 transition-colors">
                        <Share2 size={14} className="mr-1" /> Share
                     </button>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm dark:bg-gray-800">
               <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">About Dropbox</h3>
                  <div className="space-y-4">
                     <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">D</div>
                        <div>
                           <h4 className="font-bold text-sm">Dropbox Inc.</h4>
                           <p className="text-xs text-gray-500">Productivity Software</p>
                        </div>
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed">
                        Dropbox is a modern workspace that keeps files organized and teams in sync.
                     </p>
                     <div className="flex flex-col space-y-2 pt-2">
                        <a href="#" className="flex items-center text-xs text-blue-600 font-semibold hover:underline">
                           <Globe size={14} className="mr-2" /> Website
                        </a>
                        <a href="#" className="flex items-center text-xs text-blue-600 font-semibold hover:underline">
                           <Building2 size={14} className="mr-2" /> Company Page
                        </a>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetails;
