import React from "react";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Briefcase className="text-white" size={18} />
            </div>
            <span className="text-lg font-black dark:text-white tracking-tight">
              HireMe
            </span>
          </div>

          <p className="text-gray-400 text-sm font-medium">
            © {new Date().getFullYear()} Hire Me Dashboard. All rights reserved.
          </p>

          <div className="flex space-x-8 text-sm font-bold text-gray-400">
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link to="/settings" className="hover:text-blue-600 transition-colors">Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
