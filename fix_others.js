const fs = require('fs');

const runReplacements = (file, replacements) => {
    let content = fs.readFileSync(file, 'utf8');
    let count = 0;
    for (const r of replacements) {
        if (content.includes(r.from)) {
            content = content.replace(r.from, r.to);
            count++;
        } else {
            console.log(`Could not find in ${file}:`, r.from.substring(0, 50));
        }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Replaced ${count} items in ${file}`);
}

const aiJobsPath = 'c:/Users/deepu/OneDrive/Desktop/HireMe/frontend/src/pages/AIJobs.jsx';
const aiReplacements = [
    {
        from: '<h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center tracking-tight"> {/* size-fix text-lg md:text-xl */}',
        to: '<h1 className="text-lg md:text-xl font-bold flex items-center tracking-tight" style={{ color: "var(--text-primary)" }}> {/* size-fix text-lg md:text-xl */}'
    },
    {
        from: '<p className="text-gray-500 dark:text-gray-400 text-xs"> {/* size-fix text-xs */}',
        to: '<p className="text-xs" style={{ color: "var(--text-secondary)" }}> {/* size-fix text-xs */}'
    },
    {
        from: '<div className="text-center py-16 bg-transparent border-2 border-gray-100 dark:border-slate-800 border-dashed rounded-2xl flex flex-col items-center">',
        to: '<div className="text-center py-16 bg-transparent border-2 border-dashed rounded-2xl flex flex-col items-center" style={{ borderColor: "var(--border-color)" }}>'
    },
    {
        from: '<h3 className="text-gray-500 dark:text-gray-400 font-bold text-lg">No Active Prospects</h3>',
        to: '<h3 className="font-bold text-lg" style={{ color: "var(--text-secondary)" }}>No Active Prospects</h3>'
    },
    {
        from: '<p className="text-gray-400 font-medium text-sm mt-1">Adjust limit or skills to search global entries.</p>',
        to: '<p className="font-medium text-sm mt-1" style={{ color: "var(--text-muted)" }}>Adjust limit or skills to search global entries.</p>'
    },
    {
        from: '<span className="flex items-center bg-gray-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-gray-100 dark:border-slate-800 font-medium text-gray-700 dark:text-gray-300"> {/* size-fix px-2 py-0.5 */}\n                    <Briefcase size={12} className="mr-1 text-blue-600" /> {job.employer_name || \'Hiring Team\'} {/* size-fix size 12 */}\n                  </span>',
        to: '<span className="flex items-center px-2 py-0.5 rounded-full border font-medium" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}> {/* size-fix px-2 py-0.5 */}\n                    <Briefcase size={12} className="mr-1 text-blue-600" /> {job.employer_name || \'Hiring Team\'} {/* size-fix size 12 */}\n                  </span>'
    },
    {
        from: '<span className="flex items-center bg-gray-50 dark:bg-slate-800/50 px-2 py-0.5 rounded-full border border-gray-100 dark:border-slate-800 font-medium text-gray-700 dark:text-gray-300"> {/* size-fix px-2 py-0.5 */}\n                    <MapPin size={12} className="mr-1 text-blue-600" /> {job.job_is_remote ? \'Remote\' : \'On-Site\'} {/* size-fix size 12 */}\n                  </span>',
        to: '<span className="flex items-center px-2 py-0.5 rounded-full border font-medium" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}> {/* size-fix px-2 py-0.5 */}\n                    <MapPin size={12} className="mr-1 text-blue-600" /> {job.job_is_remote ? \'Remote\' : \'On-Site\'} {/* size-fix size 12 */}\n                  </span>'
    },
    {
        from: '<button disabled className="w-full flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-gray-200 dark:border-slate-700 cursor-not-allowed"> {/* size-fix px-3 py-2 rounded-lg */}',
        to: '<button disabled className="w-full flex items-center justify-center px-3 py-2 font-bold text-[10px] uppercase tracking-wider rounded-lg border cursor-not-allowed" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-muted)" }}> {/* size-fix px-3 py-2 rounded-lg */}'
    }
];

const resumeViewerPath = 'c:/Users/deepu/OneDrive/Desktop/HireMe/frontend/src/pages/ResumeViewer.jsx';
const resumeReplacements = [
    {
        from: '<div\n              className="relative w-[92vw] max-w-5xl h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col pointer-events-auto"\n            >',
        to: '<div\n              className="relative w-[92vw] max-w-5xl h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col pointer-events-auto"\n              style={{ backgroundColor: "var(--card-bg)" }}\n            >'
    },
    {
        from: '<div className="flex-1 bg-[#F8FAFC]">',
        to: '<div className="flex-1" style={{ backgroundColor: "var(--bg-secondary)" }}>'
    },
    {
        from: '<div className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-5 max-w-sm w-full shadow-2xl animate-scale-in">',
        to: '<div className="rounded-xl p-4 md:p-5 max-w-sm w-full shadow-2xl animate-scale-in" style={{ backgroundColor: "var(--card-bg)" }}>'
    },
    {
        from: '<h3 className="text-sm md:text-base font-bold text-[#0F172A]">Delete resume?</h3>',
        to: '<h3 className="text-sm md:text-base font-bold" style={{ color: "var(--text-primary)" }}>Delete resume?</h3>'
    },
    {
        from: '<p className="text-xs md:text-sm text-[#64748B] mt-1.5 leading-relaxed">',
        to: '<p className="text-xs md:text-sm mt-1.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>'
    },
    {
        from: 'className="flex-1 bg-[#F1F5F9] text-[#64748B] py-2 rounded-lg text-sm font-bold hover:bg-[#E2E8F0] transition-all disabled:opacity-50"',
        to: 'className="flex-1 border py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 hover:opacity-90" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-secondary)" }}'
    },
    {
        from: '<p className="text-sm font-semibold flex-1 text-[#0F172A]">{toastMessage}</p>',
        to: '<p className="text-sm font-semibold flex-1" style={{ color: "var(--text-primary)" }}>{toastMessage}</p>'
    }
];

const emailsPath = 'c:/Users/deepu/OneDrive/Desktop/HireMe/frontend/src/pages/Emails.jsx';
const emailsReplacements = [
    {
        from: '<span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${\n                          company.status === \'Sent\' ? \'bg-green-100 text-green-700\' : \n                          company.status === \'Failed\' ? \'bg-red-100 text-red-600\' : \'bg-gray-200 text-gray-500 dark:text-gray-400\'\n                        }`}>',
        to: '<span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${\n                          company.status === \'Sent\' ? \'bg-green-100 text-green-700\' : \n                          company.status === \'Failed\' ? \'bg-red-100 text-red-600\' : \'\'\n                        }`} style={company.status !== \'Sent\' && company.status !== \'Failed\' ? { backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" } : {}}>'
    },
    {
        from: '<h3 className="text-lg md:text-xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">Database Viewer</h3> {/* size-fix */}',
        to: '<h3 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Database Viewer</h3> {/* size-fix */}'
    },
    {
        from: '<p className="text-[#64748B] dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto font-medium">',
        to: '<p className="text-sm mt-2 max-w-sm mx-auto font-medium" style={{ color: "var(--text-secondary)" }}>'
    },
    {
        from: 'log.status === \'Sent\' \n                              ? \'bg-[#1740A6] text-white rounded-tr-none border-[#0D2B75]\' \n                              : \'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border-gray-200 dark:border-slate-700\'',
        to: 'log.status === \'Sent\' \n                              ? \'bg-[#1740A6] text-white rounded-tr-none border-[#0D2B75]\' \n                              : \'rounded-tl-none border\'\n                         }`} style={log.status !== \'Sent\' ? { backgroundColor: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--border-color)" } : {}}'
    }
];

// Special replacement: in line 321 of Emails.jsx, there's a trailing `}`} ` that we need to replace carefully:
// So let's instead define it more cleanly below.

runReplacements(aiJobsPath, aiReplacements);
runReplacements(resumeViewerPath, resumeReplacements);

let emailContent = fs.readFileSync(emailsPath, 'utf8');

emailContent = emailContent.replace(
    '<span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${\n                          company.status === \'Sent\' ? \'bg-green-100 text-green-700\' : \n                          company.status === \'Failed\' ? \'bg-red-100 text-red-600\' : \'bg-gray-200 text-gray-500 dark:text-gray-400\'\n                        }`}>',
    '<span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${\n                          company.status === \'Sent\' ? \'bg-green-100 text-green-700\' : \n                          company.status === \'Failed\' ? \'bg-red-100 text-red-600\' : \'\'\n                        }`} style={company.status !== \'Sent\' && company.status !== \'Failed\' ? { backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" } : {}}>'
);

emailContent = emailContent.replace(
    '<h3 className="text-lg md:text-xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">Database Viewer</h3> {/* size-fix */}',
    '<h3 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Database Viewer</h3> {/* size-fix */}'
);

emailContent = emailContent.replace(
    '<p className="text-[#64748B] dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto font-medium">',
    '<p className="text-sm mt-2 max-w-sm mx-auto font-medium" style={{ color: "var(--text-secondary)" }}>'
);

// We need to replace the long dynamic string in Emails.jsx:
// <div className={`p-3 md:p-4 rounded-xl shadow-sm border ${ /* size-fix p-3 md:p-4 rounded-xl */
// log.status === 'Sent' 
//   ? 'bg-[#1740A6] text-white rounded-tr-none border-[#0D2B75]' 
//   : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border-gray-200 dark:border-slate-700'
// }`}>

const emailSearchText = 'log.status === \'Sent\' \n                              ? \'bg-[#1740A6] text-white rounded-tr-none border-[#0D2B75]\' \n                              : \'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border-gray-200 dark:border-slate-700\'\n                         }`}>\n                           {log.subject && (';

const emailReplaceText = 'log.status === \'Sent\' \n                              ? \'bg-[#1740A6] text-white rounded-tr-none border-[#0D2B75]\' \n                              : \'rounded-tl-none border\'\n                         }`} style={log.status !== \'Sent\' ? { backgroundColor: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--border-color)" } : {}}>\n                           {log.subject && (';


if (emailContent.includes(emailSearchText)) {
  emailContent = emailContent.replace(emailSearchText, emailReplaceText);
  console.log("Replaced complex block in Emails.jsx");
} else {
  console.log("Could not find complex block in Emails.jsx");
}

fs.writeFileSync(emailsPath, emailContent, 'utf8');

