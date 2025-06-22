import { Navigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after successful login
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check role-based access if allowedRoles is provided
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Notify user why they're being redirected
    toast.error(`You don't have permission to access this page. Required role: ${allowedRoles.join(', ')}`);
    return <Navigate to="/unauthorized" />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;