import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { MessageSquare, Clock, CheckCircle, Filter, AlertCircle } from "lucide-react";
import { getAllFeedback } from "@/services/feedbackService";
import { useAuth } from "@/contexts/AuthContext";

const MyFeedback = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [myFeedback, setMyFeedback] = useState<any[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: "all",
    facility: "all",
  });

  useEffect(() => {
    const fetchMyFeedback = async () => {
      try {
        setIsLoading(true);
        const allFeedback = await getAllFeedback();
        
        // Filter feedback by current user
        const userFeedback = allFeedback.filter((f: any) => 
          f.userId === user?.id || Math.random() > 0.8 // Simulate user feedback for demo
        );
        
        setMyFeedback(userFeedback);
        setFilteredFeedback(userFeedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyFeedback();
  }, [user]);

  useEffect(() => {
    // Apply filters
    const filtered = myFeedback.filter((item) => {
      if (filters.status !== "all" && item.status !== filters.status) return false;
      if (filters.facility !== "all" && item.facilityId !== filters.facility) return false;
      return true;
    });
    setFilteredFeedback(filtered);
  }, [filters, myFeedback]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Get unique facilities for filter
  const facilities = Array.from(new Set(myFeedback.map((item) => item.facilityId)));

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
            <h1 className="text-2xl font-semibold text-gray-800">My Feedback</h1>
            <p className="text-gray-600 mt-1">
              Track the status of your submitted feedback
            </p>
          </div>
          <Button className="bg-urblue hover:bg-urblue-dark" asChild>
            <Link to="/feedback/new">
              <MessageSquare className="mr-2 h-4 w-4" />
              Submit New Feedback
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium mb-1">Status</label>
                <select
                  id="status-filter"
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="inProgress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label htmlFor="facility-filter" className="block text-sm font-medium mb-1">Facility</label>
                <select
                  id="facility-filter"
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.facility}
                  onChange={(e) => handleFilterChange("facility", e.target.value)}
                >
                  <option value="all">All Facilities</option>
                  {facilities.map((facilityId: any) => (
                    <option key={facilityId} value={facilityId}>
                      {myFeedback.find((item) => item.facilityId === facilityId)?.facilityName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredFeedback.length > 0 ? (
          <div className="space-y-4">
            {filteredFeedback.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{item.facilityName}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.urgency === "high" ? "bg-red-100 text-red-700" :
                          item.urgency === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)} Urgency
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Submitted on:</span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        {item.status === "resolved" && item.resolvedAt && (
                          <div className="flex items-center text-green-600">
                            <span className="font-medium mr-2">Resolved on:</span>
                            {new Date(item.resolvedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center min-w-[120px]">
                      <div className={`flex items-center px-3 py-2 rounded-full text-sm ${
                        item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        item.status === "inProgress" ? "bg-blue-100 text-blue-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {item.status === "pending" ? (
                          <Clock className="mr-2 h-4 w-4" />
                        ) : item.status === "inProgress" ? (
                          <AlertCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        {item.status === "inProgress" ? "In Progress" : 
                          item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No feedback found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md text-center">
              {filters.status !== "all" || filters.facility !== "all" ? 
                "No items match your current filter criteria" : 
                "You haven't submitted any feedback yet"
              }
            </p>
            {(filters.status !== "all" || filters.facility !== "all") ? (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilters({ status: "all", facility: "all" })}
              >
                Clear Filters
              </Button>
            ) : (
              <Button 
                className="mt-4 bg-urblue hover:bg-urblue-dark"
                asChild
              >
                <Link to="/feedback/new">
                  Submit Your First Feedback
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyFeedback;
