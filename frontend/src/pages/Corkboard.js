import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

const Corkboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">INVESTIGATION BOARD</span>
          </h1>
          <p className="text-muted-foreground mt-1">Evidence mapping and case visualization</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Evidence
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-primary" />
            Visual Investigation Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Investigation Board Module</h3>
            <p className="text-muted-foreground mb-4">Advanced evidence mapping system under development</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Connections
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter Evidence
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Corkboard;