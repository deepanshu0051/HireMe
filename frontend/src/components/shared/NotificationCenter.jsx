import React, { useState } from "react";
import { 
  CheckCircle2, AlertCircle, 
  Info, ArrowRight 
} from "lucide-react";
import { cn } from "../../utils/cn";

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "success", title: "New Applicant", text: "Sarah Wilson applied for Sr. Designer", time: "2m ago", read: false },
    { id: 2, type: "info", title: "System Update", text: "AI Match engine was upgraded to v2.4", time: "1h ago", read: false },
    { id: 3, type: "alert", title: "Interview Reminder", text: "James Chen interview in 30 mins", time: "2h ago", read: true },
  ]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
         <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">Recent Alerts</h3>
         <button className="text-xs font-bold text-blue-600 hover:underline">Mark all as read</button>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
         {notifications.map((n) => (
           <div key={n.id} className={cn(
             "p-6 flex items-start space-x-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer",
             !n.read && "bg-blue-50/20"
           )}>
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                n.type === "success" ? "bg-emerald-50 text-emerald-600" :
                n.type === "alert" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
              )}>
                 {n.type === "success" ? <CheckCircle2 size={20} /> : 
                  n.type === "alert" ? <AlertCircle size={20} /> : <Info size={20} />}
              </div>
              <div className="space-y-1">
                 <div className="flex items-center justify-between">
                    <p className="text-sm font-black">{n.title}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{n.time}</span>
                 </div>
                 <p className="text-xs text-gray-500 leading-relaxed">{n.text}</p>
              </div>
           </div>
         ))}
      </div>
      <div className="p-4 text-center">
         <button className="text-xs font-black text-gray-400 hover:text-gray-600 flex items-center justify-center w-full group">
            View All Notifications <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
