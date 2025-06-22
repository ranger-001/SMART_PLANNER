
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { User, Mail, Building, School, Key, Save, UserCog } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    joinedDate: "",
    contactNumber: "",
    address: "",
    bio: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load user profile data
  useEffect(() => {
    if (user) {
      // Simulate API delay
      setTimeout(() => {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          department: user.department || "Not specified",
          role: user.role || "",
          joinedDate: "2024-09-01", // Mock data
          contactNumber: "+250 78 123 4567", // Mock data
          address: "Kigali, Rwanda", // Mock data
          bio: "Campus user interested in improving learning facilities." // Mock data
        });
        setIsLoading(false);
      }, 500);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // Simulate saving profile data
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsLoading(false);
      setIsEditing(false);
    }, 800);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">
              View and manage your personal information
            </p>
          </div>
          <Button 
            variant={isEditing ? "outline" : "default"}
            className={isEditing ? "" : "bg-urblue hover:bg-urblue-dark"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                <UserCog className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <User className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.email}</p>
              <div className="mt-2 py-1 px-3 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                {profileData.role}
              </div>
              {profileData.department && (
                <p className="mt-2 text-gray-500 flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  {profileData.department}
                </p>
              )}
              <div className="mt-6 w-full border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Member since</span>
                  <span className="text-sm">{new Date(profileData.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Last updated</span>
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Profile" : "Profile Details"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <div className="flex border rounded-md overflow-hidden">
                        <span className="bg-gray-100 border-r px-3 flex items-center">
                          <User className="h-4 w-4 text-gray-500" />
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{profileData.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <span className="bg-gray-100 border-r px-3 flex items-center">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        readOnly
                        className="flex-1 px-3 py-2 focus:outline-none bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    {isEditing && user?.role !== "student" ? (
                      <div className="flex border rounded-md overflow-hidden">
                        <span className="bg-gray-100 border-r px-3 flex items-center">
                          <Building className="h-4 w-4 text-gray-500" />
                        </span>
                        <input
                          type="text"
                          name="department"
                          value={profileData.department}
                          onChange={handleInputChange}
                          className="flex-1 px-3 py-2 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                        <Building className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{profileData.department}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
                      <School className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="capitalize">{profileData.role}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="contactNumber"
                        value={profileData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="border rounded-md px-3 py-2 bg-gray-50">
                        {profileData.contactNumber}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="border rounded-md px-3 py-2 bg-gray-50">
                        {profileData.address}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="border rounded-md px-3 py-2 bg-gray-50 min-h-[80px]">
                      {profileData.bio}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} className="bg-urblue hover:bg-urblue-dark">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Update your password to keep your account secure
                </p>
              </div>
              <Button variant="outline">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
