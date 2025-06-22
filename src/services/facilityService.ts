
// Mock facility data service

export interface Facility {
  id: string;
  name: string;
  type: 'classroom' | 'laboratory' | 'office' | 'library' | 'recreational' | 'hostel' | 'cafeteria';
  location: string;
  capacity: number;
  currentOccupancy: number;
  department?: string;
  status: 'operational' | 'maintenance' | 'construction' | 'closed';
  lastMaintenanceDate?: string;
  features: string[];
  images?: string[];
  description?: string;
  assignedTo?: string[];
}

const mockFacilities: Facility[] = [
  {
    id: "fac-001",
    name: "MUHABURA",
    type: "classroom",
    location: "Main Building, Ground Floor",
    capacity: 200,
    currentOccupancy: 150,
    department: "Computer Science",
    status: "operational",
    lastMaintenanceDate: "2024-12-15",
    features: ["Projector", "Lighting", "Smart Board"],
    description: "Largest lecture hall on campus, used for major presentations and events."
  },
  {
    id: "fac-002",
    name: "kalisimbi Computer Lab 3f 10",
    type: "laboratory",
    location: "ICT Building, First Floor",
    capacity: 50,
    currentOccupancy: 45,
    department: "Computer Science",
    status: "operational",
    lastMaintenanceDate: "2025-01-10",
    features: ["30 Computers", "Software Development Tools", "Networking Equipment"],
    description: "Primary computer lab for programming classes and software development."
  },
  {
    id: "fac-003",
    name: "kalisimbi Chemistry Laboratory",
    type: "laboratory",
    location: "Science Building, Second Floor",
    capacity: 40,
    currentOccupancy: 20,
    department: "Chemistry",
    status: "maintenance",
    lastMaintenanceDate: "2024-11-05",
    features: ["Chemical Storage", "Fume Hoods", "Safety Equipment"],
    description: "Used for undergraduate chemistry experiments and research."
  },
  {
    id: "fac-004",
    name: "Main Library",
    type: "library",
    location: "Campus Library Building",
    capacity: 300,
    currentOccupancy: 210,
    status: "operational",
    lastMaintenanceDate: "2024-12-20",
    features: ["Study Areas", "Computer Terminals", "Book Collection", "Online Journals Access"],
    description: "Main university library with extensive collection and study spaces."
  },
  {
    id: "fac-005",
    name: "Sports play ground",
    type: "recreational",
    location: "Central Campus",
    capacity: 150,
    currentOccupancy: 75,
    status: "operational",
    features: ["Basketball Court", "Fitness Center", "Volleyball"],
    description: "Primary sports and recreation facility for students and staff."
  },
  {
    id: "fac-006",
    name: "Dusaidi Hostel A",
    type: "hostel",
    location: "At entry of Campus",
    capacity: 200,
    currentOccupancy: 190,
    status: "operational",
    lastMaintenanceDate: "2024-12-01",
    features: ["Double Rooms", "Common toilets", "Study Areas", "Wifi"],
    description: "Primary student accommodation with modern amenities."
  },
  {
    id: "fac-007",
    name: "Administration Office Building",
    type: "office",
    location: "Central Campus",
    capacity: 50,
    currentOccupancy: 45,
    status: "operational",
    features: ["Private Offices", "Conference Rooms", "Administrative Support"],
    description: "Houses faculty offices and administrative staff."
  },
  {
    id: "fac-008",
    name: "Student Center Cafeteria, and Restaurent",
    type: "cafeteria",
    location: "Student Center, Ground Floor",
    capacity: 120,
    currentOccupancy: 85,
    status: "operational",
    lastMaintenanceDate: "2025-01-05",
    features: ["Food Service", "Seating Area", "Vending Machines"],
    description: "Main dining facility for students and staff."
  },
  {
    id: "fac-009",
    name: "Engineering Workshop",
    type: "laboratory",
    location: "Engineering Building, Ground Floor",
    capacity: 35,
    currentOccupancy: 20,
    department: "Engineering",
    status: "operational",
    lastMaintenanceDate: "2024-11-20",
    features: ["Heavy Machinery", "Fabrication Tools", "Safety Equipment"],
    description: "Workshop for engineering students to build and test projects."
  },
  {
    id: "fac-010",
    name: "ClassRoom B",
    type: "classroom",
    location: "MUHABURA Building, Second Floor",
    capacity: 40,
    currentOccupancy: 35,
    department: "Geology",
    status: "operational",
    features: ["Whiteboard", "Projector"],
    description: "Lecture room for smaller classes and seminars."
  },
  {
    id: "fac-011",
    name: "Class Room c",
    type: "classroom",
    location: "Sabyinyo Building, 1st Floor",
    capacity: 40,
    currentOccupancy: 35,
    department: "Geology",
    status: "operational",
    features: ["doors", "WIndow"],
    description: "Lecture room for smaller classes and seminars."
  }
];

// Simulate API calls with delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getFacilities = async (): Promise<Facility[]> => {
  await delay(800); // Simulate network delay
  return [...mockFacilities];
};

export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
  await delay(500);
  return mockFacilities.find(facility => facility.id === id);
};

export const createFacility = async (facility: Omit<Facility, 'id'>): Promise<Facility> => {
  await delay(1000);
  const newFacility: Facility = {
    id: `fac-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    ...facility
  };
  
  // In a real app, this would add to the database
  // For the mock version, we'll just return the new facility
  return newFacility;
};

export const updateFacility = async (id: string, updates: Partial<Facility>): Promise<Facility> => {
  await delay(1000);
  const facilityIndex = mockFacilities.findIndex(facility => facility.id === id);
  
  if (facilityIndex === -1) {
    throw new Error('Facility not found');
  }
  
  const updatedFacility = {
    ...mockFacilities[facilityIndex],
    ...updates
  };
  
  // In a real app, this would update the database
  // For the mock version, we'll just return the updated facility
  return updatedFacility;
};

export const deleteFacility = async (id: string): Promise<boolean> => {
  await delay(1000);
  // In a real app, this would delete from the database
  // For the mock version, we'll just return true
  return true;
};
