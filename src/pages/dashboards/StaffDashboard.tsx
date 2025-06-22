
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Building, MessageSquare, AlertTriangle, ArrowRight, FileText, Brain } from "lucide-react";
import { getFacilities } from "@/services/facilityService";
import { getAllFeedback } from "@/services/feedbackService";
import { getAIRecommendations } from "@/services/aiService";

const StaffDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [assignedFacilities, setAssignedFacilities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [facilitiesData, feedbackData, recommendationsData] = await Promise.all([
          getFacilities(),
          getAllFeedback(),
          getAIRecommendations(),
        ]);
        
        // Filter facilities, feedback, and recommendations by staff department
        const staffDepartment = user?.department || "";
        
        // Simulate assigned facilities for the staff
        const staffAssignedFacilities = facilitiesData.filter((facility: any) => 
          facility.department === staffDepartment || Math.random() > 0.7
        );
        
        setAssignedFacilities(staffAssignedFacilities);
        setFacilities(facilitiesData);
        
        // Filter feedback for assigned facilities
        const assignedFacilityIds = staffAssignedFacilities.map((f: any) => f.id);
        const relevantFeedback = feedbackData.filter((f: any) => 
          assignedFacilityIds.includes(f.facilityId)
        );
        setFeedback(relevantFeedback);
        
        // Filter recommendations for assigned facilities or department
        const relevantRecommendations = recommendationsData.filter((r: any) => 
          r.department === staffDepartment || assignedFacilityIds.includes(r.facilityId)
        );
        setRecommendations(relevantRecommendations);
        
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
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
        </div>
      </Layout>
    );
  }

  const pendingFeedback = feedback.filter(item => item.status === "pending").length;
  const highUrgencyFeedback = feedback.filter(item => item.urgency === "high").length;
  const pendingReports = Math.floor(Math.random() * 5); // Mock value for pending reports

  return (
    <Layout>
      <div className="space-y-6">
        {/* Staff Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-urgray">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Staff Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your assigned facilities in the {user?.department} department
              </p>
            </div>
            <div className="hidden md:block">
              <Button className="bg-urblue hover:bg-urblue-dark">
                <FileText className="mr-2 h-4 w-4" />
                Submit Facility Report
              </Button>
            </div>
          </div>
        </div>

        {/* Staff Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Assigned Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{assignedFacilities.length}</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building className="h-5 w-5 text-urblue" />
                </div>
              </div>
              <div className="mt-2 text-xs">
                <Button variant="link" className="text-urblue p-0 h-auto" asChild>
                  <Link to="/facilities">View All</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{pendingFeedback}</div>
                <div className="p-2 bg-yellow-100 rounded-full">
                  <MessageSquare className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-red-500">
                {highUrgencyFeedback} high urgency items
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Your Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{pendingReports}</div>
                <div className="p-2 bg-green-100 rounded-full">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs">
                <Button variant="link" className="text-urblue p-0 h-auto" asChild>
                  <Link to="/reports">Submit Report</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* New AI Planning Card with Link */}
          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                AI Predictive Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{recommendations.length}</div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-xs">
                <Button variant="link" className="text-urblue p-0 h-auto" asChild>
                  <Link to="/predictive-planning">Access Planning Tool</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Facility Usage Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Monday', utilization: 90 },
                  { name: 'Tuesday', utilization: 85 },
                  { name: 'Wednesday', utilization: 82 },
                  { name: 'Thursday', utilization: 75 },
                  { name: 'Friday', utilization: 59 },
                  { name: 'Saturday', utilization: 42 },
                  { name: 'Sunday', utilization: 35 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Utilization"]}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "0.5rem" }}
                />
                <Bar dataKey="utilization" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Staff Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Recommendations for Staff */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>AI Suggestions for Your Facilities</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-urblue">
                <Link to="/recommendations">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="ai-recommendation border p-3 rounded-lg">
                      <h3 className="font-medium">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {rec.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          rec.impact === "high" ? "bg-red-100 text-red-700" :
                          rec.impact === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact
                        </span>
                        <Button size="sm" className="h-8 bg-urblue hover:bg-urblue-dark text-xs">
                          Flag for Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No AI recommendations for your facilities yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Feedback for Staff's Facilities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Feedback on Your Facilities</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-urblue">
                <Link to="/feedback">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {feedback.length > 0 ? (
                <div className="space-y-4">
                  {feedback.slice(0, 3).map((item) => (
                    <div 
                      key={item.id} 
                      className="feedback-item border p-3 rounded-lg"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.facilityName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.urgency === "high" ? "bg-red-100 text-red-700" :
                          item.urgency === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)} Urgency
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Submitted: {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <Button size="sm" className="h-8 bg-urblue hover:bg-urblue-dark text-xs">
                          Respond
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No feedback for your facilities yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StaffDashboard;
