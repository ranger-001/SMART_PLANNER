
// Mock report service

export interface ReportRequest {
  title: string;
  type: 'usage' | 'feedback' | 'proposal' | 'resource';
  department?: string;
  description?: string;
}

export interface Report {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'usage' | 'feedback' | 'proposal' | 'resource';
  department: string;
  author: string;
  downloadCount: number;
  status: 'generating' | 'completed';
}

// Mock function to generate a new report
export const generateReport = async (request: ReportRequest, userId: string, userName: string): Promise<Report> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const newReport = {
    id: `report-${Date.now()}`,
    title: request.title,
    date: new Date().toISOString(),
    description: request.description || `Automatically generated report based on data analysis for ${request.type} metrics.`,
    type: request.type,
    department: request.department || 'General',
    author: userName,
    downloadCount: 0,
    status: 'completed' as const
  };
  
  return newReport;
};

// Mock function to get user reports
export const getUserReports = async (userId: string): Promise<Report[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, this would filter by user ID from the database
  return [
    {
      id: "user-report-1",
      title: "Student Feedback Analysis - Engineering Department",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      description: "Analysis of student feedback for the Engineering department facilities",
      type: "feedback",
      department: "Engineering",
      author: "Current User",
      downloadCount: 3,
      status: 'completed'
    },
    {
      id: "user-report-2",
      title: "Computer Lab Usage Patterns",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
      description: "Detailed analysis of computer lab usage patterns over the past semester",
      type: "usage",
      department: "Computer Science",
      author: "Current User",
      downloadCount: 1,
      status: 'completed'
    }
  ];
};
