
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Users, UserPlus, UserX, Edit2, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllUsers, createUser, updateUser, approveUser, rejectUser, getPendingUsers } from "@/services/userService";
import { User } from "@/contexts/AuthContext";

const UserManagement = () => {
  // User state
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  
  // Filters
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // New user state
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    department: "",
    status: "active"
  });

  // Edit user state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const [allUsers, waitingUsers] = await Promise.all([
        getAllUsers(),
        getPendingUsers()
      ]);
      
      setUsers(allUsers);
      setPendingUsers(waitingUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on selected filters
  const filteredUsers = users.filter(user => {
    if (filterRole !== "all" && user.role !== filterRole) return false;
    if (filterStatus !== "all" && user.status !== filterStatus) return false;
    return true;
  });

  // Handle user activation/deactivation
  const toggleUserStatus = async (user: User) => {
    try {
      const newStatus = user.status === "active" ? "inactive" : "active";
      await updateUser(user.id, { status: newStatus });
      
      setUsers(users.map(u => {
        if (u.id === user.id) {
          return { ...u, status: newStatus };
        }
        return u;
      }));
      
      toast.success(`User ${user.name} ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const createdUser = await createUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as any,
        department: newUser.department,
        password: "password", // Default password
        status: newUser.status as any
      });
      
      setUsers([...users, createdUser]);
      setShowNewUserDialog(false);
      toast.success("New user added successfully");
      
      // Reset form
      setNewUser({
        name: "",
        email: "",
        role: "student",
        department: "",
        status: "active"
      });
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  // Handle edit user
  const openEditDialog = (user: User) => {
    setEditingUser({...user});
    setShowEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser.name || !editingUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const updatedUser = await updateUser(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        department: editingUser.department,
        status: editingUser.status
      });
      
      if (updatedUser) {
        setUsers(users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        ));
      }
      
      setShowEditDialog(false);
      toast.success(`User ${editingUser.name} updated successfully`);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };
  
  // Handle user approval or rejection
  const handleApproveUser = async (user: User) => {
    try {
      const updatedUser = await approveUser(user.id);
      if (updatedUser) {
        // Remove from pending list
        setPendingUsers(pendingUsers.filter(u => u.id !== user.id));
        // Add to regular users list if not already there
        if (!users.some(u => u.id === user.id)) {
          setUsers([...users, updatedUser]);
        } else {
          setUsers(users.map(u => u.id === user.id ? updatedUser : u));
        }
        toast.success(`User ${user.name} approved successfully`);
      }
    } catch (error) {
      console.error("Failed to approve user:", error);
      toast.error("Failed to approve user. Please try again.");
    }
  };
  
  const handleRejectUser = async (user: User) => {
    try {
      await rejectUser(user.id);
      // Remove from pending list
      setPendingUsers(pendingUsers.filter(u => u.id !== user.id));
      toast.success(`User ${user.name} rejected successfully`);
    } catch (error) {
      console.error("Failed to reject user:", error);
      toast.error("Failed to reject user. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">
              Manage users across the campus system
            </p>
          </div>
          <Button 
            className="bg-urblue hover:bg-urblue-dark"
            onClick={() => setShowNewUserDialog(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="active" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Users</TabsTrigger>
                <TabsTrigger value="pending" className="relative">
                  Pending Approvals
                  {pendingUsers.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingUsers.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div>
                    <label htmlFor="role-filter" className="block text-sm font-medium mb-1">Filter by Role</label>
                    <select 
                      id="role-filter"
                      className="border rounded-md px-3 py-2 w-full"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium mb-1">Filter by Status</label>
                    <select 
                      id="status-filter"
                      className="border rounded-md px-3 py-2 w-full"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">Email</th>
                        <th className="border px-4 py-2 text-left">Role</th>
                        <th className="border px-4 py-2 text-left">Department</th>
                        <th className="border px-4 py-2 text-left">Status</th>
                        <th className="border px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">Loading users...</td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">No users found</td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-3">{user.name}</td>
                            <td className="border px-4 py-3">{user.email}</td>
                            <td className="border px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === "admin" ? "bg-purple-100 text-purple-800" : 
                                user.role === "staff" ? "bg-blue-100 text-blue-800" : 
                                "bg-green-100 text-green-800"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="border px-4 py-3">{user.department || "N/A"}</td>
                            <td className="border px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.status === "active" ? "bg-green-100 text-green-800" : 
                                user.status === "pending" ? "bg-yellow-100 text-yellow-800" : 
                                "bg-red-100 text-red-800"
                              }`}>
                                {user.status || "active"}
                              </span>
                            </td>
                            <td className="border px-4 py-3">
                              <div className="flex items-center justify-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant={user.status === "active" ? "destructive" : "default"}
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => toggleUserStatus(user)}
                                >
                                  {user.status === "active" ? <UserX className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">Email</th>
                        <th className="border px-4 py-2 text-left">Role</th>
                        <th className="border px-4 py-2 text-left">Department</th>
                        <th className="border px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">Loading pending approvals...</td>
                        </tr>
                      ) : pendingUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">No pending approval requests</td>
                        </tr>
                      ) : (
                        pendingUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-3">{user.name}</td>
                            <td className="border px-4 py-3">{user.email}</td>
                            <td className="border px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === "staff" ? "bg-blue-100 text-blue-800" : 
                                "bg-green-100 text-green-800"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="border px-4 py-3">{user.department || "N/A"}</td>
                            <td className="border px-4 py-3">
                              <div className="flex items-center justify-center space-x-2">
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveUser(user)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRejectUser(user)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add New User Dialog */}
      <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user for the campus system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="user@ur.ac.rw" 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                placeholder="Computer Science" 
                value={newUser.department}
                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newUser.status}
                onValueChange={(value) => setNewUser({...newUser, status: value})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewUserDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({...editingUser, role: value})}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input 
                  id="edit-department" 
                  value={editingUser.department || ""}
                  onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingUser.status || "active"}
                  onValueChange={(value) => setEditingUser({...editingUser, status: value})}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UserManagement;