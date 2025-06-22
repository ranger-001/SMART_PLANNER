
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { MessageSquare, Clock, ArrowRight, CheckCircle, AlertCircle, Building } from "lucide-react";
import { getAllFeedback } from "@/services/feedbackService";
import { getFacilities } from "@/services/facilityService";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [myFeedback, setMyFeedback] = useState<any[]>([]);
  const [publicAnnouncements, setPublicAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [facilitiesData, feedbackData] = await Promise.all([
          getFacilities(),
          getAllFeedback()
        ]);
        
        setFacilities(facilitiesData);
        
        // Filter feedback by current user
        const studentFeedback = feedbackData.filter((f: any) => 
          f.userId === user?.id || Math.random() > 0.8 // Simulate user feedback
        );
        setMyFeedback(studentFeedback);
        
        // Mock public announcements
        setPublicAnnouncements([
          {
            id: 1,
            title: "Library Hours Extended",
            description: "Based on student feedback and AI analysis, the main library will now stay open until 10 PM on weekdays.",
            date: "2025-04-12",
            type: "improvement"
          },
          {
            id: 2,
            title: "New Study Spaces",
            description: "10 new individual study pods have been added to the Science Building based on space utilization data.",
            date: "2025-04-05", 
            type: "expansion"
          },
          {
            id: 3,
            title: "Computer Lab Maintenance",
            description: "The Computer Science lab will be closed this weekend for system upgrades and maintenance.",
            date: "2025-04-20",
            type: "maintenance"
          }
        ]);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue mb-4"></div>
          <p className="text-gray-500 animate-pulse">Loading your campus information...</p>
        </div>
      </Layout>
    );
  }

  const pendingFeedback = myFeedback.filter(item => item.status === "pending").length;
  const resolvedFeedback = myFeedback.filter(item => item.status === "resolved").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Student Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-urgray">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Help us improve your campus experience!
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-urblue hover:bg-urblue-dark w-full md:w-auto">
                <MessageSquare className="mr-2 h-4 w-4" />
                Submit New Feedback
              </Button>
            </div>
          </div>
        </div>

        {/* Student Feedback Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{myFeedback.length}</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <MessageSquare className="h-5 w-5 text-urblue" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Thank you for helping improve our campus!
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{pendingFeedback}</div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Items being reviewed
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{resolvedFeedback}</div>
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                Issues resolved based on your feedback
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Public Campus Announcements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Campus Updates</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-urblue">
                <Link to="/announcements">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {publicAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {publicAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start">
                        <div className={`mr-4 p-2 rounded-full
                          ${announcement.type === 'improvement' ? 'bg-blue-100' : 
                            announcement.type === 'expansion' ? 'bg-green-100' : 'bg-yellow-100'}`
                        }>
                          {announcement.type === 'improvement' ? 
                            <CheckCircle className="h-5 w-5 text-blue-600" /> : 
                            announcement.type === 'expansion' ? 
                            <Building className="h-5 w-5 text-green-600" /> :
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          }
                        </div>
                        <div>
                          <h3 className="font-medium">{announcement.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {announcement.description}
                          </p>
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(announcement.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No campus announcements at this time</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student's Recent Feedback */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Your Recent Feedback</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-urblue">
                <Link to="/my-feedback">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {myFeedback.length > 0 ? (
                <div className="space-y-4">
                  {myFeedback.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.facilityName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          item.status === "inProgress" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.status === "inProgress" ? "In Progress" : 
                           item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Submitted: {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        {item.status === "resolved" && (
                          <span className="text-xs text-green-600 flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" /> 
                            Resolved on {new Date(item.resolvedAt || Date.now()).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-600">No feedback submitted yet</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                    Help us improve your campus by sharing your experience with facilities
                  </p>
                  <Button className="mt-4 bg-urblue hover:bg-urblue-dark">
                    Submit Your First Feedback
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Campus Facilities Highlight */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Campus Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {facilities.slice(0, 4).map((facility: any) => (
                <div key={facility.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 h-32 flex items-center justify-center">
                    <Building className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm">{facility.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {facility.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                        {facility.type}
                      </span>
                      <Button variant="link" size="sm" className="text-xs h-auto p-0">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/facilities">
                  View All Campus Facilities
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
