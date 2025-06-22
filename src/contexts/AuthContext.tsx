import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Role = "student" | "staff" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  status?: "active" | "inactive" | "pending";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: Role) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers: User[] = [
  { id: "1", name: "Admin User", email: "admin@ur.ac.rw", role: "admin", department: "Management", status: "active" },
  { id: "2", name: "Staff Member", email: "staff@ur.ac.rw", role: "staff", department: "Computer Science", status: "active" },
  { id: "3", name: "Student User", email: "student@ur.ac.rw", role: "student", status: "active" }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user data in localStorage
    const storedUser = localStorage.getItem("urCampusUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user data", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: Role): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock login - find user by email and role
      const foundUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.role === role
      );
      
      if (foundUser) {
        // Check if user is active
        if (foundUser.status === "pending") {
          toast.error("Your account is pending approval by an administrator.");
          return false;
        }
        
        if (foundUser.status === "inactive") {
          toast.error("Your account has been deactivated. Please contact an administrator.");
          return false;
        }
        
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("urCampusUser", JSON.stringify(foundUser));
        toast.success(`Welcome, ${foundUser.name}!`);
        return true;
      } else {
        toast.error("Invalid login credentials");
        return false;
      }
    } catch (error) {
      console.error("Login error", error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("urCampusUser");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}