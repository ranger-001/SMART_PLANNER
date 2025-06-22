
// Mock analytics data service

export interface AnalyticsData {
  overallUtilization: number; // percentage
  monthlyUtilizationData: {
    name: string; // month
    utilization: number; // percentage
  }[];
  facilityTypeData: {
    name: string; // type
    value: number; // percentage
  }[];
  feedbackByCategory: {
    category: string;
    count: number;
  }[];
  utilizationByTimeOfDay: {
    time: string;
    utilization: number; // percentage
  }[];
  savingsPotential: {
    cost: number; // currency
    space: number; // sq ft
    time: number; // hours
  };
  topFacilities: {
    id: string;
    name: string;
    utilization: number; // percentage
  }[];
  lowUtilizedFacilities: {
    id: string;
    name: string;
    utilization: number; // percentage
  }[];
}

const mockAnalyticsData: AnalyticsData = {
  overallUtilization: 72,
  monthlyUtilizationData: [
    { name: 'Jan', utilization: 65 },
    { name: 'Feb', utilization: 70 },
    { name: 'Mar', utilization: 75 },
    { name: 'Apr', utilization: 80 },
    { name: 'May', utilization: 85 },
    { name: 'Jun', utilization: 60 },
    { name: 'Jul', utilization: 50 },
    { name: 'Aug', utilization: 55 },
    { name: 'Sep', utilization: 78 },
    { name: 'Oct', utilization: 82 },
    { name: 'Nov', utilization: 78 },
    { name: 'Dec', utilization: 68 }
  ],
  facilityTypeData: [
    { name: 'Classrooms', value: 35 },
    { name: 'Laboratories', value: 25 },
    { name: 'Libraries', value: 15 },
    { name: 'Offices', value: 10 },
    { name: 'Recreational', value: 8 },
    { name: 'Hostels', value: 7 }
  ],
  feedbackByCategory: [
    { category: 'Equipment', count: 35 },
    { category: 'Maintenance', count: 28 },
    { category: 'Cleanliness', count: 22 },
    { category: 'Temperature', count: 15 },
    { category: 'Noise', count: 10 },
    { category: 'Other', count: 5 }
  ],
  utilizationByTimeOfDay: [
    { time: '8am', utilization: 45 },
    { time: '10am', utilization: 75 },
    { time: '12pm', utilization: 85 },
    { time: '2pm', utilization: 90 },
    { time: '4pm', utilization: 70 },
    { time: '6pm', utilization: 45 },
    { time: '8pm', utilization: 25 }
  ],
  savingsPotential: {
    cost: 125000, // Annual currency savings
    space: 1500, // Square feet that could be better utilized
    time: 2800 // Hours of improved availability per year
  },
  topFacilities: [
    { id: 'fac-001', name: 'Main Lecture Hall', utilization: 92 },
    { id: 'fac-002', name: 'Computer Lab A', utilization: 89 },
    { id: 'fac-006', name: 'Student Hostel A', utilization: 85 },
    { id: 'fac-004', name: 'Central Library', utilization: 82 },
    { id: 'fac-008', name: 'Student Center Cafeteria', utilization: 78 }
  ],
  lowUtilizedFacilities: [
    { id: 'fac-007', name: 'Faculty Office Building', utilization: 45 },
    { id: 'fac-003', name: 'Chemistry Laboratory', utilization: 50 },
    { id: 'fac-005', name: 'Sports Complex', utilization: 55 },
    { id: 'fac-010', name: 'Small Lecture Room B', utilization: 60 },
    { id: 'fac-009', name: 'Engineering Workshop', utilization: 65 }
  ]
};

// Simulate API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  await delay(1200); // Simulate network delay for complex data
  return { ...mockAnalyticsData };
};

export const getFacilityUtilizationByDate = async (facilityId: string, startDate: string, endDate: string): Promise<{ date: string; utilization: number }[]> => {
  await delay(1000);
  
  // Generate random utilization data for the requested date range
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  
  const result = [];
  const currentDate = new Date(start);
  
  for (let i = 0; i < dayDiff; i++) {
    result.push({
      date: currentDate.toISOString().split('T')[0],
      utilization: Math.floor(Math.random() * 30) + 50 // Random between 50-80%
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
};

export const getFeedbackAnalyticsByTimeframe = async (timeframe: 'week' | 'month' | 'quarter' | 'year'): Promise<{ date: string; count: number }[]> => {
  await delay(1000);
  
  let dataPoints: number;
  let dateFormat: string;
  
  switch (timeframe) {
    case 'week':
      dataPoints = 7;
      dateFormat = 'day';
      break;
    case 'month':
      dataPoints = 30;
      dateFormat = 'day';
      break;
    case 'quarter':
      dataPoints = 12;
      dateFormat = 'week';
      break;
    case 'year':
    default:
      dataPoints = 12;
      dateFormat = 'month';
      break;
  }
  
  const result = [];
  const currentDate = new Date();
  
  for (let i = 0; i < dataPoints; i++) {
    let label: string;
    
    if (dateFormat === 'day') {
      label = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dateFormat === 'week') {
      label = `Week ${i+1}`;
    } else {
      label = currentDate.toLocaleDateString('en-US', { month: 'short' });
      currentDate.setMonth(currentDate.getMonth() - 1);
    }
    
    result.unshift({
      date: label,
      count: Math.floor(Math.random() * 10) + 5 // Random between 5-15
    });
  }
  
  return result;
};

export const getAIEffectivenessMetrics = async (): Promise<{
  recommendationsImplemented: number;
  totalSavings: number;
  spaceOptimized: number;
  availabilityIncreased: number;
  userSatisfactionBefore: number;
  userSatisfactionAfter: number;
}> => {
  await delay(800);
  
  return {
    recommendationsImplemented: 24,
    totalSavings: 185000,
    spaceOptimized: 2800, // sq ft
    availabilityIncreased: 1450, // hours per year
    userSatisfactionBefore: 72, // percentage
    userSatisfactionAfter: 88 // percentage
  };
};
