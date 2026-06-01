import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm transition-all outline-none",
            "focus:border-blue-600 focus:ring-4 focus:ring-blue-100",
            "placeholder:text-gray-400",
            "disabled:bg-gray-50 disabled:text-gray-500",
            Icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
