import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isAuthed } from "./utils/auth";

import AccessGate from "./pages/AccessGate";
import AdminDashboard from "./pages/AdminDashboard";
import Emails from "./pages/Emails";
import Profile from "./pages/Profile";
import JobManagement from "./pages/JobManagement";
import JobDetails from "./pages/JobDetails";
import ApplicantManagement from "./pages/ApplicantManagement";
import ResumeViewer from "./pages/ResumeViewer";
import Settings from "./pages/Settings";
import AIJobs from "./pages/AIJobs";

/**
/**
 * AUTH FLOW:
 * - No token in localStorage → all "protected" routes redirect exclusively to /access
 * - Token exists → /access redirects back to the dashboard (/)
 * - Only explicit Guest login or Admin login button clicks in AccessGate can create a session.
 * 
 * WHY THIS PREVENTS AUTO-GUEST MODE:
 * 1. The previous layout utilized an automated useEffect fallback that requested Guest credentials whenever unauthenticated.
 * 2. That side-effect has been strictly removed from AccessGate.jsx.
 * 3. ProtectedRoutes now rigorously inspect localStorage. If `hireme_token` is missing, you are halted and bounced to the Gate.
 * 4. Guest mode will ONLY mount when `handleGuestLogin` is explicitly intentionally triggered by clicking "Continue as Guest"
 */

/**
 * ProtectedRoute — Renders element only if hireme_token exists.
 * Reads directly from localStorage to avoid stale closure issues safely preventing ghost environments.
 */
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("hireme_token");
  return token && token.length > 0 ? element : <Navigate to="/access" replace />;
};

/**
 * PublicRoute — Used for /access.
 * If user already has a valid token, skip the gate and go straight to the dashboard.
 */
const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("hireme_token");
  return token && token.length > 0 ? <Navigate to="/" replace /> : element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route: /access — already-authed users are bounced to the dashboard */}
        <Route path="/access" element={<PublicRoute element={<AccessGate />} />} />

        {/* Protected routes: all require a valid hireme_token */}
        {/* Default route / → also protected; no token → /access */}
        <Route path="/" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/emails" element={<ProtectedRoute element={<Emails />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/jobs" element={<ProtectedRoute element={<JobManagement />} />} />
        <Route path="/jobs/:id" element={<ProtectedRoute element={<JobDetails />} />} />
        <Route path="/applicants" element={<ProtectedRoute element={<ApplicantManagement />} />} />
        <Route path="/resume" element={<ProtectedRoute element={<ResumeViewer />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
        <Route path="/ai-jobs" element={<ProtectedRoute element={<AIJobs />} />} />
        <Route path="/analytics" element={<ProtectedRoute element={<AdminDashboard />} />} />

        {/* Catch-all: redirect to access gate */}
        <Route path="*" element={<Navigate to="/access" replace />} />
      </Routes>
    </Router>
  );
}

export default App;