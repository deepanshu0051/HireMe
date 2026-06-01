import React from "react";
import { Card, CardContent } from "./Card";

export const JobItemSkeleton = () => (
  <Card className="border-none shadow-sm dark:bg-gray-800 animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-center gap-6">
        <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-1/3 bg-gray-100 dark:bg-gray-700 rounded-lg" />
          <div className="h-4 w-1/2 bg-gray-50 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ChartSkeleton = () => (
  <div className="w-full h-full bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse flex items-center justify-center">
    <div className="space-y-4 w-3/4">
       <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded mx-auto" />
       <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
    </div>
  </div>
);
