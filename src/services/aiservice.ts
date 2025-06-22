// Mock AI recommendations service

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'expansion' | 'relocation' | 'maintenance' | 'scheduling' | 'optimization';
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  createdAt: string;
  facilityId?: string;
  facilityName?: string;
  department?: string;
  savings?: {
    cost: number;
    space: number;
    time: number;
  };
  implementation?: {
    difficulty: 'easy' | 'medium' | 'complex';
    timeFrame: 'immediate' | 'short-term' | 'long-term';
    estimatedCost?: number;
  };
  aiConfidence: number; // 0-100
  reviewComments?: {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
}

// New interface for predictive models
export interface InfrastructurePrediction {
  id: string;
  title: string;
  year: number;
  projectedStudentCount: number;
  currentCapacity: number;
  recommendedCapacity: number;
  infrastructureType: 'classroom' | 'lab' | 'parking' | 'hostel' | 'library' | 'office' | 'restaurant' | 'recreation' | 'printing';
  priority: 'critical' | 'high' | 'medium' | 'low';
  details: {
    currentUtilization: number; // percentage
    projectedUtilization: number; // percentage without changes
    recommendedAction: 'expand' | 'build' | 'renovate' | 'optimize' | 'maintain';
    estimatedCost: number;
    spaceNeeded: number; // square feet
    implementationTimeframe?: string; // Adding this property to fix the TypeScript error
  };
  impactFactors: {
    studentGrowth: number; // percentage
    utilizationTrend: number; // percentage
    feedbackScore: number; // 0-100
    maintenanceStatus: 'excellent' | 'good' | 'fair' | 'poor';
  };
  aiConfidence: number; // 0-100
  createdAt: string;
  datasetApplied?: {
    id: string;
    name: string;
    source: string;
  };
}

// Types for campus planning datasets
export interface CampusPlanningDataset {
  id: string;
  name: string;
  description: string;
  source: string;
  lastUpdated: string;
  metrics: {
    studentGrowthRate: number;
    averageUtilization: number;
    infrastructureExpansionRate: number;
  };
  dataPoints: number;
  tags: string[];
}

// Mock datasets that would normally be fetched from an external API
const mockCampusDatasets: CampusPlanningDataset[] = [
  {
    id: "ds-001",
    name: "US Public Universities Space Planning 2020-2023",
    description: "Comprehensive space utilization and planning data from 50 major public universities in the United States",
    source: "National Center for Education Statistics",
    lastUpdated: "2023-12-10",
    metrics: {
      studentGrowthRate: 2.7,
      averageUtilization: 68.4,
      infrastructureExpansionRate: 1.8
    },
    dataPoints: 4250,
    tags: ["public", "universities", "space utilization", "classroom planning"]
  },
  {
    id: "ds-002",
    name: "Higher Education Facilities Growth Trends",
    description: "Analysis of facility expansion patterns across 120 educational institutions over 5 years",
    source: "Society for College and University Planning",
    lastUpdated: "2024-02-15",
    metrics: {
      studentGrowthRate: 3.1,
      averageUtilization: 71.2,
      infrastructureExpansionRate: 2.2
    },
    dataPoints: 3840,
    tags: ["growth trends", "facilities", "expansion", "higher education"]
  },
  {
    id: "ds-003",
    name: "African Universities Infrastructure Development 2022",
    description: "Infrastructure development patterns and student population trends across African universities",
    source: "African Higher Education Development Association",
    lastUpdated: "2023-08-22",
    metrics: {
      studentGrowthRate: 4.3,
      averageUtilization: 82.7,
      infrastructureExpansionRate: 3.5
    },
    dataPoints: 1875,
    tags: ["african universities", "infrastructure", "development", "population trends"]
  },
  {
    id: "ds-004",
    name: "Campus Sustainability & Space Efficiency Report",
    description: "Data on sustainable infrastructure planning and space efficiency metrics from global educational institutions",
    source: "International Sustainable Campus Network",
    lastUpdated: "2024-01-07",
    metrics: {
      studentGrowthRate: 1.9,
      averageUtilization: 74.6,
      infrastructureExpansionRate: 1.2
    },
    dataPoints: 2930,
    tags: ["sustainability", "space efficiency", "green campus", "resource utilization"]
  }
];

// Mock recommendations data
const mockRecommendations: AIRecommendation[] = [
  {
    id: "ai-001",
    title: "Expand Computer Lab A capacity",
    description: "Based on current utilization patterns, Computer Lab A is consistently at 90% capacity during peak hours. Recommend expanding capacity by 20% by reorganizing workstations and adding 10 new computers.",
    type: "expansion",
    impact: "high",
    status: "pending",
    createdAt: "2025-02-10T08:30:00Z",
    facilityId: "fac-002",
    facilityName: "Computer Lab A",
    department: "Computer Science",
    savings: {
      cost: 0,
      space: -50, // negative means additional space needed (sq ft)
      time: 120 // hours saved per semester in wait times
    },
    implementation: {
      difficulty: "medium",
      timeFrame: "short-term",
      estimatedCost: 15000
    },
    aiConfidence: 92
  },
  {
    id: "ai-002",
    title: "Optimize Main Lecture Hall scheduling",
    description: "Analysis shows the Main Lecture Hall is underutilized during early morning hours (8:00-10:00 AM) but over-scheduled during mid-day. Recommend shifting 30% of mid-day classes to morning slots to balance utilization.",
    type: "scheduling",
    impact: "medium",
    status: "approved",
    createdAt: "2025-02-05T14:15:00Z",
    facilityId: "fac-001",
    facilityName: "Main Lecture Hall",
    savings: {
      cost: 5000, // annual utilities savings from balanced usage
      space: 0,
      time: 0
    },
    implementation: {
      difficulty: "easy",
      timeFrame: "immediate"
    },
    aiConfidence: 88,
    reviewComments: [
      {
        id: "rc-001",
        userId: "1",
        userName: "Admin User",
        text: "This is a good suggestion. We'll implement it in the next semester schedule.",
        createdAt: "2025-02-06T09:20:00Z"
      }
    ]
  },
  {
    id: "ai-003",
    title: "Maintenance schedule adjustment for Chemistry Laboratory",
    description: "Current maintenance schedule conflicts with high-demand periods. Recommend shifting maintenance to weekend hours when utilization is 75% lower.",
    type: "maintenance",
    impact: "medium",
    status: "flagged",
    createdAt: "2025-02-12T10:45:00Z",
    facilityId: "fac-003",
    facilityName: "Chemistry Laboratory",
    department: "Chemistry",
    savings: {
      cost: 0,
      space: 0,
      time: 48 // hours of additional availability per semester
    },
    implementation: {
      difficulty: "easy",
      timeFrame: "immediate"
    },
    aiConfidence: 95,
    reviewComments: [
      {
        id: "rc-002",
        userId: "2",
        userName: "Staff Member",
        text: "Need to check if maintenance staff is available on weekends before approving.",
        createdAt: "2025-02-13T11:30:00Z"
      }
    ]
  },
  {
    id: "ai-004",
    title: "Convert underutilized storage space to additional study areas",
    description: "Storage room adjacent to the Central Library is used at less than 40% capacity. Given high demand for study spaces, recommend converting 60% of this space to create 3 new group study rooms.",
    type: "relocation",
    impact: "high",
    status: "pending",
    createdAt: "2025-02-14T09:10:00Z",
    facilityId: "fac-004",
    facilityName: "Central Library",
    savings: {
      cost: 0,
      space: 400, // sq ft repurposed
      time: 360 // hours of study space added per semester
    },
    implementation: {
      difficulty: "medium",
      timeFrame: "short-term",
      estimatedCost: 25000
    },
    aiConfidence: 84
  },
  {
    id: "ai-005",
    title: "Install smart lighting and temperature controls in Student Hostel A",
    description: "Energy usage analysis shows Student Hostel A consumes 30% more electricity than average. Recommend installing smart controls to optimize lighting and temperature, with an estimated ROI within 14 months.",
    type: "optimization",
    impact: "medium",
    status: "rejected",
    createdAt: "2025-02-08T13:20:00Z",
    facilityId: "fac-006",
    facilityName: "Student Hostel A",
    savings: {
      cost: 12000, // annual savings
      space: 0,
      time: 0
    },
    implementation: {
      difficulty: "medium",
      timeFrame: "short-term",
      estimatedCost: 18000
    },
    aiConfidence: 90,
    reviewComments: [
      {
        id: "rc-003",
        userId: "1",
        userName: "Admin User",
        text: "Budget constraints require postponing this to next fiscal year.",
        createdAt: "2025-02-09T10:15:00Z"
      }
    ]
  },
  {
    id: "ai-006",
    title: "Reallocate Faculty Office Building space",
    description: "Office utilization study shows 25% of offices are used less than 2 days per week. Recommend implementing shared office model for part-time faculty to free up 8 offices for other purposes.",
    type: "optimization",
    impact: "medium",
    status: "pending",
    createdAt: "2025-02-15T11:30:00Z",
    facilityId: "fac-007",
    facilityName: "Faculty Office Building",
    savings: {
      cost: 0,
      space: 600, // sq ft freed
      time: 0
    },
    implementation: {
      difficulty: "complex",
      timeFrame: "long-term"
    },
    aiConfidence: 78
  },
  {
    id: "ai-007",
    title: "Upgrade Engineering Workshop safety equipment",
    description: "Predictive maintenance analysis indicates 60% of safety equipment will reach end-of-life within 6 months. Recommend proactive replacement to avoid disruption during mid-semester.",
    type: "maintenance",
    impact: "high",
    status: "flagged",
    createdAt: "2025-02-16T09:45:00Z",
    facilityId: "fac-009",
    facilityName: "Engineering Workshop",
    department: "Engineering",
    implementation: {
      difficulty: "medium",
      timeFrame: "short-term",
      estimatedCost: 35000
    },
    aiConfidence: 96,
    reviewComments: [
      {
        id: "rc-004",
        userId: "2",
        userName: "Staff Member",
        text: "This is critical. We should prioritize this replacement.",
        createdAt: "2025-02-16T14:20:00Z"
      }
    ]
  },
  {
    id: "ai-008",
    title: "Reduce staffing in Student Center Cafeteria during off-peak hours",
    description: "Footfall analysis shows staffing levels can be reduced by 40% between 2:00-4:00 PM without affecting service quality, resulting in significant cost savings.",
    type: "optimization",
    impact: "low",
    status: "approved",
    createdAt: "2025-02-07T15:20:00Z",
    facilityId: "fac-008",
    facilityName: "Student Center Cafeteria",
    savings: {
      cost: 15000, // annual savings
      space: 0,
      time: 0
    },
    implementation: {
      difficulty: "easy",
      timeFrame: "immediate"
    },
    aiConfidence: 89
  }
];

// Mock predictive data
const mockPredictions: InfrastructurePrediction[] = [
  {
    id: "pred-001",
    title: "Classroom Expansion Needed by 2026",
    year: 2026,
    projectedStudentCount: 3500,
    currentCapacity: 2800,
    recommendedCapacity: 3600,
    infrastructureType: "classroom",
    priority: "high",
    details: {
      currentUtilization: 86,
      projectedUtilization: 107,
      recommendedAction: "expand",
      estimatedCost: 450000,
      spaceNeeded: 4500
    },
    impactFactors: {
      studentGrowth: 12.5,
      utilizationTrend: 8.3,
      feedbackScore: 76,
      maintenanceStatus: "good"
    },
    aiConfidence: 92,
    createdAt: "2025-04-12T08:30:00Z"
  },
  {
    id: "pred-002",
    title: "Parking Capacity Shortfall Expected by 2027",
    year: 2027,
    projectedStudentCount: 3800,
    currentCapacity: 420,
    recommendedCapacity: 580,
    infrastructureType: "parking",
    priority: "medium",
    details: {
      currentUtilization: 92,
      projectedUtilization: 118,
      recommendedAction: "build",
      estimatedCost: 280000,
      spaceNeeded: 12000
    },
    impactFactors: {
      studentGrowth: 8.5,
      utilizationTrend: 15.2,
      feedbackScore: 68,
      maintenanceStatus: "fair"
    },
    aiConfidence: 88,
    createdAt: "2025-04-10T13:45:00Z"
  },
  {
    id: "pred-003",
    title: "Additional Student Hostels Required by 2026",
    year: 2026,
    projectedStudentCount: 3500,
    currentCapacity: 1200,
    recommendedCapacity: 1500,
    infrastructureType: "hostel",
    priority: "critical",
    details: {
      currentUtilization: 98,
      projectedUtilization: 125,
      recommendedAction: "build",
      estimatedCost: 1800000,
      spaceNeeded: 25000
    },
    impactFactors: {
      studentGrowth: 12.5,
      utilizationTrend: 10.8,
      feedbackScore: 62,
      maintenanceStatus: "fair"
    },
    aiConfidence: 94,
    createdAt: "2025-04-08T11:20:00Z"
  },
  {
    id: "pred-004",
    title: "Library Expansion Recommended by 2027",
    year: 2027,
    projectedStudentCount: 3800,
    currentCapacity: 600,
    recommendedCapacity: 750,
    infrastructureType: "library",
    priority: "medium",
    details: {
      currentUtilization: 87,
      projectedUtilization: 104,
      recommendedAction: "expand",
      estimatedCost: 650000,
      spaceNeeded: 5800
    },
    impactFactors: {
      studentGrowth: 8.5,
      utilizationTrend: 7.2,
      feedbackScore: 82,
      maintenanceStatus: "good"
    },
    aiConfidence: 86,
    createdAt: "2025-04-05T09:15:00Z"
  },
  {
    id: "pred-005",
    title: "Laboratory Modernization and Expansion by 2026",
    year: 2026,
    projectedStudentCount: 3500,
    currentCapacity: 850,
    recommendedCapacity: 950,
    infrastructureType: "lab",
    priority: "high",
    details: {
      currentUtilization: 91,
      projectedUtilization: 108,
      recommendedAction: "renovate",
      estimatedCost: 780000,
      spaceNeeded: 2800
    },
    impactFactors: {
      studentGrowth: 12.5,
      utilizationTrend: 9.4,
      feedbackScore: 74,
      maintenanceStatus: "fair"
    },
    aiConfidence: 90,
    createdAt: "2025-04-14T10:30:00Z"
  },
  {
    id: "pred-006",
    title: "Restaurant Capacity Increase Needed by 2027",
    year: 2027,
    projectedStudentCount: 3800,
    currentCapacity: 350,
    recommendedCapacity: 480,
    infrastructureType: "restaurant",
    priority: "medium",
    details: {
      currentUtilization: 95,
      projectedUtilization: 115,
      recommendedAction: "expand",
      estimatedCost: 320000,
      spaceNeeded: 3200
    },
    impactFactors: {
      studentGrowth: 8.5,
      utilizationTrend: 12.3,
      feedbackScore: 71,
      maintenanceStatus: "good"
    },
    aiConfidence: 89,
    createdAt: "2025-04-07T14:20:00Z"
  },
  {
    id: "pred-007",
    title: "Office Space Optimization Required by 2026",
    year: 2026,
    projectedStudentCount: 3500,
    currentCapacity: 180,
    recommendedCapacity: 210,
    infrastructureType: "office",
    priority: "low",
    details: {
      currentUtilization: 82,
      projectedUtilization: 98,
      recommendedAction: "optimize",
      estimatedCost: 120000,
      spaceNeeded: 1500
    },
    impactFactors: {
      studentGrowth: 12.5,
      utilizationTrend: 5.8,
      feedbackScore: 79,
      maintenanceStatus: "excellent"
    },
    aiConfidence: 84,
    createdAt: "2025-04-09T11:45:00Z"
  }
];

// Simulate API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAIRecommendations = async (): Promise<AIRecommendation[]> => {
  await delay(800); // Simulate network delay
  return [...mockRecommendations];
};

export const getAIRecommendationById = async (id: string): Promise<AIRecommendation | undefined> => {
  await delay(500);
  return mockRecommendations.find(rec => rec.id === id);
};

export const getAIRecommendationsByFacility = async (facilityId: string): Promise<AIRecommendation[]> => {
  await delay(700);
  return mockRecommendations.filter(rec => rec.facilityId === facilityId);
};

export const getAIRecommendationsByDepartment = async (department: string): Promise<AIRecommendation[]> => {
  await delay(700);
  return mockRecommendations.filter(rec => rec.department === department);
};

export const updateAIRecommendationStatus = async (id: string, status: 'pending' | 'approved' | 'rejected' | 'flagged'): Promise<AIRecommendation> => {
  await delay(1000);
  const recIndex = mockRecommendations.findIndex(rec => rec.id === id);
  
  if (recIndex === -1) {
    throw new Error('Recommendation not found');
  }
  
  const updatedRec = {
    ...mockRecommendations[recIndex],
    status
  };
  
  // In a real app, this would update the database
  // For the mock version, we'll just return the updated recommendation
  return updatedRec;
};

export const addAIRecommendationComment = async (recId: string, userId: string, userName: string, text: string): Promise<AIRecommendation> => {
  await delay(800);
  const recIndex = mockRecommendations.findIndex(rec => rec.id === recId);
  
  if (recIndex === -1) {
    throw new Error('Recommendation not found');
  }
  
  const comment = {
    id: `rc-${Date.now()}`,
    userId,
    userName,
    text,
    createdAt: new Date().toISOString()
  };
  
  const updatedComments = [
    ...(mockRecommendations[recIndex].reviewComments || []),
    comment
  ];
  
  const updatedRec = {
    ...mockRecommendations[recIndex],
    reviewComments: updatedComments
  };
  
  // In a real app, this would update the database
  // For the mock version, we'll just return the updated recommendation
  return updatedRec;
};

// New functions for predictive planning

export const getInfrastructurePredictions = async (): Promise<InfrastructurePrediction[]> => {
  await delay(1000);
  return [...mockPredictions];
};

export const getInfrastructurePredictionById = async (id: string): Promise<InfrastructurePrediction | undefined> => {
  await delay(600);
  return mockPredictions.find(pred => pred.id === id);
};

export const getInfrastructurePredictionsByType = async (type: string): Promise<InfrastructurePrediction[]> => {
  await delay(800);
  return mockPredictions.filter(pred => pred.infrastructureType === type);
};

export const getInfrastructurePredictionsByYear = async (year: number): Promise<InfrastructurePrediction[]> => {
  await delay(800);
  return mockPredictions.filter(pred => pred.year === year);
};

export const getInfrastructurePredictionsByPriority = async (priority: string): Promise<InfrastructurePrediction[]> => {
  await delay(700);
  return mockPredictions.filter(pred => pred.priority === priority);
};

export const generateNewPrediction = async (params: {
  studentGrowth: number;
  infrastructureType: string;
  yearRange: number;
}): Promise<InfrastructurePrediction> => {
  await delay(2000); // Simulating complex AI calculation
  
  // This would be a real AI-based prediction in a production app
  // Here we'll just return a mock prediction based on params
  const predictionTemplate = mockPredictions.find(p => p.infrastructureType === params.infrastructureType) || mockPredictions[0];
  
  return {
    ...predictionTemplate,
    id: `pred-${Date.now()}`,
    year: new Date().getFullYear() + params.yearRange,
    projectedStudentCount: Math.round(3200 * (1 + params.studentGrowth / 100)),
    impactFactors: {
      ...predictionTemplate.impactFactors,
      studentGrowth: params.studentGrowth
    },
    createdAt: new Date().toISOString()
  };
};

// Function to get available campus planning datasets
export const getAvailableCampusDatasets = async (): Promise<CampusPlanningDataset[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockCampusDatasets;
};

// Function to apply dataset insights to a prediction
export const applyDatasetToPrediction = async (
  datasetId: string,
  predictionId: string
): Promise<InfrastructurePrediction> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Find the selected dataset
  const dataset = mockCampusDatasets.find(ds => ds.id === datasetId);
  
  if (!dataset) {
    throw new Error("Dataset not found");
  }
  
  // In a real implementation, this would apply actual insights from the dataset
  // to the prediction algorithm and return enhanced results
  const enhancedPrediction: InfrastructurePrediction = {
    id: predictionId,
    title: `Enhanced Prediction (using ${dataset.name})`,
    infrastructureType: "classroom",
    year: new Date().getFullYear() + 2,
    currentCapacity: 5000,
    recommendedCapacity: Math.round(5000 * (1 + dataset.metrics.infrastructureExpansionRate/100)),
    projectedStudentCount: Math.round(10000 * (1 + dataset.metrics.studentGrowthRate/100)),
    priority: dataset.metrics.averageUtilization > 75 ? "high" : "medium",
    aiConfidence: 87,
    details: {
      currentUtilization: dataset.metrics.averageUtilization, // Added the missing property
      projectedUtilization: dataset.metrics.averageUtilization * 1.15, // Added the missing property
      recommendedAction: "expand",
      estimatedCost: 2800000,
      spaceNeeded: 15000,
      implementationTimeframe: "18 months" // This property exists now in the interface
    },
    impactFactors: {
      studentGrowth: dataset.metrics.studentGrowthRate,
      utilizationTrend: dataset.metrics.averageUtilization,
      feedbackScore: 82,
      maintenanceStatus: "good"
    },
    createdAt: new Date().toISOString(),
    datasetApplied: {
      id: dataset.id,
      name: dataset.name,
      source: dataset.source
    }
  };
  
  return enhancedPrediction;
};

// Function to save a prediction model with dataset inputs
export const saveCustomPredictionModel = async (
  name: string,
  description: string,
  datasetIds: string[],
  parameters: Record<string, any>
): Promise<{ id: string, name: string, success: boolean }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: `model-${Math.random().toString(36).substring(2, 9)}`,
    name,
    success: true
  };
};
