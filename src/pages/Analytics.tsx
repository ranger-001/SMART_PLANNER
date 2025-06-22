
import React, { useState, useEffect } from "react";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Download, Calendar, Share2, ArrowDownUp, Building, Calendar as CalendarIcon } from "lucide-react";
import { getAnalyticsData } from "@/services/analyticsService";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState("month");
  const [selectedView, setSelectedView] = useState("usage");
  const [chartType, setChartType] = useState({
    usage: "bar",
    feedback: "line",
    distribution: "pie"
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const data = await getAnalyticsData();
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleDownloadData = () => {
    toast.success("Analytics data export started");
    // In a real app, this would trigger an actual file download
  };

  const handleShareReport = () => {
    toast.success("Report sharing dialog opened");
    // In a real app, this would open a sharing dialog
  };

  const toggleChartType = (view: keyof typeof chartType) => {
    const chartTypes: Record<string, string> = {
      bar: "line",
      line: "bar",
      pie: "pie" // Pie chart remains pie
    };
    
    setChartType({
      ...chartType,
      [view]: chartTypes[chartType[view]]
    });
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
            <h1 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive insights on facility usage and feedback
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownloadData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" onClick={handleShareReport}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Select Time Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button 
                  variant={timeRange === "week" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange("week")}
                >
                  Week
                </Button>
                <Button 
                  variant={timeRange === "month" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange("month")}
                >
                  Month
                </Button>
                <Button 
                  variant={timeRange === "quarter" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange("quarter")}
                >
                  Quarter
                </Button>
                <Button 
                  variant={timeRange === "year" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setTimeRange("year")}
                >
                  Year
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Average Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">72%</div>
              <p className="text-xs text-green-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                5.3% from last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128</div>
              <p className="text-xs text-red-500 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                2.1% from last {timeRange}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-2 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm ${selectedView === "usage" ? "border-b-2 border-urblue text-urblue" : "text-gray-600"}`}
            onClick={() => setSelectedView("usage")}
          >
            <Building className="inline-block mr-1 h-4 w-4" />
            Space Utilization
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${selectedView === "feedback" ? "border-b-2 border-urblue text-urblue" : "text-gray-600"}`}
            onClick={() => setSelectedView("feedback")}
          >
            <Calendar className="inline-block mr-1 h-4 w-4" />
            Feedback Trends
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${selectedView === "distribution" ? "border-b-2 border-urblue text-urblue" : "text-gray-600"}`}
            onClick={() => setSelectedView("distribution")}
          >
            <CalendarIcon className="inline-block mr-1 h-4 w-4" />
            Facility Distribution
          </button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {selectedView === "usage" ? "Facility Utilization by Time" :
               selectedView === "feedback" ? "Feedback Submission Trends" :
               "Facility Type Distribution"}
            </CardTitle>
            {selectedView !== "distribution" && (
              <Button variant="ghost" size="sm" onClick={() => toggleChartType(selectedView as "usage" | "feedback")}>
                <ArrowDownUp className="h-4 w-4 mr-1" />
                Switch Chart Type
              </Button>
            )}
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              {selectedView === "usage" && chartType.usage === "bar" ? (
                <BarChart
                  data={analytics?.monthlyUtilizationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                  <Legend />
                  <Bar dataKey="utilization" name="Utilization %" fill="#0088FE" />
                </BarChart>
              ) : selectedView === "usage" && chartType.usage === "line" ? (
                <LineChart
                  data={analytics?.monthlyUtilizationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                  <Legend />
                  <Line type="monotone" dataKey="utilization" name="Utilization %" stroke="#0088FE" activeDot={{ r: 8 }} />
                </LineChart>
              ) : selectedView === "feedback" && chartType.feedback === "line" ? (
                <LineChart
                  data={[
                    { name: "Jan", pending: 4, resolved: 2 },
                    { name: "Feb", pending: 7, resolved: 3 },
                    { name: "Mar", pending: 5, resolved: 6 },
                    { name: "Apr", pending: 9, resolved: 4 },
                    { name: "May", pending: 12, resolved: 8 },
                    { name: "Jun", pending: 8, resolved: 10 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pending" name="Pending Feedback" stroke="#FFBB28" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="resolved" name="Resolved Feedback" stroke="#00C49F" />
                </LineChart>
              ) : selectedView === "feedback" && chartType.feedback === "bar" ? (
                <BarChart
                  data={[
                    { name: "Jan", pending: 4, resolved: 2 },
                    { name: "Feb", pending: 7, resolved: 3 },
                    { name: "Mar", pending: 5, resolved: 6 },
                    { name: "Apr", pending: 9, resolved: 4 },
                    { name: "May", pending: 12, resolved: 8 },
                    { name: "Jun", pending: 8, resolved: 10 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pending" name="Pending Feedback" fill="#FFBB28" />
                  <Bar dataKey="resolved" name="Resolved Feedback" fill="#00C49F" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={[
                      { name: "Classrooms", value: 35 },
                      { name: "Labs", value: 20 },
                      { name: "Libraries", value: 15 },
                      { name: "Study Areas", value: 10 },
                      { name: "Offices", value: 12 },
                      { name: "Other", value: 8 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[...Array(6)].map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Distribution"]} />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Peak Usage Times</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { hour: "8AM", usage: 45 },
                    { hour: "10AM", usage: 70 },
                    { hour: "12PM", usage: 65 },
                    { hour: "2PM", usage: 85 },
                    { hour: "4PM", usage: 75 },
                    { hour: "6PM", usage: 50 },
                    { hour: "8PM", usage: 30 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
                  <Bar dataKey="usage" name="Utilization %" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Feedback by Issue Type</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { category: "Maintenance", count: 14 },
                    { category: "Space Issues", count: 8 },
                    { category: "Equipment", count: 11 },
                    { category: "Cleanliness", count: 7 },
                    { category: "Temperature", count: 5 },
                    { category: "Noise", count: 9 },
                  ]}
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                  <Bar dataKey="count" name="Issue Count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
