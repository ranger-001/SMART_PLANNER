import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const DashboardPreview = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real-Time Campus Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant visibility into your campus operations with our comprehensive dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Dashboard Preview */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-ur-blue/5 to-ur-green/5 border-ur-blue/20">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Resource Utilization</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Classrooms</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Laboratories</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Study Spaces</span>
                    <span className="font-medium">64%</span>
                  </div>
                  <Progress value={64} className="h-2" />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-ur-blue mb-1">1,247</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-ur-green mb-1">89%</div>
                <div className="text-sm text-gray-600">Energy Efficiency</div>
              </Card>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Powered by Advanced Analytics
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-ur-blue rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Predictive Maintenance</h4>
                    <p className="text-gray-600">AI algorithms predict equipment failures before they happen, reducing downtime by 45%.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-ur-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Smart Space Allocation</h4>
                    <p className="text-gray-600">Optimize room assignments based on class size, equipment needs, and student preferences.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-ur-yellow rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-ur-blue text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Real-Time Adjustments</h4>
                    <p className="text-gray-600">Automatically adjust schedules and resource allocation based on real-time campus conditions.</p>
                  </div>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-ur-blue hover:bg-ur-blue/90 w-full">
              Explore Full Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
