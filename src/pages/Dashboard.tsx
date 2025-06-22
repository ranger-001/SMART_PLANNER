
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Building, Users, MessageSquare, AlertTriangle, ArrowRight } from "lucide-react";
import { getFacilities } from "@/services/facilityService";
import { getAllFeedback } from "@/services/feedbackService";
import { getAIRecommendations } from "@/services/aiService";
import { getAnalyticsData } from "@/services/analyticsService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [facilitiesData, feedbackData, recommendationsData, analyticsData] = await Promise.all([
          getFacilities(),
          getAllFeedback(),
          getAIRecommendations(),
          getAnalyticsData()
        ]);
        
        setFacilities(facilitiesData);
        setFeedback(feedbackData);
        setRecommendations(recommendationsData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
  const pendingRecommendations = recommendations.filter(item => item.status === "pending").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-urgray">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening across the Nyarugenge Campus today
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{facilities.length}</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building className="h-5 w-5 text-urblue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Space Utilization 
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{analytics?.overallUtilization}%</div>
                <div className="p-2 bg-green-100 rounded-full">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
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
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                High Urgency Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{highUrgencyFeedback}</div>
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Utilization Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Space Utilization</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics?.monthlyUtilizationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Utilization"]}
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "0.5rem" }}
                  />
                  <Bar dataKey="utilization" fill="#1EAEDB" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Facility Type Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Facility Type Utilization</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics?.facilityTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics?.facilityTypeData.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Latest Updates Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Latest AI Recommendations</CardTitle>
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
                    <div key={rec.id} className="ai-recommendation">
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
                        <span className="text-xs text-gray-500">
                          {new Date(rec.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No AI recommendations available yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Feedback */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Feedback</CardTitle>
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
                      className={`feedback-item ${
                        item.urgency === "high" ? "urgency-high" :
                        item.urgency === "medium" ? "urgency-medium" :
                        "urgency-low"
                      }`}
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
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.userName} ({item.userRole})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No feedback submitted yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
