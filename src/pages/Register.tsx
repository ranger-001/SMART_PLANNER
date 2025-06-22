import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createUser } from "@/services/userService";
import urLogo from "@/assets/log.png"; // Import your logo image

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine((email) => email.endsWith("@ur.ac.rw"), {
    message: "Email must be a UR email address (@ur.ac.rw)"
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["student", "staff"]),
  department: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Department is required for staff members
  if (data.role === "staff") {
    return !!data.department;
  }
  return true;
}, {
  message: "Department is required for staff members",
  path: ["department"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const departments = [
  "Computer Science",
  "Engineering",
  "Business",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Psychology",
  "Political Science",
  "Economics",
  "IT Services",
  "Management"
];

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "Student@ur.ac.rw",
      password: "Student",
      confirmPassword: "Student",
      role: "student",
    },
  });

  const role = form.watch("role");

  const handleSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Remove confirmPassword as it's not needed for API call
      // Fixed: Ensure all required fields are explicitly passed as non-optional
      const { confirmPassword, ...userData } = values;
      
      await createUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        department: userData.department,
        status: "pending" // All new registrations start with pending status
      });
      
      toast.success("Registration successful! An administrator will review your request.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-100">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="bg-white p-8 rounded-lg shadow-2xl">
          <div className="text-center mb-6">
            <div className="mx-auto h-54 w-44 rounded-full  flex items-center justify-center overflow-hidden"> {/* Added overflow-hidden */}
              <img src={urLogo} alt="University of Rwanda Logo" className="h-full w-full object-contain" /> {/* Replaced span with img */}
            </div>
            <h1 className="text-2xl font-bold mt-4 text-gray-800">
              Create an Account
            </h1>
            <p className="text-black mt-1">
              University of Rwanda - Campus Planning System
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@ur.ac.rw" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Register as</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="student" id="student" />
                          <Label htmlFor="student" className="cursor-pointer">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="staff" id="staff" />
                          <Label htmlFor="staff" className="cursor-pointer">Staff</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {role === "staff" && (
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full bg-urblue hover:bg-urblue-dark"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-950">
              Already have an account?{" "}
              <Link to="/login" className="text-urblue hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;