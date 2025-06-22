// Mock user service

import { Role, User } from "@/contexts/AuthContext";

export interface UserWithPassword extends User {
  password: string;
  status?: "active" | "inactive" | "pending";
}

const mockUsers: UserWithPassword[] = [
  { 
    id: "1", 
    name: "CAMPUS PLANNER", 
    email: "admin@ur.ac.rw", 
    role: "admin" as Role, 
    department: "Management",
    password: "AdminPassword",
    status: "active"
  },
  { 
    id: "2", 
    name: "Karangwa", 
    email: "karangwa.staff@ur.ac.rw", 
    role: "staff" as Role, 
    department: "Computer Science",
    password: "password",
    status: "active"
  },
  { 
    id: "3", 
    name: "Simon Pierre", 
    email: "simon@ur.ac.rw", 
    role: "student" as Role,
    password: "password",
    status: "active"
  },
  { 
    id: "4", 
    name: "Manyanga", 
    email: "manyanga@ur.ac.rw", 
    role: "student" as Role,
    password: "password" 
  },
  { 
    id: "5", 
    name: "Jane Kamikazi", 
    email: "jane.smith@ur.ac.rw", 
    role: "staff" as Role,
    department: "Engineering",
    password: "password" 
  },
  { 
    id: "6", 
    name: "David Rucamumakuba", 
    email: "david.johnson@ur.ac.rw", 
    role: "student" as Role,
    password: "password" 
  },
  { 
    id: "7", 
    name: "Emily Niyonsaba", 
    email: "emily.davis@ur.ac.rw", 
    role: "student" as Role,
    password: "password" 
  },
  { 
    id: "8", 
    name: "Michael Kananga", 
    email: "michael.brown@ur.ac.rw", 
    role: "staff" as Role,
    department: "Chemistry",
    password: "password" 
  },
  { 
    id: "9", 
    name: "Sarah Uwimana", 
    email: "sarah.wilson@ur.ac.rw", 
    role: "admin" as Role,
    department: "IT Services",
    password: "password" 
  }
];

// Simulate API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllUsers = async (): Promise<User[]> => {
  await delay(800);
  // Return users without password field
  return mockUsers.map(({ password, ...user }) => user);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  await delay(500);
  const user = mockUsers.find(user => user.id === id);
  if (!user) return undefined;
  
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export interface NewUser extends Omit<User, 'id'> {
  password: string;
  status?: "active" | "inactive" | "pending";
}

export const createUser = async (user: NewUser): Promise<User> => {
  await delay(1000);
  const newUser: UserWithPassword = {
    id: `${mockUsers.length + 1}`,
    status: user.status || "pending", // Default to pending for new registrations
    ...user
  };
  
  // Add to mock database
  mockUsers.push(newUser);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const updateUser = async (id: string, updates: Partial<Omit<User, 'id'>>): Promise<User | undefined> => {
  await delay(1000);
  const userIndex = mockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return undefined;
  }
  
  const updatedUser = {
    ...mockUsers[userIndex],
    ...updates
  };
  
  mockUsers[userIndex] = updatedUser;
  
  // Return user without password
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const approveUser = async (id: string): Promise<User | undefined> => {
  return updateUser(id, { status: "active" });
};

export const rejectUser = async (id: string): Promise<User | undefined> => {
  return updateUser(id, { status: "inactive" });
};

export const getPendingUsers = async (): Promise<User[]> => {
  await delay(800);
  return mockUsers
    .filter(user => user.status === "pending")
    .map(({ password, ...user }) => user);
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await delay(1000);
  const userIndex = mockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return false;
  }
  
  mockUsers.splice(userIndex, 1);
  return true;
};

export const changePassword = async (id: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  await delay(1000);
  const userIndex = mockUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return false;
  }
  
  const user = mockUsers[userIndex];
  
  // Check if current password matches
  if (user.password !== currentPassword) {
    return false;
  }
  
  // Update password
  mockUsers[userIndex].password = newPassword;
  return true;
};
