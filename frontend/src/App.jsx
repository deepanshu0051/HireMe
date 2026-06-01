import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import Emails from "./pages/Emails";
import Profile from "./pages/Profile";
import JobManagement from "./pages/JobManagement";
import JobDetails from "./pages/JobDetails";
import ApplicantManagement from "./pages/ApplicantManagement";
import ResumeViewer from "./pages/ResumeViewer";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route directly to Admin Dashboard */}
        <Route path="/" element={<AdminDashboard />} />
        
        {/* Management Routes */}
        <Route path="/emails" element={<Emails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<JobManagement />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/applicants" element={<ApplicantManagement />} />
        <Route path="/resume" element={<ResumeViewer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<AdminDashboard />} /> {/* Analytics reuse dashboard for now */}
        
        {/* Catch all redirect to root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;