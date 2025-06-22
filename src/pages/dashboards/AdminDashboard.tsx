import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Building,
  Users,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Download,
  UserPlus,
  ArrowUpRight,
  Brain,
} from "lucide-react";
import { getFacilities } from "@/services/facilityService";
import { getAllFeedback } from "@/services/feedbackService";
import { getAIRecommendations } from "@/services/aiService";
import { getAnalyticsData } from "@/services/analyticsService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<{ students: number; staff: number }>({
    students: 0,
    staff: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [facilitiesData, feedbackData, recommendationsData, analyticsData] =
          await Promise.all([
            getFacilities(),
            getAllFeedback(),
            getAIRecommendations(),
            getAnalyticsData(),
          ]);

        setFacilities(facilitiesData);
        setFeedback(feedbackData);
        setRecommendations(recommendationsData);
        setAnalytics(analyticsData);

        // Mock user counts for admin dashboard
        setUsers({
          students: 2845,
          staff: 178,
        });
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

  const pendingFeedback = feedback.filter(
    (item) => item.status === "pending"
  ).length;
  const highUrgencyFeedback = feedback.filter(
    (item) => item.urgency === "high"
  ).length;
  const pendingRecommendations = recommendations.filter(
    (item) => item.status === "pending"
  ).length;
  const totalUsers = users.students + users.staff;

  // --- Export Report Function ---
  const handleExportReport = (reportType: string) => {
    let dataToExport: any;
    let filename = "";

    const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    switch (reportType) {
      case "full":
        dataToExport = {
          dashboardStats: {
            facilities: facilities.length,
            totalUsers: totalUsers,
            students: users.students,
            staff: users.staff,
            unresolvedFeedback: pendingFeedback,
            highUrgencyFeedback: highUrgencyFeedback,
            pendingAIRecommendations: pendingRecommendations,
          },
          monthlyUtilizationData: analytics?.monthlyUtilizationData,
          facilityTypeData: analytics?.facilityTypeData,
          aiRecommendations: recommendations,
          recentFeedback: feedback,
        };
        filename = `admin_dashboard_report_${currentDate}.json`; // JSON for comprehensive data
        downloadJson(dataToExport, filename);
        break;
      case "monthlyUtilization":
        dataToExport = analytics?.monthlyUtilizationData;
        filename = `monthly_utilization_report_${currentDate}.csv`;
        downloadCSV(dataToExport, filename, ["name", "utilization"]);
        break;
      case "facilityTypeUtilization":
        dataToExport = analytics?.facilityTypeData;
        filename = `facility_type_utilization_report_${currentDate}.csv`;
        downloadCSV(dataToExport, filename, ["name", "value"]);
        break;
      default:
        console.warn("Unknown report type:", reportType);
        return;
    }
  };

  const downloadJson = (data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any[], filename: string, headers: string[]) => {
    if (!data || data.length === 0) {
      alert("No data to export for this report.");
      return;
    }

    const csvRows = [];
    csvRows.push(headers.join(",")); // Add headers

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // --- End Export Report Function ---

  return (
    <Layout>
      <div className="space-y-6">
        {/* Admin Welcome Section */}
        <div className="bg-green p-6 rounded-lg shadow-sm border border-black">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                Administrator Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Complete management overview of the Nyarugenge Campus
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="hidden md:flex items-center"
                onClick={() => handleExportReport("full")} // Call with 'full' to export all data
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button className="bg-urblue hover:bg-urblue-dark hidden md:flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Key Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{facilities.length}</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building className="h-5 w-5 text-urblue" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />4 new this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{totalUsers}</div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <span className="mr-2">{users.students} Students</span>
                <span>{users.staff} Staff</span>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Unresolved Feedback
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

          {/* New AI Planning Card with Link */}
          <Card className="stat-card card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                AI Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {pendingRecommendations}
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-xs">
                <Button variant="link" className="text-urblue p-0 h-auto" asChild>
                  <Link to="/predictive-planning">
                    Access Predictive Planning
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Utilization Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Monthly Space Utilization</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("monthlyUtilization")}
              >
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
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
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="utilization" fill="#1EAEDB" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Facility Type Distribution Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Facility Type Utilization</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport("facilityTypeUtilization")}
              >
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
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
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {analytics?.facilityTypeData.map((_entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Admin Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Recommendations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>AI Recommendations</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-urblue">
                <Link to="/recommendations">
                  Manage All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.slice(0, 3).map((rec) => (
                    <div
                      key={rec.id}
                      className="ai-recommendation border-l-4 border-urblue pl-3 py-1"
                    >
                      <h3 className="font-medium">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {rec.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            rec.impact === "high"
                              ? "bg-red-100 text-red-700"
                              : rec.impact === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {rec.impact.charAt(0).toUpperCase() +
                            rec.impact.slice(1)}{" "}
                          Impact
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 bg-urblue hover:bg-urblue-dark text-xs"
                          >
                            Approve
                          </Button>
                        </div>
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
                  Manage All
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
                      className={`feedback-item border-l-4 pl-3 py-1 ${
                        item.urgency === "high"
                          ? "border-red-500"
                          : item.urgency === "medium"
                          ? "border-yellow-500"
                          : "border-green-500"
                      }`}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.facilityName}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "inProgress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.status === "inProgress"
                            ? "In Progress"
                            : item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          By: {item.userName} ({item.userRole})
                        </span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 bg-urblue hover:bg-urblue-dark text-xs"
                          >
                            Assign
                          </Button>
                        </div>
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

export default AdminDashboard;