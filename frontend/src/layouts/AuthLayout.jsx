import React from "react";
import { Toaster } from "sonner";
import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const AuthLayout = ({ children, title, description }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Briefcase className="text-white" size={28} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            HireMe
          </span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {children}
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export { AuthLayout };
