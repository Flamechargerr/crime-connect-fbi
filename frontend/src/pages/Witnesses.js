import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

const Witnesses = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="animated-text-scan">WITNESS PROTECTION</span>
          </h1>
          <p className="text-muted-foreground mt-1">Confidential witness management system</p>
        </div>
        <Button className="bg-secure-blue hover:bg-secure-blue/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Witness
        </Button>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5 text-secure-blue" />
            Protected Individuals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Eye className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Witness Protection Module</h3>
            <p className="text-muted-foreground mb-4">Confidential witness tracking system under development</p>
            <div className="flex justify-center space-x-2">
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search Records
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

export default Witnesses;