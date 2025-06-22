import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  ArrowLeft
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { createFeedback } from "@/services/feedbackService";
import { getFacilities } from "@/services/facilityService";

const FeedbackForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    facilityId: "",
    description: "",
    urgency: "medium" as "low" | "medium" | "high",
    category: "equipment" as "maintenance" | "cleanliness" | "equipment" | "noise" | "temperature" | "other",
    attachments: [] as File[],
  });
  const [selectedFacilityName, setSelectedFacilityName] = useState("");

  useState(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        const data = await getFacilities();
        setFacilities(data);
      } catch (error) {
        console.error("Error fetching facilities:", error);
        toast.error("Failed to load facilities data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  });

  const handleChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Update the selected facility name for display
    if (name === "facilityId") {
      const facility = facilities.find(f => f.id === value);
      setSelectedFacilityName(facility ? facility.name : "");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...filesArray].slice(0, 3), // limit to 3 files
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newAttachments = [...formData.attachments];
    newAttachments.splice(index, 1);
    setFormData({
      ...formData,
      attachments: newAttachments,
    });
  };

  const validateForm = () => {
    if (!formData.facilityId) {
      toast.error("Please select a facility");
      return false;
    }
    if (!formData.description || formData.description.length < 10) {
      toast.error("Please provide a detailed description (at least 10 characters)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // In a real app, would handle file uploads separately
      // For now, skipping actual file upload
      
      if (!user) {
        toast.error("You must be logged in to submit feedback");
        return;
      }
      
      const feedback = await createFeedback({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        facilityId: formData.facilityId,
        facilityName: selectedFacilityName,
        description: formData.description,
        urgency: formData.urgency,
        category: formData.category,
        status: "pending",
        attachments: formData.attachments.map(file => URL.createObjectURL(file)), // mock URLs
      });
      
      toast.success("Feedback submitted successfully");
      
      // Navigate back to appropriate page based on user role
      if (user.role === 'student') {
        navigate("/my-feedback");
      } else {
        navigate("/feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Submit New Feedback
            </h1>
            <p className="text-gray-600 mt-1">
              Help us improve by reporting issues with campus facilities
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Feedback Details</CardTitle>
            <CardDescription>
              Please provide detailed information about the issue
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Facility Selection */}
              <div className="space-y-2">
                <Label htmlFor="facility">Select Facility</Label>
                <Select 
                  onValueChange={(value) => handleChange("facilityId", value)}
                  value={formData.facilityId}
                  disabled={isLoading}
                >
                  <SelectTrigger id="facility">
                    <SelectValue placeholder="Select a facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility.id} value={facility.id}>
                        {facility.name} - {facility.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category</Label>
                <Select 
                  onValueChange={(value) => handleChange("category", value)}
                  defaultValue={formData.category}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cleanliness">Cleanliness</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="noise">Noise</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Urgency Selection */}
              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button"
                    variant={formData.urgency === "low" ? "default" : "outline"} 
                    className={`flex flex-col items-center py-6 ${formData.urgency === "low" ? "bg-green-500 hover:bg-green-600" : ""}`}
                    onClick={() => handleChange("urgency", "low")}
                  >
                    <CheckCircle className="h-6 w-6 mb-2" />
                    <span>Low</span>
                    <span className="text-xs mt-1">Not urgent</span>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant={formData.urgency === "medium" ? "default" : "outline"} 
                    className={`flex flex-col items-center py-6 ${formData.urgency === "medium" ? "bg-yellow-500 hover:bg-yellow-600" : ""}`}
                    onClick={() => handleChange("urgency", "medium")}
                  >
                    <Clock className="h-6 w-6 mb-2" />
                    <span>Medium</span>
                    <span className="text-xs mt-1">Needs attention</span>
                  </Button>
                  
                  <Button 
                    type="button"
                    variant={formData.urgency === "high" ? "default" : "outline"} 
                    className={`flex flex-col items-center py-6 ${formData.urgency === "high" ? "bg-red-500 hover:bg-red-600" : ""}`}
                    onClick={() => handleChange("urgency", "high")}
                  >
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span>High</span>
                    <span className="text-xs mt-1">Urgent issue</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <Separator className="my-4" />
              </div>
              
              {/* Description Input */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please describe the issue in detail..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Minimum 10 characters. Please be as specific as possible.
                </p>
              </div>
              
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="attachments" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-urblue">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Images only (max 3 files)
                      </p>
                    </div>
                    <Input 
                      id="attachments" 
                      type="file" 
                      accept="image/*" 
                      multiple
                      className="hidden" 
                      onChange={handleFileChange}
                      disabled={formData.attachments.length >= 3}
                    />
                  </label>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Selected files:</p>
                    <div className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveFile(index)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting} 
                className="bg-urblue hover:bg-urblue-dark"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        {/* Feedback Tips */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Tips for effective feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li className="text-sm text-gray-600">Be specific about the location within the facility</li>
              <li className="text-sm text-gray-600">Include when you noticed the issue</li>
              <li className="text-sm text-gray-600">Explain how the issue affects facility usage</li>
              <li className="text-sm text-gray-600">Add photos if possible to help maintenance staff</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FeedbackForm;
