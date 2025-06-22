
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Megaphone, Star, ChevronDown, ChevronUp, Calendar, Building, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Announcements = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "all",
    facility: "all",
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        // Mock announcements data
        const mockAnnouncements = [
          {
            id: "1",
            title: "Library Hours Extended",
            category: "operations",
            description: "Based on student feedback and AI analysis, the main library will now stay open until 10 PM on weekdays. This change aims to accommodate evening study sessions and provide more flexible access to library resources for students with afternoon classes. This extended schedule will begin next Monday.",
            date: "2025-04-25",
            facility: "Main Library",
            important: true,
            createdBy: "Dr. James Wilson, Library Director"
          },
          {
            id: "2",
            title: "New Study Spaces Available",
            category: "expansion",
            description: "10 new individual study pods have been added to the Science Building based on space utilization data. These pods are equipped with power outlets, USB ports, and adjustable lighting. Booking can be done through the campus app or at the Science Building reception desk.",
            date: "2025-04-22",
            facility: "Science Building",
            important: false,
            createdBy: "Campus Planning Committee"
          },
          {
            id: "3",
            title: "Computer Lab Maintenance",
            category: "maintenance",
            description: "The Computer Science lab will be closed this weekend for system upgrades and maintenance. All computers will be updated with the latest software versions and security patches. The lab will reopen on Monday morning at 8 AM.",
            date: "2025-04-20",
            facility: "Computer Science Building",
            important: true,
            createdBy: "IT Department"
          },
          {
            id: "4",
            title: "Cafeteria Menu Changes",
            category: "operations",
            description: "Based on student feedback, the campus cafeteria will be introducing more vegetarian and vegan options starting next week. The new menu includes a daily plant-based special and expanded salad bar options.",
            date: "2025-04-15",
            facility: "Main Cafeteria",
            important: false,
            createdBy: "Food Services"
          },
          {
            id: "5",
            title: "Engineering Building Renovation",
            category: "renovation",
            description: "The west wing of the Engineering Building will undergo renovations from May 1st to July 15th. During this period, classes will be temporarily relocated to the Science Building. The renovation will add new lab spaces and update existing facilities with modern equipment.",
            date: "2025-04-10",
            facility: "Engineering Building",
            important: true,
            createdBy: "Campus Development Office"
          },
          {
            id: "6",
            title: "Student Lounge Addition",
            category: "expansion",
            description: "A new student lounge will open in the Business School building next month. The space will feature comfortable seating, charging stations, a small kitchenette, and group study areas that can be reserved through the campus app.",
            date: "2025-04-08",
            facility: "Business School",
            important: false,
            createdBy: "Student Affairs Office"
          },
          {
            id: "7",
            title: "Parking Lot Closure",
            category: "maintenance",
            description: "The north parking lot will be closed for resurfacing from April 30th to May 2nd. Alternative parking is available in the east and west lots during this period. We apologize for any inconvenience this may cause.",
            date: "2025-04-05",
            facility: "North Campus",
            important: true,
            createdBy: "Facilities Management"
          }
        ];
        
        setAnnouncements(mockAnnouncements);
        setFilteredAnnouncements(mockAnnouncements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // Apply filters
    const filtered = announcements.filter((item) => {
      if (filters.category !== "all" && item.category !== filters.category) return false;
      if (filters.facility !== "all" && item.facility !== filters.facility) return false;
      return true;
    });
    setFilteredAnnouncements(filtered);
  }, [filters, announcements]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Get unique categories and facilities for filters
  const categories = Array.from(new Set(announcements.map((item) => item.category)));
  const facilities = Array.from(new Set(announcements.map((item) => item.facility)));

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
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Campus Announcements</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with the latest campus facility updates and changes
          </p>
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
                <label htmlFor="category-filter" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="category-filter"
                  className="w-full border rounded-md px-3 py-2"
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category} className="capitalize">
                      {category}
                    </option>
                  ))}
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
                  {facilities.map((facility) => (
                    <option key={facility} value={facility}>
                      {facility}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <Card 
                key={announcement.id} 
                className={`hover:shadow-md transition-shadow ${announcement.important ? 'border-l-4 border-urblue' : ''}`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-2">
                        <div className="mt-1">
                          <Megaphone className={`h-5 w-5 ${announcement.important ? 'text-urblue' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{announcement.title}</h3>
                            {announcement.important && (
                              <span className="flex items-center text-xs text-urblue">
                                <Star className="h-3 w-3 mr-1 fill-urblue" />
                                Important
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(announcement.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {announcement.facility}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                              announcement.category === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                              announcement.category === 'expansion' ? 'bg-green-100 text-green-800' :
                              announcement.category === 'renovation' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {announcement.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2"
                        onClick={() => toggleExpand(announcement.id)}
                      >
                        {expandedId === announcement.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    
                    <div className={expandedId === announcement.id ? "block mt-2" : "hidden"}>
                      <p className="text-gray-600 mb-3">
                        {announcement.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        Posted by: {announcement.createdBy}
                      </p>
                    </div>
                    
                    {expandedId !== announcement.id && (
                      <p className="text-gray-600 line-clamp-1">
                        {announcement.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <Megaphone className="h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-600">No announcements found</h3>
            <p className="text-sm text-gray-500 mt-1">
              No items match your current filter criteria
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setFilters({ category: "all", facility: "all" })}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;
