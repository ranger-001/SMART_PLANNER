
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Search, 
  Users, 
  Home,
  Info,
  List,
  ArrowUp
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Real-Time Resource Dashboard",
      description: "Monitor classroom availability, lab equipment usage, and facility status in real-time with interactive visualizations.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Predictive Scheduling Insights",
      description: "AI-powered scheduling that predicts optimal resource allocation and prevents conflicts before they occur.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Infrastructure Usage Analytics",
      description: "Comprehensive analytics on building utilization, maintenance needs, and space optimization opportunities.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <ArrowUp className="w-8 h-8" />,
      title: "Sustainability Metrics",
      description: "Track energy consumption, water usage, and waste management across campus for environmental optimization.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <Info className="w-8 h-8" />,
      title: "Manual vs AI Scheduling",
      description: "Compare traditional scheduling methods with AI-driven optimization to demonstrate efficiency improvements.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "STEM Resource Allocation",
      description: "Specialized tools for managing laboratories, scientific equipment, and research facilities efficiently.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <List className="w-8 h-8" />,
      title: "Funding Utilization Tracker",
      description: "Monitor government funding allocation and budget utilization with transparent reporting and analytics.",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Campus Management Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage cutting-edge AI technology to optimize every aspect of your campus operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-white"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
