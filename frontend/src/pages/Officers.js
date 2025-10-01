import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

const Officers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">FEDERAL AGENTS</span>
          </h1>
          <p className="text-muted-foreground mt-1">Bureau personnel management system</p>
        </div>
        <Button className="bg-secure-green hover:bg-secure-green/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-secure-green" />
            Active Personnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Personnel Management Module</h3>
            <p className="text-muted-foreground mb-4">Advanced agent tracking system under development</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Personnel
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

export default Officers;