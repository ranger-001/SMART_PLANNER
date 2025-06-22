
// Mock feedback data service

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'staff' | 'admin';
  facilityId: string;
  facilityName: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'inProgress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  category: 'maintenance' | 'cleanliness' | 'equipment' | 'noise' | 'temperature' | 'other';
  attachments?: string[];
  comments?: {
    id: string;
    userId: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
}

const mockFeedback: FeedbackItem[] = [
  {
    id: "fb-001",
    userId: "3",
    userName: "Student User",
    userRole: "student",
    facilityId: "fac-001",
    facilityName: "Main Lecture Hall",
    description: "The projector is flickering and making it difficult to see presentations.",
    urgency: "high",
    status: "inProgress",
    createdAt: "2025-02-15T10:30:00Z",
    assignedTo: "2",
    category: "equipment",
    comments: [
      {
        id: "c1",
        userId: "2",
        userName: "Staff Member",
        text: "We've ordered a replacement bulb. Should be fixed by next week.",
        createdAt: "2025-02-16T14:20:00Z"
      }
    ]
  },
  {
    id: "fb-002",
    userId: "3",
    userName: "Student User",
    userRole: "student",
    facilityId: "fac-002",
    facilityName: "Computer Lab A",
    description: "Five computers in the back row are not turning on.",
    urgency: "medium",
    status: "pending",
    createdAt: "2025-02-17T09:15:00Z",
    category: "equipment"
  },
  {
    id: "fb-003",
    userId: "2",
    userName: "Staff Member",
    userRole: "staff",
    facilityId: "fac-005",
    facilityName: "Sports Complex",
    description: "The swimming pool water needs to be changed. It appears cloudy.",
    urgency: "medium",
    status: "resolved",
    createdAt: "2025-02-10T11:45:00Z",
    resolvedAt: "2025-02-12T15:30:00Z",
    category: "maintenance",
    comments: [
      {
        id: "c2",
        userId: "1",
        userName: "Admin User",
        text: "Maintenance team has been notified. They will address this tomorrow.",
        createdAt: "2025-02-10T13:20:00Z"
      },
      {
        id: "c3",
        userId: "2",
        userName: "Staff Member",
        text: "Thank you for the quick response.",
        createdAt: "2025-02-10T14:05:00Z"
      }
    ]
  },
  {
    id: "fb-004",
    userId: "3",
    userName: "Student User",
    userRole: "student",
    facilityId: "fac-006",
    facilityName: "Student Hostel A",
    description: "The common kitchen microwave is not working.",
    urgency: "low",
    status: "resolved",
    createdAt: "2025-02-05T16:20:00Z",
    resolvedAt: "2025-02-08T10:15:00Z",
    category: "equipment"
  },
  {
    id: "fb-005",
    userId: "3",
    userName: "Student User",
    userRole: "student",
    facilityId: "fac-004",
    facilityName: "Central Library",
    description: "The air conditioning in the study area is too cold.",
    urgency: "low",
    status: "pending",
    createdAt: "2025-02-18T13:40:00Z",
    category: "temperature"
  },
  {
    id: "fb-006",
    userId: "2",
    userName: "Staff Member",
    userRole: "staff",
    facilityId: "fac-003",
    facilityName: "Chemistry Laboratory",
    description: "One of the fume hoods is not functioning properly.",
    urgency: "high",
    status: "inProgress",
    createdAt: "2025-02-16T08:30:00Z",
    category: "equipment",
    assignedTo: "1"
  },
  {
    id: "fb-007",
    userId: "3",
    userName: "Student User",
    userRole: "student",
    facilityId: "fac-008",
    facilityName: "Student Center Cafeteria",
    description: "The cafeteria is not being cleaned properly at the end of the day.",
    urgency: "medium",
    status: "pending",
    createdAt: "2025-02-17T17:10:00Z",
    category: "cleanliness"
  },
  {
    id: "fb-008",
    userId: "2",
    userName: "Staff Member",
    userRole: "staff",
    facilityId: "fac-010",
    facilityName: "Small Lecture Room B",
    description: "There's excessive noise from construction outside that disrupts classes.",
    urgency: "medium",
    status: "inProgress",
    createdAt: "2025-02-15T11:20:00Z",
    category: "noise",
    assignedTo: "1"
  }
];

// Simulate API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllFeedback = async (): Promise<FeedbackItem[]> => {
  await delay(800); // Simulate network delay
  return [...mockFeedback];
};

export const getFeedbackById = async (id: string): Promise<FeedbackItem | undefined> => {
  await delay(500);
  return mockFeedback.find(item => item.id === id);
};

export const getUserFeedback = async (userId: string): Promise<FeedbackItem[]> => {
  await delay(700);
  return mockFeedback.filter(item => item.userId === userId);
};

export const createFeedback = async (feedback: Omit<FeedbackItem, 'id' | 'createdAt'>): Promise<FeedbackItem> => {
  await delay(1000);
  const newFeedback: FeedbackItem = {
    id: `fb-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    ...feedback
  };
  
  // In a real app, this would add to the database
  // For the mock version, we'll just return the new feedback
  return newFeedback;
};

export const updateFeedbackStatus = async (id: string, status: 'pending' | 'inProgress' | 'resolved', assignedTo?: string): Promise<FeedbackItem> => {
  await delay(1000);
  const feedbackIndex = mockFeedback.findIndex(item => item.id === id);
  
  if (feedbackIndex === -1) {
    throw new Error('Feedback not found');
  }
  
  const updatedFeedback = {
    ...mockFeedback[feedbackIndex],
    status,
    assignedTo: assignedTo || mockFeedback[feedbackIndex].assignedTo,
    resolvedAt: status === 'resolved' ? new Date().toISOString() : mockFeedback[feedbackIndex].resolvedAt
  };
  
  // In a real app, this would update the database
  // For the mock version, we'll just return the updated feedback
  return updatedFeedback;
};

export const addFeedbackComment = async (feedbackId: string, userId: string, userName: string, text: string): Promise<FeedbackItem> => {
  await delay(800);
  const feedbackIndex = mockFeedback.findIndex(item => item.id === feedbackId);
  
  if (feedbackIndex === -1) {
    throw new Error('Feedback not found');
  }
  
  const comment = {
    id: `c${Date.now()}`,
    userId,
    userName,
    text,
    createdAt: new Date().toISOString()
  };
  
  const updatedComments = [
    ...(mockFeedback[feedbackIndex].comments || []),
    comment
  ];
  
  const updatedFeedback = {
    ...mockFeedback[feedbackIndex],
    comments: updatedComments
  };
  
  // In a real app, this would update the database
  // For the mock version, we'll just return the updated feedback
  return updatedFeedback;
};
