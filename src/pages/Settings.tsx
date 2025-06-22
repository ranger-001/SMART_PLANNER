import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Bell, Moon, Globe, Lock, Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    feedbackUpdates: true,
    facilityChanges: false,
    reportPublications: true,
    systemAnnouncements: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    fontSize: "medium",
    language: "english"
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "all",
    feedbackAnonymity: false,
    activityTracking: true
  });

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof notificationSettings]
    }));
  };

  const handleAppearanceChange = (setting: string, value: string) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handlePrivacyChange = (setting: string, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: typeof value === "boolean" ? value : value
    }));
  };

  const handleSaveSettings = (section: string) => {
    // Simulate saving settings
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">
            Customize your preferences and account settings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive important notifications via email</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.emailNotifications}
                      onChange={() => handleNotificationChange("emailNotifications")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urblue"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Feedback Updates</h3>
                  <p className="text-sm text-gray-600">Get notified when your feedback status changes</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.feedbackUpdates}
                      onChange={() => handleNotificationChange("feedbackUpdates")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urblue"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Facility Changes</h3>
                  <p className="text-sm text-gray-600">Be alerted when facilities you use are modified</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.facilityChanges}
                      onChange={() => handleNotificationChange("facilityChanges")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urblue"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Report Publications</h3>
                  <p className="text-sm text-gray-600">Get notified when new reports are published</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.reportPublications}
                      onChange={() => handleNotificationChange("reportPublications")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urblue"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">System Announcements</h3>
                  <p className="text-sm text-gray-600">Receive important system-wide announcements</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={notificationSettings.systemAnnouncements}
                      onChange={() => handleNotificationChange("systemAnnouncements")}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urblue"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => handleSaveSettings("Notification")}
                  className="bg-urblue hover:bg-urblue-dark"
                >
                  Save Notification Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="mr-2 h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${appearanceSettings.theme === "light" ? "border-urblue bg-blue-50" : ""
                      }`}
                    onClick={() => handleAppearanceChange("theme", "light")}
                  >
                    <div className="h-12 w-12 bg-white border rounded-md mb-2"></div>
                    <span className="text-sm">Light</span>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${appearanceSettings.theme === "dark" ? "border-urblue bg-blue-50" : ""
                      }`}
                    onClick={() => handleAppearanceChange("theme", "dark")}
                  >
                    <div className="h-12 w-12 bg-gray-800 border rounded-md mb-2"></div>
                    <span className="text-sm">Dark</span>
                  </div>
                  <div
                    className={`border rounded-md p-4 cursor-pointer flex flex-col items-center ${appearanceSettings.theme === "system" ? "border-urblue bg-blue-50" : ""
                      }`}
                    onClick={() => handleAppearanceChange("theme", "system")}
                  >
                    <div className="h-12 w-12 bg-gradient-to-r from-white to-gray-800 border rounded-md mb-2"></div>
                    <span className="text-sm">System</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Font Size</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    className={`py-2 px-4 border rounded-md ${appearanceSettings.fontSize === "small" ? "border-urblue bg-blue-50" : ""
                      }`}
                    onClick={() => handleAppearanceChange("fontSize", "small")}
                  >
                    <span className="text-sm">Small</span>
                  </button>
                  <button
                    className={`py-2 px-4 border rounded-md ${appearanceSettings.fontSize === "medium" ? "border-urblue bg-blue-50" : ""
                      }`}
                    onClick={() => handleAppearanceChange("fontSize", "medium")}
                  >
                    <span className="text-base">Medium</span>
                  </button>
                  <button
                    className={`py-2 px-4 border rounded-md ${appearanceSettings.fontSize === "large" ? "border-urblue bg-blue-50" : ""
                      }`}
                    onClick={() => handleAppearanceChange("fontSize", "large")}
                  >
                    <span className="text-lg">Large</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <div className="flex">
                  <div className="inline-block relative w-64">
                    <select
                      className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md leading-tight focus:outline-none"
                      value={appearanceSettings.language}
                      onChange={(e) => handleAppearanceChange("language", e.target.value)}
                    >
                      <option value="english">English</option>
                      <option value="french">French</option>
                      <option value="kinyarwanda">Kinyarwanda</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <Globe className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => handleSaveSettings("Appearance")}
                  className="bg-urblue hover:bg-urblue-dark"
                >
                  Save Appearance Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">Control who can see your profile information</p>
                </div>
                <div className="flex items-center">
                  <select
                    className="border rounded-md px-3 py-1"
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                  >
                    <option value="all">Everyone</option>
                    <option value="staff">Staff Only</option>
                    <option value="none">Private</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <h3 className="font-medium">Anonymous Feedback</h3>
                  <p className="text-sm text-gray-600">Submit feedback without displaying your name</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={privacySettings.feedbackAnonymity}
                      onChange={() => handlePrivacyChange("feedbackAnonymity", !privacySettings.feedbackAnonymity)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urblue"></div>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium">Activity Tracking</h3>
                  <p className="text-sm text-gray-600">Allow the system to track your facility usage</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={privacySettings.activityTracking}
                      onChange={() => handlePrivacyChange("activityTracking", !privacySettings.activityTracking)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-urblue"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => handleSaveSettings("Privacy")}
                  className="bg-urblue hover:bg-urblue-dark"
                >
                  Save Privacy Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="mr-2 h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 border-l-4 border-red-500 pl-4">
              <div>
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  Permanently remove your account and all associated data from the system.
                  This action cannot be undone.
                </p>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Shield className="mr-2 h-4 w-4" /> Delete My Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
