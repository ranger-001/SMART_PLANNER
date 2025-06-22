import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { FileText, Download, Filter, Calendar, Building, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateReport, getUserReports, ReportRequest, Report } from "@/services/reportService";

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("available");
  const [filter, setFilter] = useState({
    date: "all",
    facility: "all",
    type: "all"
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportRequest, setReportRequest] = useState<ReportRequest>({
    title: "",
    type: "usage",
    department: "Computer Science",
    description: ""
  });

  // Mock data for reports with properly typed 'type' property
  const mockReports: Report[] = [
    {
      id: "1",
      title: "Monthly Facility Usage Summary",
      date: "2025-04-15",
      description: "Comprehensive analysis of all facility usage patterns during the previous month.",
      type: "usage",
      department: "Computer Science",
      author: "John Smith",
      downloadCount: 24,
      status: 'completed'
    },
    {
      id: "2",
      title: "Student Feedback Analysis Q1",
      date: "2025-04-10",
      description: "Analysis of student feedback on campus facilities for the first quarter of 2025.",
      type: "feedback",
      department: "transportation Management",
      author: "Emily",
      downloadCount: 42,
      status: 'completed'
    },
    {
      id: "3",
      title: "Campus Expansion Proposal",
      date: "2025-04-05",
      description: "A detailed proposal for expanding laboratory spaces based on AI analytics and space utilization data.",
      type: "proposal",
      department: "Computer Engineering",
      author: "Redempta Uwayezu",
      downloadCount: 18,
      status: 'completed'
    },
    {
      id: "4",
      title: "Workshop Resources Allocation",
      date: "2025-04-02",
      description: "Report on current library resource allocation and recommendations for optimization.",
      type: "resource",
      department: "Mechanical engineering",
      author: "Sarah ",
      downloadCount: 31,
      status: 'completed'
    },
    {
      id: "5",
      title: "Classroom Scheduling Efficiency",
      date: "2025-03-28",
      description: "Analysis of classroom scheduling efficiency and recommendations for improvement.",
      type: "usage",
      department: "Computer Science",
      author: "Robert Karangwa",
      downloadCount: 15,
      status: 'completed'
    }
  ];

  useEffect(() => {
    setReports(mockReports);
    
    // Load user reports
    const loadUserReports = async () => {
      if (user && user.id) {
        try {
          const userReportsData = await getUserReports(user.id);
          setUserReports(userReportsData);
        } catch (error) {
          console.error("Error loading user reports:", error);
        }
      }
      setIsLoading(false);
    };
    
    loadUserReports();
  }, [user]);

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    if (filter.date !== "all") {
      const reportDate = new Date(report.date);
      const today = new Date();
      
      if (filter.date === "week" && (today.getTime() - reportDate.getTime()) > 7 * 24 * 60 * 60 * 1000) {
        return false;
      }
      
      if (filter.date === "month" && (today.getTime() - reportDate.getTime()) > 30 * 24 * 60 * 60 * 1000) {
        return false;
      }
    }
    
    if (filter.facility !== "all" && report.department !== filter.facility) {
      return false;
    }
    
    if (filter.type !== "all" && report.type !== filter.type) {
      return false;
    }
    
    return true;
  });

  const handleDownload = (reportId: string) => {
    toast.success("Report download started");
    // In a real app, this would trigger an actual file download
  };
  
  const handleGenerateReport = async () => {
    if (!reportRequest.title.trim()) {
      toast.error("Please enter a report title");
      return;
    }
    
    setIsGenerating(true);
    try {
      const newReport = await generateReport(
        reportRequest, 
        user?.id || "unknown",
        user?.name || "Anonymous User"
      );
      
      // Add to user reports
      setUserReports(prev => [newReport, ...prev]);
      setIsDialogOpen(false);
      toast.success("Report generation initiated. You will be notified when it's ready.");
      
      // Reset form
      setReportRequest({
        title: "",
        type: "usage",
        department: "Computer Science",
        description: ""
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
            <p className="text-gray-600 mt-1">
              Access and generate reports on campus facility usage and feedback
            </p>
          </div>
          <Button 
            className="bg-urblue hover:bg-urblue-dark"
            onClick={() => setIsDialogOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>

        {/* Report Generation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>
                Create a new report based on campus data analysis.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input 
                  id="reportTitle"
                  value={reportRequest.title}
                  onChange={(e) => setReportRequest({...reportRequest, title: e.target.value})}
                  placeholder="Enter report title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select 
                  value={reportRequest.type}
                  onValueChange={(value) => setReportRequest({...reportRequest, type: value as ReportRequest["type"]})}
                >
                  <SelectTrigger id="reportType">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usage">Usage Analysis</SelectItem>
                    <SelectItem value="feedback">Feedback Analysis</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="resource">Resource Allocation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportDepartment">Department</Label>
                <Select 
                  value={reportRequest.department}
                  onValueChange={(value) => setReportRequest({...reportRequest, department: value})}
                >
                  <SelectTrigger id="reportDepartment">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="Library Sciences">Library Sciences</SelectItem>
                    <SelectItem value="General">General (All Departments)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reportDescription">Description (Optional)</Label>
                <Textarea 
                  id="reportDescription"
                  value={reportRequest.description || ""}
                  onChange={(e) => setReportRequest({...reportRequest, description: e.target.value})}
                  placeholder="Enter additional details or requirements for this report"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex space-x-2 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "available" ? "border-b-2 border-urblue text-urblue" : "text-gray-600"}`}
            onClick={() => setActiveTab("available")}
          >
            Available Reports
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "submitted" ? "border-b-2 border-urblue text-urblue" : "text-gray-600"}`}
            onClick={() => setActiveTab("submitted")}
          >
            My Submitted Reports
          </button>
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
                <label htmlFor="date-filter" className="block text-sm font-medium mb-1">Date Range</label>
                <select
                  id="date-filter"
                  className="w-full border rounded-md px-3 py-2"
                  value={filter.date}
                  onChange={(e) => setFilter({...filter, date: e.target.value})}
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                </select>
              </div>
              <div>
                <label htmlFor="facility-filter" className="block text-sm font-medium mb-1">Department</label>
                <select
                  id="facility-filter"
                  className="w-full border rounded-md px-3 py-2"
                  value={filter.facility}
                  onChange={(e) => setFilter({...filter, facility: e.target.value})}
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Management">Management</option>
                  <option value="Library Sciences">Library Sciences</option>
                </select>
              </div>
              <div>
                <label htmlFor="type-filter" className="block text-sm font-medium mb-1">Report Type</label>
                <select
                  id="type-filter"
                  className="w-full border rounded-md px-3 py-2"
                  value={filter.type}
                  onChange={(e) => setFilter({...filter, type: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="usage">Usage Analysis</option>
                  <option value="feedback">Feedback Analysis</option>
                  <option value="proposal">Proposals</option>
                  <option value="resource">Resource Allocation</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {activeTab === "available" ? (
          filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports.map(report => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <p className="text-gray-600 mt-2 mb-4">{report.description}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-1">Date:</span>
                            {new Date(report.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-1">Department:</span>
                            {report.department}
                          </div>
                          <div className="flex items-center">
                            <ClipboardCheck className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-1">Author:</span>
                            {report.author}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button 
                          className="bg-urblue hover:bg-urblue-dark flex items-center"
                          onClick={() => handleDownload(report.id)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          {report.downloadCount} downloads
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <FileText className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No reports found</h3>
              <p className="text-sm text-gray-500 mt-1">
                No reports match your current filter criteria
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFilter({ date: "all", facility: "all", type: "all" })}
              >
                Clear Filters
              </Button>
            </div>
          )
        ) : (
          isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
            </div>
          ) : userReports.length > 0 ? (
            <div className="space-y-4">
              {userReports.map(report => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {report.status === 'generating' ? 'Generating' : 'Completed'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2 mb-4">{report.description}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-1">Date:</span>
                            {new Date(report.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-1">Department:</span>
                            {report.department}
                          </div>
                          <div className="flex items-center">
                            <ClipboardCheck className="h-4 w-4 mr-1" />
                            <span className="font-medium mr-1">Type:</span>
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button 
                          className="bg-urblue hover:bg-urblue-dark flex items-center"
                          onClick={() => handleDownload(report.id)}
                          disabled={report.status === 'generating'}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          {report.downloadCount} downloads
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <FileText className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No submitted reports</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-md text-center">
                You haven't submitted any reports yet
              </p>
              <Button 
                className="mt-4 bg-urblue hover:bg-urblue-dark"
                onClick={() => setIsDialogOpen(true)}
              >
                Submit Your First Report
              </Button>
            </div>
          )
        )}
      </div>
    </Layout>
  );
};

export default Reports;

