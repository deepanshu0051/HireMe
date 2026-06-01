import React from "react";
import { SearchX, FileQuestion, Plus } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../../utils/cn";

export const EmptyState = ({ 
  icon: Icon = FileQuestion, 
  title = "No data found", 
  description = "There is nothing to show here at the moment.",
  actionLabel,
  onAction,
  className
}) => (
  <div className={cn("flex flex-col items-center justify-center p-12 text-center space-y-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700", className)}>
    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
       <Icon size={40} className="text-gray-400" />
    </div>
    <div className="space-y-1">
       <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
       <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">{description}</p>
    </div>
    {actionLabel && (
      <Button onClick={onAction} className="flex items-center space-x-2">
         <Plus size={18} />
         <span>{actionLabel}</span>
      </Button>
    )}
  </div>
);
