import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { CampusPlanningDataset } from "@/services/aiService";
import { ChevronDown, ChevronUp, Database, CalendarDays, Tag } from "lucide-react";

interface CampusDatasetSelectorProps {
  datasets: CampusPlanningDataset[];
  isLoading: boolean;
  selectedDataset?: string;
  onSelectDataset: (datasetId: string) => void;
}

export const CampusDatasetSelector = ({
  datasets,
  isLoading,
  selectedDataset,
  onSelectDataset
}: CampusDatasetSelectorProps) => {
  const [expandedDataset, setExpandedDataset] = useState<string | null>(null);
  
  const toggleExpand = (datasetId: string) => {
    if (expandedDataset === datasetId) {
      setExpandedDataset(null);
    } else {
      setExpandedDataset(datasetId);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }
  
  if (datasets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Database className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>No datasets available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        Select a dataset to enhance AI predictions with real-world planning data
      </div>
      
      {datasets.map((dataset) => (
        <Collapsible 
          key={dataset.id} 
          open={expandedDataset === dataset.id}
          className={`border rounded-lg transition-all ${
            selectedDataset === dataset.id ? 
            "border-blue-500 bg-blue-50" : 
            "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="font-medium text-sm">{dataset.name}</h3>
                <p className="text-xs text-gray-500">{dataset.source}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={selectedDataset === dataset.id ? "default" : "outline"} 
                size="sm"
                onClick={() => onSelectDataset(dataset.id)}
              >
                {selectedDataset === dataset.id ? "Selected" : "Select"}
              </Button>
              
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => toggleExpand(dataset.id)}
                >
                  {expandedDataset === dataset.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="px-4 pb-4 pt-1 border-t">
              <div className="text-sm mb-3">{dataset.description}</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs font-medium text-gray-500">Student Growth Rate</div>
                  <div className="text-lg font-semibold">{dataset.metrics.studentGrowthRate}%</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">Average Utilization</div>
                  <div className="text-lg font-semibold">{dataset.metrics.averageUtilization}%</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-500">Expansion Rate</div>
                  <div className="text-lg font-semibold">{dataset.metrics.infrastructureExpansionRate}%</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>Last updated: {new Date(dataset.lastUpdated).toLocaleDateString()}</span>
                </div>
                <div>{dataset.dataPoints.toLocaleString()} data points</div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {dataset.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Tag className="h-2.5 w-2.5 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};