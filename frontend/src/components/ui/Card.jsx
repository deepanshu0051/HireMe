import React from "react";
import { cn } from "../../utils/cn";

const Card = ({ className, children, glass = false }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all",
        glass && "bg-white/70 backdrop-blur-md border-white/20 shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children }) => (
  <div className={cn("mb-4 flex flex-col space-y-1.5", className)}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={cn("text-xl font-semibold leading-none tracking-tight", className)}>
    {children}
  </h3>
);

const CardDescription = ({ className, children }) => (
  <p className={cn("text-sm text-gray-500", className)}>
    {children}
  </p>
);

const CardContent = ({ className, children }) => (
  <div className={cn("pt-0", className)}>
    {children}
  </div>
);

const CardFooter = ({ className, children }) => (
  <div className={cn("flex items-center pt-4", className)}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
