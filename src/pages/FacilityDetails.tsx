import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit, Building, Users, MessageSquare, Clock, AlertTriangle } from "lucide-react";
import { getFacilityById, Facility } from "@/services/facilityService";
import { getAIRecommendationsByFacility, Recommendation } from "@/services/aiService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define interfaces
interface Feedback {
  id: string;
  userId: string;
  userName: string;
  facilityId: string;
  facilityName: string;
  description: string;
  urgency: "high" | "medium" | "low";
  status: "pending" | "inProgress" | "resolved";
  createdAt: string;
  category: string;
}

interface UtilizationData {
  day: string;
  utilization: number;
}

const FacilityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);

        // Fetch facility details
        const facilityData = await getFacilityById(id);
        if (!facilityData) {
          toast.error("Facility not found");
          navigate("/facilities");
          return;
        }
        setFacility(facilityData);

        // Fetch AI recommendations for this facility
        const recommendationsData = await getAIRecommendationsByFacility(id);
        setRecommendations(recommendationsData);

        // Mock fetching feedback for this facility
        // TODO: Replace with actual API call when available
        const feedbackData: Feedback[] = [
          {
            id: "fb-001",
            userId: "3",
            userName: "Student User",
            facilityId: id,
            facilityName: facilityData.name,
            description: "The air conditioning in this facility is not working properly.",
            urgency: "medium",
            status: "pending",
            createdAt: "2025-04-15T10:30:00Z",
            category: "equipment",
          },
          {
            id: "fb-002",
            userId: "2",
            userName: "Staff Member",
            facilityId: id,
            facilityName: facilityData.name,
            description: "The whiteboard needs to be replaced. It's worn out and difficult to clean.",
            urgency: "low",
            status: "inProgress",
            createdAt: "2025-04-10T14:15:00Z",
            category: "maintenance",
          },
        ];
        setFeedback(feedbackData);
      } catch (error) {
        console.error("Error fetching facility details:", error);
        toast.error("Failed to load facility details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    toast.info("Facility edit functionality would be implemented here");
    // In a real application, this would navigate to an edit form
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "construction":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getFeedbackStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100";
      case "inProgress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100";
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getOccupancyColor = (ratio: number) => {
    if (ratio > 0.9) return "bg-red-500 dark:bg-red-600";
    if (ratio > 0.7) return "bg-yellow-500 dark:bg-yellow-600";
    return "bg-green-500 dark:bg-green-600";
  };

  const utilizationData: UtilizationData[] = [
    { day: "Monday", utilization: 89 },
    { day: "Tuesday", utilization: 80 },
    { day: "Wednesday", utilization: 72 },
    { day: "Thursday", utilization: 81 },
    { day: "Friday", utilization: 65 },
    { day: "Saturday", utilization: 40 },
    { day: "Sunday", utilization: 35 },
  ];

  const canEdit =
    user?.role === "admin" || (user?.role === "staff" && user?.department === facility?.department);

  const renderRecommendationButtons = () => {
    if (user?.role === "admin") {
      return (
        <>
          <Button variant="outline" size="sm" className="h-8">
            Reject
          </Button>
          <Button size="sm" className="h-8">
            Approve
          </Button>
        </>
      );
    }
    if (user?.role === "staff") {
      return (
        <Button size="sm" className="h-8">
          Flag for Review
        </Button>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!facility) {
    return (
      <Layout>
        <div className="min-h-[50vh] bg-white dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-6 text-center">
          <Building className="h-16 w-16 text-gray-300 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
            Facility not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">
            The facility you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <Link to="/facilities">Back to Facilities</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Button and Page Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {facility.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 capitalize">{facility.type}</p>
          </div>
        </div>

        {/* Facility Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Facility Overview</CardTitle>
                  <CardDescription>Detailed information about this facility</CardDescription>
                </div>
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={handleEdit} className="h-8">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Location</span>
                      <span className="font-medium">{facility.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Capacity</span>
                      <span className="font-medium">{facility.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Current Occupancy</span>
                      <span className="font-medium">{facility.currentOccupancy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Status</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${getStatusColor(
                          facility.status
                        )} capitalize`}
                      >
                        {facility.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {facility.department && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Department</span>
                        <span className="font-medium">{facility.department}</span>
                      </div>
                    )}
                    {facility.lastMaintenanceDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Last Maintenance</span>
                        <span className="font-medium">
                          {new Date(facility.lastMaintenanceDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Features</span>
                      <div className="text-right">
                        {facility.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 text-xs px-2 py-1 rounded ml-1 mb-1"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {facility.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">{facility.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Status</CardTitle>
              <CardDescription>Live utilization metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Occupancy Rate
                  </p>
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getOccupancyColor(
                            facility.currentOccupancy / facility.capacity
                          )} w-[${(facility.currentOccupancy / facility.capacity) * 100}%]`}
                        />
                      </div>
                    </div>
                    <span className="ml-2 font-medium">
                      {Math.round((facility.currentOccupancy / facility.capacity) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-center">
                    <Users className="h-5 w-5 mx-auto text-blue-600 dark:text-blue-500 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current Users</p>
                    <p className="text-xl font-semibold">{facility.currentOccupancy}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 text-center">
                    <Clock className="h-5 w-5 mx-auto text-blue-600 dark:text-blue-500 mb-1" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Availability</p>
                    <p className="text-xl font-semibold">
                      {facility.status === "operational" ? "Now" : "Closed"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Issues Reported
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400 mr-2" />
                      <span>{feedback.length} issues</span>
                    </div>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <Link to="/feedback">View All</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for additional information */}
        <Tabs defaultValue="usage">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="usage">Usage Data</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent
            value="usage"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">Weekly Utilization</h3>
            <div className="h-[50vh] min-h-[300px] max-h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={utilizationData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Utilization"]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="utilization" fill="#1EAEDB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {feedback.length > 0 ? (
              feedback.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{item.description}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(item.urgency)}`}>
                        {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)} Urgency
                      </span>
                    </div>
                    <CardDescription>
                      Reported by {item.userName} on {new Date(item.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2 border-t flex justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getFeedbackStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status === "inProgress"
                        ? "In Progress"
                        : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    {(user?.role === "admin" || user?.role === "staff") && (
                      <Button size="sm" className="h-8">
                        Process Feedback
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  No feedback yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">
                  There's no feedback for this facility yet.
                </p>
                {user?.role === "student" && (
                  <Button asChild>
                    <Link to="/feedback/new">Submit Feedback</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <Card key={rec.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(rec.impact)}`}>
                        {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact
                      </span>
                    </div>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2 border-t flex justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      AI Confidence: {rec.aiConfidence}%
                    </span>
                    <div className="space-x-2">{renderRecommendationButtons()}</div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-300 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  No AI recommendations
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  There are no AI recommendations for this facility at this time.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default FacilityDetails;