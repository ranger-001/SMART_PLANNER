import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import urLogo from "@/assets/log.png"; // Import your logo image
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Building, 
  MessageSquare, 
  PieChart, 
  Settings, 
  LogOut,
  Users,
  FileText,
  Home,
  School,
  User,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close sidebar on mobile by default
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add listener for window resize
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Define different navigation items based on user role
  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return [
          { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
          { name: "Facilities", path: "/facilities", icon: <Building size={20} /> },
          { name: "User Management", path: "/users", icon: <Users size={20} /> },
          { name: "Feedback", path: "/feedback", icon: <MessageSquare size={20} /> },
          { name: "AI Recommendations", path: "/recommendations", icon: <Home size={20} /> },
          { name: "Analytics", path: "/analytics", icon: <PieChart size={20} /> },
          { name: "Reports", path: "/reports", icon: <FileText size={20} /> },
          { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
          { name: "Predictive Planning", path: "/predictive-planning", icon: <Calendar size={20} /> }
        ];
      case "staff":
        return [
          { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
          { name: "My Facilities", path: "/facilities", icon: <Building size={20} /> },
          { name: "Feedback", path: "/feedback", icon: <MessageSquare size={20} /> },
          { name: "Submit Report", path: "/reports", icon: <FileText size={20} /> },
          { name: "AI Suggestions", path: "/recommendations", icon: <Home size={20} /> },
          { name: "My Profile", path: "/profile", icon: <User size={20} /> },
          { name: "Predictive Planning", path: "/predictive-planning", icon: <Calendar size={20} /> }
        ];
      case "student":
        return [
          { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
          { name: "Campus Facilities", path: "/facilities", icon: <Building size={20} /> },
          { name: "Submit Feedback", path: "/feedback/new", icon: <MessageSquare size={20} /> },
          { name: "My Feedback", path: "/my-feedback", icon: <FileText size={20} /> },
          { name: "Campus Updates", path: "/announcements", icon: <School size={20} /> },
          { name: "My Profile", path: "/profile", icon: <User size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Helper function to get role-specific header title
  const getRoleTitle = () => {
    switch (user?.role) {
      case "admin":
        return "CAMPUS PLANNER";
      case "staff":
        return `Staff - ${user?.department || ""}`;
      case "student":
        return "Student";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0 md:w-16"
        } bg-white border-r border-urgray transition-all duration-300 fixed h-full z-20`}
      >
        <div className="flex bg-slate-300 flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-urgray">
            {isSidebarOpen && (
              <Link to="/" className="flex items-center space-x-2">
               <div className="mx-auto h-54 w-44 rounded-full flex items-center justify-center shadow-md overflow-hidden"> {/* Added overflow-hidden for rounded image */}
                             <img src={urLogo} alt="University of Rwanda Logo" className="h-full w-full object-contain" /> {/* Replaced span with img */}
                           </div>
                
              </Link>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-urgray text-gray-600"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Role Label - Only visible when sidebar is open */}
          {isSidebarOpen && (
            <div className="px-4 py-2 bg-gray-50 border-b border-urgray">
              <span className="text-sm font-medium text-gray-600">{getRoleTitle()}</span>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 py-6 overflow-y-auto">
            <nav className="px-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path + item.name}
                  to={item.path}
                  className={`nav-link mb-1 ${
                    location.pathname === item.path ? "active" : ""
                  }`}
                >
                  {item.icon}
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-urgray">
            {isSidebarOpen ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-urblue-light text-white flex items-center justify-center font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-gray-600"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={logout}
                variant="ghost"
                size="icon"
                className="w-full h-8"
              >
                <LogOut size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0 md:ml-16"
        }`}
      >
        {/* Mobile Sidebar Toggle */}
        {isMobile && !isSidebarOpen && (
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-30 bg-white border border-urgray shadow-md rounded-md"
          >
            <Menu size={18} />
          </Button>
        )}
        
        {/* Page Content */}
        <main className="min-h-screen p-4 md:p-6 bg-urgray">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;