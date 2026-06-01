import React from "react";
import { cn } from "../../utils/cn";

const Loader = ({ size = "md", className }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-blue-600 border-t-transparent",
        sizes[size],
        className
      )}
    />
  );
};

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse rounded bg-gray-200", className)} />
);

export { Loader, Skeleton };
