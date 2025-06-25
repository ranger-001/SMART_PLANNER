

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register"; // Add import for Register page
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Role-specific dashboard components
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
import StudentDashboard from "./pages/dashboards/StudentDashboard";

// Facility Management
import Facilities from "./pages/Facilities";
import FacilityDetails from "./pages/FacilityDetails";

// User Management
import UserManagement from "./pages/UserManagement";

// Feedback pages
import Feedback from "./pages/Feedback";
import FeedbackForm from "./pages/FeedbackForm";
import MyFeedback from "./pages/Myfeedback";

// AI Recommendations
import AIRecommendations from "./pages/AiRecommendations";
import AIPredictivePlanning from "./pages/AiPredictivePlanning";

// Reports & Analytics
import Reports from "./pages/Report";
import Analytics from "./pages/Analytics";

// Profile & Settings
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Announcements
import Announcements from "./pages/Announcements";

// For role-based routing
import { useAuth, Role } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Role-based dashboard routing component
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "staff":
      return <StaffDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <Navigate to="/unauthorized" />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Add new route for registration */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Role-based dashboard route */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin-only routes */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={["admin" as Role]}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute allowedRoles={["admin" as Role]}>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            
            {/* Staff and Admin routes */}
            <Route 
              path="/recommendations" 
              element={
                <ProtectedRoute allowedRoles={["admin" as Role, "staff" as Role]}>
                  <AIRecommendations />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={["admin" as Role, "staff" as Role]}>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            
            {/* Routes for all authenticated users */}
            <Route 
              path="/facilities" 
              element={
                <ProtectedRoute>
                  <Facilities />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/facilities/:id" 
              element={
                <ProtectedRoute>
                  <FacilityDetails />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/feedback" 
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/feedback/new" 
              element={
                <ProtectedRoute>
                  <FeedbackForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/my-feedback" 
              element={
                <ProtectedRoute>
                  <MyFeedback />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/announcements" 
              element={
                <ProtectedRoute>
                  <Announcements />
                </ProtectedRoute>
              } 
            />
            
            {/* AI Predictive Planning route - Ensure it's properly restricted to admin and staff */}
            <Route
              path="/predictive-planning"
              element={
                <ProtectedRoute allowedRoles={["admin" as Role, "staff" as Role]}>
                  <AIPredictivePlanning />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;