import React from "react";
import { Plus, Briefcase, Calendar, MapPin, DollarSign, Clock } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";

const PostJob = () => {
  return (
    <DashboardLayout role="employer">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Post a New Job</h2>
          <p className="text-gray-500">Fill in the details to find your next great hire.</p>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Job Title" placeholder="e.g. Senior Product Designer" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">Job Type</label>
                <select className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Location" icon={MapPin} placeholder="e.g. San Francisco, CA or Remote" />
              <Input label="Salary Range" icon={DollarSign} placeholder="e.g. $120k - $160k" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-1">Job Description</label>
              <textarea 
                className="w-full h-40 rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Describe the role, responsibilities, and requirements..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
               <Button variant="ghost">Save Draft</Button>
               <Button className="px-8">Post Job</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
