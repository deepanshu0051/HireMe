import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

const AIMatchScore = ({ score, className }) => {
  const getColor = (s) => {
    if (s >= 90) return "text-emerald-500 border-emerald-100 bg-emerald-50";
    if (s >= 75) return "text-blue-500 border-blue-100 bg-blue-50";
    if (s >= 50) return "text-amber-500 border-amber-100 bg-amber-50";
    return "text-red-500 border-red-100 bg-red-50";
  };

  return (
    <div className={cn("flex flex-col items-center p-3 rounded-2xl border", getColor(score), className)}>
      <div className="relative h-16 w-16 flex items-center justify-center">
        <svg className="h-full w-full rotate-[-90deg]">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-10"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="176"
            initial={{ strokeDashoffset: 176 }}
            animate={{ strokeDashoffset: 176 - (176 * score) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <span className="absolute text-sm font-bold">{score}%</span>
      </div>
      <span className="text-[10px] font-bold uppercase mt-2 tracking-widest opacity-80">AI Match</span>
    </div>
  );
};

export default AIMatchScore;
