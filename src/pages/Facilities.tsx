import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Building, 
  Search, 
  Plus, 
  Filter, 
  SlidersHorizontal 
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { getFacilities, Facility } from "@/services/facilityService";
import { toast } from "sonner";

const Facilities = () => {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [facilityTypeFilter, setFacilityTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        const data = await getFacilities();
        setFacilities(data);
        setFilteredFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
        toast.error("Failed to load facilities data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  useEffect(() => {
    let result = facilities;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        facility => 
          facility.name.toLowerCase().includes(term) || 
          facility.location.toLowerCase().includes(term) ||
          facility.type.toLowerCase().includes(term)
      );
    }
    
    // Apply facility type filter
    if (facilityTypeFilter) {
      result = result.filter(facility => facility.type === facilityTypeFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(facility => facility.status === statusFilter);
    }
    
    setFilteredFacilities(result);
  }, [searchTerm, facilityTypeFilter, statusFilter, facilities]);

  // If user is a staff member, filter to only show their assigned facilities
  useEffect(() => {
    if (user?.role === 'staff') {
      const department = user.department;
      
      if (department) {
        const assignedFacilities = facilities.filter(
          facility => facility.department === department || Math.random() > 0.7 // Mock assignment logic
        );
        setFilteredFacilities(assignedFacilities);
      }
    }
  }, [facilities, user]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFacilityTypeChange = (value: string) => {
    setFacilityTypeFilter(value === "all" ? undefined : value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "all" ? undefined : value);
  };

  const handleAddFacility = () => {
    toast.info("Add facility functionality would be implemented here");
    // In a real application, this would open a form to add a new facility
  };

  const renderFacilityCard = (facility: Facility) => {
    // Helper to determine utilization status color
    const getUtilizationColor = (current: number, capacity: number) => {
      const percentage = (current / capacity) * 100;
      if (percentage >= 90) return "text-red-600";
      if (percentage >= 70) return "text-orange-500";
      return "text-green-600";
    };
    
    return (
      <Card 
        key={facility.id} 
        className="card-hover border-l-4 border-urblue"
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">{facility.name}</CardTitle>
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
              facility.status === 'operational' ? 'bg-green-100 text-green-700' :
              facility.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
              facility.status === 'construction' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
            }`}>
              {facility.status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="capitalize">{facility.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span>{facility.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Utilization</span>
              <span className={getUtilizationColor(facility.currentOccupancy, facility.capacity)}>
                {facility.currentOccupancy} / {facility.capacity}
              </span>
            </div>
            {facility.department && (
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span>{facility.department}</span>
              </div>
            )}
            <div className="pt-2 flex justify-end">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/facilities/${facility.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-urgray">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {user?.role === 'staff' ? 'My Assigned Facilities' : 'Campus Facilities'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'admin' 
                  ? 'Manage and monitor all campus facilities' 
                  : user?.role === 'staff'
                  ? 'View and manage your assigned facilities'
                  : 'Browse and learn about campus facilities'}
              </p>
            </div>
            
            {/* Only show Add Facility button for admin users */}
            {user?.role === 'admin' && (
              <Button onClick={handleAddFacility} className="bg-urblue hover:bg-urblue-dark">
                <Plus className="mr-2 h-4 w-4" />
                Add New Facility
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-urgray">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <Select onValueChange={handleFacilityTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Facility Type</SelectLabel>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="classroom">Classroom</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                    <SelectItem value="recreational">Recreational</SelectItem>
                    <SelectItem value="hostel">Hostel</SelectItem>
                    <SelectItem value="cafeteria">Cafeteria</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              <Select onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <SlidersHorizontal size={16} />
                    <span className="hidden sm:inline">More Filters</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                    <DialogDescription>
                      Filter facilities by additional criteria
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* More filters would go here in a real implementation */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Department</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="computer-science">Computer Science</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="chemistry">Chemistry</SelectItem>
                          <SelectItem value="Geology">Geology</SelectItem>
                          <SelectItem value="transportation management">transport Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Features</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feature" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="projector">Projector</SelectItem>
                          <SelectItem value="Lighting">Lighting</SelectItem>
                          <SelectItem value="whiteboard">Whiteboard</SelectItem>
                          <SelectItem value="computers">Computers</SelectItem>
                          <SelectItem value="wifi">WiFi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Occupancy</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Input placeholder="Min" type="number" />
                        </div>
                        <div>
                          <Input placeholder="Max" type="number" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline">Clear All</Button>
                    <Button>Apply Filters</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {/* Facilities Grid */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
          </div>
        ) : filteredFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFacilities.map(renderFacilityCard)}
          </div>
        ) : (
          <div className="h-64 bg-white rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <Building className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No facilities found</h3>
            <p className="text-gray-500 max-w-md">
              {searchTerm || facilityTypeFilter || statusFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no facilities to display at this time."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Facilities;
