import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, MoreVertical, Paperclip, Send, Mail } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import DoubleTick from "../components/ui/DoubleTick";
import { cn } from "../utils/cn";

const Emails = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const companies = [
    {
      id: 1,
      name: "Infosys",
      email: "hr@infosys.com",
      role: "React Developer",
      date: "29 May 2026",
      group: "Today",
      seen: true,
      time: "9:00 AM",
      subject: "Application for React Developer Position",
      body: "Dear Hiring Team, I am Deepanshu, a Full Stack Developer skilled in React.js, Node.js, Express.js, and MongoDB. I have hands-on experience building real-world applications and recently completed an internship at DS Group. I would love to contribute to your team. Please find my resume attached. Best regards, Deepanshu"
    },
    {
      id: 2,
      name: "TCS",
      email: "careers@tcs.com",
      role: "Frontend Engineer",
      date: "29 May 2026",
      group: "Today",
      seen: false,
      time: "9:05 AM",
      subject: "Application for Frontend Engineer Position",
      body: "Dear Hiring Team, I am Deepanshu, a Frontend Developer specialized in React.js and modern CSS frameworks. I have a strong foundation in building responsive and performant user interfaces. I am eager to apply my frontend development skills to your projects. Best regards, Deepanshu"
    },
    {
      id: 3,
      name: "Wipro",
      email: "hr@wipro.com",
      role: "MERN Developer",
      date: "29 May 2026",
      group: "Today",
      seen: true,
      time: "9:10 AM",
      subject: "Application for MERN Developer Position",
      body: "Dear Hiring Team, I am Deepanshu, a MERN Stack Developer with experience in building end-to-end web applications. I am proficient in MongoDB, Express, React, and Node.js. I would appreciate the opportunity to discuss how my skills align with your development needs. Best regards, Deepanshu"
    },
    {
      id: 4,
      name: "HCL",
      email: "recruit@hcl.com",
      role: "Node.js Developer",
      date: "29 May 2026",
      group: "Today",
      seen: false,
      time: "9:15 AM",
      subject: "Application for Node.js Developer Position",
      body: "Dear Hiring Team, I am Deepanshu, a backend-focused developer with expertise in Node.js and RESTful API development. I have worked on scalable backend systems and am comfortable with database management and server-side logic. Best regards, Deepanshu"
    },
    {
      id: 5,
      name: "Accenture",
      email: "jobs@accenture.com",
      role: "Full Stack Developer",
      date: "29 May 2026",
      group: "Today",
      seen: false,
      time: "9:20 AM",
      subject: "Application for Full Stack Developer Position",
      body: "Dear Hiring Team, I am Deepanshu, a Full Stack Developer with a comprehensive understanding of both frontend and backend technologies. I enjoy solving complex problems and building seamless user experiences. Best regards, Deepanshu"
    },
    {
      id: 6,
      name: "Cognizant",
      email: "hr@cognizant.com",
      role: "Frontend Developer",
      date: "28 May 2026",
      group: "Yesterday",
      seen: true,
      time: "10:00 AM",
      subject: "Exploring Frontend Developer Opportunities",
      body: "Dear Hiring Team, I am writing to express my interest in Frontend Developer roles at Cognizant. With a passion for creating intuitive web experiences, I have honed my skills in React and modern UI/UX principles. Best regards, Deepanshu"
    },
    {
      id: 7,
      name: "Tech Mahindra",
      email: "careers@techm.com",
      role: "React Specialist",
      date: "28 May 2026",
      group: "Yesterday",
      seen: false,
      time: "11:30 AM",
      subject: "Application: React Specialist Role",
      body: "Dear HR Team, I am a specialized React developer with extensive experience in state management and component architecture. I am impressed by Tech Mahindra's innovative projects and would love to be a part of your team. Best regards, Deepanshu"
    },
    {
      id: 8,
      name: "Capgemini",
      email: "jobs@capgemini.com",
      role: "MERN Stack Engineer",
      date: "28 May 2026",
      group: "Yesterday",
      seen: true,
      time: "2:15 PM",
      subject: "Technical Application: MERN Stack Engineer",
      body: "Dear Recruitment Team, my background in MERN stack development has prepared me well for the Engineer position at Capgemini. I have a proven track record of delivering robust web solutions. Best regards, Deepanshu"
    },
    {
      id: 9,
      name: "Mphasis",
      email: "hr@mphasis.com",
      role: "Web Developer",
      date: "28 May 2026",
      group: "Yesterday",
      seen: false,
      time: "4:00 PM",
      subject: "Application for Web Developer",
      body: "Dear Hiring Manager, I am a versatile Web Developer with skills ranging from HTML/CSS to advanced JavaScript frameworks. I am eager to bring my technical expertise to Mphasis. Best regards, Deepanshu"
    },
    {
      id: 10,
      name: "Persistent",
      email: "careers@persistent.com",
      role: "Software Engineer",
      date: "28 May 2026",
      group: "Yesterday",
      seen: true,
      time: "5:45 PM",
      subject: "Application for Software Engineer Trainee",
      body: "Dear Team, as a recent graduate with strong fundamentals in software engineering and web technologies, I am excited about the prospect of starting my career at Persistent Systems. Best regards, Deepanshu"
    }
  ];

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCompany = companies.find(c => c.id === selectedId);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] bg-white rounded-xl overflow-hidden shadow-xl border border-[#E2E8F0]">
        
        {/* LEFT PANEL */}
        <div className="w-[320px] flex flex-col border-r border-[#E2E8F0] bg-[#F8FAFC]">
          {/* Header */}
          <div className="p-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#0F172A]">Mails</h1>
            <span className="bg-[#2563EB] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">10</span>
          </div>

          {/* Search */}
          <div className="p-3 bg-white border-b border-[#E2E8F0]">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input 
                type="text" 
                placeholder="Search companies"
                className="w-full bg-[#F1F5F9] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#2563EB] outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {/* Group: Today */}
            <div className="py-2">
              <div className="flex items-center px-4 py-2 opacity-50">
                <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
                <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Today, 29 May 2026</span>
                <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
              </div>
              {filteredCompanies.filter(c => c.group === "Today").map(company => (
                <div 
                  key={company.id}
                  onClick={() => setSelectedId(company.id)}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-all hover:bg-[#F1F5F9] border-l-4",
                    selectedId === company.id ? "bg-[#EFF6FF] border-[#2563EB]" : "border-transparent"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0F172A] truncate">{company.name}</p>
                      <p className="text-xs text-[#64748B] truncate">{company.role}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-2">
                      <span className="text-[10px] text-[#94A3B8] font-medium">{company.time}</span>
                      <div className="flex items-center space-x-1">
                        {!company.seen && <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>}
                        <DoubleTick seen={company.seen} size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Group: Yesterday */}
            <div className="py-2">
              <div className="flex items-center px-4 py-2 opacity-50">
                <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
                <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#64748B]">Yesterday, 28 May 2026</span>
                <div className="flex-1 h-[1px] bg-[#E2E8F0]"></div>
              </div>
              {filteredCompanies.filter(c => c.group === "Yesterday").map(company => (
                <div 
                  key={company.id}
                  onClick={() => setSelectedId(company.id)}
                  className={cn(
                    "px-4 py-3 cursor-pointer transition-all hover:bg-[#F1F5F9] border-l-4",
                    selectedId === company.id ? "bg-[#EFF6FF] border-[#2563EB]" : "border-transparent"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0F172A] truncate">{company.name}</p>
                      <p className="text-xs text-[#64748B] truncate">{company.role}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1 ml-2">
                      <span className="text-[10px] text-[#94A3B8] font-medium">{company.time}</span>
                      <div className="flex items-center space-x-1">
                        {!company.seen && <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>}
                        <DoubleTick seen={company.seen} size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-white border-t border-[#E2E8F0] flex items-center justify-between">
            <button className="p-1 hover:bg-[#F1F5F9] rounded-md transition-colors text-[#94A3B8] disabled:opacity-30" disabled>
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-[#64748B]">Page 1 of 3</span>
            <button className="p-1 hover:bg-[#F1F5F9] rounded-md transition-colors text-[#2563EB]">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedCompany ? (
            <>
              {/* Header */}
              <div className="p-4 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center text-[#2563EB] font-bold">
                    {selectedCompany.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0F172A]">{selectedCompany.name}</h2>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-[#64748B]">{selectedCompany.email}</p>
                      <span className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span className="text-[10px] text-green-600 font-bold">Email Sent</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-[#94A3B8]">
                  <Search size={18} className="cursor-pointer hover:text-[#2563EB]" />
                  <MoreVertical size={18} className="cursor-pointer hover:text-[#2563EB]" />
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 bg-[#F0F7FF] p-6 overflow-y-auto space-y-6">
                <div className="flex flex-col space-y-2 max-w-[75%] ml-auto animate-fade-in">
                  <div className="bg-[#2563EB] text-white p-5 rounded-2xl rounded-tr-none shadow-md">
                    <p className="text-sm font-bold mb-2 border-b border-white/20 pb-2">
                      Subject: {selectedCompany.subject}
                    </p>
                    <p className="text-sm leading-relaxed opacity-95">
                      {selectedCompany.body}
                    </p>
                    <div className="flex items-center justify-end space-x-1 mt-2">
                      <span className="text-[10px] opacity-70">{selectedCompany.time}</span>
                      <DoubleTick seen={selectedCompany.seen} size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer (Simplified for viewing only) */}
              <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center space-x-4">
                <Paperclip size={20} className="text-[#94A3B8] cursor-pointer hover:text-[#2563EB]" />
                <div className="flex-1 bg-white rounded-lg px-4 py-2 text-sm text-[#94A3B8] italic">
                  This is a record of your sent application.
                </div>
                <button className="p-2 bg-[#2563EB] text-white rounded-full shadow-md hover:bg-[#1d4ed8] transition-all">
                  <Send size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4">
              <div className="w-20 h-20 bg-[#F0F7FF] rounded-full flex items-center justify-center text-[#2563EB]">
                <Mail size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Select a company to view mail</h3>
                <p className="text-[#64748B] text-sm max-w-xs mx-auto">
                  Click on any company from the list on the left to see the email conversation and status.
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
