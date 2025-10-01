import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart3, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">INTELLIGENCE REPORTS</span>
          </h1>
          <p className="text-muted-foreground mt-1">Analytical reporting and statistics</p>
        </div>
        <Button className="bg-secure-green hover:bg-secure-green/90">
          <Plus className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-secure-green" />
            Statistical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Intelligence Reports Module</h3>
            <p className="text-muted-foreground mb-4">Advanced analytics and reporting system under development</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Reports
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;