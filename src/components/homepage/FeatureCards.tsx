import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Brain, 
  Building, 
  Leaf, 
  GitCompare, 
  FlaskConical, 
  DollarSign,
  TrendingUp 
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Resource Dashboard',
    description: 'Monitor campus resources, room occupancy, and equipment usage in real-time with interactive visualizations.',
    color: 'text-blue-600'
  },
  {
    icon: Brain,
    title: 'Predictive Scheduling Insights',
    description: 'AI-powered predictions for optimal scheduling based on historical data and usage patterns.',
    color: 'text-purple-600'
  },
  {
    icon: Building,
    title: 'Infrastructure Usage Analytics',
    description: 'Comprehensive analysis of building utilization, space efficiency, and maintenance needs.',
    color: 'text-orange-600'
  },
  {
    icon: Leaf,
    title: 'Sustainability Metrics',
    description: 'Track energy consumption, water usage, and waste management for environmental impact assessment.',
    color: 'text-green-600'
  },
  {
    icon: GitCompare,
    title: 'Manual vs AI Scheduling Comparison',
    description: 'Compare traditional scheduling methods with AI-optimized solutions to demonstrate efficiency gains.',
    color: 'text-indigo-600'
  },
  {
    icon: FlaskConical,
    title: 'STEM Resource Allocation',
    description: 'Specialized tools for managing laboratories, classrooms, and scientific equipment scheduling.',
    color: 'text-red-600'
  },
  {
    icon: DollarSign,
    title: 'Government Funding Utilization',
    description: 'Track and optimize the use of government funding and budget allocation across departments.',
    color: 'text-yellow-600'
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    description: 'Advanced analytics and reporting tools to measure campus efficiency and resource optimization.',
    color: 'text-cyan-600'
  }
];

export const FeatureCards = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
            Smart Campus Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools for intelligent campus management and resource optimization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <CardTitle className="text-lg text-blue-900">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
