
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { MessageSquare, Clock, AlertCircle, CheckCircle, Filter } from "lucide-react";
import { getAllFeedback } from "@/services/feedbackService";
import { toast } from "sonner";

const Feedback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: "all",
    urgency: "all",
    facility: "all",
  });

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const data = await getAllFeedback();
        setFeedback(data);
        setFilteredFeedback(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to load feedback data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  useEffect(() => {
    // Apply filters
    const filtered = feedback.filter((item) => {
      if (filters.status !== "all" && item.status !== filters.status) return false;
      if (filters.urgency !== "all" && item.urgency !== filters.urgency) return false;
      if (filters.facility !== "all" && item.facilityId !== filters.facility) return false;
      return true;
    });
    setFilteredFeedback(filtered);
  }, [filters, feedback]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleStatusChange = (feedbackId: string, newStatus: string) => {
    setFeedback((prev) =>
      prev.map((item) => {
        if (item.id === feedbackId) {
          toast.success(`Feedback status updated to ${newStatus}`);
          return {
            ...item,
            status: newStatus,
            ...(newStatus === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
          };
        }
        return item;
      })
    );
  };

  // Get unique facilities for filter
  const facilities = Array.from(new Set(feedback.map((item) => item.facilityId)));

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
            <h1 className="text-2xl font-semibold text-gray-800">Feedback Management</h1>
            <p className="text-gray-600 mt-1">
              Review and manage feedback from campus users
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label htmlFor="urgency-filter" className="block text-sm font-medium mb-1">Urgency</label>
                <select
                  id="urgency-filter"
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.urgency}
                  onChange={(e) => handleFilterChange("urgency", e.target.value)}
                >
                  <option value="all">All Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
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
                      {feedback.find((item) => item.facilityId === facilityId)?.facilityName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((item) => (
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
                          <span className="font-medium mr-2">Submitted by:</span>
                          {item.userName} ({item.userRole})
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Date:</span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                        {item.status === "resolved" && item.resolvedAt && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Resolved on:</span>
                            {new Date(item.resolvedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 min-w-[180px]">
                      <div className="flex items-center mb-2">
                        <span className={`flex items-center px-3 py-1 rounded-full text-sm ${
                          item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          item.status === "inProgress" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.status === "pending" ? (
                            <Clock className="mr-1 h-4 w-4" />
                          ) : item.status === "inProgress" ? (
                            <AlertCircle className="mr-1 h-4 w-4" />
                          ) : (
                            <CheckCircle className="mr-1 h-4 w-4" />
                          )}
                          {item.status === "inProgress" ? "In Progress" : 
                            item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {item.status !== "inProgress" && (
                          <Button 
                            size="sm"
                            className="w-full bg-blue-500 hover:bg-blue-600"
                            onClick={() => handleStatusChange(item.id, "inProgress")}
                          >
                            Mark In Progress
                          </Button>
                        )}
                        {item.status !== "resolved" && (
                          <Button 
                            size="sm"
                            className="w-full bg-green-500 hover:bg-green-600"
                            onClick={() => handleStatusChange(item.id, "resolved")}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        {item.status !== "pending" && (
                          <Button 
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleStatusChange(item.id, "pending")}
                          >
                            Reset Status
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No feedback found</h3>
              <p className="text-sm text-gray-500 mt-1">
                No items match your current filter criteria
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilters({ status: "all", urgency: "all", facility: "all" })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
