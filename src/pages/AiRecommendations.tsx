
import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle, Flag, ArrowRight } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { getAIRecommendations, updateAIRecommendationStatus, AIRecommendation } from "@/services/aiService";
import { toast } from "sonner";

const AIRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [impactFilter, setImpactFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const data = await getAIRecommendations();
        setRecommendations(data);
        setFilteredRecommendations(data);
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        toast.error("Failed to load AI recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  useEffect(() => {
    let result = recommendations;
    
    if (statusFilter && statusFilter !== "all") {
      result = result.filter(item => item.status === statusFilter);
    }
    
    if (impactFilter && impactFilter !== "all") {
      result = result.filter(item => item.impact === impactFilter);
    }
    
    if (typeFilter && typeFilter !== "all") {
      result = result.filter(item => item.type === typeFilter);
    }
    
    // If user is staff member, filter to only show recommendations related to their department
    if (user?.role === 'staff' && user.department) {
      result = result.filter(rec => 
        rec.department === user.department || 
        (rec.facilityId && Math.random() > 0.7) // Mock assignment logic
      );
    }
    
    setFilteredRecommendations(result);
  }, [statusFilter, impactFilter, typeFilter, recommendations, user]);

  const handleApprove = async (id: string) => {
    try {
      await updateAIRecommendationStatus(id, 'approved');
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.id === id ? { ...rec, status: 'approved' } : rec
        )
      );
      toast.success("Recommendation approved successfully");
    } catch (error) {
      console.error("Error approving recommendation:", error);
      toast.error("Failed to approve recommendation");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateAIRecommendationStatus(id, 'rejected');
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.id === id ? { ...rec, status: 'rejected' } : rec
        )
      );
      toast.success("Recommendation rejected");
    } catch (error) {
      console.error("Error rejecting recommendation:", error);
      toast.error("Failed to reject recommendation");
    }
  };

  const handleFlag = async (id: string) => {
    try {
      await updateAIRecommendationStatus(id, 'flagged');
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.id === id ? { ...rec, status: 'flagged' } : rec
        )
      );
      toast.success("Recommendation flagged for review");
    } catch (error) {
      console.error("Error flagging recommendation:", error);
      toast.error("Failed to flag recommendation");
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'expansion':
        return 'Expand Capacity';
      case 'relocation':
        return 'Space Relocation';
      case 'maintenance':
        return 'Maintenance Schedule';
      case 'scheduling':
        return 'Usage Scheduling';
      case 'optimization':
        return 'Resource Optimization';
      default:
        return type;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'complex':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate':
        return 'bg-green-100 text-green-700';
      case 'short-term':
        return 'bg-yellow-100 text-yellow-700';
      case 'long-term':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-urgray">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                AI-Generated Recommendations
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'admin' 
                  ? 'Review and act on AI-suggested campus improvements' 
                  : 'View and help review AI-suggested improvements for your assigned areas'}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={(value) => setImpactFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Impact filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Impact Levels</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="low">Low Impact</SelectItem>
                </SelectContent>
              </Select>
              
              <Select onValueChange={(value) => setTypeFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Type filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expansion">Expansion</SelectItem>
                  <SelectItem value="relocation">Relocation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="scheduling">Scheduling</SelectItem>
                  <SelectItem value="optimization">Optimization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Recommendations List */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-urblue"></div>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="space-y-6">
            {filteredRecommendations.map((rec) => (
              <Card key={rec.id} className="relative overflow-hidden">
                {rec.status === 'approved' && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-green-500 border-l-[60px] border-l-transparent z-10"></div>
                )}
                {rec.status === 'rejected' && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-red-500 border-l-[60px] border-l-transparent z-10"></div>
                )}
                {rec.status === 'flagged' && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[60px] border-t-yellow-500 border-l-[60px] border-l-transparent z-10"></div>
                )}
                <CardHeader>
                  <div className="flex flex-wrap gap-2 justify-between items-start">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getImpactColor(rec.impact)}`}>
                        {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)} Impact
                      </span>
                      <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {getTypeLabel(rec.type)}
                      </span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">AI Confidence</span>
                            <Progress value={rec.aiConfidence} className="w-24 h-2" />
                            <span className="ml-2 text-sm font-medium">{rec.aiConfidence}%</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI's confidence level in this recommendation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <CardTitle className="text-xl">{rec.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {rec.facilityName && (
                      <span className="font-medium text-gray-700">{rec.facilityName}{rec.department ? ` • ${rec.department}` : ''}</span>
                    )}
                    {!rec.facilityName && rec.department && (
                      <span className="font-medium text-gray-700">{rec.department} Department</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-gray-600 mb-4">{rec.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {rec.savings && (
                      <div className="bg-urgray p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Potential Savings</h4>
                        <div className="space-y-1">
                          {rec.savings.cost > 0 && (
                            <p className="text-sm flex justify-between">
                              <span>Cost:</span>
                              <span className="font-medium text-green-600">RF{rec.savings.cost.toLocaleString()}</span>
                            </p>
                          )}
                          {rec.savings.space !== 0 && (
                            <p className="text-sm flex justify-between">
                              <span>Space:</span>
                              <span className="font-medium">
                                {Math.abs(rec.savings.space)} sq ft {rec.savings.space > 0 ? 'saved' : 'needed'}
                              </span>
                            </p>
                          )}
                          {rec.savings.time > 0 && (
                            <p className="text-sm flex justify-between">
                              <span>Time:</span>
                              <span className="font-medium">{rec.savings.time} hours</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {rec.implementation && (
                      <div className="bg-urgray p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Implementation</h4>
                        <div className="space-y-1">
                          <p className="text-sm flex justify-between">
                            <span>Difficulty:</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getDifficultyColor(rec.implementation.difficulty)} capitalize`}>
                              {rec.implementation.difficulty}
                            </span>
                          </p>
                          <p className="text-sm flex justify-between">
                            <span>Timeframe:</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${getTimeframeColor(rec.implementation.timeFrame)} capitalize`}>
                              {rec.implementation.timeFrame.split('-').join(' ')}
                            </span>
                          </p>
                          {rec.implementation.estimatedCost && (
                            <p className="text-sm flex justify-between">
                              <span>Est. Cost:</span>
                              <span className="font-medium">RF{rec.implementation.estimatedCost.toLocaleString()}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-urgray p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Status</h4>
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            rec.status === 'approved' ? 'bg-green-100 text-green-700' :
                            rec.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            rec.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          } capitalize`}>
                            {rec.status}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Generated on {new Date(rec.createdAt).toLocaleDateString()}
                        </p>
                        {rec.reviewComments && rec.reviewComments.length > 0 && (
                          <p className="text-xs text-urblue">
                            {rec.reviewComments.length} comment{rec.reviewComments.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t flex flex-wrap justify-between">
                  <div>
                    <Button variant="outline" size="sm" className="text-xs h-8" asChild>
                      <a href={`#rec-${rec.id}`}>
                        View Details <ArrowRight className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    {user?.role === 'admin' && rec.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(rec.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" /> Reject
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8 bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(rec.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" /> Approve
                        </Button>
                      </>
                    )}
                    {(user?.role === 'staff' || (user?.role === 'admin' && rec.status !== 'pending')) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleFlag(rec.id)}
                      >
                        <Flag className="mr-1 h-4 w-4" />
                        {rec.status === 'flagged' ? 'Flagged' : 'Flag'}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="h-64 bg-white rounded-lg flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No recommendations found</h3>
            <p className="text-gray-500 max-w-md">
              {statusFilter || impactFilter || typeFilter
                ? "Try adjusting your filters to find what you're looking for."
                : "There are no AI recommendations to display at this time."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AIRecommendations;
