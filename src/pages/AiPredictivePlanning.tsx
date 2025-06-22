import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Building,
  Warehouse,
  School,
  Library,
  Car,
  Home,
  Users,
  ChefHat,
  Printer,
  Palmtree,
  Calendar,
  BarChartHorizontal,
  ListFilter,
  AlertTriangle,
  Download,
  PlusCircle,
  Share2,
  RotateCw,
  Database,
  Info,
} from "lucide-react";
import {
  getInfrastructurePredictions,
  getInfrastructurePredictionsByType,
  getInfrastructurePredictionsByYear,
  getInfrastructurePredictionsByPriority,
  generateNewPrediction,
  InfrastructurePrediction,
  getAvailableCampusDatasets,
  CampusPlanningDataset,
  applyDatasetToPrediction,
  saveCustomPredictionModel,
} from "@/services/aiService";
import { CampusDatasetSelector } from "@/components/CampusDatasetSelector";
import { formatRwfCurrency } from "@/lib/utils";

// Infrastructure type icons mapping
const infrastructureIcons: Record<string, React.ReactNode> = {
  classroom: <School className="h-5 w-5" />,
  lab: <Warehouse className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  hostel: <Home className="h-5 w-5" />,
  library: <Library className="h-5 w-5" />,
  office: <Building className="h-5 w-5" />,
  restaurant: <ChefHat className="h-5 w-5" />,
  printing: <Printer className="h-5 w-5" />,
  recreation: <Palmtree className="h-5 w-5" />
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#EC7063"];

const AIPredictivePlanning = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<InfrastructurePrediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<InfrastructurePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("predictions");
  const [chartType, setChartType] = useState<"capacity" | "timeline">("capacity");
  
  // New prediction dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPredictionParams, setNewPredictionParams] = useState({
    studentGrowth: 10,
    infrastructureType: "classroom",
    yearRange: 2
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dataset integration
  const [datasets, setDatasets] = useState<CampusPlanningDataset[]>([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<string | undefined>(undefined);
  const [isDatasetDialogOpen, setIsDatasetDialogOpen] = useState(false);
  const [isApplyingDataset, setIsApplyingDataset] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<string | undefined>(undefined);
  
  // New state for campus population input
  const [campusPopulation, setCampusPopulation] = useState<number>(3000);
  const [isPopulationDialogOpen, setIsPopulationDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setIsLoading(true);
        const data = await getInfrastructurePredictions();
        setPredictions(data);
        setFilteredPredictions(data);
      } catch (error) {
        console.error("Error fetching infrastructure predictions:", error);
        toast.error("Failed to load infrastructure predictions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPredictions();
  }, []);
  
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setIsLoadingDatasets(true);
        const data = await getAvailableCampusDatasets();
        setDatasets(data);
      } catch (error) {
        console.error("Error fetching campus datasets:", error);
        toast.error("Failed to load campus planning datasets");
      } finally {
        setIsLoadingDatasets(false);
      }
    };

    fetchDatasets();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      setIsLoading(true);
      
      try {
        let result = predictions;
        
        if (yearFilter && yearFilter !== "all") {
          const year = parseInt(yearFilter);
          result = await getInfrastructurePredictionsByYear(year);
        }
        
        if (typeFilter && typeFilter !== "all") {
          result = await getInfrastructurePredictionsByType(typeFilter);
        }
        
        if (priorityFilter && priorityFilter !== "all") {
          result = await getInfrastructurePredictionsByPriority(priorityFilter);
        }
        
        setFilteredPredictions(result);
      } catch (error) {
        console.error("Error filtering predictions:", error);
        toast.error("Failed to apply filters");
      } finally {
        setIsLoading(false);
      }
    };
    
    applyFilters();
  }, [yearFilter, typeFilter, priorityFilter, predictions]);

  const handleGeneratePrediction = async () => {
    setIsGenerating(true);
    try {
      const newPrediction = await generateNewPrediction(newPredictionParams);
      setPredictions(prev => [newPrediction, ...prev]);
      setFilteredPredictions(prev => [newPrediction, ...prev]);
      setIsDialogOpen(false);
      toast.success("New infrastructure prediction generated successfully");
    } catch (error) {
      console.error("Error generating prediction:", error);
      toast.error("Failed to generate infrastructure prediction");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApplyDataset = async () => {
    if (!selectedDataset || !selectedPrediction) return;
    
    setIsApplyingDataset(true);
    try {
      const enhancedPrediction = await applyDatasetToPrediction(selectedDataset, selectedPrediction);
      
      // Update predictions with the enhanced one
      setPredictions(prev => 
        prev.map(p => p.id === selectedPrediction ? enhancedPrediction : p)
      );
      setFilteredPredictions(prev => 
        prev.map(p => p.id === selectedPrediction ? enhancedPrediction : p)
      );
      
      setIsDatasetDialogOpen(false);
      toast.success(`Dataset applied successfully to prediction`);
    } catch (error) {
      console.error("Error applying dataset:", error);
      toast.error("Failed to apply dataset to prediction");
    } finally {
      setIsApplyingDataset(false);
    }
  };

  const handlePopulationBasedPrediction = async () => {
    setIsGenerating(true);
    try {
      // Generate prediction based on the input population
      const newPredictionParams = {
        studentGrowth: Math.round(((campusPopulation - 3000) / 3000) * 100),
        infrastructureType: "classroom", // Default to classroom
        yearRange: 2
      };
      
      const newPrediction = await generateNewPrediction(newPredictionParams);
      setPredictions(prev => [newPrediction, ...prev]);
      setFilteredPredictions(prev => [newPrediction, ...prev]);
      setIsPopulationDialogOpen(false);
      toast.success("Population-based infrastructure prediction generated successfully");
    } catch (error) {
      console.error("Error generating population-based prediction:", error);
      toast.error("Failed to generate infrastructure prediction");
    } finally {
      setIsGenerating(false);
    }
  };

  const getInfrastructureLabel = (type: string) => {
    const labels: Record<string, string> = {
      classroom: "Classrooms",
      lab: "Laboratories",
      parking: "Parking Areas",
      hostel: "Student Hostels",
      library: "Libraries",
      office: "Office Spaces",
      restaurant: "Restaurants",
      printing: "Printing Services",
      recreation: "Recreation Areas"
    };
    
    return labels[type] || type;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'build':
        return 'bg-purple-100 text-purple-700';
      case 'expand':
        return 'bg-blue-100 text-blue-700';
      case 'renovate':
        return 'bg-yellow-100 text-yellow-700';
      case 'optimize':
        return 'bg-green-100 text-green-700';
      case 'maintain':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Generate data for capacity chart
  const prepareCapacityChartData = () => {
    return filteredPredictions.map(pred => ({
      name: getInfrastructureLabel(pred.infrastructureType),
      current: pred.currentCapacity,
      recommended: pred.recommendedCapacity,
      projected: pred.projectedStudentCount * (pred.currentCapacity / 3000)
    }));
  };

  // Generate data for timeline chart
  const prepareTimelineChartData = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Set(filteredPredictions.map(p => p.year))).sort();
    
    return years.map(year => {
      const yearPredictions = filteredPredictions.filter(p => p.year === year);
      const totalExpansion = yearPredictions.reduce((sum, p) => sum + (p.recommendedCapacity - p.currentCapacity), 0);
      const totalCost = yearPredictions.reduce((sum, p) => sum + p.details.estimatedCost, 0);
      
      return {
        year,
        yearsFromNow: year - currentYear,
        totalExpansion,
        totalCost,
        predictions: yearPredictions.length
      };
    });
  };

  // Prepare summary data for pie chart
  const prepareTypeSummaryData = () => {
    const typeCounts: Record<string, number> = {};
    
    filteredPredictions.forEach(pred => {
      typeCounts[pred.infrastructureType] = (typeCounts[pred.infrastructureType] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([name, value]) => ({
      name: getInfrastructureLabel(name),
      value
    }));
  };

  // Update the formatCurrency function to use our new RWF formatter
  const formatCurrency = (value: number) => {
    return formatRwfCurrency(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-urgray">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                AI-Driven Infrastructure Prediction
              </h1>
              <p className="text-gray-600 mt-1">
                Plan infrastructure needs based on projected student populations and facility usage patterns
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-urblue hover:bg-urblue-dark">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generate New Prediction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate New Infrastructure Prediction</DialogTitle>
                    <DialogDescription>
                      Set parameters for AI to predict future infrastructure needs.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="infrastructureType">Infrastructure Type</Label>
                      <Select 
                        value={newPredictionParams.infrastructureType}
                        onValueChange={value => setNewPredictionParams(prev => ({ ...prev, infrastructureType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select infrastructure type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="classroom">Classrooms</SelectItem>
                          <SelectItem value="lab">Laboratories</SelectItem>
                          <SelectItem value="parking">Parking Areas</SelectItem>
                          <SelectItem value="hostel">Student Hostels</SelectItem>
                          <SelectItem value="library">Libraries</SelectItem>
                          <SelectItem value="office">Office Spaces</SelectItem>
                          <SelectItem value="restaurant">Restaurants</SelectItem>
                          <SelectItem value="printing">Printing Services</SelectItem>
                          <SelectItem value="recreation">Recreation Areas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Projected Student Growth (%)</Label>
                      <div className="flex items-center gap-4">
                        <Slider 
                          value={[newPredictionParams.studentGrowth]} 
                          min={0}
                          max={50}
                          step={1}
                          onValueChange={([value]) => setNewPredictionParams(prev => ({ ...prev, studentGrowth: value }))}
                          className="flex-1"
                        />
                        <span className="w-12 text-center font-medium">
                          {newPredictionParams.studentGrowth}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Prediction Year Range</Label>
                      <div className="flex items-center gap-4">
                        <Slider 
                          value={[newPredictionParams.yearRange]} 
                          min={1}
                          max={10}
                          step={1}
                          onValueChange={([value]) => setNewPredictionParams(prev => ({ ...prev, yearRange: value }))}
                          className="flex-1"
                        />
                        <span className="w-12 text-center font-medium">
                          {newPredictionParams.yearRange} yr
                        </span>
                      </div>
                    </div>
                    
                    {/* Dataset selector in prediction dialog */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Apply Campus Planning Dataset</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-80 text-xs">
                                Campus planning datasets contain real-world data from educational institutions that can improve prediction accuracy. 
                                Data includes student growth patterns, facility usage trends, and expansion metrics.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select 
                        value={selectedDataset}
                        onValueChange={setSelectedDataset}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a dataset (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No dataset</SelectItem>
                          {datasets.map(dataset => (
                            <SelectItem key={dataset.id} value={dataset.id}>
                              {dataset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedDataset && (
                        <div className="text-xs text-gray-500">
                          Using this dataset will enhance prediction accuracy with real-world campus planning data
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" className="mr-2" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleGeneratePrediction} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Generate Prediction"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isPopulationDialogOpen} onOpenChange={setIsPopulationDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-urblue hover:bg-urblue-dark">
                    <Users className="mr-2 h-4 w-4" />
                    Population-Based Prediction
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Prediction Based on Campus Population</DialogTitle>
                    <DialogDescription>
                      Enter the current or projected campus population to get infrastructure recommendations.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="campusPopulation">Campus Population</Label>
                      <Input 
                        id="campusPopulation"
                        type="number"
                        value={campusPopulation}
                        onChange={(e) => setCampusPopulation(parseInt(e.target.value) || 0)}
                        min={1000}
                      />
                      <p className="text-xs text-gray-500">
                        Current baseline: 3,000 students. Enter a higher number to simulate growth.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Impact on Infrastructure</Label>
                      <Progress 
                        value={Math.min(100, (campusPopulation / 3000) * 100)} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Current capacity</span>
                        <span>Projected needs</span>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" className="mr-2" onClick={() => setIsPopulationDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handlePopulationBasedPrediction} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Generate Prediction"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="items-center hidden md:flex"
                onClick={() => setIsDatasetDialogOpen(true)}
              >
                <Database className="mr-2 h-4 w-4" />
                Apply Campus Datasets
              </Button>
              
              <Button variant="outline" className="hidden md:flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              
              <Button variant="outline" className="hidden md:flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share Insights
              </Button>
            </div>
          </div>
        </div>

        {/* Dataset Dialog */}
        <Dialog open={isDatasetDialogOpen} onOpenChange={setIsDatasetDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Apply Campus Planning Datasets</DialogTitle>
              <DialogDescription>
                Enhance predictions with real-world campus planning data from educational institutions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Prediction to Enhance</Label>
                <Select 
                  value={selectedPrediction}
                  onValueChange={setSelectedPrediction}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prediction" />
                  </SelectTrigger>
                  <SelectContent>
                    {predictions.map(prediction => (
                      <SelectItem key={prediction.id} value={prediction.id}>
                        {prediction.title} ({getInfrastructureLabel(prediction.infrastructureType)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Available Campus Planning Datasets</h3>
                <CampusDatasetSelector
                  datasets={datasets}
                  isLoading={isLoadingDatasets}
                  selectedDataset={selectedDataset}
                  onSelectDataset={setSelectedDataset}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDatasetDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleApplyDataset} 
                disabled={isApplyingDataset || !selectedDataset || !selectedPrediction}
              >
                {isApplyingDataset ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Applying...
                  </>
                ) : (
                  "Apply Dataset"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tabs and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-urgray">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <Tabs defaultValue="predictions" className="w-full" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="predictions">
                  <BarChartHorizontal className="h-4 w-4 mr-2" />
                  Predictions
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline Analysis
                </TabsTrigger>
                <TabsTrigger value="datasets">
                  <Database className="h-4 w-4 mr-2" />
                  Campus Datasets
                </TabsTrigger>
              </TabsList>
              
              {/* Content based on selected tab */}
              {isLoading ? (
                <div className="h-64 flex items-center justify-center mt-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
                </div>
              ) : (
                <>
                  <TabsContent value="predictions" className="space-y-6 mt-4">
                    {filteredPredictions.length > 0 ? (
                      <>
                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols gap-2">
                          {/* Capacity Comparison Chart */}
                          <Card className="col-span-2">
                            <CardHeader className="flex flex-row items-center justify-between">
                              <div>
                                <CardTitle>Capacity Analysis</CardTitle>
                                <CardDescription>Current vs. Recommended Capacity by Infrastructure Type</CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setChartType(chartType === "capacity" ? "timeline" : "capacity")}
                                >
                                  <BarChartHorizontal className="h-4 w-4 mr-1" />
                                  Switch View
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                {chartType === "capacity" ? (
                                  <BarChart data={prepareCapacityChartData()} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <RechartsTooltip
                                      formatter={(value: number) => [value, "Capacity"]}
                                      contentStyle={{ backgroundColor: "#fff", borderRadius: "0.5rem" }}
                                    />
                                    <Legend />
                                    <Bar dataKey="current" name="Current Capacity" fill="#8884d8" />
                                    <Bar dataKey="recommended" name="Recommended" fill="#82ca9d" />
                                    <Bar dataKey="projected" name="Projected Need" fill="#ffc658" />
                                  </BarChart>
                                ) : (
                                  <LineChart data={prepareTimelineChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <RechartsTooltip
                                      contentStyle={{ backgroundColor: "#fff", borderRadius: "0.5rem" }}
                                    />
                                    <Legend />
                                    <Line
                                      yAxisId="left"
                                      type="monotone"
                                      dataKey="totalExpansion"
                                      name="Capacity Expansion"
                                      stroke="#8884d8"
                                      activeDot={{ r: 8 }}
                                    />
                                    <Line
                                      yAxisId="right"
                                      type="monotone"
                                      dataKey="predictions"
                                      name="Number of Predictions"
                                      stroke="#82ca9d"
                                    />
                                  </LineChart>
                                )}
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                          
                          {/* Infrastructure Type Distribution */}
                          <Card>
                            <CardHeader>
                              <CardTitle>Infrastructure Type Distribution</CardTitle>
                              <CardDescription>Breakdown by facility type</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={prepareTypeSummaryData()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {prepareTypeSummaryData().map((_entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {/* Prediction Cards */}
                        <div className="space-y-6">
                          <h2 className="text-lg font-medium">Infrastructure Predictions</h2>
                          <div className="grid grid-cols-1 gap-6">
                            {filteredPredictions.map((prediction) => (
                              <Card key={prediction.id} className="overflow-hidden">
                                <CardHeader className="bg-urgray bg-opacity-20">
                                  <div className="flex flex-wrap items-start justify-between">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="p-2 rounded-full bg-yellow-400">
                                        {infrastructureIcons[prediction.infrastructureType] || <Building className="h-5 w-5" />}
                                      </div>
                                      <div>
                                        <CardTitle>{prediction.title}</CardTitle>
                                        <CardDescription>
                                          {getInfrastructureLabel(prediction.infrastructureType)} • Year {prediction.year}
                                        </CardDescription>
                                      </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(prediction.priority)}`}>
                                      {prediction.priority.charAt(0).toUpperCase() + prediction.priority.slice(1)} Priority
                                    </span>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-6 pb-2">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                          <span className="text-sm font-medium">Current Capacity</span>
                                          <span className="text-sm font-medium">{prediction.currentCapacity.toLocaleString()}</span>
                                        </div>
                                        <Progress value={(prediction.currentCapacity / prediction.projectedStudentCount) * 100} className="h-2" />
                                      </div>
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                          <span className="text-sm font-medium">Recommended Capacity</span>
                                          <span className="text-sm font-medium">{prediction.recommendedCapacity.toLocaleString()}</span>
                                        </div>
                                        <Progress value={(prediction.recommendedCapacity / prediction.projectedStudentCount) * 100} className="h-2" />
                                      </div>
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                          <span className="text-sm font-medium">Projected Student Count</span>
                                          <span className="text-sm font-medium">{prediction.projectedStudentCount.toLocaleString()}</span>
                                        </div>
                                        <Progress value={100} className="h-2 bg-blue-200" />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div className="p-3 bg-urgray rounded-md">
                                        <h4 className="text-sm font-medium mb-2">Implementation Details</h4>
                                        <div className="space-y-1 text-sm">
                                          <div className="flex justify-between">
                                            <span>Action:</span>
                                            <span className={`px-2 py-0.5 rounded ${getActionColor(prediction.details.recommendedAction)} capitalize`}>
                                              {prediction.details.recommendedAction}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Est. Cost:</span>
                                            <span className="font-medium">
                                              {formatCurrency(prediction.details.estimatedCost)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Space:</span>
                                            <span>{prediction.details.spaceNeeded.toLocaleString()} sq ft</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <span className="text-sm text-gray-500 mr-2">AI Confidence</span>
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <div className="flex items-center gap-2">
                                                  <Progress value={prediction.aiConfidence} className="w-16 h-2" />
                                                  <span className="text-xs font-medium">{prediction.aiConfidence}%</span>
                                                </div>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>AI's confidence level in this prediction</p>
                                              </TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                    <h4 className="text-sm font-medium mb-2">Impact Factors</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                      <div>
                                        <span className="text-gray-600">Student Growth</span>
                                        <p className="font-medium">{prediction.impactFactors.studentGrowth}%</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Usage Trend</span>
                                        <p className="font-medium">{prediction.impactFactors.utilizationTrend}%</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Feedback Score</span>
                                        <p className="font-medium">{prediction.impactFactors.feedbackScore}/100</p>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Maintenance</span>
                                        <p className="font-medium capitalize">{prediction.impactFactors.maintenanceStatus}</p>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter className="border-t flex justify-between flex-wrap">
                                  <div className="text-xs text-gray-500">
                                    Generated on {new Date(prediction.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Download Details</Button>
                                    <Button size="sm" className="bg-urblue hover:bg-urblue-dark">View Simulation</Button>
                                  </div>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-64 bg-white rounded-lg flex flex-col items-center justify-center p-6 text-center">
                        <AlertTriangle className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No predictions found</h3>
                        <p className="text-gray-500 max-w-md">
                          {yearFilter || typeFilter || priorityFilter
                            ? "Try adjusting your filters to find what you're looking for."
                            : "There are no infrastructure predictions to display at this time. Generate a new prediction to get started."}
                        </p>
                        <Button className="mt-4 bg-urblue hover:bg-urblue-dark" onClick={() => setIsDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Generate New Prediction
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="analytics" className="mt-4">
                    {/* Timeline content will be implemented in the next phase */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Infrastructure Development Timeline</CardTitle>
                        <CardDescription>
                          Year-by-year analysis of predicted infrastructure needs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={prepareTimelineChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <RechartsTooltip 
                              formatter={(value: any, name: string) => {
                                if (name === "totalCost") return [formatCurrency(value), "Estimated Cost"];
                                return [value, name];
                              }}
                              contentStyle={{ backgroundColor: "#fff", borderRadius: "0.5rem" }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="totalExpansion"
                              name="Capacity Expansion"
                              stroke="#8884d8"
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="totalCost"
                              name="Estimated Cost"
                              stroke="#82ca9d"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* New Datasets Tab */}
                  <TabsContent value="datasets" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Campus Planning Datasets</CardTitle>
                        <CardDescription>
                          Real-world datasets from educational institutions to enhance AI predictions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <h3 className="text-sm font-medium text-blue-800 mb-1">About Campus Planning Datasets</h3>
                          <p className="text-sm text-blue-700">
                            These datasets include metrics from educational institutions worldwide on space utilization, 
                            student growth trends, infrastructure development patterns, and more. 
                            Using these datasets can significantly improve the accuracy of AI-driven planning predictions.
                          </p>
                        </div>
                      
                        {isLoadingDatasets ? (
                          <div className="h-64 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              {datasets.map((dataset) => (
                                <Card key={dataset.id} className="overflow-hidden">
                                  <CardHeader className="bg-urgray bg-opacity-10">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <CardTitle className="text-base">{dataset.name}</CardTitle>
                                        <CardDescription>{dataset.source}</CardDescription>
                                      </div>
                                      <div className="bg-white rounded-full p-2">
                                        <Database className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-4">
                                    <p className="text-sm mb-4">{dataset.description}</p>
                                    
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                      <div className="p-2 bg-gray-50 rounded-md text-center">
                                        <div className="text-xs text-gray-500">Student Growth</div>
                                        <div className="font-medium">{dataset.metrics.studentGrowthRate}%</div>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md text-center">
                                        <div className="text-xs text-gray-500">Avg. Utilization</div>
                                        <div className="font-medium">{dataset.metrics.averageUtilization}%</div>
                                      </div>
                                      <div className="p-2 bg-gray-50 rounded-md text-center">
                                        <div className="text-xs text-gray-500">Expansion Rate</div>
                                        <div className="font-medium">{dataset.metrics.infrastructureExpansionRate}%</div>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mb-2">
                                      {dataset.tags.map((tag, i) => (
                                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                    
                                    <div className="text-xs text-gray-500">
                                      {dataset.dataPoints.toLocaleString()} data points • Last updated: {new Date(dataset.lastUpdated).toLocaleDateString()}
                                    </div>
                                  </CardContent>
                                  <CardFooter className="border-t pt-3">
                                    <Button 
                                      className="w-full" 
                                      onClick={() => {
                                        setSelectedDataset(dataset.id);
                                        setIsDatasetDialogOpen(true);
                                      }}
                                    >
                                      Apply to Prediction
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ))}
                            </div>
                            
                            <div className="text-center">
                              <Button variant="outline">
                                Request Additional Datasets
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
            
            <div className="flex flex-wrap gap-2">
              <Select onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="2028">2028</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="classroom">Classrooms</SelectItem>
                  <SelectItem value="lab">Laboratories</SelectItem>
                  <SelectItem value="parking">Parking</SelectItem>
                  <SelectItem value="hostel">Hostels</SelectItem>
                  <SelectItem value="library">Libraries</SelectItem>
                  <SelectItem value="office">Offices</SelectItem>
                  <SelectItem value="restaurant">Restaurants</SelectItem>
                  <SelectItem value="printing">Printing</SelectItem>
                  <SelectItem value="recreation">Recreation</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => {
                setYearFilter(undefined);
                setTypeFilter(undefined);
                setPriorityFilter(undefined);
              }} className="h-10 w-10">
                <ListFilter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIPredictivePlanning;
