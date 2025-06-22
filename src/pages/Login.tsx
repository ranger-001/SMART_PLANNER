import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, Role } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio"; // This import is not used in the provided code, can be removed if not needed elsewhere.
import urLogo from "@/assets/log.png"; // Import your logo image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credentials based on role
  const setDemoCredentials = (selectedRole: Role) => {
    setRole(selectedRole);
    if (selectedRole === "admin") {
      setEmail("admin@ur.ac.rw");
    } else if (selectedRole === "staff") {
      setEmail("staff@ur.ac.rw");
    } else {
      setEmail("student@ur.ac.rw");
    }
    setPassword("password"); // Demo password is the same for all roles
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-urgray to-white bg-slate-200">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white p-8 rounded-lg shadow-2xl border-spacing-1 border-urgray-dark">
          <div className="text-center mb-6">
            <div className="mx-auto h-54 w-44 rounded-full flex items-center justify-center  overflow-hidden"> {/* Added overflow-hidden for rounded image */}
              <img src={urLogo} alt="University of Rwanda Logo" className="h-full w-full object-contain" /> {/* Replaced span with img */}
            </div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800">
              University of Rwanda
            </h1>
            <p className="text-gray-600 mt-1 text- ">
              AI-Driven Campus Planning System
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-5 text-sm border-l-4 border-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@ur.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-700">Login as</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setDemoCredentials(value as Role)}
                className="flex justify-between p-2 bg-urgray rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" className="border-urblue text-urblue" />
                  <Label htmlFor="student" className="cursor-pointer text-gray-700 font-medium">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staff" id="staff" className="border-urblue text-urblue" />
                  <Label htmlFor="staff" className="cursor-pointer text-gray-700 font-medium">Staff</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" className="border-urblue text-urblue" />
                  <Label htmlFor="admin" className="cursor-pointer text-gray-700 font-medium">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              type="submit"
              className="w-full bg-urblue hover:bg-urblue-dark h-11 mt-2 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-urgray text-center text-sm">
            <p className="text-gray-600 mb-3">
              Need an account?{" "}
              <Link to="/register" className="text-urblue hover:underline font-medium">
                Register here
              </Link>
            </p>
            <div className="p-3 bg-urgray rounded-md text-gray-500">
              <p className="font-medium text-gray-700 mb-1">Demo Credentials</p>
              <p>
                Email: {role}@ur.ac.rw
                <br />
                Password: password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;